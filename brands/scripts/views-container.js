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

    // Favorite button toggle functionality
    function toggleFavorite(button) {
        const icon = button.querySelector('i');
        button.classList.toggle('favorited');
        if (button.classList.contains('favorited')) {
            icon.classList.remove('fa-heart-o');
            icon.classList.add('fa-heart');
        } else {
            icon.classList.remove('fa-heart');
            icon.classList.add('fa-heart-o');
        }
    }

    // Add event listeners to all favorite buttons
    document.querySelectorAll('.card-favorite-btn, .list-favorite-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleFavorite(this);
        });
    });
});
  







