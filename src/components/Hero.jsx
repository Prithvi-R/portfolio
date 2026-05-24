import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const arrowRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const arrow = arrowRef.current;
    if (!arrow) return;

    // Rotate arrow as we scroll down the hero section
    gsap.to(arrow, {
      rotate: 90,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === sectionRef.current) t.kill();
      });
    };
  }, []);

  const handleArrowClick = () => {
    const el = document.getElementById('about-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} id="page1">
      <h3>open to opportunities</h3>
      
      <div 
        ref={arrowRef} 
        id="arrow" 
        className="magnet-target"
        onClick={handleArrowClick}
      >
        <div id="in" className="magnet-target">
          <i className="ri-arrow-down-line"></i>
        </div>
      </div>

      <div id="text">
        <h4>robotics & software</h4>
        <div id="text2">
          <h1>PRITHVI RAJ</h1>
        </div>
        <divid id="text3">
          <h5>magician takes the ordinary something and makes it do something extraordinary</h5>
        </divid>
      </div>
    </section>
  );
}

