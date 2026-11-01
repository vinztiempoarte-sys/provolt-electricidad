import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { BlogPost } from "@/lib/blog-wp.server";

export type { BlogPost };

/** Los artículos viven en WordPress; el servidor los lee, limpia y cachea (ver blog-wp.server.ts). */
const getPosts = createServerFn({ method: "GET" }).handler(async (): Promise<BlogPost[]> => {
  const { listPosts } = await import("./blog-wp.server");
  return listPosts();
});

/** Artículos publicados, del más reciente al más antiguo. */
export async function fetchPosts(): Promise<BlogPost[]> {
  return getPosts();
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost> {
  const post = (await getPosts()).find((p) => p.slug === slug);
  if (!post) throw notFound();
  return post;
}
