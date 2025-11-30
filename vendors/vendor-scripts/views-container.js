// Views Container - View Switching
document.addEventListener('DOMContentLoaded', function() {
    const dashboardViewBtn = document.querySelector('.data-view-btn[title="Dashboard View"]');
    const cardViewBtn = document.querySelector('.data-view-btn[title="Card View"]');
    const listViewBtn = document.querySelector('.data-view-btn[title="List View"]');
    const calendarViewBtn = document.querySelector('.data-view-btn[title="Calendar View"]');
    const mapViewBtn = document.querySelector('.data-view-btn[title="Map View"]');
    
    const dashboardView = document.querySelector('.bmh-dashboard-view');
    const cardView = document.querySelector('.bmh-card-view');
    const listView = document.querySelector('.bmh-list-view');
    const calendarView = document.querySelector('.bmh-calendar-view');
    const mapView = document.querySelector('.bmh-map-view');

    // Show card view by default
    if (cardView) cardView.style.display = 'flex';
    if (listView) listView.style.display = 'none';
    if (dashboardView) dashboardView.style.display = 'none';
    if (calendarView) calendarView.style.display = 'none';
    if (mapView) mapView.style.display = 'none';
    
    // Set card view as active by default
    if (cardViewBtn) cardViewBtn.classList.add('data-view-btn-active');
    if (listViewBtn) listViewBtn.classList.remove('data-view-btn-active');
    if (dashboardViewBtn) dashboardViewBtn.classList.remove('data-view-btn-active');
    if (calendarViewBtn) calendarViewBtn.classList.remove('data-view-btn-active');
    if (mapViewBtn) mapViewBtn.classList.remove('data-view-btn-active');

    // Dashboard view button
    if (dashboardViewBtn) {
        dashboardViewBtn.addEventListener('click', function() {
            hideAllViews();
            if (dashboardView) dashboardView.style.display = 'block';
            updateActiveButton(dashboardViewBtn);
        });
    }

    // Card view button
    if (cardViewBtn) {
        cardViewBtn.addEventListener('click', function() {
            hideAllViews();
            if (cardView) cardView.style.display = 'flex';
            updateActiveButton(cardViewBtn);
        });
    }

    // List view button
    if (listViewBtn) {
        listViewBtn.addEventListener('click', function() {
            hideAllViews();
            if (listView) listView.style.display = 'flex';
            updateActiveButton(listViewBtn);
        });
    }

    // Calendar view button
    if (calendarViewBtn) {
        calendarViewBtn.addEventListener('click', function() {
            hideAllViews();
            if (calendarView) calendarView.style.display = 'block';
            updateActiveButton(calendarViewBtn);
        });
    }

    // Map view button
    if (mapViewBtn) {
        mapViewBtn.addEventListener('click', function() {
            hideAllViews();
            if (mapView) mapView.style.display = 'block';
            updateActiveButton(mapViewBtn);
            
            // Initialize map when map view is shown
            initializeMap();
        });
    }

    function hideAllViews() {
        if (dashboardView) dashboardView.style.display = 'none';
        if (cardView) cardView.style.display = 'none';
        if (listView) listView.style.display = 'none';
        if (calendarView) calendarView.style.display = 'none';
        if (mapView) mapView.style.display = 'none';
    }

    function updateActiveButton(activeBtn) {
        // Remove active class from all buttons
        [dashboardViewBtn, cardViewBtn, listViewBtn, calendarViewBtn, mapViewBtn].forEach(btn => {
            if (btn) btn.classList.remove('data-view-btn-active');
        });
        // Add active class to clicked button
        if (activeBtn) activeBtn.classList.add('data-view-btn-active');
    }
});

// Vendor Popup Functions
function openVendorPopup() {
    const sidebar = document.getElementById('vendorPopup');
    const overlay = document.getElementById('vendorSidebarOverlay');
    
    if (sidebar && overlay) {
        overlay.classList.add('active');
        sidebar.classList.add('active');
        // Prevent body scroll when sidebar is open
        document.body.style.overflow = 'hidden';
    }
}

function closeVendorPopup() {
    const sidebar = document.getElementById('vendorPopup');
    const overlay = document.getElementById('vendorSidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('active');
        // Delay overlay removal to match sidebar animation
        setTimeout(() => {
            overlay.classList.remove('active');
        }, 300);
        // Restore body scroll
        document.body.style.overflow = '';
    }
}

// Close vendor sidebar when clicking on overlay
document.addEventListener('click', function(event) {
    const overlay = document.getElementById('vendorSidebarOverlay');
    if (event.target === overlay) {
        closeVendorPopup();
    }
});

// Close vendor sidebar with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const sidebar = document.getElementById('vendorPopup');
        if (sidebar && sidebar.classList.contains('active')) {
            closeVendorPopup();
        }
    }
});

// Map View Functions
document.addEventListener('DOMContentLoaded', function() {
    const mapMarkers = document.querySelectorAll('.bmh-map-marker');
    const infoPanel = document.querySelector('.bmh-map-info-panel');
    const infoClose = document.querySelector('.bmh-map-info-close');

    // Marker click handlers - show info panel
    mapMarkers.forEach(marker => {
        marker.addEventListener('click', function() {
            if (infoPanel) {
                infoPanel.classList.add('show');
            }
        });
    });

    // Close info panel
    if (infoClose) {
        infoClose.addEventListener('click', function() {
            if (infoPanel) {
                infoPanel.classList.remove('show');
            }
        });
    }
});


// Map initialization variables
var map = null;
var mapInitialized = false;

