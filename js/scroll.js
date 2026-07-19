/* ==========================================================================
   SCROLL.JS - INTERSECTION OBSERVER REVEAL CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveals();
});

/* ==========================================================================
   1. Intersection Observer for General Reveals & Underlines
   ========================================================================== */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-element');
  const scrollWrapper = document.getElementById('scroll-experience-wrapper');
  
  if (revealElements.length === 0) return;
  
  const observerOptions = {
    root: scrollWrapper, // Snap container is the root
    threshold: 0.12,     // Fire when 12% visible
    rootMargin: '0px 0px -50px 0px' // Offset triggers
  };
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        
        // Trigger specific animations based on block type
        if (entry.target.classList.contains('quran-verse-translation')) {
          const fill = entry.target.querySelector('.quran-underline-fill');
          if (fill) {
            fill.style.width = '100%';
          }
        }
        
        // Unobserve to keep element visible once loaded
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
  
  // Backup scroll event trigger for instant checks
  if (scrollWrapper) {
    scrollWrapper.addEventListener('scroll', () => {
      // Force check intersection states on scrolling
      revealElements.forEach(element => {
        if (!element.classList.contains('revealed')) {
          const rect = element.getBoundingClientRect();
          const inView = (rect.top <= window.innerHeight * 0.85 && rect.bottom >= 0);
          if (inView) {
            element.classList.add('revealed');
            if (element.classList.contains('quran-verse-translation')) {
              const fill = element.querySelector('.quran-underline-fill');
              if (fill) fill.style.width = '100%';
            }
          }
        }
      });
    });
  }
}
