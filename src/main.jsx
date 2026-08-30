import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { profile } from "./data/profile.js";
import { projects } from "./data/projects.js";
import { experience } from "./data/experience.js";
import { education } from "./data/education.js";
import { caseStudies } from "./data/caseStudies.js";
import { serviceLeadership } from "./data/serviceLeadership.js";
import { publications } from "./data/publications.js";
import { Markdown } from "./blog/Markdown.jsx";
import { posts } from "./blog/posts.js";

const navItems = [
  ["Home", "#home"],
  ["Projects", "#projects"],
  ["Experience", "#experience"],
  ["Publications", "#publications"],
  ["About", "#about"],
  ["Blog", "#blog"],
  ["Service", "#service-leadership"],
  ["Case Studies", "#case-studies"],
  ["Skills", "#skills"],
  ["Interests", "#interests"],
  ["Contact", "#contact"],
];

const highlightPhrases = [
  "8+ years",
  "semiconductor automation",
  "industrial AI",
  "edge computing",
  "hardware-software integration",
  "React",
  "TypeScript",
  "C#",
  "Python",
  "Oracle SQL",
  "ASP.NET Core",
  "real-time production data",
  "ELK Stack",
  "more than 10%",
  "18 global factories",
  "Docker",
  "Kubernetes",
  "Azure DevOps",
  "PID",
  "FFT",
  "machine learning",
  "TensorFlow",
  "patented and published",
  "90% adoption",
  "0% to 90%",
  "within two years",
  "5% to 50%",
  "20 micrometers",
  "Data Science & AI",
  "Cybersecurity",
  "WMA 83",
  "GPA 4.03 / 4.3",
  "GPA 3.89 / 4.3",
  "TSMC Foundation",
  "remote elementary schools",
  "hands-on learning",
  "Airballers",
  "Sydney Social Basketball",
  "USYD club activities",
];

const highlightMatcher = new RegExp(
  `(${highlightPhrases
    .slice()
    .sort((a, b) => b.length - a.length)
    .map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})`,
  "g",
);

