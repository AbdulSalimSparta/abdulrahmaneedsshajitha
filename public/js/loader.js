/* ==========================================================================
   LOADER.JS - INTRO BISMILLAH STATE MANAGER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader-container');
  const bismillahText = document.querySelector('.bismillah-text');
  
  if (!loader || !bismillahText) return;
  
  // 1. Trigger fade-in with custom easing
  setTimeout(() => {
    bismillahText.style.transition = 'opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1), filter 1.5s cubic-bezier(0.16, 1, 0.3, 1)';
    bismillahText.style.opacity = '1';
    bismillahText.style.filter = 'blur(0)';
  }, 300); // Small initial buffer
  
  // 2. Stay 2 seconds, then trigger fade-out
  setTimeout(() => {
    bismillahText.style.opacity = '0';
    bismillahText.style.filter = 'blur(6px)';
  }, 2300); // 300ms + 2000ms delay
  
  // 3. Fade out loader container
  setTimeout(() => {
    loader.style.transition = 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), visibility 1s';
    loader.style.opacity = '0';
    loader.style.visibility = 'hidden';
    
    // Dispatch custom event to notify main script that loader has cleared
    window.dispatchEvent(new CustomEvent('loaderFinished'));
  }, 3300); // 2300ms + 1000ms delay
});
