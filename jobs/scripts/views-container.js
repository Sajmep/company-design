// Views Container - View Switching
document.addEventListener('DOMContentLoaded', function() {
    // View containers mapping
    const views = {
        dashboard: { element: document.querySelector('.bmh-jobs-dashboard-view'), display: 'block' },
        card: { element: document.querySelector('.bmh-jobs-card-view'), display: 'flex' },
        list: { element: document.querySelector('.bmh-jobs-list-view'), display: 'flex' },
        calendar: { element: document.querySelector('.bmh-jobs-calendar-view'), display: 'block' },
        map: { element: document.querySelector('.bmh-jobs-map-view'), display: 'block' }
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

    // Job card Save button toggle
    document.querySelectorAll('.job-card-save-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var icon = this.querySelector('.job-card-save-icon');
            var text = this.querySelector('.job-card-save-text');
            this.classList.toggle('saved');
            if (this.classList.contains('saved')) {
                icon.classList.remove('fa-bookmark-o');
                icon.classList.add('fa-bookmark');
                if (text) text.textContent = 'Saved';
            } else {
                icon.classList.remove('fa-bookmark');
                icon.classList.add('fa-bookmark-o');
                if (text) text.textContent = 'Save';
            }
        });
    });
});