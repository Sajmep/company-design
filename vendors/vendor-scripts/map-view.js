// Map View - Leaflet map, markers, and controls for vendors page
// Requires: Leaflet (L) loaded before this script

var map = null;
var mapInitialized = false;

// Example vendor data from your database
// Each vendor object contains: name, latitude, longitude, and address
var vendors = [
    { name: "Vendor 1", lat: 24.7136, lng: 46.6753, address: "Riyadh City", status: "open" },
    { name: "Vendor 2", lat: 24.7200, lng: 46.6800, address: "Another Location", status: "closed" },
    { name: "Sakhrat Al Janoub Contracting Co.", lat: 24.7000, lng: 46.6500, address: "King Fahd Road, Riyadh", status: "open" },
    { name: "Sakhrat Al Janoub Contracting Co.", lat: 24.7000, lng: 46.6100, address: "King Fahd Road, Riyadh", status: "closed" }
];

// Initialize the map (called when user switches to Map View)
function initializeMap() {
    if (mapInitialized) return;

    map = L.map('map', {
        zoomControl: false
    }).setView([24.7136, 46.6753], 12);

    // Zoom In
    document.getElementById('zoomInBtn').addEventListener('click', function () {
        map.zoomIn();
    });

    // Zoom Out
    document.getElementById('zoomOutBtn').addEventListener('click', function () {
        map.zoomOut();
    });

    // Show All Vendors
    document.getElementById('fitVendorsBtn').addEventListener('click', function () {
        var group = new L.featureGroup();
        vendors.forEach(function (vendor) {
            group.addLayer(L.marker([vendor.lat, vendor.lng]));
        });
        map.fitBounds(group.getBounds().pad(0.1));
    });

    // Fullscreen (4th control button)
    var fullscreenBtn = document.querySelector('.bmh-map-control-btn:nth-child(4)');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', function () {
            var mapContainer = document.getElementById('map');
            if (!document.fullscreenElement) {
                if (mapContainer.requestFullscreen) {
                    mapContainer.requestFullscreen();
                } else if (mapContainer.webkitRequestFullscreen) {
                    mapContainer.webkitRequestFullscreen();
                } else if (mapContainer.msRequestFullscreen) {
                    mapContainer.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
            setTimeout(function () {
                if (map) map.invalidateSize();
            }, 100);
        });
    }

    // Use CARTO Voyager for English (Latin) labels; standard OSM shows local script (e.g. Arabic in KSA)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
        maxNativeZoom: 19
    }).addTo(map);

    vendors.forEach(function (vendor) {
        var customIcon = L.divIcon({
            className: 'custom-marker',
            html: '<div class="marker-' + vendor.status + '"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        var marker = L.marker([vendor.lat, vendor.lng], { icon: customIcon }).addTo(map);

        var statusBg = vendor.status === 'open' ? '#10b981' : '#ef4444';
        marker.bindPopup(
            '<div style="min-width: 250px; font-family: Arial, sans-serif;">' +
            '<div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 15px;">' +
            '<h3 style="margin: 0; color: #1f2937; font-size: 16px;">Vendor Details</h3></div>' +
            '<div style="margin-bottom: 15px;">' +
            '<p style="margin: 5px 0; color: #374151;"><strong>Company:</strong> ' + (vendor.name || 'Sakhrat Al Janoub Contracting Co.') + '</p>' +
            '<p style="margin: 5px 0; color: #374151;"><strong>Type:</strong> Contractor</p>' +
            '<p style="margin: 5px 0; color: #374151;"><strong>Location:</strong> ' + (vendor.address || 'Riyadh, Saudi Arabia') + '</p>' +
            '<p style="margin: 5px 0; color: #374151;"><strong>Industry:</strong> Construction</p>' +
            '<span style="display: inline-block; background: ' + statusBg + '; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-top: 5px;">' + vendor.status + '</span>' +
            '</div>' +
            '<div style="display: flex; gap: 8px;">' +
            '<a href="vendor-details.html" target="_blank"><button style="flex: 1; background: #3b82f6; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;"><i class="fa fa-external-link"></i> Open</button></a>' +
            '<button onclick="window.open(\'https://www.google.com/maps/dir/?api=1&destination=' + vendor.lat + ',' + vendor.lng + '\', \'_blank\')" style="flex: 1; background: #6b7280; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;"><i class="fa fa-map-marker"></i> Navigate</button>' +
            '</div></div>'
        );
    });

    mapInitialized = true;

    setTimeout(function () {
        if (map) map.invalidateSize();
    }, 100);

    var activeStates = []; // test with one active

    fetch('occupied-palestine.json')
    .then(response => response.json())
    .then(data => {
    
        L.geoJSON(data, {
    
            style: function (feature) {
                var stateName = feature.properties.name;
    
                // ACTIVE (has vendors)
                if (activeStates.includes(stateName)) {
                    return {
                        color: "#16a34a",
                        fillColor: "#86efac",
                        fillOpacity: 0.6,
                        weight: 2
                    };
                }
    
                // OCCUPIED (clouded)
                return {
                    color: "#9ca3af",
                    fillColor: "#d1d5db",
                    fillOpacity: 0.8,
                    weight: 1,
                    dashArray: "4"
                };
            },
    
            onEachFeature: function (feature, layer) {
                var stateName = feature.properties.name;
    
                if (!activeStates.includes(stateName)) {
    
                    // Add centered "Coming Soon" label
                    layer.bindTooltip("Coming Soon", {
                        permanent: true,
                        direction: "center",
                        className: "coming-soon-label"
                    });
    
                    // Disable clicking
                    layer.off('click');
                }
            }
    
        }).addTo(map);
    
    });

}

// Map marker / info panel UI (static HTML markers)
document.addEventListener('DOMContentLoaded', function () {
    var mapMarkers = document.querySelectorAll('.bmh-map-marker');
    var infoPanel = document.querySelector('.bmh-map-info-panel');
    var infoClose = document.querySelector('.bmh-map-info-close');

    mapMarkers.forEach(function (marker) {
        marker.addEventListener('click', function () {
            if (infoPanel) infoPanel.classList.add('show');
        });
    });

    if (infoClose) {
        infoClose.addEventListener('click', function () {
            if (infoPanel) infoPanel.classList.remove('show');
        });
    }
});

// Resize: recalculate map size
window.addEventListener('resize', function () {
    if (map && mapInitialized) {
        setTimeout(function () {
            map.invalidateSize();
        }, 100);
    }
});
