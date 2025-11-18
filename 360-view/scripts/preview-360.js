// ============================================================================
// Panorama Preview Page Script - Using Three.js with Panolens
// ============================================================================

// ============================================================================
// SECTION 1: GLOBAL VARIABLES
// ============================================================================

let viewer = null;
let panorama = null;
let hotspots = [];

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
    return;
  }
  
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
// SECTION 5: PANORAMA VIEWER SETUP WITH WEBXR IMMERSIVE VR
// ============================================================================

// Initialize Panolens viewer with WebXR support
function initializeViewer(imageUrl) {
  const container = document.getElementById('panoramaImage');
  
  if (!container) {
    return;
  }
  
  // Clear container
  container.innerHTML = '';
  
  // Create viewer
  viewer = new PANOLENS.Viewer({
    container: container,
    autoRotate: false,
    controlBar: true,
    autoRotateSpeed: 0.3,
    autoRotateActivationDuration: 2000,
    cameraFov: 75
  });
  
  // Ensure viewer canvas doesn't block pointer events on buttons
  setTimeout(() => {
    const canvas = container.querySelector('canvas');
    if (canvas) {
      canvas.style.pointerEvents = 'auto';
    }
  }, 500);
  
  // Load panorama
  panorama = new PANOLENS.ImagePanorama(imageUrl);
  viewer.add(panorama);
  
  // Create hotspots after panorama loads
  panorama.addEventListener('load', function() {
    createHotspots();
    updateHotspotCount();
    initializeDirectionIndicator();
    
    // Add VR button after panorama loads
    addWebXRButton();
  });
  
  // Handle panorama loading errors
  panorama.addEventListener('error', function(error) {
    console.error('Error loading panorama:', error);
  });
  
  // Make viewer globally available
  window.viewer = viewer;
  window.panorama = panorama;
}

// ============================================================================
// WEBXR IMMERSIVE VR BUTTON
// ============================================================================

function addWebXRButton() {
  // Check if WebXR is supported
  if (!navigator.xr) {
    console.log('WebXR not supported');
    return;
  }
  
  navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
    if (supported) {
      // Create VR button
      const vrButton = document.createElement('button');
      vrButton.id = 'webxrButton';
      vrButton.innerHTML = '🥽 Enter VR';
      vrButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 30px;
        background: #dc2626;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      `;
      
      let xrSession = null;
      
      vrButton.addEventListener('click', async function() {
        if (!xrSession) {
          // Enter immersive VR
          try {
            // Request VR session without requiring floor tracking (no boundary setup needed)
            xrSession = await navigator.xr.requestSession('immersive-vr', {
              // No required features - use default viewer reference space
              optionalFeatures: ['local-floor', 'bounded-floor']
            });
            
            vrButton.innerHTML = '🥽 Exit VR';
            
            // Set up WebXR rendering
            await setupWebXRSession(xrSession);
            
            // Handle session end
            xrSession.addEventListener('end', () => {
              xrSession = null;
              vrButton.innerHTML = '🥽 Enter VR';
              
              // Restore Panolens's normal animation loop
              if (viewer && viewer.animate !== undefined) {
                viewer.animate = true;
              }
              
              if (viewer && viewer.renderer) {
                viewer.renderer.setAnimationLoop(null);
                
                if (viewer.renderer.xr) {
                  viewer.renderer.xr.enabled = false;
                  try {
                    viewer.renderer.xr.setSession(null);
                  } catch (err) {
                    // ignore cleanup errors
                  }
                } else if (viewer.renderer.vr) {
                  viewer.renderer.vr.enabled = false;
                  if (viewer.renderer.vr.setSession) {
                    viewer.renderer.vr.setSession(null);
                  }
                }
              }
            });
            
          } catch (error) {
            console.error('Failed to start VR session:', error);
            alert('Could not enter VR mode: ' + error.message);
          }
        } else {
          // Exit VR
          xrSession.end();
        }
      });
      
      document.body.appendChild(vrButton);
    } else {
      console.log('Immersive VR not supported');
    }
  });
}

// ============================================================================
// WEBXR SESSION SETUP
// ============================================================================

async function setupWebXRSession(session) {
  if (!viewer || !viewer.renderer) {
    throw new Error('Viewer renderer not available.');
  }
  
  const renderer = viewer.renderer;
  
  // Ensure panorama texture is ready
  if (!panorama || !panorama.material || !panorama.material.map || !panorama.material.map.image) {
    throw new Error('Panorama not fully loaded. Please wait for the image to load.');
  }
  
  // Stop Panolens internal loop while XR takes over rendering
  if (typeof viewer.animate !== 'undefined') {
    viewer.animate = false;
  }
  
  // Make sure panorama stays visible
  panorama.visible = true;
  if (panorama.material) {
    panorama.material.needsUpdate = true;
    if (panorama.material.map) {
      panorama.material.map.needsUpdate = true;
    }
  }
  
  const xrManager = renderer.xr || renderer.vr;
  if (!xrManager) {
    throw new Error('WebXR manager not available on renderer.');
  }
  
  if (renderer.xr) {
    renderer.xr.enabled = true;
    renderer.xr.setReferenceSpaceType('viewer');
    await renderer.xr.setSession(session);
  } else {
    renderer.vr.enabled = true;
    if (renderer.vr.setSession) {
      renderer.vr.setSession(session);
    }
  }
  
  viewer.camera.position.set(0, 0, 0);
  viewer.camera.quaternion.set(0, 0, 0, 1);
  viewer.camera.updateMatrixWorld(true);
  
  const renderLoop = () => {
    panorama.visible = true;
    renderer.render(viewer.scene, viewer.camera);
  };
  
  renderer.setAnimationLoop(renderLoop);
}

// ============================================================================
// UPDATE YOUR WINDOW LOAD EVENT
// ============================================================================

window.addEventListener('load', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const imageUrl = urlParams.get('image');
  
  if (!imageUrl) {
    return;
  }
  
  initializeViewer(imageUrl);
  updateActivePanoramaInSidebar(imageUrl);
});
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

