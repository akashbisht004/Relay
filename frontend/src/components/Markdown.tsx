import { Component } from "react";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import CodeBlock from "./CodeBlock";

const components: Components = {
  p: ({ children }) => (
    <p className="my-2 leading-6 first:mt-0 last:mb-0">{children}</p>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="text-amber-400 underline underline-offset-2 transition hover:text-amber-300"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="my-2 list-disc space-y-1 pl-5 marker:text-neutral-600">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2 list-decimal space-y-1 pl-5 marker:text-neutral-600">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-6">{children}</li>,
  h1: ({ children }) => (
    <h1 className="mb-2 mt-4 text-lg font-semibold text-neutral-100 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-2 mt-4 text-base font-semibold text-neutral-100 first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-1 mt-3 text-sm font-semibold text-neutral-100 first:mt-0">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-1 mt-3 text-sm font-semibold text-neutral-200 first:mt-0">
      {children}
    </h4>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-2 border-neutral-700 pl-3 text-neutral-400 italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-4 border-neutral-800" />,
  strong: ({ children }) => (
    <strong className="font-semibold text-neutral-100">{children}</strong>
  ),
  table: ({ children }) => (
    <div className="my-3 overflow-x-auto rounded-lg border border-neutral-800">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-neutral-900/60 text-neutral-200">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-3 py-1.5 text-left font-semibold">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border-t border-neutral-800 px-3 py-1.5 text-neutral-300">
      {children}
    </td>
  ),
  pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
  code: ({ className, children, node }) => {
    const hasLanguage = /language-(\w+)/.test(className || "");
    const firstChild = node?.children?.[0];
    const rawText =
      firstChild && "value" in firstChild
        ? (firstChild as { value?: string }).value
        : undefined;
    const isBlock =
      hasLanguage || (typeof rawText === "string" && rawText.includes("\n"));

    if (isBlock) {
      // The <pre> wrapper (CodeBlock) draws the container; keep the hljs/lang
      // classes so the syntax theme applies to the tokens inside.
      return <code className={className}>{children}</code>;
    }

    return (
      <code className="rounded-md border border-neutral-700/60 bg-neutral-800/70 px-1.5 py-0.5 font-mono text-[0.85em] text-amber-200/90">
        {children}
      </code>
    );
  },
};

class MarkdownBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function Markdown({ content }: { content: string }) {
  return (
    <div className="text-sm text-neutral-200">
      <MarkdownBoundary
        fallback={<p className="whitespace-pre-wrap">{content}</p>}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={components}
        >
          {content}
        </ReactMarkdown>
      </MarkdownBoundary>
    </div>
  );
}

export default Markdown;
