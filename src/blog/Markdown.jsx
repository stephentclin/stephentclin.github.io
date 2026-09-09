import React from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

function MarkdownLink({ href = "", children }) {
  const isInternal = href.startsWith("#") || href.startsWith("/");

  return (
    <a href={href} target={isInternal ? undefined : "_blank"} rel={isInternal ? undefined : "noreferrer"}>
      {children}
    </a>
  );
}

function MarkdownImage({ src = "", alt = "" }) {
  return (
    <figure className="markdown-image">
      <img src={src} alt={alt} loading="lazy" />
      {alt ? <figcaption>{alt}</figcaption> : null}
    </figure>
  );
}

function remarkArticleTitle() {
  return (tree) => {
    // The article header already displays the title from frontmatter.
    if (tree.children[0]?.type === "heading" && tree.children[0].depth === 1) tree.children.shift();
  };
}

export function Markdown({ content }) {
  return (
    <div className="article-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks, remarkArticleTitle]}
        components={{
          a: MarkdownLink,
          img: MarkdownImage,
          p: ({ node, children }) => node.children.some((child) => child.tagName === "img")
            ? <div className="markdown-paragraph">{children}</div>
            : <p>{children}</p>,
          h1: ({ children }) => <h2>{children}</h2>,
          table: ({ children }) => (
            <div className="table-scroll" role="region" aria-label="Article table" tabIndex={0}>
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
