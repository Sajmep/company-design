// ============================================================================
// Panorama Preview Page Script - Using Three.js with Panolens
// ============================================================================

// ============================================================================
// SECTION 1: GLOBAL VARIABLES
// ============================================================================

let viewer = null;
let panorama = null;
let hotspots = [];
let panoramaLoaded = false;

// ============================================================================
// SECTION 2: HOTSPOT DATA & CONFIGURATION
// ============================================================================

// Hotspot data - Contains information for different types of hotspots
const hotspotData = {
  image: {
    type: 'image',
    title: "Room Image",
    imageUrl: "../images/vendor6.jpg"
  },
  video: {
    type: 'video',
    title: "Room Video",
    youtubeId: "q0akSljWBpc?si=XVEGEZExSFCKkkew" // Replace with your YouTube video ID
  },
  info: {
    type: 'info',
    title: "Room Information",
    description: "Some sample text for this info card. This is just test text",
    price: "$199.99",
    link: "https://example.com/product"
  },
  navigation: {
    type: 'navigation',
    title: "Go to Next Panorama",
    targetPanorama: "images/360-2.jpg" // Image URL of the next panorama
  }
};

// ============================================================================
// SECTION 3: PANORAMA VIEWER INITIALIZATION
// ============================================================================

// Initialize viewer when page loads
window.addEventListener('load', function() {
  // Get image URL from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const imageUrl = urlParams.get('image');
  
  if (!imageUrl) {
    console.error('No image URL provided');
    console.log('Current URL:', window.location.href);
    console.log('URL parameters:', urlParams.toString());
    alert('No image URL provided. Please provide an image parameter in the URL.');
    return;
  }
  
  console.log('Initializing viewer with image:', imageUrl);
  initializeViewer(imageUrl);
  updateActivePanoramaInSidebar(imageUrl);
});

// ============================================================================
// SECTION 4: PANORAMA SIDEBAR FUNCTIONALITY (PREVIEW PAGE)
// ============================================================================

// Update active panorama in sidebar based on current image
function updateActivePanoramaInSidebar(currentImageUrl) {
  const panoramaItems = document.querySelectorAll('.panorama-item');
  
  panoramaItems.forEach(function(item) {
    // Remove active class from all items
    item.classList.remove('active');
    
    // Get image path from this item
    const img = item.querySelector('.panorama-item-image img');
    if (img) {
      const itemImagePath = img.getAttribute('src');
      
      // Check if this item's image matches current panorama
      if (currentImageUrl.includes(itemImagePath) || itemImagePath === currentImageUrl) {
        item.classList.add('active');
      }
    }
  });
}

// ============================================================================
// SECTION 5: PANORAMA VIEWER SETUP
// ============================================================================

