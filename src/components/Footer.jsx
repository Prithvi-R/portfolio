import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const sayRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const sayEl = sayRef.current;
    if (!sayEl) return;

    // Split text into characters including spaces
    const text = sayEl.textContent;
    sayEl.innerHTML = text.split('').map(char => {
      if (char === ' ') return `<span>&nbsp;</span>`;
      return `<span>${char}</span>`;
    }).join('');

    const spans = sayEl.querySelectorAll('span');

    gsap.fromTo(spans, 
      { y: "100%" },
      {
        y: "0%",
        stagger: 0.05,
        scrollTrigger: {
          trigger: ".footer-spacer-element",
          start: "top 90%",
          end: "bottom bottom",
          scrub: 1,
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === sayEl) t.kill();
      });
    };
  }, []);

  const handleMailClick = () => {
    window.location.href = "mailto:rprithvi939@gmail.com";
  };

  return (
    <footer ref={containerRef} id="footer" className="footer-section-old">
      
      {/* Top Label */}
      <div className="footer-top-old">
        <h4>contact</h4>
      </div>

      {/* Playful Reveal Title */}
      <div id="say" className="footer-say-container">
        <h1 ref={sayRef} className="footer-huge-title">let's talk!</h1>
      </div>

      {/* Centered Email Link */}
      <h2 
        id="mail" 
        className="footer-mail-link magnet-target"
        onClick={handleMailClick}
      >
        rprithvi939@gmail.com
      </h2>

      {/* Phone and Social details */}
      <div className="footer-details-container">
        <div className="footer-details-row">
          <span className="footer-phone">
            Phone: <a href="tel:+919955095089" className="magnet-target">+91 9955095089</a>
          </span>
          <div className="footer-social-links">
            <a href="https://github.com/Prithvi-R" target="_blank" rel="noopener noreferrer" className="magnet-target">github</a>
            <a href="https://linkedin.com/in/prithvi-ra" target="_blank" rel="noopener noreferrer" className="magnet-target">linkedin</a>
          </div>
        </div>

        {/* Bottom Credits */}
        <h5 className="footer-credits-label">
          created with ❤️ by Prithvi
        </h5>
      </div>

    </footer>
  );
}
