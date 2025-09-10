// Purchase Tab Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize purchase tabs
    initPurchaseTabs();
    
});

function initPurchaseTabs() {
    const tabButtons = document.querySelectorAll('.purchase-tab-btn');
    const tabPanels = document.querySelectorAll('.purchase-tab-panel');
    
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
            const targetPanel = document.querySelector(`.purchase-tab-panel[data-tab="${targetTab}"]`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
            
            // Optional: Update URL hash for bookmarking
            updateUrlHash(targetTab);
        });
    });
    
    // Initialize first tab as active if no active tab is set
    if (!document.querySelector('.purchase-tab-btn.active')) {
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
        const targetButton = document.querySelector(`.purchase-tab-btn[data-tab="${hash}"]`);
        const targetPanel = document.querySelector(`.purchase-tab-panel[data-tab="${hash}"]`);
        
        if (targetButton && targetPanel) {
            // Remove active class from all buttons and panels
            document.querySelectorAll('.purchase-tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.purchase-tab-panel').forEach(panel => panel.classList.remove('active'));
            
            // Add active class to target elements
            targetButton.classList.add('active');
            targetPanel.classList.add('active');
        }
    }
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    const activeButton = document.querySelector('.purchase-tab-btn.active');
    if (!activeButton) return;
    
    const tabButtons = Array.from(document.querySelectorAll('.purchase-tab-btn'));
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
    const tabButtons = document.querySelectorAll('.purchase-tab-btn');
    const tabPanels = document.querySelectorAll('.purchase-tab-panel');
    
    // Add ARIA attributes
    tabButtons.forEach((button, index) => {
        const tabName = button.getAttribute('data-tab');
        const panel = document.querySelector(`.purchase-tab-panel[data-tab="${tabName}"]`);
        
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-selected', 'false');
        button.setAttribute('aria-controls', `purchase-${tabName}`);
        button.setAttribute('id', `purchase-tab-${tabName}`);
        button.setAttribute('tabindex', '-1');
        
        if (panel) {
            panel.setAttribute('role', 'tabpanel');
            panel.setAttribute('aria-labelledby', `purchase-tab-${tabName}`);
            panel.setAttribute('id', `purchase-${tabName}`);
        }
    });
    
    // Update ARIA attributes when tabs change
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const button = mutation.target;
                const isActive = button.classList.contains('active');
                const tabName = button.getAttribute('data-tab');
                const panel = document.querySelector(`.purchase-tab-panel[data-tab="${tabName}"]`);
                
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
function switchPurchaseTab(tabName) {
    const targetButton = document.querySelector(`.purchase-tab-btn[data-tab="${tabName}"]`);
    if (targetButton) {
        targetButton.click();
    }
}

// Create Dropdown Functionality

function createPurchaseItem(type) {
    // Switch to the appropriate tab
    switchPurchaseTab(type);
    
    // Open the form inside the tab
    openPurchaseForm(type);
}

function openPurchaseForm(type) {
    const content = document.getElementById(`${type}Content`);
    const form = document.getElementById(`${type}Form`);
    
    if (content && form) {
        // Hide the content placeholder
        content.style.display = 'none';
        
        // Show the form
        form.style.display = 'block';
        
        // Reset form
        form.querySelector('form').reset();
        
        // Focus on first input
        const firstInput = form.querySelector('input[required]');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
        
        // Initialize RFQ vendor selection if it's an RFQ form
        if (type === 'rfq') {
            initRFQVendorSelection();
            initRFQItemsActions();
        }
        
        // Initialize PR items actions if it's a PR form
        if (type === 'pr') {
            initPRItemsActions();
        }
    }
}

