/* ==========================================================================
   COUNTDOWN.JS - GLASSMORPHIC CIRCULAR COUNTDOWN RING CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCountdownTimer();
});

function initCountdownTimer() {
  // Target: Sunday, 20 September 2026 at 11:30 AM
  const targetDate = new Date('2026-09-20T11:30:00').getTime();
  
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  
  const daysRing = document.getElementById('days-ring');
  const hoursRing = document.getElementById('hours-ring');
  const minutesRing = document.getElementById('minutes-ring');
  const secondsRing = document.getElementById('seconds-ring');
  
  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
  
  // Circumference of circles (cx="70" cy="70" r="64")
  // Circumference = 2 * Math.PI * r = 2 * 3.14159 * 64 = 402.12
  const circumference = 402.12;
  
  // Initialize ring dash arrays
  const rings = [daysRing, hoursRing, minutesRing, secondsRing];
  rings.forEach(ring => {
    if (ring) {
      ring.style.strokeDasharray = circumference;
      ring.style.strokeDashoffset = circumference;
    }
  });
  
  function updateTimer() {
    const now = new Date().getTime();
    let difference = targetDate - now;
    
    // Fallback if target date has passed
    if (difference < 0) {
      difference = 0;
    }
    
    // Time calculations
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    // Update numerical values (zero-padded)
    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
    
    // Update SVG progress rings
    // Seconds: out of 60
    if (secondsRing) {
      const secondsOffset = circumference - (seconds / 60) * circumference;
      secondsRing.style.strokeDashoffset = secondsOffset;
    }
    
    // Minutes: out of 60
    if (minutesRing) {
      const minutesOffset = circumference - (minutes / 60) * circumference;
      minutesRing.style.strokeDashoffset = minutesOffset;
    }
    
    // Hours: out of 24
    if (hoursRing) {
      const hoursOffset = circumference - (hours / 24) * circumference;
      hoursRing.style.strokeDashoffset = hoursOffset;
    }
    
    // Days: out of arbitrary 100-day milestone for visual scaling
    if (daysRing) {
      const capDays = Math.min(100, days);
      const daysOffset = circumference - (capDays / 100) * circumference;
      daysRing.style.strokeDashoffset = daysOffset;
    }
  }
  
  // Start countdown and trigger immediately
  updateTimer();
  setInterval(updateTimer, 1000);
}
