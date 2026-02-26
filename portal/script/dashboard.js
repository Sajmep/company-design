// Dashboard Tab Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard tabs
    initDashboardTabs();
    // Initialize animated counters
    initAnimatedCounters();
});

function initDashboardTabs() {
    const tabButtons = document.querySelectorAll('.dashboard-tab-btn');
    const tabPanels = document.querySelectorAll('.dashboard-tab-panel');
    
    // Add click event listeners to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding panel
            const targetPanel = document.querySelector(`.dashboard-tab-panel[data-tab="${targetTab}"]`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
            
            // Optional: Update URL hash for bookmarking
            updateUrlHash(targetTab);
        });
    });
    
    // Initialize first tab as active if no active tab is set
    if (!document.querySelector('.dashboard-tab-btn.active')) {
        const firstButton = tabButtons[0];
        const firstPanel = tabPanels[0];
        
        if (firstButton && firstPanel) {
            firstButton.classList.add('active');
            firstPanel.classList.add('active');
        }
    }
    
    // Handle URL hash on page load
    handleUrlHash();
}

function updateUrlHash(tabName) {
    // Update URL hash without triggering page reload
    if (history.pushState) {
        history.pushState(null, null, `#${tabName}`);
    } else {
        window.location.hash = tabName;
    }
}

function handleUrlHash() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        const targetButton = document.querySelector(`.dashboard-tab-btn[data-tab="${hash}"]`);
        const targetPanel = document.querySelector(`.dashboard-tab-panel[data-tab="${hash}"]`);
        
        if (targetButton && targetPanel) {
            // Remove active class from all buttons and panels
            document.querySelectorAll('.dashboard-tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.dashboard-tab-panel').forEach(panel => panel.classList.remove('active'));
            
            // Add active class to target elements
            targetButton.classList.add('active');
            targetPanel.classList.add('active');
        }
    }
}

// Animated Counter Functionality
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.dashboard-metric-number[data-target]');
    
    // Create intersection observer to trigger animation when elements come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the element is visible
    });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const prefix = element.getAttribute('data-prefix') || '';
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(target * easeOutQuart);
        
        // Format the number based on prefix/suffix
        let displayValue = currentValue;
        if (prefix === '$' && suffix === 'M') {
            displayValue = (currentValue / 1000000).toFixed(1);
        }
        
        element.textContent = prefix + displayValue + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            // Ensure final value is exact
            let finalValue = target;
            if (prefix === '$' && suffix === 'M') {
                finalValue = (target / 1000000).toFixed(1);
            }
            element.textContent = prefix + finalValue + suffix;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Export functions for external use
window.Dashboard = {
    switchTab: switchDashboardTab,
    init: initDashboardTabs,
    animateCounters: initAnimatedCounters
};
