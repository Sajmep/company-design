const searchInput = document.getElementById('search-input');
const resultsDropdown = document.getElementById('results-dropdown');

// Show dropdown when user starts typing
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (query.length > 0) {
        resultsDropdown.style.display = 'block';
    } else {
        resultsDropdown.style.display = 'none';
    }
});

// Hide dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.bmh-home-page-search-wrapper')) {
        resultsDropdown.style.display = 'none';
    }
});

// Show dropdown on focus if there's text
searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length > 0) {
        resultsDropdown.style.display = 'block';
    }
});

// Tooltip Toggle Functionality
const tooltipToggle = document.getElementById('tooltipToggle');
const loginTooltip = document.querySelector('.header-login-tooltip');
const companyTooltip = document.querySelector('.company-selector-tooltip');
const exploreTooltip = document.querySelector('.bmh-home-page-explore-tooltip');

// Array of all tooltips in order
const allTooltips = [companyTooltip, loginTooltip, exploreTooltip];
let currentTooltipIndex = 0;

// Check localStorage for saved preference
const tooltipsVisible = localStorage.getItem('tooltipsVisible') !== 'false';

function updateTooltipsVisibility(visible) {
    if (visible) {
        showTooltip(currentTooltipIndex);
        tooltipToggle?.classList.add('active');
    } else {
        hideAllTooltips();
        tooltipToggle?.classList.remove('active');
    }
    localStorage.setItem('tooltipsVisible', visible);
}

function hideAllTooltips() {
    allTooltips.forEach(tooltip => {
        if (tooltip) tooltip.classList.add('hidden');
    });
}

function showTooltip(index) {
    // Hide all tooltips first
    hideAllTooltips();
    
    // Show the tooltip at the given index
    if (allTooltips[index]) {
        allTooltips[index].classList.remove('hidden');
    }
    
    // Update navigation buttons for all tooltips
    updateNavigationButtons();
}

function updateNavigationButtons() {
    allTooltips.forEach((tooltip, index) => {
        if (!tooltip) return;
        
        const prevBtn = tooltip.querySelector('.tooltip-prev');
        const nextBtn = tooltip.querySelector('.tooltip-next');
        
        if (prevBtn) {
            prevBtn.disabled = currentTooltipIndex === 0;
        }
        if (nextBtn) {
            nextBtn.disabled = currentTooltipIndex === allTooltips.length - 1;
        }
    });
}

// Initialize tooltip visibility
if (tooltipsVisible) {
    showTooltip(currentTooltipIndex);
    tooltipToggle?.classList.add('active');
} else {
    hideAllTooltips();
    tooltipToggle?.classList.remove('active');
}

// Toggle on button click
tooltipToggle?.addEventListener('click', () => {
    const currentlyVisible = tooltipsVisible && !allTooltips[0]?.classList.contains('hidden');
    if (currentlyVisible) {
        updateTooltipsVisibility(false);
    } else {
        currentTooltipIndex = 0;
        updateTooltipsVisibility(true);
    }
});

// Handle Next button clicks
document.querySelectorAll('.tooltip-next').forEach((nextBtn) => {
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentTooltipIndex < allTooltips.length - 1) {
            currentTooltipIndex++;
            showTooltip(currentTooltipIndex);
        }
    });
});

// Handle Previous button clicks
document.querySelectorAll('.tooltip-prev').forEach((prevBtn) => {
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentTooltipIndex > 0) {
            currentTooltipIndex--;
            showTooltip(currentTooltipIndex);
        }
    });
});

// Handle Close button clicks
document.querySelectorAll('.tooltip-close').forEach((closeBtn) => {
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateTooltipsVisibility(false);
    });
});

