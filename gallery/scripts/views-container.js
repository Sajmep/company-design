// Views Container - View Switching
document.addEventListener('DOMContentLoaded', function() {
    // View containers mapping
    const views = {
        dashboard: { element: document.querySelector('.gallery-dashboard-view'), display: 'block' },
        card: { element: document.querySelector('.gallery-card-view'), display: 'flex' },
        list: { element: document.querySelector('.quick-view'), display: 'flex' },
        calendar: { element: document.querySelector('.gallery-calendar-view'), display: 'block' },
        map: { element: document.querySelector('.gallery-map-view'), display: 'block' }
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
    showView('list');

    // Override switchView function from toolbar.js
    window.switchView = function(viewType) {
        showView(viewType);
    };

    // Gallery List View Post Navigation (Reels Style)
    const mediaBox = document.querySelector('.quick-view-list-media-box');
    const posts = document.querySelectorAll('.quick-view-post');
    const buttons = document.querySelectorAll('.quick-view-list-navigation-button');
    
    if (mediaBox && posts.length > 0) {
        const getCurrentIndex = () => {
            const scrollTop = mediaBox.scrollTop;
            const containerHeight = mediaBox.clientHeight;
            return Math.round(scrollTop / containerHeight);
        };

        const scrollToPost = (index) => {
            if (index < 0) index = posts.length - 1;
            if (index >= posts.length) index = 0;
            posts[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
        };

        // Up button - previous post
        if (buttons[0]) {
            buttons[0].addEventListener('click', () => {
                scrollToPost(getCurrentIndex() - 1);
            });
        }

        // Down button - next post
        if (buttons[1]) {
            buttons[1].addEventListener('click', () => {
                scrollToPost(getCurrentIndex() + 1);
            });
        }
    }
});
  







