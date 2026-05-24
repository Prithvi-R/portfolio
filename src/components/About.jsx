import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const textEl = textRef.current;
    if (!textEl) return;

    // Split text into words
    const words = textEl.textContent.trim().split(/\s+/);
    textEl.innerHTML = words.map(word => `<span>${word}</span>`).join(' ');

    const spans = textEl.querySelectorAll('span');

    // Create GSAP ScrollTrigger animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
        end: "top 10%",
        scrub: 1,
      }
    });

    tl.to(spans, {
      color: "#ffffff",
      stagger: 0.5,
      duration: 1
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === containerRef.current) t.kill();
      });
    };
  }, []);

  return (
    <section ref={containerRef} id="about-section" className="about-page">
      <h2 ref={textRef} className="about-text-reveal">
        Hi, I'm Prithvi Raj. I love building things that are efficient, decentralized, and ready for deployment...
      </h2>
    </section>
  );
}
