// Purchase/Inquiry Offcanvas Functions
// Standalone functions for purchase and inquiry offcanvas elements

function openPROffcanvas() {
    const offcanvas = document.getElementById('prOffcanvas');
    if (!offcanvas) {
        console.error('PR Offcanvas element not found');
        return;
    }
    
    offcanvas.style.display = 'block';
    
    // Show all tabs (RFQ, Chat, Offers, Log)
    document.querySelectorAll('.pr-tab-btn').forEach(tab => {
        tab.style.display = 'flex';
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
    // Only target the main tabs container (direct child of purchase-offcanvas-body), not nested ones
    const offcanvasBody = document.querySelector('.purchase-offcanvas-body');
    const tabsContainer = offcanvasBody ? offcanvasBody.querySelector(':scope > .pr-tabs-container') : null;
    const otherTabs = document.querySelectorAll('.pr-tab-btn[data-tab]:not([data-tab="create"])');
    
    if (tabName === 'create') {
         // Show main tabs container and all main tabs (RFQ, Chat, Offers, Log)
        if (tabsContainer) {
            tabsContainer.style.display = 'block';
        }
        // Show all main tabs including RFQ (create tab)
        otherTabs.forEach(tab => tab.style.display = 'flex');
        const createTab = document.querySelector('[data-tab="create"]');
        if (createTab) createTab.style.display = 'flex';
        
        // Ensure nested tabs in create panel are visible
        const createPanel = document.getElementById('create-panel');
        if (createPanel) {
            const nestedTabsContainer = createPanel.querySelector('.pr-tabs-container');
            if (nestedTabsContainer) {
                nestedTabsContainer.style.display = 'block';
            }
        }
    } else {
        // Show main tabs container and all tabs
        if (tabsContainer) {
            tabsContainer.style.display = 'block';
        }
        otherTabs.forEach(tab => tab.style.display = 'flex');
        const createTab = document.querySelector('[data-tab="create"]');
        if (createTab) createTab.style.display = 'flex';
        
        // Hide nested tabs in create panel when not in create mode
        const createPanel = document.getElementById('create-panel');
        if (createPanel) {
            const nestedTabsContainer = createPanel.querySelector('.pr-tabs-container');
            if (nestedTabsContainer) {
                nestedTabsContainer.style.display = 'none';
            }
        }
    }
    
    // Update header based on tab using data attribute
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTab && activeTab.dataset.title) {
        updateOffcanvasHeader(activeTab.dataset.title);
    }
    
    // Update dropdown button text and active state if tab is in dropdown
    if (tabName === 'chat' || tabName === 'offers' || tabName === 'log') {
        const dropdownText = document.getElementById('tabDropdownText');
        const dropdownItem = document.querySelector(`.pr-tab-dropdown-item[data-tab="${tabName}"]`);
        
        if (dropdownText && dropdownItem) {
            dropdownText.textContent = dropdownItem.dataset.title || dropdownItem.querySelector('span').textContent;
        }
        
        // Update active state in dropdown items
        document.querySelectorAll('.pr-tab-dropdown-item').forEach(item => {
            item.classList.remove('active');
        });
        if (dropdownItem) {
            dropdownItem.classList.add('active');
        }
        
        // Make dropdown button active
        const dropdownBtn = document.getElementById('tabDropdownBtn');
        if (dropdownBtn) {
            dropdownBtn.classList.add('active');
        }
    } else {
        // Remove active state from dropdown button if switching to non-dropdown tab
        const dropdownBtn = document.getElementById('tabDropdownBtn');
        if (dropdownBtn) {
            dropdownBtn.classList.remove('active');
        }
        document.querySelectorAll('.pr-tab-dropdown-item').forEach(item => {
            item.classList.remove('active');
        });
    }
}

// Tab Dropdown Functions
function toggleTabDropdown(event) {
    if (event) {
        event.stopPropagation();
    }
    
    const dropdownMenu = document.getElementById('tabDropdownMenu');
    const dropdownBtn = document.getElementById('tabDropdownBtn');
    
    if (!dropdownMenu || !dropdownBtn) return;
    
    const isOpen = dropdownMenu.classList.contains('show');
    
    // Close all other dropdowns
    document.querySelectorAll('.pr-tab-dropdown-menu.show').forEach(menu => {
        if (menu !== dropdownMenu) {
            menu.classList.remove('show');
            const btn = menu.previousElementSibling;
            if (btn) btn.classList.remove('active');
        }
    });
    
    if (isOpen) {
        dropdownMenu.classList.remove('show');
        dropdownBtn.classList.remove('active');
    } else {
        dropdownMenu.classList.add('show');
        dropdownBtn.classList.add('active');
    }
}

function selectTabFromDropdown(tabName) {
    // Close dropdown
    const dropdownMenu = document.getElementById('tabDropdownMenu');
    const dropdownBtn = document.getElementById('tabDropdownBtn');
    const dropdownText = document.getElementById('tabDropdownText');
    
    if (dropdownMenu) dropdownMenu.classList.remove('show');
    if (dropdownBtn) dropdownBtn.classList.remove('active');
    
    // Update dropdown button text to show selected tab
    const selectedItem = document.querySelector(`.pr-tab-dropdown-item[data-tab="${tabName}"]`);
    if (selectedItem && dropdownText) {
        const tabTitle = selectedItem.dataset.title || selectedItem.querySelector('span').textContent;
        dropdownText.textContent = tabTitle;
    }
    
    // Update active state in dropdown items
    document.querySelectorAll('.pr-tab-dropdown-item').forEach(item => {
        item.classList.remove('active');
    });
    if (selectedItem) {
        selectedItem.classList.add('active');
    }
    
    // Switch to the selected tab
    switchTab(tabName);
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    const dropdown = document.querySelector('.pr-tab-dropdown');
    if (dropdown && !dropdown.contains(e.target)) {
        const dropdownMenu = document.getElementById('tabDropdownMenu');
        const dropdownBtn = document.getElementById('tabDropdownBtn');
        if (dropdownMenu) dropdownMenu.classList.remove('show');
        if (dropdownBtn) dropdownBtn.classList.remove('active');
    }
});

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
    
    // Change arrow direction based on state - preserve existing classes
    if (offcanvas.classList.contains('purchase-offcanvas-content-full')) {
        icon.classList.remove('fa-chevron-left');
        icon.classList.add('fa-chevron-right');
    } else {
        icon.classList.remove('fa-chevron-right');
        icon.classList.add('fa-chevron-left');
    }
}