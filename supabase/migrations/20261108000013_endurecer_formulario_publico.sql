-- Endurece los puntos de entrada públicos (anon) contra spam y abuso.
-- No cambia la forma de uso de la web: mismas funciones, mismos parámetros.

-- 1) Formulario de contacto: límite de envíos.
--    Máx. 3 solicitudes por email y hora, y 30 en total por hora (protege la bandeja de avisos).
--    request_callback ya tenía su propio límite por teléfono.
create or replace function public.submit_contact_request(
  p_name text,
  p_email text,
  p_message text,
  p_phone text default null,
  p_service_id uuid default null,
  p_consent boolean default false
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_email text := lower(trim(coalesce(p_email, '')));
begin
  if p_consent is not true then
    raise exception 'Debes aceptar la política de privacidad' using errcode = '22023';
  end if;
  if p_name is null or char_length(trim(p_name)) < 3 or char_length(p_name) > 120 then
    raise exception 'Nombre no válido' using errcode = '22023';
  end if;
  if p_email is null or p_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' or char_length(p_email) > 254 then
    raise exception 'Email no válido' using errcode = '22023';
  end if;
  if p_message is null or char_length(trim(p_message)) < 10 or char_length(p_message) > 1000 then
    raise exception 'Mensaje no válido' using errcode = '22023';
  end if;
  if p_phone is not null and char_length(p_phone) > 30 then
    raise exception 'Teléfono no válido' using errcode = '22023';
  end if;
  if (select count(*) from public.contact_requests
       where email = v_email and created_at > now() - interval '1 hour') >= 3 then
    raise exception 'Ya hemos recibido tus mensajes. Te responderemos lo antes posible.' using errcode = '22023';
  end if;
  if (select count(*) from public.contact_requests
       where created_at > now() - interval '1 hour') >= 30 then
    raise exception 'Estamos recibiendo muchas solicitudes. Llámanos al 722 62 40 40.' using errcode = '22023';
  end if;
  if p_service_id is not null and not exists (select 1 from public.services where id = p_service_id) then
    p_service_id := null;
  end if;

  insert into public.contact_requests (name, email, phone, message, service_id, source, consent_accepted)
  values (trim(p_name), v_email, nullif(trim(coalesce(p_phone, '')), ''), trim(p_message),
          p_service_id, 'web', true)
  returning id into v_id;

  return v_id;
end;
$$;

-- 2) Analítica: tope global de eventos por minuto, para que nadie pueda inflar la tabla.
create or replace function public.track_site_event(
  p_event text,
  p_path text,
  p_referrer_host text default null,
  p_utm_source text default null,
  p_utm_medium text default null,
  p_utm_campaign text default null,
  p_from_ads boolean default false,
  p_device text default null
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_path text;
begin
  if p_event is null or p_event not in ('view','call','whatsapp','form') then
    return;
  end if;
  -- Solo ruta, sin parámetros ni fragmentos; se ignora el panel interno y rutas absurdas.
  v_path := split_part(split_part(coalesce(p_path, ''), '?', 1), '#', 1);
  if v_path !~ '^/[A-Za-z0-9/_\-\.]{0,198}$' or v_path like '/admin%' then
    return;
  end if;
  -- Tope: más de 300 eventos en el último minuto se descartan sin error.
  if (select count(*) from public.site_events where created_at > now() - interval '1 minute') >= 300 then
    return;
  end if;
  insert into public.site_events
    (event, path, referrer_host, utm_source, utm_medium, utm_campaign, from_ads, device)
  values (
    p_event,
    v_path,
    nullif(left(p_referrer_host, 120), ''),
    nullif(left(p_utm_source, 100), ''),
    nullif(left(p_utm_medium, 100), ''),
    nullif(left(p_utm_campaign, 100), ''),
    coalesce(p_from_ads, false),
    case when p_device in ('mobile','tablet','desktop') then p_device end
  );
end;
$$;

-- 3) La función del trigger de avisos no debe poder llamarse desde la API pública.
--    Los triggers siguen funcionando: no necesitan EXECUTE del usuario que inserta.
revoke execute on function public.notify_new_contact_request() from public, anon, authenticated;
