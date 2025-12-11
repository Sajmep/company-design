// Views Container - View Switching
document.addEventListener('DOMContentLoaded', function() {
    // View containers mapping
    const views = {
        dashboard: { element: document.querySelector('.bmh-dashboard-view'), display: 'block' },
        card: { element: document.querySelector('.bmh-card-view'), display: 'flex' },
        list: { element: document.querySelector('.bmh-list-view'), display: 'flex' },
        calendar: { element: document.querySelector('.bmh-calendar-view'), display: 'block' },
        map: { element: document.querySelector('.bmh-map-view'), display: 'block' }
    };

    // Hide all views
    function hideAllViews() {
        Object.values(views).forEach(view => {
            if (view.element) view.element.style.display = 'none';
        });
    }

    // Show specific view
    function showView(viewType) {
        const view = views[viewType];
        if (view && view.element) {
            hideAllViews();
            view.element.style.display = view.display;
        }
    }

    // Initialize: show card view by default
    showView('card');

    // Override switchView function from toolbar.js
    window.switchView = function(viewType) {
        showView(viewType);
    };
});
  







