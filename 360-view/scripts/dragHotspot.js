// Drag Hotspot Functionality

let isDragging = false;
let dragHotspot = null;

// Setup drag and drop for hotspots
function setupDragAndDrop() {
  const container = document.getElementById('panoramaImage');
  if (!container) return;

  let startMouseX = 0;
  let startMouseY = 0;
  let startPosition = { x: 0, y: 0, z: 0 };

  // Mouse down - start dragging (hold Shift key to drag)
  container.addEventListener('mousedown', function(e) {
    if (!window.hotspots || window.hotspots.length === 0) return;
    
    // Get selected hotspot index from edit-360.js
    let selectedIndex = 0;
    if (window.getSelectedHotspotIndex && typeof window.getSelectedHotspotIndex === 'function') {
      selectedIndex = window.getSelectedHotspotIndex();
    }
    
    // Only start dragging if Shift key is held and a hotspot is selected
    if (e.shiftKey && window.hotspots[selectedIndex]) {
      isDragging = true;
      dragHotspot = window.hotspots[selectedIndex];
      startMouseX = e.clientX;
      startMouseY = e.clientY;
      startPosition = {
        x: dragHotspot.position.x,
        y: dragHotspot.position.y,
        z: dragHotspot.position.z
      };
      
      // Disable panorama controls while dragging
      if (window.viewer && window.viewer.controls) {
        window.viewer.controls.enabled = false;
      }
      
      e.preventDefault();
      e.stopPropagation();
    }
  });

  // Mouse move - update position while dragging
  container.addEventListener('mousemove', function(e) {
    if (!isDragging || !dragHotspot) return;

    // Calculate mouse movement
    const deltaX = e.clientX - startMouseX;
    const deltaY = e.clientY - startMouseY;

    // Convert screen movement to 3D position change
    const moveSpeed = 10; // Adjust this to control drag sensitivity
    
    // Invert X direction to match cursor movement
    dragHotspot.position.x = startPosition.x - (deltaX * moveSpeed);
    dragHotspot.position.y = startPosition.y - (deltaY * moveSpeed); // Invert Y

    e.preventDefault();
    e.stopPropagation();
  });

  // Mouse up - stop dragging
  container.addEventListener('mouseup', function(e) {
    if (isDragging) {
      isDragging = false;
      dragHotspot = null;
      
      // Re-enable panorama controls
      if (window.viewer && window.viewer.controls) {
        window.viewer.controls.enabled = true;
      }
      
      e.preventDefault();
      e.stopPropagation();
    }
  });

  // Also handle mouse leave
  container.addEventListener('mouseleave', function(e) {
    if (isDragging) {
      isDragging = false;
      dragHotspot = null;
      
      // Re-enable panorama controls
      if (window.viewer && window.viewer.controls) {
        window.viewer.controls.enabled = true;
      }
    }
  });
}
