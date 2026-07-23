/* ==========================================================================
   MAIN.JS - WAX SEAL INTERACTION, PETALS CANVAS, PROCEDURAL AUDIO & CURSOR
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initEnvelopeInteraction();
  initRsvpForm();
});

/* ==========================================================================
   1. Custom Premium Cursor
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  const follower = document.createElement('div');
  follower.className = 'custom-cursor-follower';
  
  document.body.appendChild(cursor);
  document.body.appendChild(follower);
  
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Position dot immediately
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    
    // Dynamic wax seal shine effect based on mouse location
    const seal = document.querySelector('.wax-seal');
    if (seal && seal.style.display !== 'none') {
      const rect = seal.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width/2;
      const y = e.clientY - rect.top - rect.height/2;
      
      // Calculate angle and apply minor tilt + glare adjustments
      const tiltX = (y / rect.height) * 20;
      const tiltY = -(x / rect.width) * 20;
      seal.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
    }
  });
  
  // Clean tilt when cursor leaves wax seal
  document.addEventListener('mouseover', (e) => {
    if (!e.target.closest('.wax-seal')) {
      const seal = document.querySelector('.wax-seal');
      if (seal) {
        seal.style.transform = '';
      }
    }
  });

  // Smooth lagging follower position (Linear Interpolation)
  function updateFollower() {
    const ease = 0.12; // Dampening factor
    followerX += (mouseX - followerX) * ease;
    followerY += (mouseY - followerY) * ease;
    
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    
    requestAnimationFrame(updateFollower);
  }
  updateFollower();
  
  // Global hover listener to expand cursor
  const updateHoverState = (e) => {
    if (e.target.closest('a, button, .wax-seal, input, select, textarea, .gallery-item')) {
      document.body.classList.add('cursor-hover');
    } else {
      document.body.classList.remove('cursor-hover');
    }
  };
  
  document.addEventListener('mouseover', updateHoverState);
}

/* ==========================================================================
   2. Wax Seal & Envelope Interaction
   ========================================================================== */
