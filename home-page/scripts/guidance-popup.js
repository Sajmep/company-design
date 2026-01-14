// Guidance Popup JavaScript - Minimal

// Slide Navigation
let currentSlide = 0;
const totalSlides = 3; // Only image slides (2, 3, 4)

function showSlide(slide) {
  // Hide all slides
  document.querySelectorAll('.guidance-popup-slide').forEach(slideEl => {
    slideEl.classList.remove('active');
  });
  
  // Show current slide
  const currentSlideEl = document.querySelector(`.guidance-popup-slide[data-slide="${slide}"]`);
  if (currentSlideEl) {
    currentSlideEl.classList.add('active');
  }
  
  // Update slide indicators
  document.querySelectorAll('.guidance-popup-slide-dot').forEach((dot, index) => {
    if (index <= slide) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
  
  // Update navigation buttons
  const prevBtn = document.querySelector('.guidance-popup-prev-btn');
  const nextBtn = document.querySelector('.guidance-popup-next-btn');
  const finishBtn = document.querySelector('.guidance-popup-finish-btn');
  
  if (prevBtn) {
    prevBtn.style.display = slide === 0 ? 'none' : 'flex';
  }
  
  if (nextBtn && finishBtn) {
    if (slide === totalSlides - 1) {
      // Last slide - show "Get started" button
      nextBtn.style.display = 'none';
      finishBtn.style.display = 'flex';
    } else {
      // Middle slides - show "Next" button
      nextBtn.style.display = 'flex';
      finishBtn.style.display = 'none';
    }
  }
}

function nextSlide() {
  const firstSlide = document.querySelector('.guidance-popup-first-slide');
  const slidesContainer = document.querySelector('.guidance-popup-slides-container');
  const slidesIndicator = document.querySelector('.guidance-popup-slides-indicator');
  const navigation = document.querySelector('.guidance-popup-navigation');
  
  // If first slide is visible, hide it and show slides system
  if (firstSlide && firstSlide.style.display !== 'none') {
    firstSlide.style.display = 'none';
    if (slidesContainer) slidesContainer.style.display = 'flex';
    if (slidesIndicator) slidesIndicator.style.display = 'flex';
    if (navigation) navigation.style.display = 'flex';
    currentSlide = 0;
    showSlide(0);
    return;
  }
  
  // Otherwise, navigate to next image slide
  if (currentSlide < totalSlides - 1) {
    currentSlide++;
    showSlide(currentSlide);
  }
}

function previousSlide() {
  if (currentSlide > 0) {
    currentSlide--;
    showSlide(currentSlide);
  }
}

// Initialize on popup open
function openGuidancePopup() {
  const popup = document.querySelector('.guidance-popup');
  const firstSlide = document.querySelector('.guidance-popup-first-slide');
  const slidesContainer = document.querySelector('.guidance-popup-slides-container');
  const slidesIndicator = document.querySelector('.guidance-popup-slides-indicator');
  const navigation = document.querySelector('.guidance-popup-navigation');
  
  if (popup) {
    popup.style.display = 'flex';
    // Show first slide, hide slides system
    if (firstSlide) firstSlide.style.display = 'flex';
    if (slidesContainer) slidesContainer.style.display = 'none';
    if (slidesIndicator) slidesIndicator.style.display = 'none';
    if (navigation) navigation.style.display = 'none';
    currentSlide = 0;
  }
}

function closeGuidancePopup() {
  const popup = document.querySelector('.guidance-popup');
  if (popup) {
    popup.style.display = 'none';
  }
}

// Close popup when clicking outside
document.addEventListener('click', function(event) {
  const popup = document.querySelector('.guidance-popup');
  const popupContent = document.querySelector('.guidance-popup-content');
  
  if (popup && popupContent && event.target === popup) {
    closeGuidancePopup();
  }
});
