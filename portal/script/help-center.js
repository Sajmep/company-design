// Help Center Tab Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize help center tabs
    initHelpCenterTabs();
    
    // Initialize FAQ functionality
    initHelpCenterFAQs();
});

function initHelpCenterTabs() {
    const tabButtons = document.querySelectorAll('.help-center-tab-btn');
    const tabPanels = document.querySelectorAll('.help-center-tab-panel');
    
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
            const targetPanel = document.querySelector(`.help-center-tab-panel[data-tab="${targetTab}"]`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
            
            // Optional: Update URL hash for bookmarking
            updateUrlHash(targetTab);
        });
    });
    
    // Initialize first tab as active if no active tab is set
    if (!document.querySelector('.help-center-tab-btn.active')) {
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
        const targetButton = document.querySelector(`.help-center-tab-btn[data-tab="${hash}"]`);
        const targetPanel = document.querySelector(`.help-center-tab-panel[data-tab="${hash}"]`);
        
        if (targetButton && targetPanel) {
            // Remove active class from all buttons and panels
            document.querySelectorAll('.help-center-tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.help-center-tab-panel').forEach(panel => panel.classList.remove('active'));
            
            // Add active class to target elements
            targetButton.classList.add('active');
            targetPanel.classList.add('active');
        }
    }
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    const activeButton = document.querySelector('.help-center-tab-btn.active');
    if (!activeButton) return;
    
    const tabButtons = Array.from(document.querySelectorAll('.help-center-tab-btn'));
    const currentIndex = tabButtons.indexOf(activeButton);
    
    let targetIndex = currentIndex;
    
    switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            targetIndex = currentIndex > 0 ? currentIndex - 1 : tabButtons.length - 1;
            break;
        case 'ArrowRight':
            e.preventDefault();
            targetIndex = currentIndex < tabButtons.length - 1 ? currentIndex + 1 : 0;
            break;
        case 'Home':
            e.preventDefault();
            targetIndex = 0;
            break;
        case 'End':
            e.preventDefault();
            targetIndex = tabButtons.length - 1;
            break;
        default:
            return;
    }
    
    if (targetIndex !== currentIndex) {
        tabButtons[targetIndex].click();
        tabButtons[targetIndex].focus();
    }
});

// Accessibility improvements
function enhanceAccessibility() {
    const tabButtons = document.querySelectorAll('.help-center-tab-btn');
    const tabPanels = document.querySelectorAll('.help-center-tab-panel');
    
    // Add ARIA attributes
    tabButtons.forEach((button, index) => {
        const tabName = button.getAttribute('data-tab');
        const panel = document.querySelector(`.help-center-tab-panel[data-tab="${tabName}"]`);
        
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-selected', 'false');
        button.setAttribute('aria-controls', `help-center-${tabName}`);
        button.setAttribute('id', `help-center-tab-${tabName}`);
        button.setAttribute('tabindex', '-1');
        
        if (panel) {
            panel.setAttribute('role', 'tabpanel');
            panel.setAttribute('aria-labelledby', `help-center-tab-${tabName}`);
            panel.setAttribute('id', `help-center-${tabName}`);
        }
    });
    
    // Update ARIA attributes when tabs change
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const button = mutation.target;
                const isActive = button.classList.contains('active');
                const tabName = button.getAttribute('data-tab');
                const panel = document.querySelector(`.help-center-tab-panel[data-tab="${tabName}"]`);
                
                button.setAttribute('aria-selected', isActive.toString());
                button.setAttribute('tabindex', isActive ? '0' : '-1');
                
                if (panel) {
                    panel.setAttribute('aria-hidden', (!isActive).toString());
                }
            }
        });
    });
    
    tabButtons.forEach(button => {
        observer.observe(button, { attributes: true });
    });
}

// Initialize accessibility enhancements
document.addEventListener('DOMContentLoaded', function() {
    enhanceAccessibility();
});

// Utility function to programmatically switch tabs
function switchHelpCenterTab(tabName) {
    const targetButton = document.querySelector(`.help-center-tab-btn[data-tab="${tabName}"]`);
    if (targetButton) {
        targetButton.click();
    }
}

// FAQ Functionality
function initHelpCenterFAQs() {
    const faqQuestions = document.querySelectorAll('.help-center-faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqId = this.getAttribute('data-faq');
            const answer = document.getElementById(faqId);
            
            // Toggle active state
            const isActive = this.classList.contains('active');
            
            // Close all other FAQs
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                const otherFaqId = q.getAttribute('data-faq');
                const otherAnswer = document.getElementById(otherFaqId);
                if (otherAnswer) {
                    otherAnswer.classList.remove('active');
                }
            });
            
            // Toggle current FAQ
            if (!isActive) {
                this.classList.add('active');
                if (answer) {
                    answer.classList.add('active');
                }
            }
        });
        
        // Add keyboard support
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// FAQ Search functionality (optional enhancement)
function initFAQSearch() {
    const searchInput = document.querySelector('.help-center-faq-search');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const faqItems = document.querySelectorAll('.help-center-faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.help-center-faq-question span').textContent.toLowerCase();
            const answer = item.querySelector('.help-center-faq-answer p').textContent.toLowerCase();
            
            if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// Utility function to expand/collapse all FAQs
function toggleAllFAQs(expand = true) {
    const faqQuestions = document.querySelectorAll('.help-center-faq-question');
    
    faqQuestions.forEach(question => {
        const faqId = question.getAttribute('data-faq');
        const answer = document.getElementById(faqId);
        
        if (expand) {
            question.classList.add('active');
            if (answer) {
                answer.classList.add('active');
            }
        } else {
            question.classList.remove('active');
            if (answer) {
                answer.classList.remove('active');
            }
        }
    });
}

// Export functions for external use
window.HelpCenter = {
    switchTab: switchHelpCenterTab,
    init: initHelpCenterTabs,
    initFAQs: initHelpCenterFAQs,
    toggleAllFAQs: toggleAllFAQs,
    initFAQSearch: initFAQSearch
};