// Initialize Panolens viewer
function initializeViewer(imageUrl) {
  const container = document.getElementById('panoramaImage');
  
  if (!container) {
    console.error('Container not found');
    return;
  }
  
  // Clear container
  container.innerHTML = '';
  
  // Create viewer with WebXR VR support
  viewer = new PANOLENS.Viewer({
    container: container,
    autoRotate: false,
    controlBar: true,
    autoRotateSpeed: 0.3,
    autoRotateActivationDuration: 2000,
    enableVR: true,        // Enable WebXR VR mode (Panolens will handle VR automatically)
    enableReticle: false,  // Disable reticle by default - we'll enable it in VR mode
    cameraFov: 75          // Set camera field of view
  });
  
  // Wait for viewer to fully initialize and find Panolens VR button
  // We'll use Panolens's built-in VR button instead of custom implementation
  setTimeout(() => {
    findAndStorePanolensVRButton(container);
  }, 500);
  
  setTimeout(() => {
    findAndStorePanolensVRButton(container);
  }, 1500);
  
  setTimeout(() => {
    findAndStorePanolensVRButton(container);
  }, 3000);
  
  function findAndStorePanolensVRButton(container) {
    // Look for Panolens VR button in various possible locations
    const possibleSelectors = [
      '.panolens-control-bar .panolens-control-item[data-control="vr"]',
      '.panolens-control-bar button[data-control="vr"]',
      '.panolens-control-bar [data-control="vr"]',
      'button[data-control="vr"]',
      '.panolens-vr-button',
      '.vr-button'
    ];
    
    for (let selector of possibleSelectors) {
      const panolensVRButton = container.querySelector(selector);
      if (panolensVRButton) {
        console.log('Panolens VR button found with selector:', selector);
        // Store reference but DON'T hide it - we'll use it
        window.panolensVRButton = panolensVRButton;
        // Make it visible in case it was hidden
        panolensVRButton.style.display = '';
        return;
      }
    }
    
    // Also check if viewer has VR methods
    if (viewer) {
      const viewerKeys = Object.keys(viewer);
      const vrMethods = viewerKeys.filter(k => k.toLowerCase().includes('vr'));
      if (vrMethods.length > 0) {
        console.log('Viewer has VR-related methods:', vrMethods);
      }
    }
    
    // Check renderer XR availability
    if (viewer && viewer.renderer) {
      console.log('Renderer XR check:', {
        hasXR: !!viewer.renderer.xr,
        rendererType: viewer.renderer.constructor.name
      });
    }
  }
  
  // Reset panorama loaded state
  panoramaLoaded = false;
  
  // Ensure viewer canvas doesn't block pointer events on buttons
  setTimeout(() => {
    const canvas = container.querySelector('canvas');
    if (canvas) {
      canvas.style.pointerEvents = 'auto';
    }
    
    // Check if renderer XR is available after viewer initialization
    if (viewer && viewer.renderer) {
      console.log('Viewer renderer initialized');
      console.log('Renderer XR available:', !!viewer.renderer.xr);
      
      // If XR is not available, try to ensure it's set up
      // Three.js renderer should have XR support by default
      if (!viewer.renderer.xr && typeof THREE !== 'undefined') {
        console.log('Renderer XR not found, but Three.js is available');
        // XR might be initialized lazily by Panolens
      }
    }
  }, 500);
  
  // Load panorama
  panorama = new PANOLENS.ImagePanorama(imageUrl);
  viewer.add(panorama);
  
  // Create hotspots after panorama loads
  panorama.addEventListener('load', function() {
    console.log('Panorama loaded successfully');
    panoramaLoaded = true;
    createHotspots();
    updateHotspotCount();
    // Initialize direction indicator after panorama loads
    initializeDirectionIndicator();
    // Re-check VR availability after panorama loads
    checkVRAvailability();
  });
  
  // Handle panorama loading errors
  panorama.addEventListener('error', function(error) {
    console.error('Error loading panorama:', error);
    console.error('Image URL:', imageUrl);
    panoramaLoaded = false;
    alert('Failed to load panorama image. Please check the image URL: ' + imageUrl);
    checkVRAvailability();
  });
  
  // Handle panorama progress
  panorama.addEventListener('progress', function(event) {
    if (event.lengthComputable) {
      const percentComplete = (event.loaded / event.total) * 100;
      console.log('Panorama loading progress:', percentComplete.toFixed(2) + '%');
    }
  });
  
  // Make viewer globally available
  window.viewer = viewer;
  // Make panorama globally available
  window.panorama = panorama;
}

// ============================================================================
// SECTION 6: HOTSPOT ICON CREATION
// ============================================================================

