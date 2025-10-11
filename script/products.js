// Products JavaScript Functions

// Open Product Creation Offcanvas
function createProduct() {
    const offcanvas = document.getElementById('Offcanvas');
    if (offcanvas) {
        offcanvas.style.display = 'block';
        // Add show class after a small delay to trigger the animation
        setTimeout(() => {
            offcanvas.classList.add('show');
        }, 10);
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

// Close Product Offcanvas
function closePROffcanvas() {
    const offcanvas = document.getElementById('Offcanvas');
    if (offcanvas) {
        offcanvas.classList.remove('show');
        // Hide the offcanvas after animation completes
        setTimeout(() => {
            offcanvas.style.display = 'none';
        }, 300); // Match the CSS transition duration
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Toggle Offcanvas Width
function toggleOffcanvasWidth() {
    const offcanvas = document.getElementById('Offcanvas');
    const resizeIcon = document.querySelector('.offcanvas-resize-icon');
    
    if (offcanvas && resizeIcon) {
        offcanvas.classList.toggle('expanded');
        
        // Toggle icon direction
        if (offcanvas.classList.contains('expanded')) {
            resizeIcon.classList.remove('fa-chevron-left');
            resizeIcon.classList.add('fa-chevron-right');
        } else {
            resizeIcon.classList.remove('fa-chevron-right');
            resizeIcon.classList.add('fa-chevron-left');
        }
    }
}

// Close offcanvas when clicking backdrop
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('product-offcanvas-backdrop')) {
        closePROffcanvas();
    }
});

// Prevent offcanvas from closing 
document.addEventListener('click', function(e) {
    const offcanvasContent = document.querySelector('.product-offcanvas-content');
    if (offcanvasContent && offcanvasContent.contains(e.target)) {
        e.stopPropagation();
    }
});

// Product Category Dropdown functionality
function toggleCategoryDropdown() {
    const dropdown = document.querySelector('.product-category-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('open');
    }
}

// Ecommerce Category Dropdown functionality
function toggleEcommerceCategoryDropdown() {
    const dropdown = document.getElementById('ecommerceCategoryDropdown');
    if (dropdown) {
        dropdown.classList.toggle('open');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    const dropdown = document.querySelector('.product-category-dropdown');
    const ecommerceDropdown = document.getElementById('ecommerceCategoryDropdown');
    const trigger = document.querySelector('.dropdown-trigger');
    const ecommerceTrigger = document.querySelector('#ecommerceCategoryDropdown .dropdown-trigger');
    
    if (dropdown && trigger && !trigger.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
    }
    
    if (ecommerceDropdown && ecommerceTrigger && !ecommerceTrigger.contains(e.target) && !ecommerceDropdown.contains(e.target)) {
        ecommerceDropdown.classList.remove('open');
    }
});

// Handle category item selection (multiple selection)
function selectCategoryItem(itemText) {
    const selectedItems = document.getElementById('selectedItems');
    const placeholder = selectedItems.querySelector('.placeholder');
    
    // Remove placeholder if it exists
    if (placeholder) {
        placeholder.remove();
    }
    
    // Get full path
    const fullPath = getFullPath(itemText);
    
    // Check if item already selected
    const existingItem = selectedItems.querySelector(`[data-item="${fullPath}"]`);
    if (existingItem) {
        return; // Already selected
    }
    
    // Create new selected item
    const itemDiv = document.createElement('div');
    itemDiv.className = 'selected-item';
    itemDiv.setAttribute('data-item', fullPath);
    itemDiv.innerHTML = `
        ${fullPath}
        <span class="remove" onclick="removeCategoryItem('${fullPath}')">&times;</span>
    `;
    
    selectedItems.appendChild(itemDiv);
}

// Get full path - simplified version
function getFullPath(itemText) {
    // Find the clicked item by text content
    const items = document.querySelectorAll('.item');
    let clickedItem = null;
    
    for (let item of items) {
        if (item.textContent.trim() === itemText) {
            clickedItem = item;
            break;
        }
    }
    
    if (!clickedItem) return itemText;
    
    // Build path by going up through details
    const path = [itemText];
    let current = clickedItem;
    
    while (current) {
        const details = current.closest('details');
        if (details) {
            const summary = details.querySelector('summary');
            if (summary && summary.textContent.trim() !== itemText) {
                path.unshift(summary.textContent.trim());
            }
            current = details.parentElement;
        } else {
            break;
        }
    }
    
    return path.join(' / ');
}

// Remove category item
function removeCategoryItem(itemText) {
    const item = document.querySelector(`[data-item="${itemText}"]`);
    if (item) {
        item.remove();
        
        // Show placeholder if no items left
        const selectedItems = document.getElementById('selectedItems');
        if (selectedItems.children.length === 0) {
            selectedItems.innerHTML = '<span class="placeholder">Select Categories</span>';
        }
    }
}

// Handle ecommerce category item selection (multiple selection)
function selectEcommerceCategoryItem(itemText) {
    const selectedItems = document.getElementById('selectedEcommerceItems');
    const placeholder = selectedItems.querySelector('.placeholder');
    
    // Remove placeholder if it exists
    if (placeholder) {
        placeholder.remove();
    }
    
    // Check if item already selected
    const existingItem = selectedItems.querySelector(`[data-item="${itemText}"]`);
    if (existingItem) {
        return; // Already selected
    }
    
    // Create new selected item
    const itemDiv = document.createElement('div');
    itemDiv.className = 'selected-item';
    itemDiv.setAttribute('data-item', itemText);
    itemDiv.innerHTML = `
        ${itemText}
        <span class="remove" onclick="removeEcommerceCategoryItem('${itemText}')">&times;</span>
    `;
    
    selectedItems.appendChild(itemDiv);
}

// Remove ecommerce category item
function removeEcommerceCategoryItem(itemText) {
    const item = document.querySelector(`[data-item="${itemText}"]`);
    if (item) {
        item.remove();
        
        // Show placeholder if no items left
        const selectedItems = document.getElementById('selectedEcommerceItems');
        if (selectedItems.children.length === 0) {
            selectedItems.innerHTML = '<span class="placeholder">Select Ecommerce Categories</span>';
        }
    }
}

// Tab functionality
function switchTab(tabName) {
    // Remove active class from all tabs and panels
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    
    // Add active class to clicked tab and corresponding panel
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Add click event listeners to tab buttons
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling to backdrop
            e.preventDefault(); // Prevent any default behavior
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
});