function initEnvelopeInteraction() {
  const seal = document.querySelector('.wax-seal');
  const envelopeWrap = document.querySelector('.envelope-wrapper');
  const topFlap = document.querySelector('.envelope-flap.top');
  const envCard = document.querySelector('.envelope-card');
  const envExperience = document.getElementById('envelope-experience');
  const unfoldContainer = document.getElementById('unfolding-invitation-container');
  const unfoldCard = document.querySelector('.unfolding-card');
  const topFold = document.querySelector('.card-panel.top-fold');
  const bottomFold = document.querySelector('.card-panel.bottom-fold');
  const mainWrapper = document.getElementById('scroll-experience-wrapper');
  const musicController = document.querySelector('.audio-controller');
  
  if (!seal) return;
  
  // Gentler seal pulse after loader clears
  window.addEventListener('loaderFinished', () => {
    seal.style.animation = 'seal-pulse 3s infinite ease-in-out';
  });
  
  seal.addEventListener('click', () => {
    // Stop pulse animation
    seal.style.animation = 'none';
    
    // 1. Crack Seal & spawn flying fragments
    shatterSeal(seal);
    
    // Initialize procedural audio context upon user interaction
    initProceduralAudio();
    
    // 2. Open Flap (Triggers smooth hardware-accelerated CSS transition)
    setTimeout(() => {
      topFlap.style.transform = 'rotateX(180deg)';
      // Push top flap behind card after it finishes opening
      setTimeout(() => {
        topFlap.style.zIndex = '1';
      }, 1200);
    }, 600);
    
    // 3. Card slides up (Triggers smooth hardware-accelerated CSS transition)
    setTimeout(() => {
      envCard.style.transition = 'transform 2.5s var(--ease-in-out), opacity 0.8s var(--ease-apple)';
      envCard.style.transform = 'translateY(-115%)';
      envCard.style.zIndex = '92';
    }, 1800);
    
    // 4. Transition Envelope display to Unfolding Container
    setTimeout(() => {
      // Soft light glow effect
      const glow = document.getElementById('light-glow-overlay');
      if (glow) {
        glow.style.opacity = '1';
        setTimeout(() => {
          glow.style.transition = 'opacity 2.0s ease';
          glow.style.opacity = '0';
        }, 1200);
      }

      // Fade out envelope screen
      envExperience.style.transition = 'opacity 1s var(--ease-apple), transform 1s var(--ease-apple)';
      envExperience.style.opacity = '0';
      envExperience.style.transform = 'scale(0.95)';
      
      // Reveal 3D Unfolding panel screen
      unfoldContainer.style.display = 'flex';
      unfoldContainer.style.opacity = '0';
      setTimeout(() => {
        unfoldContainer.style.transition = 'opacity 1s var(--ease-apple)';
        unfoldContainer.style.opacity = '1';
      }, 50);
    }, 4300); // Triggered slightly earlier to align with the end of slide
    
    // 5. Unfold Card panels in 3D (Triggers smooth hardware-accelerated CSS transition)
    setTimeout(() => {
      topFold.style.transform = 'rotateX(180deg)';
      bottomFold.style.transform = 'rotateX(-180deg)';
      
      // Tilt card slightly forward during unfold
      unfoldCard.style.transform = 'rotateX(12deg) translateZ(50px)';
    }, 5500);
    
    // 6. Transition to Main Scroll Snapping Web Application
    setTimeout(() => {
      // Fade out unfolding wrapper
      unfoldContainer.style.transition = 'opacity 1.2s var(--ease-apple), filter 1.2s var(--ease-apple)';
      unfoldContainer.style.opacity = '0';
      unfoldContainer.style.filter = 'blur(10px)';
      
      // Show main site
      mainWrapper.style.display = 'block';
      mainWrapper.style.opacity = '0';
      
      // Show audio float btn
      musicController.style.display = 'flex';
      musicController.style.opacity = '0';
      
      setTimeout(() => {
        mainWrapper.style.transition = 'opacity 1.5s var(--ease-apple)';
        mainWrapper.style.opacity = '1';
        musicController.style.transition = 'opacity 1.5s var(--ease-apple)';
        musicController.style.opacity = '1';
        
        // Remove interactive overlays
        envExperience.remove();
        unfoldContainer.remove();
        
        // Start floating rose petals
        initRosePetals();
        
        // Run scroll reveals check
        window.dispatchEvent(new Event('scroll'));
      }, 100);
    }, 8000);
  });
}