// Example vendor data from your database
// Each vendor object contains: name, latitude, longitude, and address
var vendors = [
    { name: "Vendor 1", lat: 24.7136, lng: 46.6753, address: "Riyadh City", status: "online" },
    { name: "Vendor 2", lat: 24.7200, lng: 46.6800, address: "Another Location", status: "offline" },
    { name: "Sakhrat Al Janoub Contracting Co.", lat: 24.7000, lng: 46.6500, address: "King Fahd Road, Riyadh", status: "busy" },
    { name: "Sakhrat Al Janoub Contracting Co.", lat: 24.7000, lng: 46.6100, address: "King Fahd Road, Riyadh", status: "vacation" }
];

// Function to initialize the map
function initializeMap() {
    // Prevent multiple initializations - only run once
    if (mapInitialized) return;
    
    // Create Leaflet map instance and center it on Riyadh coordinates
    // Parameters: [latitude, longitude], zoom level (12 = city level)
    map = L.map('map', {
    zoomControl: false  // Disable default zoom controls
    }).setView([24.7136, 46.6753], 12);

    // Add event listeners for zoom controls
    // Zoom In button
    document.getElementById('zoomInBtn').addEventListener('click', function() {
        map.zoomIn();
    });

    // Zoom Out button  
    document.getElementById('zoomOutBtn').addEventListener('click', function() {
        map.zoomOut();
    });

    // Show All Vendors button
    document.getElementById('fitVendorsBtn').addEventListener('click', function() {
        // Get all markers and fit the map to show them all
        var group = new L.featureGroup();
        vendors.forEach(function(vendor) {
            group.addLayer(L.marker([vendor.lat, vendor.lng]));
        });
        map.fitBounds(group.getBounds().pad(0.1));
    });

    // Fullscreen button
    document.querySelector('.bmh-map-control-btn:nth-child(4)').addEventListener('click', function() {
        // Toggle fullscreen for the map container
        var mapContainer = document.getElementById('map');
        if (!document.fullscreenElement) {
            // Enter fullscreen
            if (mapContainer.requestFullscreen) {
                mapContainer.requestFullscreen();
            } else if (mapContainer.webkitRequestFullscreen) {
                mapContainer.webkitRequestFullscreen();
            } else if (mapContainer.msRequestFullscreen) {
                mapContainer.msRequestFullscreen();
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
        
        // Resize map after fullscreen change
        setTimeout(function() {
            if (map) {
                map.invalidateSize();
            }
        }, 100);
    });

    // Add OpenStreetMap tile layer (the map background)
    // This provides the street map, satellite imagery, etc.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Loop through each vendor and create a marker on the map
    vendors.forEach(function(vendor) {

        // Create custom colored marker based on vendor status
        var customIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div class="marker-${vendor.status}"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        
        // Create a marker with the custom icon
        var marker = L.marker([vendor.lat, vendor.lng], { icon: customIcon }).addTo(map);
        
        // Bind a popup to the marker with vendor information
        // This popup will show when user clicks on the marker
        marker.bindPopup(`
            <div style="min-width: 250px; font-family: Arial, sans-serif;">
                <!-- Popup Header -->
                <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 15px;">
                    <h3 style="margin: 0; color: #1f2937; font-size: 16px;">Vendor Details</h3>
                </div>
                
                <!-- Vendor Information -->
                <div style="margin-bottom: 15px;">
                    <p style="margin: 5px 0; color: #374151;"><strong>Company:</strong> Sakhrat Al Janoub Contracting Co.</p>
                    <p style="margin: 5px 0; color: #374151;"><strong>Type:</strong> Contractor</p>
                    <p style="margin: 5px 0; color: #374151;"><strong>Location:</strong> Riyadh, Saudi Arabia</p>
                    <p style="margin: 5px 0; color: #374151;"><strong>Industry:</strong> Construction</p>
                    <!-- Online status badge with green background -->
                    <span style="display: inline-block; background: ${vendor.status === 'online' ? '#10b981' : vendor.status === 'offline' ? '#ef4444' : vendor.status === 'busy' ? '#f59e0b' : '#6b7280'}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-top: 5px;">${vendor.status}</span>
                </div>
                
                <!-- Action Buttons -->
                <div style="display: flex; gap: 8px;">
                    <!-- Open button - calls openVendorPopup() function -->
                    <a href="vendor-details.html" target="_blank">
                    <button style="flex: 1; background: #3b82f6; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">
                        <i class="fa fa-external-link"></i> Open
                    </button>
                    </a>
                    <!-- Navigate button - opens Google Maps with directions -->
                    <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${vendor.lat},${vendor.lng}', '_blank')" style="flex: 1; background: #6b7280; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">
                        <i class="fa fa-map-marker"></i> Navigate
                    </button>
                </div>
            </div>
        `);
    });
    
    // Mark map as initialized to prevent re-initialization
    mapInitialized = true;
    
    // Fix map rendering issue - invalidateSize() recalculates map dimensions
    // This is needed because the map container might be hidden when initialized
    setTimeout(function() {
        if (map) {
            map.invalidateSize();
        }
    }, 100);
}

// Handle window resize to ensure map renders properly
// When user resizes browser window, we need to recalculate map dimensions
window.addEventListener('resize', function() {
    // Only run if map exists and has been initialized
    if (map && mapInitialized) {
        // Use setTimeout to avoid too many resize calculations
        setTimeout(function() {
            map.invalidateSize(); // Recalculate map size after window resize
        }, 100);
    }
});
  







