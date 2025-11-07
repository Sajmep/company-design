// Panorama Edit Page Script - Using Three.js with Panolens

let viewer = null;
let panorama = null;
let hotspots = [];

// Hotspot data
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
  }
};

// Initialize viewer when page loads
window.addEventListener('load', function() {
  // Get image URL from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const imageUrl = urlParams.get('image');
  
  if (!imageUrl) {
    console.error('No image URL provided');
    return;
  }
  
  initializeViewer(imageUrl);
});

// Initialize Panolens viewer
function initializeViewer(imageUrl) {
  const container = document.getElementById('panoramaImage');
  
  if (!container) {
    console.error('Container not found');
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
    autoRotateActivationDuration: 2000
  });
  
  // Ensure viewer canvas doesn't block pointer events on buttons
  setTimeout(() => {
    const canvas = container.querySelector('canvas');
    if (canvas) {
      canvas.style.pointerEvents = 'auto';
    }
  }, 100);
  
  // Load panorama
  panorama = new PANOLENS.ImagePanorama(imageUrl);
  viewer.add(panorama);
  
  // Create hotspots after panorama loads
  panorama.addEventListener('load', function() {
    createHotspots();
    updateHotspotCount();
  });
  
  // Make viewer globally available
  window.viewer = viewer;
}

// Create icon for hotspot (works without tray)
function createHotspotIcon(type) {
  const iconMap = {
    'image': 'fa-image',
    'video': 'fa-video-camera',
    'info': 'fa-info-circle'
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
    'fa-info-circle': '\uf05a'
  };
  
  ctx.fillText(unicodeMap[iconClass] || '\uf05a', 32, 32);
  
  return canvas.toDataURL();
}

// Create hotspots with different types
function createHotspot(data, position, size = 200) {
  const icon = createHotspotIcon(data.type);
  const infospot = new PANOLENS.Infospot(size, icon);
  infospot.position.set(position.x, position.y, position.z);
  
  infospot.addEventListener('click', function() {
    console.log('Hotspot clicked:', data.type);
    if (data.type === 'image') {
      showImageHotspot(data);
    } else if (data.type === 'video') {
      showVideoHotspot(data);
    } else if (data.type === 'info') {
      showInfoHotspot(data);
    }
  });
  
  return infospot;
}

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

// Close hotspot info
window.closeHotspotInfo = function() {
  const content = document.getElementById('hotspotInfoPopup');
  if (content) {
    content.style.display = 'none';
  }
};

// Default positions for hotspots
const defaultPositions = [
  { x: 3000, y: 0, z: -2000 },    // Image hotspot
  { x: -2000, y: 200, z: -3000 }, // Video hotspot
  { x: 1000, y: -300, z: -4000 }  // Info hotspot
];

// Create all hotspots
function createHotspots() {
  hotspots = [
    createHotspot(hotspotData.image, defaultPositions[0]),
    createHotspot(hotspotData.video, defaultPositions[1]),
    createHotspot(hotspotData.info, defaultPositions[2])
  ];
  
  // Add all hotspots to panorama
  hotspots.forEach(hotspot => {
    panorama.add(hotspot);
  });
}

// Update hotspot count display (not needed in preview page)
function updateHotspotCount() {
  // Hotspot count is only shown in edit page, not preview page
}

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
});