function closePurchaseForm(type) {
    const content = document.getElementById(`${type}Content`);
    const form = document.getElementById(`${type}Form`);
    
    if (content && form) {
        // Show the content placeholder
        content.style.display = 'block';
        
        // Hide the form
        form.style.display = 'none';
        
        // Reset form
        form.querySelector('form').reset();
    }
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    // Handle all purchase forms
    const forms = document.querySelectorAll('.purchase-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const type = form.getAttribute('data-type');
            const data = Object.fromEntries(formData.entries());
            
            // Add type to data
            data.type = type;
            
            // Here you can handle the form submission
            console.log('Form submitted:', data);
            
            // You can add API call here
            // submitPurchaseForm(data);
            
            // Show success message
            alert(`${type.toUpperCase()} created successfully!`);
            
            // Close the form
            closePurchaseForm(type);
            
            // You can also refresh the current tab content or add the new item to a list
        });
    });
    
    // Close form on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Find which form is currently visible and close it
            const visibleForm = document.querySelector('.purchase-form-container[style*="block"]');
            if (visibleForm) {
                const formId = visibleForm.id;
                const type = formId.replace('Form', '');
                closePurchaseForm(type);
            }
        }
    });
});

// Multiple RFQ Vendor Selection
function initRFQVendorSelection() {
    // Handle vendor category selection
    const vendorCategorySelect = document.getElementById('rfqVendorCategories');
    if (vendorCategorySelect) {
        vendorCategorySelect.addEventListener('change', function() {
            if (this.value) {
                addSelectedValue('rfqVendorCategories', this.value, this.options[this.selectedIndex].text);
                this.selectedIndex = 0; // Reset to placeholder
            }
        });
    }
    
    // Handle vendor selection
    const vendorSelect = document.getElementById('rfqVendors');
    if (vendorSelect) {
        vendorSelect.addEventListener('change', function() {
            if (this.value) {
                addSelectedValue('rfqVendors', this.value, this.options[this.selectedIndex].text);
                this.selectedIndex = 0; // Reset to placeholder
            }
        });
    }
}

function addSelectedValue(selectId, value, text) {
    // Find or create the display container
    let displayContainer = document.getElementById(`${selectId}Container`);
    if (!displayContainer) {
        const select = document.getElementById(selectId);
        if (select) {
            displayContainer = document.createElement('div');
            displayContainer.id = `${selectId}Container`;
            displayContainer.className = 'purchase-rfq-selected-container';
            select.parentNode.appendChild(displayContainer);
        }
    }
    
    if (displayContainer) {
        // Check if this value is already selected
        if (displayContainer.querySelector(`[data-value="${value}"]`)) {
            return; // Already selected
        }
        
        // Create a new selected item
        const selectedItem = document.createElement('div');
        selectedItem.className = 'purchase-rfq-selected-item';
        selectedItem.setAttribute('data-value', value);
        selectedItem.innerHTML = `
            <span class="purchase-rfq-selected-text">${text}</span>
            <button type="button" class="purchase-rfq-remove-btn" onclick="removeSelectedValue('${selectId}', '${value}')">
                <i class="fa-solid fa-times"></i>
            </button>
        `;
        
        displayContainer.appendChild(selectedItem);
    }
}

function removeSelectedValue(selectId, value) {
    const container = document.getElementById(`${selectId}Container`);
    if (container) {
        const item = container.querySelector(`[data-value="${value}"]`);
        if (item) {
            item.remove();
        }
    }
}

// RFQ Items Actions
function initRFQItemsActions() {
    // Handle Import from PR button
    const importPRBtn = document.querySelector('.purchase-rfq-import-pr-btn');
    if (importPRBtn) {
        importPRBtn.addEventListener('click', function() {
            showItemsAction('Import from PR', 'This will import items from existing Purchase Requests. Feature coming soon!');
        });
    }
    
    // Handle Add Item Manually button
    const addItemBtn = document.querySelector('.purchase-rfq-add-item-btn');
    if (addItemBtn) {
        addItemBtn.addEventListener('click', function() {
            showRFQItemForm();
        });
    }
}

