import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WorkFolderTransition() {
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const contentContainer = section.querySelector('.folder-content-container');
    if (!contentContainer) return;

    // Create scroll-driven timeline for entrance and exit fades
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top bottom",    // start animation when the top of the section enters the bottom of screen
        end: "bottom top",      // end animation when the bottom of the section leaves the top of screen
        scrub: true,            // link to scroll speed
      }
    });

    // Animate opacity up to center, hold, then fade back out
    tl.fromTo(contentContainer, 
      { opacity: 0.15, scale: 0.95 },
      { opacity: 1.0, scale: 1.0, duration: 1, ease: "power1.out" }
    ).to(contentContainer,
      { opacity: 0.15, scale: 0.95, duration: 1, ease: "power1.in" },
      "+=0.5" // hold full opacity in the middle
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === section) t.kill();
      });
    };
  }, []);

  const handleFolderClick = () => {
    const el = document.getElementById('work-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="folder-transition-section" id="folder-transition">
      
      {/* Giant faint word backdrop */}
      <div className="folder-backdrop-text">Work</div>

      <div className="folder-content-container">
        <span className="folder-top-label">Curious?... Check out my</span>
        
        {/* Interactive Folder */}
        <div 
          className={`folder-wrapper ${isHovered ? 'folder-hovered' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleFolderClick}
        >
          {/* Papers sticking out of folder (will slide up on hover) */}
          <div className="folder-papers">
            <div className="paper paper-1">
              <span className="paper-code">0x7B // Robotics</span>
            </div>
            <div className="paper paper-2">
              <span className="paper-code">0x8C // Software</span>
            </div>
            <div className="paper paper-3">
              <span className="paper-code">0x9D // FPGA</span>
            </div>
          </div>

          {/* Folder Back plate */}
          <div className="folder-back" />

          {/* Folder Front plate */}
          <div className="folder-front">
            <div className="folder-tab-label">Portfolio</div>
            
            {/* Logo and Arrow inside folder */}
            <div className="folder-inner-brand">
              <div className="folder-brand-logo">PR</div>
              <div className="folder-arrow-btn">
                <i className="fa-solid fa-arrow-right"></i>
              </div>
            </div>
          </div>
        </div>

        <span className="folder-bottom-label">Or keep scrolling</span>
      </div>

    </section>
  );
}
