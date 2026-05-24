import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projectCategories } from '../data/projects';
import { AutonomousCarSimulator, RAGGraphSimulator, SystolicArraySimulator } from './InteractiveWidgets';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// PROJECT IMAGE SLIDESHOW COMPONENT
// ==========================================
const ProjectImageSlideshow = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Cycles every 3 seconds
    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) return null;

  return (
    <div className="project-slideshow-container">
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`Slide ${idx + 1}`}
          className={`slideshow-img ${idx === currentIndex ? 'img-active' : ''}`}
        />
      ))}
      <div className="slideshow-indicators">
        {images.map((_, idx) => (
          <span 
            key={idx} 
            className={`slideshow-dot ${idx === currentIndex ? 'dot-active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default function ProjectShowcase({ activeCategoryIdx, setActiveCategoryIdx }) {
  const [activeProjId, setActiveProjId] = useState("");
  const activeCategory = projectCategories[activeCategoryIdx];

  const followerRef = useRef(null);
  const rightColRef = useRef(null);

  // GSAP Mouse Follower for project list hover
  useEffect(() => {
    const follower = followerRef.current;
    if (!follower) return;

    const xTo = gsap.quickTo(follower, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(follower, "y", { duration: 0.35, ease: "power3.out" });
    const rotateTo = gsap.quickTo(follower, "rotation", { duration: 0.4, ease: "power2.out" });

    let lastMouseX = 0;

    const handleMouseMove = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const deltaX = mouseX - lastMouseX;
      lastMouseX = mouseX;
      const rotation = Math.max(-10, Math.min(10, deltaX * 0.4));

      xTo(mouseX);
      yTo(mouseY);
      rotateTo(rotation);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll Trigger to update active project based on scroll focus
  useEffect(() => {
    ScrollTrigger.getAll().forEach(t => {
      if (t.vars.id && t.vars.id.startsWith("proj-")) t.kill();
    });

    const projects = activeCategory.projects;
    if (projects.length === 0) return;

    setActiveProjId(projects[0].id);

    projects.forEach((proj) => {
      ScrollTrigger.create({
        id: `proj-${proj.id}`,
        trigger: `#card-${proj.id}`,
        start: "top 40%",
        end: "bottom 40%",
        onEnter: () => setActiveProjId(proj.id),
        onEnterBack: () => setActiveProjId(proj.id),
      });
    });
  }, [activeCategoryIdx]);

  const handleMouseEnter = (projId, categoryColor) => {
    const follower = followerRef.current;
    if (!follower) return;

    const proj = activeCategory.projects.find(p => p.id === projId);
    const mainImage = proj && proj.images && proj.images.length > 0 ? proj.images[0] : "";
    
    const imgElement = follower.querySelector('.follower-preview-img');
    if (imgElement && mainImage) {
      imgElement.src = mainImage;
    }

    follower.style.borderColor = categoryColor;

    gsap.to(follower, {
      opacity: 1,
      scale: 1,
      duration: 0.25,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    const follower = followerRef.current;
    if (!follower) return;

    gsap.to(follower, {
      opacity: 0,
      scale: 0.8,
      duration: 0.2,
      ease: "power2.in"
    });
  };

  const scrollToProject = (projId) => {
    const el = document.getElementById(`card-${projId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section className="work-section" id="work-section">
      
      {/* 1. Header Hub to Toggle Disciplines */}
      <div className="work-section-header">
        <h2 className="section-title">Selected Work</h2>
        
        <div className="discipline-tabs">
          {projectCategories.map((cat, idx) => (
            <button
              key={cat.id}
              className={`discipline-tab-btn ${activeCategoryIdx === idx ? 'tab-active' : ''}`}
              style={{ 
                '--tab-accent': cat.accentColor,
                borderColor: activeCategoryIdx === idx ? cat.accentColor : 'rgba(255,255,255,0.05)'
              }}
              onClick={() => {
                setActiveCategoryIdx(idx);
                const el = document.querySelector('.work-layout-wrapper');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Split Showcase Layout */}
      <div className="work-layout-wrapper">
        
        {/* LEFT COLUMN: Sticky Navigation */}
        <div className="work-sticky-col" onMouseLeave={handleMouseLeave}>
          <div className="sticky-nav-container">
            <span className="sticky-label">Projects List:</span>
            
            <ul className="project-sticky-list" onMouseLeave={handleMouseLeave}>
              {activeCategory.projects.map((proj) => {
                const isActive = activeProjId === proj.id;
                return (
                  <li 
                    key={proj.id}
                    className={`sticky-list-item ${isActive ? 'item-active' : ''}`}
                    onClick={() => scrollToProject(proj.id)}
                    onMouseEnter={() => handleMouseEnter(proj.id, activeCategory.accentColor)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div 
                      className="sticky-dot" 
                      style={{ background: isActive ? activeCategory.accentColor : 'transparent' }}
                    />
                    <span className="sticky-project-name">{proj.title}</span>
                  </li>
                );
              })}
            </ul>

            {/* Resume download corresponding to this active category */}
            <div className="resume-section-box" style={{ borderLeftColor: activeCategory.accentColor }}>
              <h5>Target Qualifications</h5>
              <p className="resume-box-desc">
                Download the {activeCategoryIdx === 0 ? 'Robotics-specific' : 'Software/VLSI-specific'} resume file customized for this engineering field.
              </p>
              <a 
                href={activeCategory.resumePath} 
                download={activeCategory.resumeName}
                className="resume-download-btn"
                style={{ 
                  background: activeCategory.accentColor,
                  color: '#0a0b10'
                }}
              >
                <i className="fa-solid fa-file-arrow-down"></i> Get Resume (PDF)
              </a>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Scrollable detailed cards */}
        <div ref={rightColRef} className="work-scrollable-col">
          {activeCategory.projects.map((proj) => (
            <div 
              key={proj.id} 
              id={`card-${proj.id}`} 
              className={`project-detail-card ${activeProjId === proj.id ? 'card-focused' : ''}`}
            >
              <div className="card-top-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="card-period">{proj.period}</span>
                  <span className="card-period-bar" style={{ background: activeCategory.accentColor }} />
                </div>
                {proj.github && (
                  <a 
                    href={proj.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="project-github-link magnet-target"
                    title="View GitHub Repository"
                  >
                    <i className="ri-github-fill"></i>
                  </a>
                )}
              </div>

              {/* SPLIT LAYOUT INSIDE PROJECT CARD */}
              <div className="project-card-inner-layout">
                
                {/* Left Text details */}
                <div className="project-card-text-col">
                  <h3 className="project-card-title">{proj.title}</h3>
                  <p className="project-card-subtitle" style={{ color: activeCategory.accentColor }}>{proj.subtitle}</p>

                  {/* Challenge block */}
                  <div className="project-meta-block">
                    <span className="meta-label">The Challenge</span>
                    <p className="meta-text">{proj.challenge}</p>
                  </div>

                  {/* Role block */}
                  <div className="project-meta-block">
                    <span className="meta-label">Role & Engineering Tasks</span>
                    <p className="meta-text">{proj.role}</p>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="project-meta-block">
                    <span className="meta-label">Key Highlights</span>
                    <ul className="project-highlights-list">
                      {proj.highlights.map((hl, i) => (
                        <li key={i}>{hl}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech Stack tags */}
                  <div className="project-meta-block">
                    <span className="meta-label">Technologies Applied</span>
                    <div className="tech-tags">
                      {proj.stack.map((tech) => (
                        <span 
                          key={tech} 
                          className="tech-tag" 
                          style={{ 
                            borderColor: `rgba(${parseInt(activeCategory.accentColor.slice(1,3),16) || 0}, ${parseInt(activeCategory.accentColor.slice(3,5),16) || 242}, ${parseInt(activeCategory.accentColor.slice(5,7),16) || 254}, 0.25)`,
                            color: activeCategory.accentColor
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Slideshow panel */}
                <div className="project-card-media-col">
                  <ProjectImageSlideshow images={proj.images} />
                </div>

              </div>

            </div>
          ))}

          {/* Inline Simulation Widget depending on the active discipline */}
          <div className="discipline-widget-wrapper" style={{ marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '40px' }}>
            {activeCategoryIdx === 2  && <h3 className="widget-section-headline">Interactive Sandbox</h3>}
            {/* {activeCategoryIdx === 0 && <AutonomousCarSimulator />} */}
            {/* {activeCategoryIdx === 1 && <RAGGraphSimulator />} */}
            {activeCategoryIdx === 2 && <SystolicArraySimulator />}
          </div>

        </div>

      </div>

      {/* IMAGE-PREVIEW CURSOR FOLLOWER */}
      <div 
        ref={followerRef} 
        className="project-cursor-follower"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '320px',
          height: '200px',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: 0,
          scale: 0.8,
          willChange: 'transform, opacity',
          background: '#0a0d14',
          border: '2px solid',
          borderRadius: '8px',
          boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <img 
          className="follower-preview-img" 
          src="" 
          alt="Preview" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>

    </section>
  );
}
