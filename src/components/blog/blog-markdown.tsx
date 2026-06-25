import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

type BlogMarkdownProps = {
  content: string;
  className?: string;
};

/**
 * Markdown do blog com tipografia dedicada.
 * `#` no conteúdo vira <h2> (o único <h1> da página é o título do post).
 */
const components: Components = {
  h1: ({ children, className, ...props }) => (
    <h2 className={cn("blog-prose-h2", className)} {...props}>
      {children}
    </h2>
  ),
  h2: ({ children, className, ...props }) => (
    <h3 className={cn("blog-prose-h3", className)} {...props}>
      {children}
    </h3>
  ),
  h3: ({ children, className, ...props }) => (
    <h4 className={cn("blog-prose-h4", className)} {...props}>
      {children}
    </h4>
  ),
  h4: ({ children, className, ...props }) => (
    <h5 className={cn("blog-prose-h5", className)} {...props}>
      {children}
    </h5>
  ),
  h5: ({ children, className, ...props }) => (
    <h6 className={cn("blog-prose-h6", className)} {...props}>
      {children}
    </h6>
  ),
  h6: ({ children, className, ...props }) => (
    <h6 className={cn("blog-prose-h6", className)} {...props}>
      {children}
    </h6>
  ),
  p: ({ children, className, ...props }) => (
    <p className={cn("blog-prose-p", className)} {...props}>
      {children}
    </p>
  ),
  a: ({ children, className, href, ...props }) => {
    const external =
      href?.startsWith("http://") || href?.startsWith("https://");

    return (
      <a
        href={href}
        className={cn("blog-prose-a", className)}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        {...props}
      >
        {children}
      </a>
    );
  },
  strong: ({ children, className, ...props }) => (
    <strong className={cn("blog-prose-strong", className)} {...props}>
      {children}
    </strong>
  ),
  em: ({ children, className, ...props }) => (
    <em className={cn("blog-prose-em", className)} {...props}>
      {children}
    </em>
  ),
  ul: ({ children, className, ...props }) => (
    <ul className={cn("blog-prose-ul", className)} {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, className, ...props }) => (
    <ol className={cn("blog-prose-ol", className)} {...props}>
      {children}
    </ol>
  ),
  li: ({ children, className, ...props }) => (
    <li className={cn("blog-prose-li", className)} {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, className, ...props }) => (
    <blockquote className={cn("blog-prose-blockquote", className)} {...props}>
      {children}
    </blockquote>
  ),
  hr: ({ className, ...props }) => (
    <hr className={cn("blog-prose-hr", className)} {...props} />
  ),
  pre: ({ children, className, ...props }) => (
    <pre className={cn("blog-prose-pre", className)} {...props}>
      {children}
    </pre>
  ),
  code: ({ children, className, ...props }) => {
    const isBlock = Boolean(className?.includes("language-"));

    if (isBlock) {
      return (
        <code className={cn("blog-prose-code-block", className)} {...props}>
          {children}
        </code>
      );
    }

    return (
      <code className={cn("blog-prose-code-inline", className)} {...props}>
        {children}
      </code>
    );
  },
  table: ({ children, className, ...props }) => (
    <div className="blog-prose-table-wrap">
      <table className={cn("blog-prose-table", className)} {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, className, ...props }) => (
    <thead className={cn("blog-prose-thead", className)} {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, className, ...props }) => (
    <tbody className={cn("blog-prose-tbody", className)} {...props}>
      {children}
    </tbody>
  ),
  tr: ({ children, className, ...props }) => (
    <tr className={cn("blog-prose-tr", className)} {...props}>
      {children}
    </tr>
  ),
  th: ({ children, className, ...props }) => (
    <th className={cn("blog-prose-th", className)} {...props}>
      {children}
    </th>
  ),
  td: ({ children, className, ...props }) => (
    <td className={cn("blog-prose-td", className)} {...props}>
      {children}
    </td>
  ),
  img: ({ alt, className, ...props }) => (
    <img
      alt={alt ?? ""}
      className={cn("blog-prose-img", className)}
      loading="lazy"
      {...props}
    />
  ),
};

export function BlogMarkdown({ content, className }: BlogMarkdownProps) {
  return (
    <div className={cn("blog-prose", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
