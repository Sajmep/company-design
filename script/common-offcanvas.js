// Purchase/Inquiry Offcanvas Functions
// Standalone functions for purchase and inquiry offcanvas elements

function openPROffcanvas() {
    const offcanvas = document.getElementById('prOffcanvas');
    if (!offcanvas) {
        console.error('PR Offcanvas element not found');
        return;
    }
    
    offcanvas.style.display = 'block';
    
    // Show all tabs except create when opening normally
    document.querySelectorAll('.pr-tab-btn').forEach(tab => {
        if (tab.dataset.tab === 'create') {
            tab.style.display = 'none';
        } else {
            tab.style.display = 'flex';
        }
    });
    
    setTimeout(() => {
        offcanvas.classList.add('show');
    }, 10);
}

function closePROffcanvas() {
    const offcanvas = document.getElementById('prOffcanvas');
    offcanvas.classList.remove('show');
    setTimeout(() => {
        offcanvas.style.display = 'none';
    }, 300);
}

// Update offcanvas header
function updateOffcanvasHeader(title) {
    const header = document.querySelector('.purchase-offcanvas-header h3');
    if (header) {
        header.textContent = title;
    }
}

// Tab switching function
function switchTab(tabName) {
    // Remove active class from all tabs and panels
    document.querySelectorAll('.pr-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.pr-tab-panel').forEach(panel => panel.classList.remove('active'));
    
    // Add active class to selected tab and panel
    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    const selectedPanel = document.getElementById(`${tabName}-panel`);
    
    if (selectedTab) selectedTab.classList.add('active');
    if (selectedPanel) selectedPanel.classList.add('active');
    
    // Hide/show tabs container and other tabs based on current tab
    const tabsContainer = document.querySelector('.pr-tabs-container');
    const otherTabs = document.querySelectorAll('.pr-tab-btn:not([data-tab="create"])');
    
    if (tabName === 'create') {
        // Hide tabs container and show create tab
        if (tabsContainer) {
            tabsContainer.style.display = 'none';
            
        }
        document.querySelector('[data-tab="create"]').style.display = 'flex';
        otherTabs.forEach(tab => tab.style.display = 'none');
    } else {
        // Show tabs container and all tabs except create
        if (tabsContainer) {
            tabsContainer.style.display = 'block';
        }
        otherTabs.forEach(tab => tab.style.display = 'flex');
        document.querySelector('[data-tab="create"]').style.display = 'none';
    }
    
    // Update header based on tab using data attribute
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTab && activeTab.dataset.title) {
        updateOffcanvasHeader(activeTab.dataset.title);
    }
}

// Offcanvas Resize Function
function toggleOffcanvasWidth() {
    const offcanvas = document.querySelector('.purchase-offcanvas-content');
    const resizeBtn = document.querySelector('.purchase-offcanvas-resize-btn');
    
    if (!offcanvas || !resizeBtn) {
        console.error('Offcanvas or resize button not found');
        return;
    }
    
    const icon = resizeBtn.querySelector('.offcanvas-resize-icon');
    if (!icon) {
        console.error('Resize icon not found');
        return;
    }
    
    // Toggle the full width class
    offcanvas.classList.toggle('purchase-offcanvas-content-full');
    resizeBtn.classList.toggle('purchase-offcanvas-resize-btn-full');
    
    // Change arrow direction based on state
    if (offcanvas.classList.contains('purchase-offcanvas-content-full')) {
        icon.className = 'fa-solid fa-chevron-right offcanvas-resize-icon';
    } else {
        icon.className = 'fa-solid fa-chevron-left offcanvas-resize-icon';
    }
}