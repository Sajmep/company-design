// Open search more popup
function openSearchMorePopup() {
  const popup = document.getElementById('searchMorePopup');
  if (popup) {
    popup.style.display = 'flex';
  }
}

// Close search more popup
function closeSearchMorePopup() {
  const popup = document.getElementById('searchMorePopup');
  if (popup) {
    popup.style.display = 'none';
  }
}

// Close popup when clicking outside
document.addEventListener('DOMContentLoaded', function() {
  const popup = document.getElementById('searchMorePopup');
  if (popup) {
    popup.addEventListener('click', function(e) {
      if (e.target === popup) {
        closeSearchMorePopup();
      }
    });
  }

});