// Create icon for hotspot (works without tray)
function createHotspotIcon(type) {
  const iconMap = {
    'image': 'fa-image',
    'video': 'fa-video-camera',
    'info': 'fa-info-circle',
    'navigation': 'fa-arrow-right'
  };
  const iconClass = iconMap[type] || 'fa-info-circle';
  
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  
  // Draw red circle background
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.arc(32, 32, 30, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw white border
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(32, 32, 30, 0, Math.PI * 2);
  ctx.stroke();
  
  // Draw Font Awesome icon
  ctx.fillStyle = '#fff';
  ctx.font = '32px FontAwesome';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Font Awesome Unicode characters
  const unicodeMap = {
    'fa-image': '\uf03e',
    'fa-video-camera': '\uf03d',
    'fa-info-circle': '\uf05a',
    'fa-arrow-right': '\uf061'
  };
  
  ctx.fillText(unicodeMap[iconClass] || '\uf05a', 32, 32);
  
  return canvas.toDataURL();
}

// ============================================================================
// SECTION 7: HOTSPOT CREATION & MANAGEMENT
// ============================================================================

// Create hotspots with different types
function createHotspot(data, position, size = 200) {
  const icon = createHotspotIcon(data.type);
  const infospot = new PANOLENS.Infospot(size, icon);
  infospot.position.set(position.x, position.y, position.z);
  
  infospot.addEventListener('click', function() {
    console.log('Hotspot clicked:', data.type);
    
    // Select hotspot for editing (if edit page is loaded)
    if (window.selectHotspot) {
      const index = hotspots.findIndex(h => h === infospot);
      if (index !== -1) {
        window.selectHotspot(index);
      }
    }
    
    // Check if we're on edit page (edit-360.html)
    const isEditPage = window.location.pathname.includes('edit-360.html');
    
    if (isEditPage) {
      // Show empty popup for editing
      showHotspotSidebar(data);
    } else {
      // Show content based on type (preview page)
      if (data.type === 'image') {
        showImageHotspot(data);
      } else if (data.type === 'video') {
        showVideoHotspot(data);
      } else if (data.type === 'info') {
        showInfoHotspot(data);
      } else if (data.type === 'navigation') {
        // Navigate to another panorama
        navigateToPanorama(data.targetPanorama);
      }
    }
  });
  
  return infospot;
}

// ============================================================================
// SECTION 8: HOTSPOT CONTENT DISPLAY (PREVIEW PAGE)
// ============================================================================

// Show image hotspot
function showImageHotspot(data) {
  console.log('Showing image hotspot:', data);
  const content = document.getElementById('hotspotInfoPopup');
  if (content) {
    content.innerHTML = `
      <button class="hotspot-info-close" onclick="closeHotspotInfo()">&times;</button>
      <div class="hotspot-info-content">
        <h2>${data.title}</h2>
        <div class="hotspot-image-container">
          <img src="${data.imageUrl}" alt="${data.title}" style="width: 100%; max-width: 500px; border-radius: 8px; margin: 15px 0;">
        </div>
      </div>
    `;
    content.style.display = 'block';
    console.log('Popup displayed');
  } else {
    console.error('Popup element not found');
  }
}

// Show video hotspot with YouTube iframe
function showVideoHotspot(data) {
  const content = document.getElementById('hotspotInfoPopup');
  if (content) {
    content.innerHTML = `
      <button class="hotspot-info-close" onclick="closeHotspotInfo()">&times;</button>
      <div class="hotspot-info-content">
        <h2>${data.title}</h2>
        <div class="hotspot-video-container">
          <iframe 
            width="560" 
            height="315" 
            src="https://www.youtube.com/embed/${data.youtubeId}" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
            style="width: 100%; max-width: 560px; height: 315px; border-radius: 8px; margin: 15px 0;">
          </iframe>
        </div>
      </div>
    `;
    content.style.display = 'block';
  }
}

// Show info hotspot
function showInfoHotspot(data) {
  const content = document.getElementById('hotspotInfoPopup');
  if (content) {
    content.innerHTML = `
      <button class="hotspot-info-close" onclick="closeHotspotInfo()">&times;</button>
      <div class="hotspot-info-content">
        <h2>${data.title}</h2>
        <p>${data.description}</p>
        <p class="hotspot-price"><strong>Price:</strong> ${data.price}</p>
        <a href="${data.link}" target="_blank" class="hotspot-link">View Room →</a>
      </div>
    `;
    content.style.display = 'block';
  }
}

// ============================================================================
// SECTION 9: HOTSPOT EDIT SIDEBAR (EDIT PAGE)
// ============================================================================

// Show sidebar for editing hotspot
function showHotspotSidebar(data) {
  const hotspotSelect = document.getElementById('hotspot');
  
  // Set hotspot type in dropdown
  if (hotspotSelect && data.type) {
    hotspotSelect.value = data.type;
  }
  
  // Update image preview if it's an image hotspot
  if (data.type === 'image' && data.imageUrl) {
    const imagePreview = document.getElementById('imageHotspotPreview');
    if (imagePreview) {
      imagePreview.src = data.imageUrl;
    }
  }
  
  // Show the correct tab based on hotspot type
  if (window.showHotspotTab && typeof window.showHotspotTab === 'function') {
    window.showHotspotTab(data.type || 'info');
  }
  
  // Show sidebar
  openHotspotSidebar();
}

// ============================================================================
// SECTION 10: HOTSPOT INFO POPUP (PREVIEW PAGE)
// ============================================================================

// Close hotspot info (for backward compatibility - only used in preview page)
window.closeHotspotInfo = function() {
  const content = document.getElementById('hotspotInfoPopup');
  if (content) {
    content.style.display = 'none';
  }
};

// ============================================================================
// SECTION 11: PANORAMA NAVIGATION
// ============================================================================

// Navigate to another panorama
function navigateToPanorama(imageUrl) {
  // Get current URL parameters
  const currentUrl = new URL(window.location.href);
  
  // Update the image parameter with the new panorama image
  currentUrl.searchParams.set('image', imageUrl);
  
  // Navigate to the new panorama
  window.location.href = currentUrl.toString();
}

// ============================================================================
// SECTION 12: HOTSPOT POSITIONS & CREATION
// ============================================================================

// Default positions for hotspots
const defaultPositions = [
  { x: 3000, y: 0, z: -2000 },    // Image hotspot
  { x: -2000, y: 200, z: -3000 }, // Video hotspot
  { x: 1000, y: -300, z: -4000 }, // Info hotspot
  { x: -3000, y: 0, z: -2000 }    // Navigation hotspot
];

// Create all hotspots
function createHotspots() {
  hotspots = [
    createHotspot(hotspotData.image, defaultPositions[0]),
    createHotspot(hotspotData.video, defaultPositions[1]),
    createHotspot(hotspotData.info, defaultPositions[2]),
    createHotspot(hotspotData.navigation, defaultPositions[3])
  ];
  
  // Add all hotspots to panorama
  hotspots.forEach(hotspot => {
    panorama.add(hotspot);
  });
  
  // Make hotspots globally accessible
  window.hotspots = hotspots;
}

// Update hotspot count display (not needed in preview page)
function updateHotspotCount() {
  // Hotspot count is only shown in edit page, not preview page
}

// ============================================================================
// SECTION 13: UI CONTROLS (PREVIEW PAGE)
// ============================================================================

// Go back function
window.goBack = function() {
  if (viewer) {
    viewer.dispose();
  }
  window.history.back();
};

// Toggle sidebar function
window.toggleSidebar = function(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const sidebar = document.getElementById('panoramaSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  
  if (sidebar && overlay) {
    const isActive = sidebar.classList.contains('active');
    if (isActive) {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    } else {
      sidebar.classList.add('active');
      overlay.classList.add('active');
    }
  }
};

// ============================================================================
// SECTION 14: EVENT LISTENERS SETUP
// ============================================================================

// Add event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Back button
  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      window.goBack();
    });
  }
  
  // Sidebar toggle button
  const toggleBtn = document.getElementById('sidebarToggleBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      window.toggleSidebar();
    });
  }
  
  // Sidebar close button
  const closeBtn = document.getElementById('sidebarCloseBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      window.toggleSidebar();
    });
  }
  
  // Sidebar overlay
  const overlay = document.getElementById('sidebarOverlay');
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      window.toggleSidebar();
    });
  }
  
  // Add panorama button (placeholder)
  const addBtn = document.getElementById('addPanoramaBtn');
  if (addBtn) {
    addBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Add panorama clicked');
    });
  }
  
  // Make panorama items clickable to switch panoramas
  const panoramaItems = document.querySelectorAll('.panorama-item');
  panoramaItems.forEach(function(item) {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Get image path from clicked item
      const img = item.querySelector('.panorama-item-image img');
      if (img) {
        const imagePath = img.getAttribute('src');
        navigateToPanorama(imagePath);
      }
    });
  });
  
  // VR control button (combined VR and reticle toggle)
  const vrControlBtn = document.getElementById('vrControlBtn');
  if (vrControlBtn) {
    // Check VR availability and update button state
    checkVRAvailability();
    
    // Left click: Enter/Exit VR mode
    // Shift+Click: Toggle reticle
    vrControlBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Don't do anything if button is disabled
      if (vrControlBtn.disabled) {
        return;
      }
      
      if (e.shiftKey) {
        // Shift+Click: Toggle reticle
        toggleReticle();
      } else {
        // Normal click: Enter/Exit VR mode
        enterVRMode();
      }
    });
    
    // Right click: Toggle reticle
    vrControlBtn.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Don't do anything if button is disabled
      if (vrControlBtn.disabled) {
        return;
      }
      
      toggleReticle();
    });
  }
});