function HighlightText({ text }) {
  if (!text) return null;

  return text.split(highlightMatcher).map((part, index) =>
    highlightPhrases.includes(part) ? (
      <mark className="text-highlight" key={`${part}-${index}`}>
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

function ExternalLink({ href, children }) {
  if (!href) return null;

  return (
    <a href={href} target={href.startsWith("#") ? undefined : "_blank"} rel={href.startsWith("#") ? undefined : "noreferrer"}>
      {children} <span aria-hidden="true" />
    </a>
  );
}

function Header() {
  const [isNavOpen, setIsNavOpen] = React.useState(false);

  return (
    <header className="topbar">
      <div className="brand-row">
        <a className="brand" href="#home" onClick={() => setIsNavOpen(false)}>
          {profile.name}
        </a>
        <button
          className="nav-toggle"
          type="button"
          aria-controls="main-navigation"
          aria-expanded={isNavOpen}
          aria-label={isNavOpen ? "Collapse navigation" : "Expand navigation"}
          onClick={() => setIsNavOpen((open) => !open)}
        >
          <span aria-hidden="true" />
        </button>
      </div>
      <nav id="main-navigation" className={isNavOpen ? "nav-open" : ""} aria-label="Main navigation">
        {navItems.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setIsNavOpen(false)}>
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function useHashRoute() {
  const [hash, setHash] = React.useState(() => window.location.hash || "#home");

  React.useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || "#home");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  React.useEffect(() => {
    if (hash.startsWith("#blog")) return;

    window.requestAnimationFrame(() => {
      const target = document.querySelector(hash);
      if (target) target.scrollIntoView({ block: "start" });
    });
  }, [hash]);

  if (hash === "#blog") return { page: "blog" };
  if (hash.startsWith("#blog/")) return { page: "post", slug: hash.replace("#blog/", "") };
  return { page: "home" };
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">{profile.role}</p>
        <h1>{profile.headline}</h1>
        <p className="lead">
          <HighlightText text={profile.summary} />
        </p>
        <div className="signal-row" aria-label="Professional highlights">
          {profile.highlights.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div className="hero-actions">
          <a className="button primary" href="#projects">
            View projects
          </a>
          <a className="button secondary" href={profile.links.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>

      <aside className="hero-profile-card" aria-label="Professional profile">
        <div className="portrait-frame">
          <img src={profile.photo} alt={`${profile.name} professional portrait`} />
        </div>
        <div className="profile-card-body">
          <div className="profile-card-header">
            <div>
              <span>Portfolio signal</span>
              <h2>{profile.name}</h2>
            </div>
            <strong>2026</strong>
          </div>
          <p>{profile.role}</p>
          <div className="credential-grid">
            <div>
              <span className="metric">{profile.projectCount}</span>
              <span>software engineering experience</span>
            </div>
            <div>
              <span className="metric">{profile.focus}</span>
              <span>main focus</span>
            </div>
            <div>
              <span className="metric">{profile.location}</span>
              <span>location</span>
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
}

function SectionHeading({ eyebrow, title }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className="project-visual" role="img" aria-label={`${project.name} preview`}>
        <span>{project.stack[0]}</span>
      </div>
      <div>
        <h3>{project.name}</h3>
        <p>
          <HighlightText text={project.summary} />
        </p>
        <div className="tag-row">
          {project.stack.map((item) => (
            <span className="tag" key={item}>
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="card-links">
        <ExternalLink href={project.demo}>Demo</ExternalLink>
        <ExternalLink href={project.caseStudy}>Case study</ExternalLink>
      </div>
    </article>
  );
}

function Projects() {
  return (
    <section id="projects" className="section">
      <SectionHeading eyebrow="Featured work" title="Projects built around production constraints" />
      <div className="project-grid">
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="section split">
      <div>
        <p className="eyebrow">Experience</p>
        <h2>Industrial software, automation, and AI systems</h2>
        <p>
          <HighlightText text="Experience shaped by production environments: real-time data, factory workflows, hardware integration, and systems that need to be adopted by users at scale." />
        </p>
      </div>
      <div className="experience-list">
        {experience.map((job) => (
          <article className="experience-item" key={`${job.company}-${job.period}`}>
            <div className="experience-heading">
              {job.logo ? (
                <div className="company-logo" aria-hidden="true">
                  <img src={job.logo.src} alt="" />
                </div>
              ) : null}
              <div className="experience-title">
                <div>
                  <h3>{job.role}</h3>
                  <p className="experience-meta">{job.company}</p>
                </div>
                <span>{job.period}</span>
              </div>
            </div>
            <ul>
              {job.highlights.map((item) => (
                <li key={item}>
                  <HighlightText text={item} />
                </li>
              ))}
            </ul>
            {job.achievement ? (
              <div className="achievement-callout">
                <strong>Achievement:</strong> <HighlightText text={job.achievement} />
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function Publications() {
  return (
    <section id="publications" className="section publications-section">
      <div className="publications-layout">
        <div>
          <p className="eyebrow">Publications & patent</p>
          <h2>Applied machine-tool research and intellectual property</h2>
          <p>
            <HighlightText text="Published and patented work from industrial machine-tool software research, connecting CNC control, tool management, and intelligent value-added applications." />
          </p>
        </div>
        <div className="publication-list">
          {publications.map((item) => (
            <article className="publication-item" key={`${item.type}-${item.title}`}>
              <span>{item.type}</span>
              <h3>{item.title}</h3>
              <p>{item.venue}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section about-section">
      <SectionHeading
        eyebrow="About me"
        title="Study path shaped by AI, cybersecurity, control systems, and engineering practice"
      />
      <div className="about-grid">
        <article className="about-card about-intro">
          <h3>Current focus</h3>
          <p>
            <HighlightText text="I am continuing my Computer Science studies at the University of Sydney, focusing on Data Science & AI and Cybersecurity. My academic path connects software engineering with industrial systems, machine learning, signal processing, and practical automation." />
          </p>
        </article>
        <div className="education-list">
          {education.map((item) => (
            <article className="education-item" key={`${item.school}-${item.period}`}>
              <div className="education-main">
                {item.logo ? (
                  <div className="school-logo" aria-hidden="true">
                    <img src={item.logo.src} alt="" />
                  </div>
                ) : null}
                <div>
                  <h3>{item.school}</h3>
                  <p className="experience-meta">
                    {item.degree} | {item.period}
                  </p>
                </div>
              </div>
              <div className="education-detail">
                <p>
                  <HighlightText text={item.focus} />
                </p>
                {item.transcript ? <ExternalLink href={item.transcript}>Transcript</ExternalLink> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseStudies() {
  return (
    <section id="case-studies" className="section band">
      <SectionHeading eyebrow="Engineering depth" title="Case studies" />
      <div className="case-study-list">
        {caseStudies.map((study) => (
          <article id={study.id} className="case-study" key={study.title}>
            <div>
              <p className="eyebrow">{study.type}</p>
              <h3>{study.title}</h3>
            </div>
            <div>
              <p>
                <HighlightText text={study.problem} />
              </p>
              <p>
                <strong>Technical decision:</strong> <HighlightText text={study.decision} />
              </p>
              <p>
                <strong>Result:</strong> <HighlightText text={study.result} />
              </p>
              {study.links ? (
                <div className="case-study-links">
                  {study.links.map((link) => (
                    <ExternalLink href={link.href} key={link.href}>
                      {link.label}
                    </ExternalLink>
                  ))}
                </div>
              ) : null}
              {study.showcase ? (
                <section className="case-study-showcase" aria-labelledby={`${study.id}-showcase-title`}>
                  <div className="showcase-header">
                    <p className="eyebrow">Result showcase</p>
                    <h4 id={`${study.id}-showcase-title`}>{study.showcase.title}</h4>
                    <p>
                      <HighlightText text={study.showcase.summary} />
                    </p>
                  </div>
                  <div className="showcase-grid">
                    {study.showcase.figures.map((figure) => (
                      <figure className="case-study-image" key={figure.src}>
                        <img src={figure.src} alt={figure.alt} />
                        <figcaption>
                          <HighlightText text={figure.caption} />
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </section>
              ) : null}
              {study.image ? (
                <figure className="case-study-image">
                  <img src={study.image.src} alt={study.image.alt} />
                  <figcaption>{study.image.caption}</figcaption>
                </figure>
              ) : null}
              {study.video ? (
                <>
                  <div className="case-study-video">
                    <iframe
                      src={study.video.embedUrl}
                      title={study.video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  {study.video.caption ? (
                    <p className="case-study-video-caption">
                      <HighlightText text={study.video.caption} />
                    </p>
                  ) : null}
                </>
              ) : null}
              {study.futureWork ? (
                <section className="future-work" aria-labelledby={`${study.id}-future-work-title`}>
                  <div className="showcase-header">
                    <p className="eyebrow">Future work</p>
                    <h4 id={`${study.id}-future-work-title`}>Next iteration roadmap</h4>
                  </div>
                  <div className="future-work-grid">
                    {study.futureWork.map((item) => (
                      <article className="future-work-card" key={item.title}>
                        <h5>{item.title}</h5>
                        <p>
                          <HighlightText text={item.description} />
                        </p>
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ServiceLeadership() {
  return (
    <section id="service-leadership" className="section service-section">
      <div className="service-layout">
        <div>
          <p className="eyebrow">Service & leadership</p>
          <h2>Community roles and team leadership</h2>
          <p>
            <HighlightText text={serviceLeadership.summary} />
          </p>
        </div>
        <div className="service-groups">
          {serviceLeadership.groups.map((group) => (
            <section className="service-group" key={group.title}>
              <h3>{group.title}</h3>
              <div className="service-item-list">
                {group.items.map((item) => (
                  <article className="service-item" key={`${group.title}-${item.title}`}>
                    <div className="service-item-heading">
                      <h4>{item.title}</h4>
                      <span>{item.meta}</span>
                    </div>
                    <p>
                      <HighlightText text={item.description} />
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="section split">
      <div>
        <p className="eyebrow">Toolbox</p>
        <h2>Skills and technologies</h2>
        <p>A practical stack across frontend, backend, AI, infrastructure, embedded systems, and industrial data workflows.</p>
      </div>
      <div className="skill-list">
        {profile.skills.map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>
    </section>
  );
}

function Interests() {
  return (
    <section id="interests" className="section interests-section">
      <div>
        <p className="eyebrow">Interests</p>
        <h2>Outside the build</h2>
      </div>
      <div className="interest-list">
        {profile.interests.map((interest) => (
          <article className="interest-item" key={interest.name}>
            <h3>{interest.name}</h3>
            {interest.detail ? (
              <p>
                <HighlightText text={interest.detail} />
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="section contact">
      <div>
        <p className="eyebrow">Contact</p>
        <h2>Let&apos;s build something useful.</h2>
      </div>
      <div className="contact-content">
        <div className="contact-links">
          <ExternalLink href={profile.links.email}>Email</ExternalLink>
          <ExternalLink href={profile.links.github}>GitHub</ExternalLink>
          <ExternalLink href={profile.links.linkedin}>LinkedIn</ExternalLink>
          <ExternalLink href={profile.links.resume}>Resume</ExternalLink>
        </div>
        <figure className="qr-card">
          <img src={profile.websiteQrCode.src} alt={profile.websiteQrCode.alt} />
          <figcaption>
            <strong>Portfolio QR</strong>
            <span>Scan to open this website on mobile.</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

function buildTagFilters(items) {
  const counts = items.reduce((accumulator, post) => {
    post.tags.forEach((tag) => {
      accumulator[tag] = (accumulator[tag] || 0) + 1;
    });
    return accumulator;
  }, {});

  return Object.entries(counts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
}

function BlogCard({ post, onTagSelect }) {
  return (
    <article className="blog-card">
      <div>
        <p className="eyebrow">{post.date}</p>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <div className="tag-row">
          {post.tags.map((tag) => (
            <button className="tag tag-button" type="button" key={tag} onClick={() => onTagSelect(tag)}>
              {tag}
            </button>
          ))}
        </div>
      </div>
      <div className="card-links">
        <ExternalLink href={`#blog/${post.slug}`}>Read post</ExternalLink>
      </div>
    </article>
  );
}

function BlogIndex() {
  const [selectedTag, setSelectedTag] = React.useState("All");
  const tagFilters = React.useMemo(() => buildTagFilters(posts), []);
  const filteredPosts = React.useMemo(
    () => (selectedTag === "All" ? posts : posts.filter((post) => post.tags.includes(selectedTag))),
    [selectedTag],
  );

  return (
    <main className="page-shell">
      <section className="section blog-hero">
        <div>
          <p className="eyebrow">Blog</p>
          <h1>Engineering notes, study logs, and project write-ups.</h1>
          <p className="lead">
            A Markdown-powered space for documenting what I am learning and building across full-stack systems, AI,
            automation, and cybersecurity.
          </p>
        </div>
      </section>
      <section className="section blog-section">
        <div className="blog-filter-panel" aria-label="Filter blog posts by tag">
          <div className="blog-filter-heading">
            <div>
              <p className="eyebrow">Tags</p>
              <h2>Browse by topic</h2>
            </div>
            <span>
              {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
            </span>
          </div>
          <div className="tag-filter-list">
            <button
              className={selectedTag === "All" ? "tag-filter active" : "tag-filter"}
              type="button"
              aria-pressed={selectedTag === "All"}
              onClick={() => setSelectedTag("All")}
            >
              All
              <span>{posts.length}</span>
            </button>
            {tagFilters.map(({ tag, count }) => (
              <button
                className={selectedTag === tag ? "tag-filter active" : "tag-filter"}
                type="button"
                aria-pressed={selectedTag === tag}
                key={tag}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
                <span>{count}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="blog-grid">
          {filteredPosts.map((post) => (
            <BlogCard post={post} key={post.slug} onTagSelect={setSelectedTag} />
          ))}
        </div>
        {filteredPosts.length === 0 ? <p className="empty-state">No posts found for this tag yet.</p> : null}
      </section>
    </main>
  );
}

function BlogPost({ slug }) {
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    return (
      <main className="page-shell">
        <section className="section blog-hero">
          <p className="eyebrow">Blog</p>
          <h1>Post not found.</h1>
          <div className="hero-actions">
            <a className="button primary" href="#blog">
              Back to blog
            </a>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <article className="section article-page">
        <a className="back-link" href="#blog">
          Back to blog
        </a>
        <p className="eyebrow">{post.date}</p>
        <h1>{post.title}</h1>
        <div className="tag-row">
          {post.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <Markdown content={post.content} />
      </article>
    </main>
  );
}

function HomePage() {
  return (
    <main id="home">
      <Hero />
      <Projects />
      <Experience />
      <Publications />
      <About />
      <ServiceLeadership />
      <CaseStudies />
      <Skills />
      <Interests />
      <Contact />
    </main>
  );
}

function App() {
  const route = useHashRoute();

  return (
    <>
      <Header />
      {route.page === "blog" && <BlogIndex />}
      {route.page === "post" && <BlogPost slug={route.slug} />}
      {route.page === "home" && <HomePage />}
      <footer>
        <span>{profile.name}</span>
        <span>Built with React and GitHub Pages.</span>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
