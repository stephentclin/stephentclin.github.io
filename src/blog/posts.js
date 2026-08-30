const markdownPosts = import.meta.glob("../content/blog/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

function parseFrontmatter(markdown, filePath) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const frontmatter = match ? match[1] : "";
  const content = match ? match[2].trim() : markdown.trim();
  const meta = {};

  frontmatter.split("\n").forEach((line) => {
    const separator = line.indexOf(":");
    if (separator === -1) return;

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    meta[key] = value.replace(/^["']|["']$/g, "");
  });

  const fallbackSlug = filePath.split("/").pop().replace(/\.md$/, "");
  const tags = meta.tags ? meta.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [];

  return {
    title: meta.title || "Untitled post",
    date: meta.date || "",
    slug: meta.slug || fallbackSlug,
    excerpt: meta.excerpt || content.split("\n").find((line) => line.trim()) || "",
    tags,
    content,
  };
}

export const posts = Object.entries(markdownPosts)
  .map(([filePath, markdown]) => parseFrontmatter(markdown, filePath))
  .sort((a, b) => b.date.localeCompare(a.date));