// ============================================================================
// SECTION 15: DIRECTION MAP/COMPASS INDICATOR (PREVIEW PAGE)
// ============================================================================

// Initialize direction indicator to show current viewing direction
function initializeDirectionIndicator() {
  // Get the arrow container element from the compass
  const compassArrow = document.querySelector('.compass-arrow');
  
  if (!compassArrow) {
    return;
  }
  
  if (!viewer) {
    return;
  }
  
  // Function to update the arrow rotation based on viewer direction
  function updateArrowRotation() {
    const camera = viewer.camera;
    
    // Check if camera exists
    if (!camera) {
      // If camera doesn't exist, exit the function
      return;
    }
    
    // Get the current rotation angle from the camera's Y rotation (yaw)
    // camera.rotation.y gives us the horizontal rotation in radians
    // This tells us which direction the camera is facing horizontally
    const rotation = camera.rotation.y;
    
    // Convert radians to degrees (multiply by 180 and divide by PI)
    // This gives us the angle in degrees (0-360)
    const rotationDegrees = rotation * (180 / Math.PI);
    
    compassArrow.style.transform = 'translate(-50%, -50%) rotate(' + (-rotationDegrees) + 'deg)';
  }
  
  // Update the arrow rotation immediately when function is called
  updateArrowRotation();
  
  function animate() {
    // Update the arrow rotation
    updateArrowRotation();
    
    // This creates a smooth continuous update loop
    requestAnimationFrame(animate);
  }
  
  // Start the animation loop
  animate();
}

// ============================================================================
// SECTION 16: RETICLE TOGGLE FUNCTIONALITY
// ============================================================================

// Helper function to update VR control button appearance
function updateVRControlButton(isInVR, isReticleEnabled) {
  const vrBtn = document.getElementById('vrControlBtn');
  if (!vrBtn || vrBtn.disabled) {
    // Don't update if button is disabled
    return;
  }
  
  if (isInVR) {
    // In VR mode: show exit icon
    vrBtn.classList.add('active', 'vr-mode');
    vrBtn.title = 'Exit VR Mode (Right-click: Toggle Reticle)';
    vrBtn.innerHTML = '<i class="fa fa-times"></i>';
    
    // Add reticle indicator if enabled
    if (isReticleEnabled) {
      vrBtn.classList.add('reticle-enabled');
    } else {
      vrBtn.classList.remove('reticle-enabled');
    }
  } else {
    // Not in VR mode: show VR icon
    vrBtn.classList.remove('active', 'vr-mode', 'reticle-enabled');
    vrBtn.title = 'Enter VR Mode (Right-click: Toggle Reticle)';
    vrBtn.innerHTML = '<i class="fa fa-cube"></i>';
  }
}

