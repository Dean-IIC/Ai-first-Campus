import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const proseClass =
  "prose max-w-[72ch] prose-headings:font-semibold prose-h2:mt-10 prose-h2:text-[1.375rem] prose-h3:text-lg prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-li:my-1";

export default function Markdown({ children, className = "" }: { children: string; className?: string }) {
  return (
    <div className={`${proseClass} ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node: _node, href = "", children: kids, ...rest }) => {
            // In-page links (#apply) use a plain anchor so tabs can react to the hash.
            if (href.startsWith("#")) return <a href={href} {...rest}>{kids}</a>;
            if (href.startsWith("/")) return <Link href={href} {...rest}>{kids}</Link>;
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
                {kids}
              </a>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
