/* ==========================================================================
   GALLERY.JS - MASONRY LIGHTBOX CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryLightbox();
});

function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox-overlay');
  const lightboxImg = document.querySelector('.lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-nav.prev');
  const nextBtn = document.querySelector('.lightbox-nav.next');
  
  if (galleryItems.length === 0 || !lightbox || !lightboxImg || !closeBtn) return;
  
  let currentIndex = 0;
  const imagesList = [];
  
  // Build internal image URL cache for simple cycling
  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    if (img) {
      imagesList.push(img.src);
      
      // Open Lightbox click event
      item.addEventListener('click', () => {
        currentIndex = index;
        openLightbox(imagesList[currentIndex]);
      });
    }
  });
  
  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Lock main scrolling
    
    // Smooth transition trigger
    setTimeout(() => {
      lightbox.style.opacity = '1';
    }, 50);
  }
  
  function closeLightbox() {
    lightbox.style.opacity = '0';
    setTimeout(() => {
      lightbox.style.display = 'none';
      document.body.style.overflow = ''; // Unlock scroll
      lightboxImg.src = '';
    }, 500);
  }
  
  function showNextImage() {
    currentIndex = (currentIndex + 1) % imagesList.length;
    fadeTransitionImg(imagesList[currentIndex]);
  }
  
  function showPrevImage() {
    currentIndex = (currentIndex - 1 + imagesList.length) % imagesList.length;
    fadeTransitionImg(imagesList[currentIndex]);
  }
  
  // Transition between images with a quick elegant fade/blur
  function fadeTransitionImg(newSrc) {
    lightboxImg.style.transition = 'opacity 0.2s, filter 0.2s';
    lightboxImg.style.opacity = '0.3';
    lightboxImg.style.filter = 'blur(6px)';
    
    setTimeout(() => {
      lightboxImg.src = newSrc;
      lightboxImg.style.opacity = '1';
      lightboxImg.style.filter = 'blur(0)';
    }, 200);
  }
  
  // Listeners
  closeBtn.addEventListener('click', closeLightbox);
  
  if (nextBtn) nextBtn.addEventListener('click', showNextImage);
  if (prevBtn) prevBtn.addEventListener('click', showPrevImage);
  
  // Close when clicking outside of image box
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  // Keyboard arrow key bindings
  document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'flex') {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        showNextImage();
      } else if (e.key === 'ArrowLeft') {
        showPrevImage();
      }
    }
  });
}
