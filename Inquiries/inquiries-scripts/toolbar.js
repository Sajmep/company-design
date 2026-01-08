// Toolbar Search Toggle (Mobile)
document.addEventListener('DOMContentLoaded', function() {
    const searchContainer = document.querySelector('.toolbar-search');
    const searchIcon = document.querySelector('.toolbar-search-icon');
    const searchInput = document.querySelector('.toolbar-search-input');
    const searchClose = document.querySelector('.toolbar-search-close');

    if (searchContainer && searchIcon) {
        // Toggle search expansion on icon click
        searchIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            searchContainer.classList.toggle('expanded');
            
            // Focus input when expanded
            if (searchContainer.classList.contains('expanded')) {
                setTimeout(function() {
                    if (searchInput) {
                        searchInput.focus();
                    }
                }, 100);
            }
        });

        // Close search when close button is clicked
        if (searchClose) {
            searchClose.addEventListener('click', function(e) {
                e.stopPropagation();
                searchContainer.classList.remove('expanded');
                if (searchInput) {
                    searchInput.value = '';
                    searchInput.blur();
                }
            });
        }

        // Close search when clicking outside
        document.addEventListener('click', function(e) {
            if (searchContainer && !searchContainer.contains(e.target)) {
                searchContainer.classList.remove('expanded');
            }
        });

        // Close search on input blur (optional - remove if you want it to stay open)
        if (searchInput) {
            searchInput.addEventListener('blur', function() {
                // Small delay to allow clicking the icon to close
                setTimeout(function() {
                    if (!searchContainer.contains(document.activeElement)) {
                        searchContainer.classList.remove('expanded');
                    }
                }, 200);
            });
        }
    }
});

// Views Toggle Dropdown
function toggleViewsDropdown() {
    const dropdown = document.getElementById('viewsDropdown');
    const button = document.querySelector('.views-toggle-btn');
    
    if (dropdown && button) {
        dropdown.classList.toggle('show');
        button.classList.toggle('active');
    }
}

// Switch View Function
function switchView(viewType) {
    const dropdown = document.getElementById('viewsDropdown');
    const button = document.querySelector('.views-toggle-btn');
    const icon = document.querySelector('.views-toggle-icon');
    const items = document.querySelectorAll('.views-toggle-item');
    
    // Remove active class from all items
    items.forEach(item => item.classList.remove('active'));
    
    // Add active class to selected item
    const selectedItem = document.querySelector(`.views-toggle-item[data-view="${viewType}"]`);
    if (selectedItem) {
        selectedItem.classList.add('active');
        
        // Update button icon
        const selectedIcon = selectedItem.querySelector('i').className;
        if (icon) {
            icon.className = selectedIcon;
        }
    }
    
    // Close dropdown
    if (dropdown) dropdown.classList.remove('show');
    if (button) button.classList.remove('active');
    
    // Here you can add logic to actually switch views
    // For example: show/hide different view containers
    console.log('Switched to:', viewType);
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('viewsDropdown');
    const button = document.querySelector('.views-toggle-btn');
    const viewsToggle = document.querySelector('.views-toggle');
    
    if (dropdown && button && viewsToggle && !viewsToggle.contains(e.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});




// Company Selector Toggle
document.addEventListener('DOMContentLoaded', function() {
    const selector = document.getElementById('selector');
    const panel = document.getElementById('panel');
    const caret = document.getElementById('caret');
    const companySelector = document.getElementById('companySelector');

    if (selector && panel && caret) {
        // Initialize panel as hidden
        panel.style.display = 'none';

        // Toggle panel on button click
        selector.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = panel.style.display === 'block';
            
            panel.style.display = isOpen ? 'none' : 'block';
            caret.classList.toggle('open');
            selector.setAttribute('aria-expanded', !isOpen);
        });

        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (companySelector && !companySelector.contains(e.target)) {
                panel.style.display = 'none';
                caret.classList.remove('open');
                selector.setAttribute('aria-expanded', 'false');
            }
        });
    }
});