// Toggle reticle on/off
function toggleReticle() {
  // Check if viewer exists
  if (!viewer) {
    console.error('Viewer not initialized');
    return;
  }
  
  // Toggle reticle state
  // Panolens stores reticle state in viewer.reticle
  if (viewer.reticle) {
    // Toggle visibility
    const isVisible = viewer.reticle.visible;
    viewer.reticle.visible = !isVisible;
    
    // Update button appearance
    const renderer = viewer.renderer;
    const isInVR = renderer && renderer.xr && renderer.xr.isPresenting;
    updateVRControlButton(isInVR, !isVisible);
  } else {
    // If reticle doesn't exist, try to enable it
    // Panolens may need enableReticle to be set and viewer reinitialized
    console.log('Reticle not available. VR mode may need to be active.');
  }
}

// ============================================================================
// SECTION 17: VR MODE FUNCTIONALITY
// ============================================================================

// Check if VR headset is available and update button state
async function checkVRAvailability() {
  const vrBtn = document.getElementById('vrControlBtn');
  if (!vrBtn) {
    return;
  }
  
  // Check if panorama is loaded first
  if (!panoramaLoaded) {
    vrBtn.disabled = true;
    vrBtn.classList.add('disabled');
    vrBtn.title = 'Loading panorama...';
    return;
  }
  
  // TESTING MODE: Set to true to enable VR button without headset (for testing)
  const TESTING_MODE = false; // Change to true to test without VR headset
  
  if (TESTING_MODE) {
    // Enable button for testing (will still need WebXR emulator to actually enter VR)
    vrBtn.disabled = false;
    vrBtn.classList.remove('disabled');
    vrBtn.title = 'Enter VR Mode (TESTING MODE - Use WebXR Emulator)';
    return;
  }
  
  // Check if WebXR is available
  if (!navigator.xr) {
    // WebXR not supported
    vrBtn.disabled = true;
    vrBtn.classList.add('disabled');
    vrBtn.title = 'VR not supported in this browser';
    return;
  }
  
  try {
    // Check if immersive VR session is supported
    const isSupported = await navigator.xr.isSessionSupported('immersive-vr');
    
    if (isSupported) {
      // VR is supported and headset is available
      vrBtn.disabled = false;
      vrBtn.classList.remove('disabled');
      vrBtn.title = 'Enter VR Mode (Right-click: Toggle Reticle)';
      console.log('VR headset detected - button enabled');
    } else {
      // VR is not supported or no headset connected
      vrBtn.disabled = true;
      vrBtn.classList.add('disabled');
      vrBtn.title = 'No VR headset detected. Please connect a VR headset.';
      console.log('No VR headset detected - button disabled');
    }
  } catch (error) {
    // Error checking VR support
    console.error('Error checking VR availability:', error);
    vrBtn.disabled = true;
    vrBtn.classList.add('disabled');
    vrBtn.title = 'Unable to check VR availability';
  }
}

