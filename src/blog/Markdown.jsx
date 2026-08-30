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

export function Markdown({ content }) {
  return (
    <div className="article-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          a: MarkdownLink,
          img: MarkdownImage,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