function showItemsAction(action, message) {
    // Create or find the action display area
    let actionDisplay = document.getElementById('itemsActionDisplay');
    if (!actionDisplay) {
        const itemsSection = document.querySelector('.purchase-rfq-items-section');
        if (itemsSection) {
            actionDisplay = document.createElement('div');
            actionDisplay.id = 'itemsActionDisplay';
            actionDisplay.className = 'purchase-rfq-items-action-display';
            itemsSection.appendChild(actionDisplay);
        }
    }
    
    if (actionDisplay) {
        actionDisplay.innerHTML = `
            <div class="purchase-rfq-action-item">
                <span class="purchase-rfq-action-text">${action}: ${message}</span>
                <button type="button" class="purchase-rfq-action-close" onclick="closeItemsAction()">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
        `;
        actionDisplay.style.display = 'block';
    }
}

function closeItemsAction() {
    const actionDisplay = document.getElementById('itemsActionDisplay');
    if (actionDisplay) {
        actionDisplay.style.display = 'none';
    }
}

// PR Items Actions
function initPRItemsActions() {
    // Handle Add Item button for PR
    const addItemBtn = document.querySelector('#prItemsList').parentNode.querySelector('.purchase-rfq-add-item-btn');
    if (addItemBtn) {
        addItemBtn.addEventListener('click', function() {
            showPRItemForm();
        });
    }
}

function showPRItemsAction(action, message) {
    // Create or find the action display area
    let actionDisplay = document.getElementById('prItemsActionDisplay');
    if (!actionDisplay) {
        const itemsSection = document.querySelector('#prItemsList').parentNode;
        if (itemsSection) {
            actionDisplay = document.createElement('div');
            actionDisplay.id = 'prItemsActionDisplay';
            actionDisplay.className = 'purchase-rfq-items-action-display';
            itemsSection.appendChild(actionDisplay);
        }
    }
    
    if (actionDisplay) {
        actionDisplay.innerHTML = `
            <div class="purchase-rfq-action-item">
                <span class="purchase-rfq-action-text">${action}: ${message}</span>
                <button type="button" class="purchase-rfq-action-close" onclick="closePRItemsAction()">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
        `;
        actionDisplay.style.display = 'block';
    }
}

function closePRItemsAction() {
    const actionDisplay = document.getElementById('prItemsActionDisplay');
    if (actionDisplay) {
        actionDisplay.style.display = 'none';
    }
}

