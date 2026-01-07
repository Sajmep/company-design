// Announcement Popup JavaScript - Minimal

function openAnnouncementPopup() {
  const popup = document.querySelector('.announcement-popup');
  if (popup) {
    popup.style.display = 'flex';
  }
}

function closeAnnouncementPopup() {
  const popup = document.querySelector('.announcement-popup');
  if (popup) {
    popup.style.display = 'none';
  }
}

// Close popup when clicking outside
document.addEventListener('click', function(event) {
  const popup = document.querySelector('.announcement-popup');
  const popupContent = document.querySelector('.announcement-popup-content');
  
  if (popup && popupContent && event.target === popup) {
    closeAnnouncementPopup();
  }
});
