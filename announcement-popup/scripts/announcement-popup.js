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

// Dropdown Toggle Function
function toggleDropdown() {
  const dropdown = document.getElementById('sendDropdown');
  const toggle = document.querySelector('.announcement-popup-dropdown-toggle');
  
  if (dropdown && toggle) {
    const isActive = dropdown.classList.contains('active');
    
    // Close all dropdowns
    document.querySelectorAll('.announcement-popup-dropdown-menu').forEach(menu => {
      menu.classList.remove('active');
    });
    document.querySelectorAll('.announcement-popup-dropdown-toggle').forEach(tog => {
      tog.classList.remove('active');
    });
    
    // Toggle current dropdown
    if (!isActive) {
      dropdown.classList.add('active');
      toggle.classList.add('active');
    }
  }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
      const sendDropdown = document.querySelector('.announcement-popup-send-dropdown');
      
      if (dropdown && toggle && sendDropdown) {
        if (!sendDropdown.contains(event.target)) {
          dropdown.classList.remove('active');
          toggle.classList.remove('active');
        }
      }
    });
}