// Enter VR mode using Panolens' built-in VR support
async function enterVRMode() {
  // Check if viewer exists
  if (!viewer) {
    console.error('Viewer not initialized');
    return;
  }
  
  // Check if panorama is loaded
  if (!panoramaLoaded) {
    alert('Please wait for the panorama to finish loading before entering VR.');
    return;
  }
  
  // Get the Three.js renderer from Panolens viewer
  const renderer = viewer.renderer;
  
  if (!renderer) {
    console.error('Renderer not available');
    return;
  }
  
  // Check if already in VR mode
  if (renderer.xr && renderer.xr.isPresenting) {
    // Exit VR mode using Panolens' method
    try {
      const session = renderer.xr.getSession();
      if (session) {
        await session.end();
        updateVRControlButton(false, false);
      }
    } catch (error) {
      console.error('Error exiting VR mode:', error);
    }
    return;
  }
  
  // Check if WebXR is available
  if (!navigator.xr) {
    alert('WebXR is not supported in this browser. Please use a VR-compatible browser (Chrome, Edge) with a VR headset connected.');
    checkVRAvailability();
    return;
  }
  
  // Check VR session support
  try {
    const isSupported = await navigator.xr.isSessionSupported('immersive-vr');
    if (!isSupported) {
      alert('No VR headset detected. Please connect a VR headset and try again.');
      checkVRAvailability();
      return;
    }
  } catch (error) {
    console.error('Error checking VR session support:', error);
    alert('Unable to check VR headset availability. Please ensure a VR headset is connected.');
    checkVRAvailability();
    return;
  }
  
  // Helper function to update debug panel (visible on page)
  function updateDebugInfo(message) {
    const debugPanel = document.getElementById('debugPanel');
    const debugContent = document.getElementById('debugContent');
    if (debugPanel && debugContent) {
      debugPanel.style.display = 'block';
      const time = new Date().toLocaleTimeString();
      debugContent.innerHTML += '[' + time + '] ' + message + '<br>';
      console.log(message);
    }
  }
  
  // Clear debug panel
  function clearDebugInfo() {
    const debugContent = document.getElementById('debugContent');
    if (debugContent) {
      debugContent.innerHTML = '';
    }
  }
  
  // FINAL SOLUTION: Try to use Panolens's built-in VR or properly initialize XR
  try {
    clearDebugInfo();
    updateDebugInfo('Step 1: Checking for Panolens VR support...');
    
    // First, try to find Panolens VR button one more time
    const container = document.getElementById('panoramaImage');
    if (container && window.panolensVRButton) {
      updateDebugInfo('Found Panolens VR button - using it...');
      window.panolensVRButton.click();
      updateVRControlButton(true, true);
      return;
    }
    
    // Try to use Panolens's built-in VR method if it exists
    if (viewer && typeof viewer.enterVR === 'function') {
      updateDebugInfo('Found viewer.enterVR() - using Panolens built-in VR...');
      viewer.enterVR();
      updateVRControlButton(true, true);
      return;
    }
    
    // Check if renderer has XR support
    updateDebugInfo('Step 2: Checking renderer XR support...');
    updateDebugInfo('Renderer type: ' + renderer.constructor.name);
    
    // For Three.js r105, we need to properly initialize XR
    // The renderer might not have XR initialized yet
    if (!renderer.xr) {
      updateDebugInfo('Renderer XR not found - initializing manually...');
      
      // Create a basic XR interface for the renderer
      // This is needed for Three.js to work with WebXR
      renderer.xr = {
        enabled: false,
        isPresenting: false,
        session: null,
        setSession: async function(session) {
          this.enabled = true;
          this.isPresenting = true;
          this.session = session;
          updateDebugInfo('XR session set on renderer');
        },
        getSession: function() {
          return this.session;
        }
      };
      updateDebugInfo('XR interface created with setSession method');
    } else {
      updateDebugInfo('Renderer XR found');
    }
    
    // Request VR session
    updateDebugInfo('Step 2: Requesting VR session...');
    const session = await navigator.xr.requestSession('immersive-vr', {
      requiredFeatures: ['local-floor']
    });
    
    updateDebugInfo('Step 3: VR session created ✓');
    
    // Get WebGL context and make it XR compatible
    const gl = renderer.getContext();
    if (gl && gl.makeXRCompatible) {
      await gl.makeXRCompatible();
      updateDebugInfo('WebGL context made XR compatible ✓');
    }
    
    // Create reference space
    updateDebugInfo('Step 4: Creating reference space...');
    let referenceSpace = null;
    try {
      referenceSpace = await session.requestReferenceSpace('local-floor');
      updateDebugInfo('Reference space created (local-floor) ✓');
    } catch (e) {
      try {
        referenceSpace = await session.requestReferenceSpace('local');
        updateDebugInfo('Reference space created (local) ✓');
      } catch (e2) {
        referenceSpace = await session.requestReferenceSpace('viewer');
        updateDebugInfo('Reference space created (viewer) ✓');
      }
    }
    
    // Set up render state with base layer
    updateDebugInfo('Step 5: Setting up render state...');
    
    // Create XRWebGLLayer with the renderer's WebGL context
    // Make sure we're using the same context that the renderer uses
    let glLayer;
    try {
      // Try creating with options first
      glLayer = new XRWebGLLayer(session, gl, {
        antialias: true,
        depth: true,
        stencil: false,
        alpha: false,
        ignoreDepthValues: false,
        framebufferScaleFactor: 1.0
      });
      updateDebugInfo('XRWebGLLayer created with options ✓');
    } catch (error) {
      updateDebugInfo('Failed to create XRWebGLLayer with options: ' + error.message);
      // Try creating without options
      try {
        glLayer = new XRWebGLLayer(session, gl);
        updateDebugInfo('XRWebGLLayer created without options ✓');
      } catch (error2) {
        updateDebugInfo('ERROR: Failed to create XRWebGLLayer: ' + error2.message);
        throw new Error('Failed to create XRWebGLLayer: ' + error2.message);
      }
    }
    
    // Update render state with the layer
    session.updateRenderState({
      baseLayer: glLayer
    });
    updateDebugInfo('Render state updated with baseLayer ✓');
    
    // The framebuffer should be available immediately after creating the layer
    // But let's wait a frame to be sure
    await new Promise(resolve => requestAnimationFrame(resolve));
    
    // Check for framebuffer - it should be available now
    // Try multiple ways to access the framebuffer
    const framebuffer = glLayer.framebuffer;
    const renderStateFramebuffer = session.renderState && session.renderState.baseLayer ? session.renderState.baseLayer.framebuffer : null;
    
    updateDebugInfo('GL Layer framebuffer check: ' + (framebuffer ? 'Created (ID: ' + framebuffer + ')' : 'Missing'));
    updateDebugInfo('RenderState framebuffer check: ' + (renderStateFramebuffer ? 'Created (ID: ' + renderStateFramebuffer + ')' : 'Missing'));
    
    // Use whichever framebuffer is available
    const actualFramebuffer = framebuffer || renderStateFramebuffer;
    
    if (!actualFramebuffer) {
      updateDebugInfo('WARNING: XRWebGLLayer framebuffer not found!');
      updateDebugInfo('This might be a WebXR compatibility issue or emulator limitation.');
      updateDebugInfo('The framebuffer might be created during the first XR frame.');
      updateDebugInfo('Continuing anyway - will check again in render loop...');
      // Don't throw error - let's try to continue and see if it works
    } else {
      updateDebugInfo('Framebuffer successfully found! ✓');
    }
    
    // Ensure renderer knows about the XR session
    // This is important for Three.js to render correctly
    if (renderer.setAnimationLoop) {
      updateDebugInfo('Renderer setAnimationLoop available');
    }
    
    // Make sure the renderer's canvas is the one being used
    if (renderer.domElement) {
      updateDebugInfo('Renderer canvas element: ' + (renderer.domElement ? 'Found' : 'Missing'));
    }
    
    // Set up XR animation loop
    updateDebugInfo('Step 6: Starting XR render loop...');
    
    // Use Three.js's setAnimationLoop if available (preferred method)
    // Note: We'll use setAnimationLoop even if framebuffer is not found yet
    // It might be created during the first frame
    if (renderer.setAnimationLoop) {
      updateDebugInfo('Using renderer.setAnimationLoop for XR rendering');
      
      // Update renderer's XR session FIRST
      if (renderer.xr && renderer.xr.setSession) {
        await renderer.xr.setSession(session);
        updateDebugInfo('XR session set on renderer via setSession');
      }
      
      // Set up the animation loop using Three.js's method
      // Since framebuffer might be missing, we need to handle XR frames manually
      renderer.setAnimationLoop(function(timestamp, frame) {
        if (!frame || !viewer || !viewer.scene || !viewer.camera) {
          return;
        }
        
        // Get the base layer and framebuffer from the frame
        const baseLayer = session.renderState.baseLayer;
        if (!baseLayer) {
          return;
        }
        
        // Check if framebuffer is available now (it might be created during first frame)
        const frameFramebuffer = baseLayer.framebuffer;
        if (!frameFramebuffer) {
          // Framebuffer still not available - can't render
          return;
        }
        
        // Get pose from frame
        const pose = frame.getViewerPose(referenceSpace);
        if (!pose) {
          return;
        }
        
        // Ensure panorama is visible and in scene
        if (panorama) {
          panorama.visible = true;
          if (viewer.scene) {
            let panoramaInScene = false;
            viewer.scene.traverse(function(child) {
              if (child === panorama || child.uuid === panorama.uuid) {
                panoramaInScene = true;
              }
            });
            if (!panoramaInScene) {
              viewer.scene.add(panorama);
            }
          }
        }
        
        // Bind the XR framebuffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameFramebuffer);
        
        // Clear framebuffer
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        // Render for each view (left eye, right eye)
        for (const view of pose.views) {
          const viewport = baseLayer.getViewport(view);
          if (!viewport) {
            continue;
          }
          
          // Set viewport for this eye
          gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
          
          // Clear depth buffer for this view
          gl.clear(gl.DEPTH_BUFFER_BIT);
          
          // Update camera from XR view
          if (viewer.camera && viewer.scene) {
            // Set projection matrix from XR view
            if (view.projectionMatrix) {
              viewer.camera.projectionMatrix.fromArray(view.projectionMatrix);
              viewer.camera.projectionMatrixInverse.getInverse(viewer.camera.projectionMatrix);
            }
            
            // Set camera transform from XR view
            const transform = view.transform;
            if (transform && transform.matrix) {
              viewer.camera.matrix.fromArray(transform.matrix);
              viewer.camera.matrixWorldNeedsUpdate = true;
              viewer.camera.updateMatrixWorld();
            }
            
            // Render the scene
            const currentRenderTarget = renderer.getRenderTarget();
            renderer.setRenderTarget(null);
            renderer.render(viewer.scene, viewer.camera);
            renderer.setRenderTarget(currentRenderTarget);
          }
        }
      });
      
      updateDebugInfo('XR render loop started using setAnimationLoop ✓');
      updateVRControlButton(true, true);
      
      // Handle session end
      session.addEventListener('end', function() {
        updateDebugInfo('VR session ended');
        if (renderer.setAnimationLoop) {
          renderer.setAnimationLoop(null);
        }
        if (renderer.xr) {
          renderer.xr.enabled = false;
          renderer.xr.isPresenting = false;
          renderer.xr.session = null;
        }
        updateVRControlButton(false, false);
        checkVRAvailability();
      });
      
      updateDebugInfo('Step 7: VR mode active!');
      return; // Exit early - setAnimationLoop handles everything
    } else if (!glLayer.framebuffer) {
      updateDebugInfo('WARNING: Framebuffer missing, cannot use setAnimationLoop');
      updateDebugInfo('Falling back to manual XR frame loop');
    }
    
    // Fallback: Manual XR frame loop (if setAnimationLoop not available)
    updateDebugInfo('Using manual XR frame loop (fallback)');
    function onXRFrame(timestamp, frame) {
      if (!frame || !viewer || !viewer.scene || !viewer.camera) {
        session.requestAnimationFrame(onXRFrame);
        return;
      }
      
      const pose = frame.getViewerPose(referenceSpace);
      if (!pose) {
        session.requestAnimationFrame(onXRFrame);
        return;
      }
      
      const glLayer = session.renderState.baseLayer;
      if (!glLayer) {
        session.requestAnimationFrame(onXRFrame);
        return;
      }
      
      // Get the framebuffer - it should be available now
      const frameFramebuffer = glLayer.framebuffer;
      if (!frameFramebuffer) {
        // Framebuffer still not available - log and continue
        updateDebugInfo('WARNING: Framebuffer still missing in render loop');
        session.requestAnimationFrame(onXRFrame);
        return;
      }
      
      // Bind the XR framebuffer BEFORE rendering
      gl.bindFramebuffer(gl.FRAMEBUFFER, frameFramebuffer);
      
      // Ensure panorama is visible and in scene before rendering
      if (panorama) {
        panorama.visible = true;
        // Make sure panorama is in the scene
        if (viewer.scene) {
          let panoramaInScene = false;
          viewer.scene.traverse(function(child) {
            if (child === panorama || child.uuid === panorama.uuid) {
              panoramaInScene = true;
            }
          });
          if (!panoramaInScene) {
            viewer.scene.add(panorama);
          }
        }
        
        // Ensure panorama material is ready
        if (panorama.material) {
          panorama.material.needsUpdate = true;
        }
      }
      
      // Clear the entire framebuffer once before rendering views
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      
      // Render for each view (left eye, right eye)
      for (const view of pose.views) {
        const viewport = glLayer.getViewport(view);
        if (!viewport) {
          continue;
        }
        
        // Set viewport for this eye
        gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
        
        // Don't clear color buffer - we already cleared it
        // Only clear depth buffer for each view
        gl.clear(gl.DEPTH_BUFFER_BIT);
        
        // Update camera from XR view
        if (viewer.camera && viewer.scene) {
          // Set projection matrix from XR view
          if (view.projectionMatrix) {
            viewer.camera.projectionMatrix.fromArray(view.projectionMatrix);
            viewer.camera.projectionMatrixInverse.getInverse(viewer.camera.projectionMatrix);
          }
          
          // Set camera transform from XR view
          const transform = view.transform;
          if (transform && transform.matrix) {
            viewer.camera.matrix.fromArray(transform.matrix);
            viewer.camera.matrixWorldNeedsUpdate = true;
            viewer.camera.updateMatrixWorld();
          }
          
          // CRITICAL: Render directly using Three.js renderer
          // The renderer needs to render to the XR framebuffer
          // The framebuffer is already bound, so we just need to render
          
          // IMPORTANT: The renderer's internal state needs to know about the XR framebuffer
          // We need to tell the renderer to use the current framebuffer (XR layer)
          
          // CRITICAL: The renderer needs to know we're rendering to the XR framebuffer
          // Save current render target
          const currentRenderTarget = renderer.getRenderTarget();
          
          // Set render target to null to render to the current framebuffer (XR layer)
          renderer.setRenderTarget(null);
          
          // IMPORTANT: The renderer's WebGL context must use the XR framebuffer
          // The framebuffer is already bound via gl.bindFramebuffer above
          // But we need to make sure the renderer's internal state is correct
          
          // Render the scene - this should render to the XR framebuffer
          // The renderer will use whatever framebuffer is currently bound
          renderer.render(viewer.scene, viewer.camera);
          
          // Restore render target
          renderer.setRenderTarget(currentRenderTarget);
        }
      }
      
      // Keep framebuffer bound - don't unbind it
      // The XR session needs it to stay bound
      
      session.requestAnimationFrame(onXRFrame);
    }
    
    // Start the render loop
    session.requestAnimationFrame(onXRFrame);
    updateDebugInfo('XR render loop started ✓');
    
    // Update button state
    updateVRControlButton(true, true);
    
    // Handle session end
    session.addEventListener('end', function() {
      updateDebugInfo('VR session ended');
      updateVRControlButton(false, false);
      checkVRAvailability();
    });
    
    updateDebugInfo('Step 7: VR mode active!');
    
  } catch (error) {
    updateDebugInfo('ERROR: ' + error.message);
    alert('Failed to enter VR mode: ' + error.message);
    checkVRAvailability();
  }
}
