// ==================== Gallery List View JavaScript ====================

// Set actual viewport height to handle mobile browser address bar
function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set on load and resize
setViewportHeight();
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);

let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (Math.abs(scrollTop - lastScrollTop) > 5) {
        setViewportHeight();
        lastScrollTop = scrollTop;
    }
}, false);

// Toggle navigation dropdown
function toggleNavDropdown() {
    const menu = document.getElementById('quickViewNavMenu');
    const toggle = document.querySelector('.quick-view-list-nav-dropdown-toggle');
    if (menu && toggle) {
        menu.classList.toggle('quick-view-nav-menu-open');
        toggle.classList.toggle('quick-view-nav-toggle-active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const menu = document.getElementById('quickViewNavMenu');
    const toggle = document.querySelector('.quick-view-list-nav-dropdown-toggle');
    if (menu && toggle && !menu.contains(event.target) && !toggle.contains(event.target)) {
        menu.classList.remove('quick-view-nav-menu-open');
        toggle.classList.remove('quick-view-nav-toggle-active');
    }
});

// Toggle "Find similar" button on click
document.addEventListener('click', function(event) {
    const postContainer = event.target.closest('.quick-view-post-container');
    if (postContainer) {
        const post = postContainer.closest('.quick-view-post');
        const findSimilarBtn = post ? post.querySelector('.quick-view-find-similar-btn') : null;
        
        // Don't toggle if clicking the button itself
        if (findSimilarBtn && !findSimilarBtn.contains(event.target)) {
            findSimilarBtn.classList.toggle('show');
        }
    }
});

// Open offcanvas when clicking "Find similar" button
function openFindSimilarOffcanvas() {
    const offcanvas = document.getElementById('gallery-find-similar-offcanvas');
    if (offcanvas) {
        offcanvas.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// Close offcanvas
function closeFindSimilarOffcanvas() {
    const offcanvas = document.getElementById('gallery-find-similar-offcanvas');
    if (offcanvas) {
        offcanvas.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Add click handler to all "Find similar" buttons
document.addEventListener('click', function(event) {
    if (event.target.closest('.quick-view-find-similar-btn')) {
        event.preventDefault();
        event.stopPropagation();
        openFindSimilarOffcanvas();
    }
});

// Close offcanvas when clicking backdrop or close button
document.addEventListener('click', function(event) {
    const offcanvas = document.getElementById('gallery-find-similar-offcanvas');
    if (offcanvas && offcanvas.classList.contains('show')) {
        if (event.target.classList.contains('gallery-find-similar-offcanvas-backdrop') || 
            event.target.classList.contains('gallery-find-similar-offcanvas-close')) {
            closeFindSimilarOffcanvas();
        }
    }
});