function showPRItemForm() {
    const itemForm = document.getElementById('prItemForm');
    if (itemForm) {
        itemForm.style.display = 'block';
        // Focus on first input
        const firstInput = itemForm.querySelector('textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closePRItemForm() {
    const itemForm = document.getElementById('prItemForm');
    if (itemForm) {
        itemForm.style.display = 'none';
        // Clear form
        itemForm.querySelector('#itemDescription').value = '';
        itemForm.querySelector('#itemQuantity').value = '';
        itemForm.querySelector('#itemUnit').selectedIndex = 0;
    }
}

function addPRItem() {
    // Just close the form - no actual item adding functionality
    closePRItemForm();
}

// RFQ Item Form Functions
function showRFQItemForm() {
    const itemForm = document.getElementById('rfqItemForm');
    if (itemForm) {
        itemForm.style.display = 'block';
        // Focus on first input
        const firstInput = itemForm.querySelector('textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeRFQItemForm() {
    const itemForm = document.getElementById('rfqItemForm');
    if (itemForm) {
        itemForm.style.display = 'none';
        // Clear form
        itemForm.querySelector('#rfqItemDescription').value = '';
        itemForm.querySelector('#rfqItemQuantity').value = '';
        itemForm.querySelector('#rfqItemUnit').selectedIndex = 0;
    }
}

function addRFQItem() {
    // Just close the form - no actual item adding functionality
    closeRFQItemForm();
}

// File Display Function
function displaySelectedFiles(input) {
    const filesList = document.getElementById('prFilesList');
    filesList.innerHTML = ''; // Clear existing files
    
    if (input.files && input.files.length > 0) {
        Array.from(input.files).forEach((file, index) => {
            const fileBox = document.createElement('div');
            fileBox.className = 'purchase-file-box';
            fileBox.innerHTML = `
                <div class="purchase-file-info">
                    <i class="purchase-file-icon fa-solid fa-file"></i>
                    <span class="purchase-file-name">${file.name}</span>
                </div>
                <div class="purchase-file-actions">
                    <div class="purchase-file-preview">
                        <i class="fa-solid fa-eye"></i>
                    </div>
                    <button type="button" class="purchase-file-remove" onclick="removeFile(${index})" title="Remove">
                        <i class="fa-solid fa-times"></i>
                    </button>
                </div>
            `;
            filesList.appendChild(fileBox);
        });
    }
}

function removeFile(index) {
    const input = document.getElementById('prAttachments');
    const dt = new DataTransfer();
    
    // Add all files except the one to be removed
    Array.from(input.files).forEach((file, i) => {
        if (i !== index) {
            dt.items.add(file);
        }
    });
    
    input.files = dt.files;
    displaySelectedFiles(input); // Refresh display
}



// Add Item Dropdown Functions
function toggleAddItemDropdown() {
    const dropdown = document.getElementById('addItemMenu');
    const button = document.querySelector('.purchase-add-item-btn');
    
    if (dropdown && button) {
        const isOpen = dropdown.classList.contains('show');
        
        if (isOpen) {
            closeAddItemDropdown();
        } else {
            openAddItemDropdown();
        }
    }
}

function openAddItemDropdown() {
    const dropdown = document.getElementById('addItemMenu');
    const button = document.querySelector('.purchase-add-item-btn');
    
    if (dropdown && button) {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

function closeAddItemDropdown() {
    const dropdown = document.getElementById('addItemMenu');
    const button = document.querySelector('.purchase-add-item-btn');
    
    if (dropdown && button) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
}

function selectExistingItem() {
    closeAddItemDropdown();
    alert('Random items: Office Chair, Laptop, Paper, Lamp, Printer Ink');
}

function createNewItem() {
    closeAddItemDropdown();
    const form = document.getElementById('createItemForm');
    if (form) {
        form.style.display = 'block';
    }
}

function closeCreateItemForm() {
    const form = document.getElementById('createItemForm');
    if (form) {
        form.style.display = 'none';
        // Clear form fields
        clearCreateItemForm();
    }
}

function clearCreateItemForm() {
    document.getElementById('itemName').value = '';
    document.getElementById('itemDescription').value = '';
    document.getElementById('itemCategory').value = '';
    document.getElementById('itemUnit').value = '';
    document.getElementById('itemUnitPrice').value = '';
}

function saveNewItem() {
    const name = document.getElementById('itemName').value;
    const description = document.getElementById('itemDescription').value;
    const category = document.getElementById('itemCategory').value;
    const unit = document.getElementById('itemUnit').value;
    const unitPrice = document.getElementById('itemUnitPrice').value;
    
    if (!name || !description || !category || !unit) {
        alert('Please fill in all required fields');
        return;
    }
    
    // TODO: Implement save functionality
    console.log('Saving new item:', { name, description, category, unit, unitPrice });
    alert('New item saved successfully!');
    
    closeCreateItemForm();
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('addItemMenu');
    const button = document.querySelector('.purchase-add-item-btn');
    
    if (dropdown && button && !button.contains(e.target) && !dropdown.contains(e.target)) {
        closeAddItemDropdown();
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeAddItemDropdown();
    }
});

// Export functions for external use
window.Purchase = {
    switchTab: switchPurchaseTab,
    init: initPurchaseTabs,
    createItem: createPurchaseItem,
    toggleAddItemDropdown: toggleAddItemDropdown,
    selectExistingItem: selectExistingItem,
    createNewItem: createNewItem,
    closeCreateItemForm: closeCreateItemForm,
    saveNewItem: saveNewItem
};
