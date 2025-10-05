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