/* Wax Seal Crumbling shatter simulation */
function shatterSeal(sealElement) {
  const rect = sealElement.getBoundingClientRect();
  const container = document.body;
  const numFragments = 16;
  
  // Play soft wax cracking audio feedback procedurally
  playProceduralClick();
  
  for (let i = 0; i < numFragments; i++) {
    const fragment = document.createElement('div');
    fragment.className = 'wax-fragment';
    
    // Random sizes
    const size = Math.random() * 15 + 8;
    fragment.style.width = size + 'px';
    fragment.style.height = size + 'px';
    
    // Position at seal center
    fragment.style.left = (rect.left + rect.width / 2 - size / 2) + 'px';
    fragment.style.top = (rect.top + rect.height / 2 - size / 2) + 'px';
    
    // Scatter physics (angle and distance)
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 120 + 60;
    const rot = Math.random() * 720 - 360;
    
    container.appendChild(fragment);
    
    // Force layout reflow before transform triggers
    fragment.offsetWidth;
    
    fragment.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) rotate(${rot}deg) scale(0.2)`;
    fragment.style.opacity = '0';
    
    // Cleanup fragment element
    setTimeout(() => {
      fragment.remove();
    }, 1200);
  }
  
  // Hide main seal
  sealElement.style.transition = 'transform 0.4s var(--ease-apple), opacity 0.4s';
  sealElement.style.transform = 'scale(0.8)';
  sealElement.style.opacity = '0';
  setTimeout(() => {
    sealElement.style.display = 'none';
  }, 400);
}

/* ==========================================================================
   3. Canvas Floating Rose Petals (Optimized slow drift)
   ========================================================================== */
function initRosePetals() {
  const canvas = document.getElementById('rose-petals-canvas');
  if (!canvas) return;
  
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
  
  const petalCount = 45;
  const petals = [];
  
  class Petal {
    constructor() {
      this.reset();
      this.y = Math.random() * height; // Distribute vertically initially
    }
    
    reset() {
      this.x = Math.random() * width;
      this.y = -20;
      this.size = Math.random() * 12 + 8;
      // Very slow drift
      this.speedY = Math.random() * 0.6 + 0.3;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.rotation = Math.random() * 360;
      this.rotSpeed = Math.random() * 0.4 - 0.2;
      // Color variations (premium rose pinks, golds, and creams)
      const colors = [
        'rgba(229, 107, 111, 0.45)', // Premium rose pink
        'rgba(244, 172, 183, 0.4)',  // Soft blush pink
        'rgba(252, 224, 130, 0.22)', // Warm gold-leaf tint
        'rgba(255, 245, 246, 0.65)'  // Elegant cream/white
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.oscillationSpeed = Math.random() * 0.02 + 0.005;
      this.oscillationDistance = Math.random() * 20 + 5;
      this.oscillationOffset = Math.random() * 100;
    }
    
    update() {
      this.y += this.speedY;
      // Left-right organic sway
      this.x += this.speedX + Math.sin(this.y * this.oscillationSpeed + this.oscillationOffset) * 0.2;
      this.rotation += this.rotSpeed;
      
      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }
    
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation * Math.PI / 180);
      
      ctx.fillStyle = this.color;
      ctx.beginPath();
      // Draw smooth, realistic petal shape using Bezier curves
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-this.size/2, -this.size/2, -this.size, this.size/3, 0, this.size);
      ctx.bezierCurveTo(this.size, this.size/3, this.size/2, -this.size/2, 0, 0);
      ctx.fill();
      ctx.restore();
    }
  }
  
  for (let i = 0; i < petalCount; i++) {
    petals.push(new Petal());
  }
  
  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   4. Background Music Player & Procedural Synthesis Fallback
   ========================================================================== */
let audioCtx = null;
let isAudioPlaying = false;
let synthTimer = null;
let delayNode = null;
let masterGain = null;
let bgmAudio = null;
let useProceduralFallback = false;

// E Major Pentatonic Scale for soothing, divine wedding ambiance
const notesFreq = [164.81, 185.00, 207.65, 246.94, 277.18, 329.63, 369.99, 415.30, 493.88, 554.37];



function setupSynthesizerContext() {
  if (audioCtx) return;
  
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContextClass();
  
  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0, audioCtx.currentTime); // Start muted
  
  delayNode = audioCtx.createDelay();
  delayNode.delayTime.setValueAtTime(0.65, audioCtx.currentTime);
  
  const delayFeedback = audioCtx.createGain();
  delayFeedback.gain.setValueAtTime(0.45, audioCtx.currentTime);
  
  const delayFilter = audioCtx.createBiquadFilter();
  delayFilter.type = 'lowpass';
  delayFilter.frequency.setValueAtTime(800, audioCtx.currentTime);
  
  delayNode.connect(delayFilter);
  delayFilter.connect(delayFeedback);
  delayFeedback.connect(delayNode);
  
  masterGain.connect(audioCtx.destination);
  delayNode.connect(masterGain);
}

function initProceduralAudio() {
  bgmAudio = document.getElementById('wedding-bgm');
  
  if (bgmAudio) {
    bgmAudio.addEventListener('error', () => {
      console.warn("BGM file assets/music/wedding_bgm.m4a not found. Falling back to procedural synthesizer.");
      useProceduralFallback = true;
      setupSynthesizerContext();
    });
  } else {
    useProceduralFallback = true;
    setupSynthesizerContext();
  }
  
  setupMusicControls();
}

// Procedural note generator (synthesizing a soft wedding bell/harp)
function playBellNote(frequency, time, duration = 2.5) {
  if (!audioCtx || audioCtx.state === 'suspended') return;
  
  // Triangle oscillator for soft, warm fundamental frequency
  const osc = audioCtx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(frequency, time);
  
  // Sine modulator to add a gentle vibrato
  const vibrato = audioCtx.createOscillator();
  const vibratoGain = audioCtx.createGain();
  vibrato.frequency.setValueAtTime(4.5, time); // 4.5 Hz vibration
  vibratoGain.gain.setValueAtTime(2.5, time);  // minor depth
  
  vibrato.connect(vibratoGain);
  vibratoGain.connect(osc.frequency);
  
  // Independent Gain envelope
  const noteGain = audioCtx.createGain();
  noteGain.gain.setValueAtTime(0, time);
  // Extremely soft attack to feel ambient
  noteGain.gain.linearRampToValueAtTime(0.08, time + 0.15);
  // Elegant exponential release/decay
  noteGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
  
  osc.connect(noteGain);
  noteGain.connect(masterGain);
  noteGain.connect(delayNode); // Feed into delay line
  
  vibrato.start(time);
  osc.start(time);
  
  vibrato.stop(time + duration);
  osc.stop(time + duration);
}

// Web Audio API procedural click sound for breaking the wax seal
function playProceduralClick() {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const osc = context.createOscillator();
  const gain = context.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, context.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, context.currentTime + 0.08);
  
  gain.gain.setValueAtTime(0.12, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.08);
  
  osc.connect(gain);
  gain.connect(context.destination);
  
  osc.start();
  osc.stop(context.currentTime + 0.08);
}

// Procedural music composer scheduling loop
function startProceduralComposer() {
  let noteIndex = 0;
  
  function scheduleMelody() {
    if (!isAudioPlaying) return;
    
    const now = audioCtx.currentTime;
    
    // Soft random selection with pentatonic constraints
    // Tends to prefer harmonious pairings
    const randNoteIndex1 = Math.floor(Math.random() * notesFreq.length);
    const randFreq1 = notesFreq[randNoteIndex1];
    
    // Play main voice melody note
    playBellNote(randFreq1, now, 3.2);
    
    // Occasional harmony note (65% chance)
    if (Math.random() < 0.65) {
      const harmonyOffset = [3, 4, 5, 7][Math.floor(Math.random() * 4)];
      const randFreq2 = notesFreq[(randNoteIndex1 + harmonyOffset) % notesFreq.length];
      playBellNote(randFreq2, now + 0.35, 2.5);
    }
    
    // Slow interval between melody phrases (2.2 seconds to 3.8 seconds)
    const nextInterval = Math.random() * 1600 + 2200;
    synthTimer = setTimeout(scheduleMelody, nextInterval);
  }
  
  scheduleMelody();
}

function stopProceduralComposer() {
  clearTimeout(synthTimer);
}

function setupMusicControls() {
  const musicController = document.querySelector('.audio-controller');
  const btn = document.querySelector('.music-btn');
  const visualizerBars = document.querySelectorAll('.visualizer-bar');
  
  if (!btn) return;
  
  // Set up visualizer bar animations (individual speeds)
  visualizerBars.forEach((bar) => {
    bar.style.transition = 'height 0.3s';
  });
  
  let visualizerTimer = null;
  function animateVisualizer() {
    if (isAudioPlaying) {
      visualizerBars.forEach((bar) => {
        const height = Math.random() * 15 + 4;
        bar.style.height = height + 'px';
      });
      visualizerTimer = setTimeout(animateVisualizer, 180);
    } else {
      visualizerBars.forEach((bar) => {
        bar.style.height = '3px';
      });
    }
  }
  
  function toggleMusic() {
    if (useProceduralFallback) {
      // Synthesizer Fallback Flow
      if (!audioCtx) {
        setupSynthesizerContext();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      
      if (isAudioPlaying) {
        masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
        masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
        
        setTimeout(() => {
          stopProceduralComposer();
          isAudioPlaying = false;
          musicController.classList.remove('playing');
          clearTimeout(visualizerTimer);
          visualizerBars.forEach((bar) => { bar.style.height = '3px'; });
        }, 1200);
      } else {
        isAudioPlaying = true;
        musicController.classList.add('playing');
        
        masterGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
        masterGain.gain.exponentialRampToValueAtTime(1.0, audioCtx.currentTime + 2.5);
        
        startProceduralComposer();
        animateVisualizer();
      }
    } else {
      // Actual M4A Audio File Flow
      if (isAudioPlaying) {
        // Fade out volume gently
        let fadeInterval = setInterval(() => {
          if (bgmAudio.volume > 0.03) {
            bgmAudio.volume -= 0.03;
          } else {
            clearInterval(fadeInterval);
            bgmAudio.pause();
            isAudioPlaying = false;
            musicController.classList.remove('playing');
            clearTimeout(visualizerTimer);
            visualizerBars.forEach((bar) => { bar.style.height = '3px'; });
          }
        }, 50);
      } else {
        isAudioPlaying = true;
        musicController.classList.add('playing');
        bgmAudio.volume = 0;
        
        const playPromise = bgmAudio.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            // Fade in volume gently over 2 seconds
            let fadeInterval = setInterval(() => {
              if (bgmAudio.volume < 0.95) {
                bgmAudio.volume += 0.05;
              } else {
                bgmAudio.volume = 1;
                clearInterval(fadeInterval);
              }
            }, 100);
            animateVisualizer();
          }).catch((err) => {
            console.warn("BGM play failed, falling back to synth:", err);
            useProceduralFallback = true;
            isAudioPlaying = false;
            musicController.classList.remove('playing');
            toggleMusic(); // Trigger the synthesizer fallback
          });
        }
      }
    }
  }
  
  btn.addEventListener('click', toggleMusic);
  
  // Auto-trigger music on wax seal break
  toggleMusic();
}

/* ==========================================================================
   // Google Form RSVP Configuration (Live connected to guest sheet!)
   ========================================================================== */
const GOOGLE_FORM_CONFIG = {
  formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScB1xTGshId3f4JASzCPowbamlZClnUKbVB77HLFpR7G3qHTw/formResponse',
  fields: {
    name: 'entry.1044802346',
    phone: 'entry.1718912156',
    guests: 'entry.1953715307',
    message: 'entry.1781111882'
  }
};

/* ==========================================================================
   5. RSVP Form Premium Handler
   ========================================================================== */
let rsvpFormSubmitted = false;

// Global callback for hidden iframe onload event
window.rsvpIframeLoaded = function() {
  if (!rsvpFormSubmitted) return; // Ignore initial iframe load on page load
  
  const form = document.getElementById('wedding-rsvp-form');
  const notification = document.getElementById('rsvp-status-notification');
  if (!form || !notification) return;
  
  const submitBtn = form.querySelector('button[type="submit"]');
  
  // Restore button state
  submitBtn.disabled = false;
  submitBtn.innerHTML = 'Confirm Attendance';
  
  // Show premium success notification
  notification.textContent = 'Thank you! Your RSVP response has been recorded beautifully.';
  notification.className = 'rsvp-status-message success';
  form.reset();
  
  rsvpFormSubmitted = false; // Reset submission flag
  
  // Auto-hide success notification after 5 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.textContent = '';
      notification.className = 'rsvp-status-message';
      notification.style.opacity = '';
    }, 400);
  }, 5000);
};

/* ==========================================================================
   5. RSVP Form Premium Handler
   ========================================================================== */
function initRsvpForm() {
  const form = document.getElementById('wedding-rsvp-form');
  const notification = document.getElementById('rsvp-status-notification');
  
  if (!form || !notification) return;
  
  form.addEventListener('submit', (e) => {
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Set loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Recording Response...';
    
    rsvpFormSubmitted = true; // Mark as submitted so iframe onload triggers success
  });
}
