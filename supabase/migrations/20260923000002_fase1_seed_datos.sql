-- Fase 1 · Datos iniciales Provolt Electricidad
-- Solo servicios reales. Proyectos, testimonios y equipo se cargan desde el panel
-- cuando existan datos reales y consentimiento de los clientes.
insert into public.company_info (id) values (1);

insert into public.services (slug, title, short_description, icon, category, featured, order_index) values
('averias-urgencias-electricas','Averías y urgencias eléctricas','Localizamos y reparamos averías eléctricas en viviendas, comercios y empresas de Valencia y alrededores.','wrench','Mantenimiento',true,1),
('instalaciones-electricas-vivienda','Instalaciones eléctricas en vivienda','Instalación eléctrica nueva y renovación de instalaciones antiguas en vivienda.','house','Instalaciones',true,2),
('locales-y-comercios','Locales y comercios','Instalaciones eléctricas para locales y comercios, adaptadas a tu actividad y a la normativa.','zap','Instalaciones',false,3),
('industrial-y-naves','Industrial y naves','Instalaciones eléctricas de baja tensión en naves y entornos industriales.','utility-pole','Ingeniería',false,4),
('cuadros-electricos','Cuadros eléctricos','Montaje, ampliación y sustitución de cuadros eléctricos.','cpu','Instalaciones',false,5),
('reformas-y-obra-nueva','Reformas y obra nueva','Instalación eléctrica completa en reformas y obra nueva.','zap','Instalaciones',false,6),
('boletines-y-certificados','Boletines y certificados','Gestionamos boletines y certificados de instalación eléctrica y los trámites con la distribuidora.','file-check','Certificación',true,7),
('autoconsumo-fotovoltaico','Autoconsumo fotovoltaico','Instalación de placas solares para autoconsumo en vivienda, comercio y empresa.','sun','Energía',true,8),
('cargadores-coche-electrico','Cargadores de coche eléctrico','Instalación de puntos de recarga para vehículo eléctrico en vivienda, garaje y empresa.','battery-charging','Movilidad',true,9),
('iluminacion-led-y-asesoria-energetica','Iluminación LED y asesoría energética','Iluminación LED y asesoramiento energético para reducir el consumo.','lightbulb','Eficiencia',false,10);
