/**
 * Contract: shapes expostos pelos loaders SSR do blog (spec 002).
 * Não há endpoints Hono novos — contrato é TypeScript entre
 * posts.server.ts / categories.server.ts e rotas React Router.
 *
 * Validar com: npm run typecheck após implementação.
 */

/** Categoria resumida embutida em posts */
export type PostCategorySummary = {
  slug: string;
  name: string;
  position: number;
};

/** Item retornado por getCategoriesForBlogMenu() — somente categorias com posts published */
export type BlogMenuCategory = PostCategorySummary;

/** Sentinela de filtro — NÃO existe em `categories` */
export type BlogFilterSlug =
  | "todos"
  | "sem-categoria"
  | string; // slug de categoria do banco

/** Loader /blog */
export type BlogLoaderData = {
  posts: BlogPostCard[];
  menuCategories: BlogMenuCategory[];
};

/** Post na listagem /blog e landing */
export type BlogPostCard = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  publishedAt: string;
  cover: string | null;
  readTime: string;
  categories: PostCategorySummary[];
};

/** Loader /blog/:slug — post completo */
export type BlogPostDetail = BlogPostCard & {
  content: string;
  images: unknown[];
  media: unknown[];
  attachments: unknown[];
};

/** Loader home (landing blog section) */
export type HomeLoaderData = {
  recentPosts: BlogPostCard[];
};

/** Constantes UI (src/lib/content/category-constants.ts) */
export declare const UNCategorized_FILTER_SLUG: "sem-categoria";
export declare const UNCategorized_LABEL: "Sem categoria";
export declare const ALL_FILTER_SLUG: "todos";
