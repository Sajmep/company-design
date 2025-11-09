// Edit Page - Only Move Controls Logic

let selectedHotspotIndex = 0; // Currently selected hotspot

// Setup move controls when page loads
window.addEventListener('load', function() {
  // Wait a bit for preview-360.js to initialize
  setTimeout(function() {
    setupMoveControls();
    setupHotspotTypeChange();
    if (typeof setupDragAndDrop === 'function') {
      setupDragAndDrop();
    }
  }, 500);
});

// Setup move controls
function setupMoveControls() {
  const moveStep = 200; // How much to move per click

  // Move up
  const moveUpBtn = document.getElementById('moveUp');
  if (moveUpBtn) {
    moveUpBtn.addEventListener('click', function() {
      if (window.hotspots && window.hotspots.length > 0) {
        const hotspot = window.hotspots[selectedHotspotIndex];
        if (hotspot) {
          hotspot.position.y += moveStep;
        }
      }
    });
  }

  // Move down
  const moveDownBtn = document.getElementById('moveDown');
  if (moveDownBtn) {
    moveDownBtn.addEventListener('click', function() {
      if (window.hotspots && window.hotspots.length > 0) {
        const hotspot = window.hotspots[selectedHotspotIndex];
        if (hotspot) {
          hotspot.position.y -= moveStep;
        }
      }
    });
  }

  // Move left
  const moveLeftBtn = document.getElementById('moveLeft');
  if (moveLeftBtn) {
    moveLeftBtn.addEventListener('click', function() {
      if (window.hotspots && window.hotspots.length > 0) {
        const hotspot = window.hotspots[selectedHotspotIndex];
        if (hotspot) {
          hotspot.position.x -= moveStep;
        }
      }
    });
  }

  // Move right
  const moveRightBtn = document.getElementById('moveRight');
  if (moveRightBtn) {
    moveRightBtn.addEventListener('click', function() {
      if (window.hotspots && window.hotspots.length > 0) {
        const hotspot = window.hotspots[selectedHotspotIndex];
        if (hotspot) {
          hotspot.position.x += moveStep;
        }
      }
    });
  }
}

// Make hotspots globally accessible and selectable
window.selectHotspot = function(index) {
  selectedHotspotIndex = index;
  console.log('Selected hotspot:', index);
};

// Function to get selected hotspot index (for dragHotspot.js)
window.getSelectedHotspotIndex = function() {
  return selectedHotspotIndex;
};

// Open hotspot sidebar
window.openHotspotSidebar = function() {
  const sidebar = document.getElementById('hotspotEditSidebar');
  if (sidebar) sidebar.classList.add('active');
};

// Close hotspot sidebar
window.closeHotspotSidebar = function() {
  const sidebar = document.getElementById('hotspotEditSidebar');
  if (sidebar) sidebar.classList.remove('active');
};

// Show hotspot tab based on type
window.showHotspotTab = function(type) {
  // Hide all tabs
  const allTabs = document.querySelectorAll('[class*="-hotspot-tab"]');
  allTabs.forEach(tab => {
    tab.style.display = 'none';
  });
  
  // Show the selected tab
  const selectedTab = document.querySelector('.' + type + '-hotspot-tab');
  if (selectedTab) {
    selectedTab.style.display = 'block';
  }
};

// Setup hotspot type change handler
function setupHotspotTypeChange() {
  const hotspotSelect = document.getElementById('hotspot');
  if (hotspotSelect) {
    hotspotSelect.addEventListener('change', function() {
      const selectedType = this.value;
      window.showHotspotTab(selectedType);
    });
  }

  // Setup image upload preview
  const imageUpload = document.getElementById('imageHotspotUpload');
  const imagePreview = document.getElementById('imageHotspotPreview');
  
  if (imageUpload && imagePreview) {
    imageUpload.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          imagePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

