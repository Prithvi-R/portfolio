import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import About from './components/About';
import WorkFolderTransition from './components/WorkFolderTransition';
import ProjectShowcase from './components/ProjectShowcase';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';

function App() {
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [footerHeight, setFooterHeight] = useState(480);

  // Dynamic ResizeObserver to measure footer size for perfect scroll reveal spacing
  useEffect(() => {
    const footerElement = document.querySelector('.footer-section-old');
    if (!footerElement) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // Adjust spacer height based on actual rendered height
        setFooterHeight(entry.target.offsetHeight);
      }
    });

    observer.observe(footerElement);
    return () => observer.disconnect();
  }, []);

  const toggleNavigation = () => {
    setIsNavOpen(!isNavOpen);
  };

  const scrollToSection = (id) => {
    setIsNavOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Dynamic Custom Cursor follower dot/circle */}
      <CustomCursor />

      {/* 1. PERSISTENT FIXED NAV BAR (Top) */}
      <div id="navbar">
        <h3 className="magnet-target" onClick={() => scrollToSection('hero')}>
          Prithvi <i>Raj</i>
        </h3>
      </div>

      {/* 2. PERSISTENT FIXED BOTTOM BAR (Bottom) */}
      <div id="bottom">
        <div /> {/* Left placeholder since sound button was removed */}
        <div id="menu" className="magnet-target" onClick={toggleNavigation}>
          <i className={isNavOpen ? 'ri-close-line' : 'ri-menu-line'}></i>
        </div>
      </div>

      {/* 3. SLIDE-OUT NAVIGATION DRAWER OVERLAY */}
      <div id="navigation" style={{ right: isNavOpen ? '0' : '-100%', transform: isNavOpen ? 'none' : 'translateX(100%)', transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        <span className="nav-close-btn magnet-target" onClick={() => setIsNavOpen(false)}>×</span>
        {/* <div className="nav-header" style={{display: 'flex', flexDirection: 'column', gap: '10px'}}> */}
          <a onClick={() => scrollToSection('page1')}>Home</a>
          <a onClick={() => scrollToSection('about-section')}>About</a>
          <a onClick={() => scrollToSection('folder-transition')}>Projects</a>
          <a onClick={() => scrollToSection('say')}>Contact</a>
        {/* </div> */}
        <div className="nav-social-group">
          <a href="https://github.com/Prithvi-R" target="_blank" rel="noopener noreferrer">github</a>
          <a href="https://linkedin.com/in/prithvi-ra" target="_blank" rel="noopener noreferrer">linkedin</a>
        </div>
      </div>

      {/* 4. MAIN SCROLL CONTAINER */}
      <div 
        id="main" 
        className="main-wrapper" 
        style={{ 
          backgroundColor: isNavOpen ? '#fffffffd' : '#c84545',
          opacity: isNavOpen ? 0.4 : 1,
          transition: 'background-color 0.4s ease, opacity 0.4s ease'
        }}
      >
        <Hero />
        
        <About />
        
        {/* Hover-open folder trigger transition */}
        <WorkFolderTransition />
        
        {/* Dynamic double-column projects listing & simulators */}
        <ProjectShowcase 
          activeCategoryIdx={activeCategoryIdx} 
          setActiveCategoryIdx={setActiveCategoryIdx} 
        />
      </div>

      {/* Spacer that pushes page scroll to reveal fixed footer beneath */}
      <div 
        className="footer-spacer-element" 
        style={{ 
          height: `${footerHeight}px`, 
          pointerEvents: 'none',
          backgroundColor: '#fff'
        }} 
      />

      {/* fixed reveal footer */}
      <Footer />
    </>
  );
}

export default App;
