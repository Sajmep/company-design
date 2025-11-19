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
    
    // Bridge custom VR button to Panolens controls
    setupCustomVRButton();
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
// DIRECT WEBXR IMPLEMENTATION (Works with Three.js r105)
// ============================================================================

let xrSession = null;
let xrAnimationFrame = null;

function setupCustomVRButton() {
  const customButton = document.getElementById('vrControlBtn');
  if (!customButton || !viewer) {
    return;
  }

  // Check for WebXR support
  if (!navigator.xr) {
    customButton.classList.add('disabled');
    customButton.title = 'WebXR not supported';
    return;
  }

  // Check if immersive VR is supported
  navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
    if (supported) {
      customButton.classList.remove('disabled');
      customButton.title = 'Enter VR Mode';
    } else {
      customButton.classList.add('disabled');
      customButton.title = 'VR not supported';
    }
  }).catch(() => {
    customButton.classList.add('disabled');
    customButton.title = 'VR check failed';
  });

  // Handle button click
  if (!customButton.dataset.bound) {
    customButton.addEventListener('click', async function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      if (customButton.classList.contains('disabled')) {
        return;
      }

      if (!xrSession) {
        // Enter VR
        try {
          xrSession = await navigator.xr.requestSession('immersive-vr', {
            optionalFeatures: ['local-floor', 'bounded-floor']
          });
          
          customButton.classList.add('active');
          customButton.title = 'Exit VR Mode';
          
          await setupWebXRSession(xrSession);
          
          // Handle session end
          xrSession.addEventListener('end', () => {
            xrSession = null;
            customButton.classList.remove('active');
            customButton.title = 'Enter VR Mode';
            
            // Stop animation loop
            if (xrAnimationFrame) {
              cancelAnimationFrame(xrAnimationFrame);
              xrAnimationFrame = null;
            }
            
            // Restore normal rendering
            if (viewer && viewer.renderer) {
              viewer.renderer.setAnimationLoop(null);
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
    customButton.dataset.bound = 'true';
  }
}

async function setupWebXRSession(session) {
  if (!viewer || !viewer.renderer || !panorama) {
    throw new Error('Viewer or panorama not available');
  }

  const renderer = viewer.renderer;
  const gl = renderer.getContext();
  
  // Make WebGL context XR compatible
  if (gl.makeXRCompatible) {
    await gl.makeXRCompatible();
  }
  
  // Create XR WebGL layer
  const xrLayer = new XRWebGLLayer(session, gl);
  session.updateRenderState({
    baseLayer: xrLayer
  });
  
  // Get reference space (try viewer first, no boundary needed)
  let referenceSpace;
  try {
    referenceSpace = await session.requestReferenceSpace('viewer');
  } catch (e) {
    try {
      referenceSpace = await session.requestReferenceSpace('local');
    } catch (e2) {
      referenceSpace = await session.requestReferenceSpace('local-floor');
    }
  }
  
  // Ensure panorama is visible
  panorama.visible = true;
  if (panorama.material) {
    panorama.material.needsUpdate = true;
  }
  
  // Ensure camera is at origin
  viewer.camera.position.set(0, 0, 0);
  viewer.camera.updateMatrixWorld(true);
  
  // XR animation loop
  function onXRFrame(time, frame) {
    const pose = frame.getViewerPose(referenceSpace);
    
    if (!pose || !viewer || !viewer.scene || !viewer.camera) {
      xrAnimationFrame = session.requestAnimationFrame(onXRFrame);
      return;
    }
    
    const layer = session.renderState.baseLayer;
    if (!layer || !layer.framebuffer) {
      xrAnimationFrame = session.requestAnimationFrame(onXRFrame);
      return;
    }
    
    // Save current render target
    const currentRenderTarget = renderer.getRenderTarget();
    const currentFramebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
    
    // Bind XR framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, layer.framebuffer);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // Render for each eye
    for (const view of pose.views) {
      const viewport = layer.getViewport(view);
      if (!viewport) continue;
      
      gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
      gl.clear(gl.DEPTH_BUFFER_BIT);
      
      // Update camera projection
      if (view.projectionMatrix) {
        viewer.camera.projectionMatrix.fromArray(view.projectionMatrix);
        viewer.camera.projectionMatrixInverse.getInverse(viewer.camera.projectionMatrix);
      }
      
      // Update camera transform
      const transform = view.transform;
      if (transform && transform.matrix) {
        const viewMatrix = new THREE.Matrix4().fromArray(transform.matrix);
        const position = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        position.setFromMatrixPosition(viewMatrix);
        quaternion.setFromRotationMatrix(viewMatrix);
        viewer.camera.position.copy(position);
        viewer.camera.quaternion.copy(quaternion);
        viewer.camera.updateMatrixWorld(true);
      }
      
      // Ensure panorama is visible and in scene
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
      
      // Set render target to null to render to current framebuffer (XR framebuffer)
      renderer.setRenderTarget(null);
      
      // Render scene
      renderer.render(viewer.scene, viewer.camera);
    }
    
    // Restore previous render target
    renderer.setRenderTarget(currentRenderTarget);
    if (currentFramebuffer) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, currentFramebuffer);
    }
    
    xrAnimationFrame = session.requestAnimationFrame(onXRFrame);
  }
  
  xrAnimationFrame = session.requestAnimationFrame(onXRFrame);
}

// ============================================================================
// UPDATE YOUR WINDOW LOAD EVENT
// ============================================================================

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

