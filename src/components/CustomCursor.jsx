import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const followerRef = useRef(null);

  useEffect(() => {
    const follower = followerRef.current;
    if (!follower) return;

    // Set initial position centered on cursor and scale down to 0.05 (400px * 0.05 = 20px visual size)
    gsap.set(follower, { xPercent: -50, yPercent: -50, scale: 0.05 });

    const xTo = gsap.quickTo(follower, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(follower, "y", { duration: 0.35, ease: "power3.out" });

    const handleMouseMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Event delegation for hover states
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;
      
      const isHeroText = target.closest('#text2');
      const isInteractive = target.closest('.magnet-target') || target.tagName === 'A' || target.tagName === 'BUTTON';

      if (isHeroText) {
        // Spotlight scale = 1 (400px visual size)
        gsap.to(follower, {
          scale: 0.4,
          duration: 0.2,
          ease: "power2.out"
        });
      } else if (isInteractive) {
        // Link scale = 0.125 (50px visual size)
        gsap.to(follower, {
          scale: 0.125,
          duration: 0.3,
          ease: "power2.out"
        });
      } else {
        // Normal scale = 0.05 (20px visual size)
        gsap.to(follower, {
          scale: 0.05,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };

    document.addEventListener('mouseover', handleMouseOver);

    // Global nested magnet target effect (SheryJS makeMagnet style)
    let activeMagnets = [];

    const handleDocumentMouseMove = (e) => {
      // Find all parent magnet targets under the cursor
      let current = e.target;
      const currentTargets = [];
      
      while (current && current !== document) {
        if (current.classList && current.classList.contains('magnet-target')) {
          const isNavbarLogo = current.closest('#navbar h3');
          const isFooterMail = current.id === 'mail';
          const isFooterDetailLink = current.closest('.footer-details-row a');
          
          if (!isNavbarLogo && !isFooterMail && !isFooterDetailLink) {
            currentTargets.push(current);
          }
        }
        current = current.parentNode;
      }

      // Reset magnets that are no longer under the cursor
      const newActiveMagnets = [];
      for (const active of activeMagnets) {
        if (currentTargets.includes(active.element)) {
          newActiveMagnets.push(active);
        } else {
          gsap.to(active.element, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)"
          });
        }
      }
      activeMagnets = newActiveMagnets;

      // Update or add newly entered magnets
      for (const target of currentTargets) {
        let active = activeMagnets.find(m => m.element === target);
        
        if (!active) {
          const rect = target.getBoundingClientRect();
          const currentX = gsap.getProperty(target, "x") || 0;
          const currentY = gsap.getProperty(target, "y") || 0;
          
          const center = {
            x: rect.left + rect.width / 2 - currentX,
            y: rect.top + rect.height / 2 - currentY
          };
          active = { element: target, center };
          activeMagnets.push(active);
        }

        // Calculate offset relative to the cached center coordinates
        const x = e.clientX - active.center.x;
        const y = e.clientY - active.center.y;
        
        gsap.to(target, {
          x: x * 0.35,
          y: y * 0.35,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };

    const handleDocumentMouseLeave = () => {
      for (const active of activeMagnets) {
        gsap.to(active.element, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.3)"
        });
      }
      activeMagnets = [];
      gsap.to(follower, {
        scale: 0.05,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    document.addEventListener('mousemove', handleDocumentMouseMove);
    document.addEventListener('mouseleave', handleDocumentMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('mouseleave', handleDocumentMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={followerRef} 
      className="mousefollower" 
      id="cursor-follower" 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '400px',
        height: '400px',
        backgroundColor: '#fff',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 99999,
        willChange: 'transform',
        mixBlendMode: 'difference'
      }}
    />
  );
}

