"use client";

import { Children, isValidElement, type ReactNode } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import "highlight.js/styles/github-dark.css";

type MarkdownContentProps = {
  content: string;
  className?: string;
};

function languageFromClassName(className?: string): string | null {
  if (!className) return null;
  const match = /language-([\w+-]+)/.exec(className);
  return match?.[1] ?? null;
}

function codeText(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }
      if (isValidElement<{ children?: ReactNode }>(child)) {
        return codeText(child.props.children);
      }
      return "";
    })
    .join("")
    .replace(/\n$/, "");
}

const components: Components = {
  img: ({ src, alt }) => {
    if (!src || typeof src !== "string") return null;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt ?? ""} className="md-img" loading="lazy" />
    );
  },
  a: ({ href, children }) => (
    <a
      href={href}
      className="neon-link"
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  ),
  pre: ({ children }) => {
    const onlyChild = Children.count(children) === 1 ? Children.only(children) : null;
    if (isValidElement(onlyChild) && onlyChild.type === MermaidDiagram) {
      return onlyChild;
    }
    return <pre className="md-pre">{children}</pre>;
  },
  code: ({ className, children, ...props }) => {
    const language = languageFromClassName(className);
    const isBlock = Boolean(className);

    if (language === "mermaid") {
      return <MermaidDiagram chart={codeText(children)} />;
    }

    if (!isBlock) {
      return (
        <code className="md-inline-code" {...props}>
          {children}
        </code>
      );
    }

    return (
      <code className={className} {...props}>
        {language ? <span className="md-code-lang">{language}</span> : null}
        {children}
      </code>
    );
  },
};

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div className={["md-content", className].filter(Boolean).join(" ")}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSanitize,
          [rehypeHighlight, { plainText: ["mermaid"] }],
        ]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
