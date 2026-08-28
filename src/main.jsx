import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { profile } from "./data/profile.js";
import { projects } from "./data/projects.js";
import { experience } from "./data/experience.js";
import { education } from "./data/education.js";
import { caseStudies } from "./data/caseStudies.js";
import { serviceLeadership } from "./data/serviceLeadership.js";

const navItems = [
  ["Projects", "#projects"],
  ["Experience", "#experience"],
  ["About", "#about"],
  ["Service", "#service-leadership"],
  ["Case Studies", "#case-studies"],
  ["Skills", "#skills"],
  ["Contact", "#contact"],
];

function ExternalLink({ href, children }) {
  if (!href) return null;

  return (
    <a href={href} target={href.startsWith("#") ? undefined : "_blank"} rel={href.startsWith("#") ? undefined : "noreferrer"}>
      {children} <span aria-hidden="true" />
    </a>
  );
}

function Header() {
  return (
    <header className="topbar">
      <a className="brand" href="#home">
        {profile.name}
      </a>
      <nav aria-label="Main navigation">
        {navItems.map(([label, href]) => (
          <a key={href} href={href}>
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">{profile.role}</p>
        <h1>{profile.headline}</h1>
        <p className="lead">{profile.summary}</p>
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
        <p>{project.summary}</p>
        <div className="tag-row">
          {project.stack.map((item) => (
            <span className="tag" key={item}>
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="card-links">
        <ExternalLink href={project.repo}>Code</ExternalLink>
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
          Experience shaped by production environments: real-time data, factory workflows, hardware integration, and systems that need to be adopted by users at scale.
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
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
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
            I am continuing my Computer Science studies at the University of Sydney, focusing on Data Science & AI and Cybersecurity. My academic path connects software engineering with industrial systems, machine learning, signal processing, and practical automation.
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
              <p>{item.focus}</p>
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
              <p>{study.problem}</p>
              <p>
                <strong>Technical decision:</strong> {study.decision}
              </p>
              <p>
                <strong>Result:</strong> {study.result}
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
                    <p>{study.showcase.summary}</p>
                  </div>
                  <div className="showcase-grid">
                    {study.showcase.figures.map((figure) => (
                      <figure className="case-study-image" key={figure.src}>
                        <img src={figure.src} alt={figure.alt} />
                        <figcaption>{figure.caption}</figcaption>
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
                  {study.video.caption ? <p className="case-study-video-caption">{study.video.caption}</p> : null}
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
                        <p>{item.description}</p>
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
          <p>{serviceLeadership.summary}</p>
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
                    <p>{item.description}</p>
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

function Contact() {
  return (
    <section id="contact" className="section contact">
      <div>
        <p className="eyebrow">Contact</p>
        <h2>Let&apos;s build something useful.</h2>
      </div>
      <div className="contact-links">
        <ExternalLink href={profile.links.email}>Email</ExternalLink>
        <ExternalLink href={profile.links.github}>GitHub</ExternalLink>
        <ExternalLink href={profile.links.linkedin}>LinkedIn</ExternalLink>
        <ExternalLink href={profile.links.resume}>Resume</ExternalLink>
      </div>
    </section>
  );
}

function App() {
  return (
    <>
      <Header />
      <main id="home">
        <Hero />
        <Projects />
        <Experience />
        <About Me/>
        <ServiceLeadership />
        <CaseStudies />
        <Skills />
        <Contact />
      </main>
      <footer>
        <span>{profile.name}</span>
        <span>Built with React and GitHub Pages.</span>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
