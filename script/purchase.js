// Purchase Tab Functionality - Sidebar Version
document.addEventListener('DOMContentLoaded', function() {
    initPurchaseTabs();
    
    // Note: Common table functionality is now auto-initialized by common-table.js
    // The auto-initialization will handle drag & drop, select all, column visibility, etc.
});

// Basic tab switching from sidebar
function initPurchaseTabs() {
    const tabPanels = document.querySelectorAll('.purchase-tab-panel');
    const sidebarLinks = document.querySelectorAll('.purchase-submenu-link');
    
    // Initialize first tab as active
    if (tabPanels.length > 0) {
        tabPanels.forEach(panel => panel.classList.remove('active'));
        tabPanels[0].classList.add('active');
    }
    
    // Set up sidebar link click handlers
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTab = this.getAttribute('data-tab');
            switchPurchaseTab(targetTab);
        });
    });
}

// Create form functionality
function createPurchaseItem(type) {
    if (type === 'pr') {
        // Open offcanvas and switch to create tab
        openPROffcanvas();
        switchTab('create');
        // Update header for create mode
        updateOffcanvasHeader('Create PR');
    } else {
        // For other types, use the old behavior
        switchPurchaseTab(type);
        openPurchaseForm(type);
    }
}


function switchPurchaseTab(tabName) {
    const tabPanels = document.querySelectorAll('.purchase-tab-panel');
    const sidebarLinks = document.querySelectorAll('.purchase-submenu-link');
    
    // Hide all panels
    tabPanels.forEach(panel => panel.classList.remove('active'));
    
    // Show target panel
    const targetPanel = document.querySelector(`.purchase-tab-panel[data-tab="${tabName}"]`);
    if (targetPanel) {
        targetPanel.classList.add('active');
    }
    
    // Update sidebar active state
    sidebarLinks.forEach(link => link.classList.remove('active'));
    const targetLink = document.querySelector(`.purchase-submenu-link[data-tab="${tabName}"]`);
    if (targetLink) {
        targetLink.classList.add('active');
    }
}

function openPurchaseForm(type) {
    const content = document.getElementById(`${type}Content`);
    const form = document.getElementById(`${type}Form`);
    
    if (content && form) {
        content.style.display = 'none';
        form.style.display = 'block';
        form.querySelector('form').reset();
    }
}

function closePurchaseForm(type) {
    const content = document.getElementById(`${type}Content`);
    const form = document.getElementById(`${type}Form`);
    
    if (content && form) {
        content.style.display = 'block';
        form.style.display = 'none';
        form.querySelector('form').reset();
    }
}

// Form submission
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('.purchase-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            const type = form.getAttribute('data-type');
            const data = Object.fromEntries(formData.entries());
            
            console.log('Form submitted:', data);
            alert(`${type.toUpperCase()} created successfully!`);
            closePurchaseForm(type);
        });
    });
});

// Vendor selection display
function addSelectedValue(selectId, value, text) {
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
        if (displayContainer.querySelector(`[data-value="${value}"]`)) {
            return; // Already selected
        }
        
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

// Initialize vendor selection
function initRFQVendorSelection() {
    const vendorCategorySelect = document.getElementById('rfqVendorCategories');
    if (vendorCategorySelect) {
        vendorCategorySelect.addEventListener('change', function() {
            if (this.value) {
                addSelectedValue('rfqVendorCategories', this.value, this.options[this.selectedIndex].text);
                this.selectedIndex = 0;
            }
        });
    }
    
    const vendorSelect = document.getElementById('rfqVendors');
    if (vendorSelect) {
        vendorSelect.addEventListener('change', function() {
            if (this.value) {
                addSelectedValue('rfqVendors', this.value, this.options[this.selectedIndex].text);
                this.selectedIndex = 0;
            }
        });
    }
}

// File display
function displaySelectedFiles(input) {
    const filesList = document.getElementById('prFilesList');
    filesList.innerHTML = '';
    
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
    
    Array.from(input.files).forEach((file, i) => {
        if (i !== index) {
            dt.items.add(file);
        }
    });
    
    input.files = dt.files;
    displaySelectedFiles(input);
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


// Note: initClickableRows and initSelectAll are now handled by common-table.js

// Note: initDragReorder is now handled by common-table.js

// Note: Action dropdown functionality is now handled by common-table.js
// Keeping purchase-specific toggleActionDropdown for backward compatibility
function toggleActionDropdown(tabType) {
    const dropdown = document.getElementById(`${tabType}ActionDropdown`);
    if (dropdown) {
        CommonTable.toggleActionDropdown(dropdown.id);
    }
}

// Purchase-specific action dropdown visibility update
function updateActionDropdownVisibility() {
    CommonTable.updateActionDropdownVisibility('.data-checkbox-row:checked', '.data-action-dropdown');
}


// Export functions
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

// Delete Modal Functions (Design Only)
function deleteSelectedPRs() {
    // Update the count in the modal
    document.querySelector('.purchase-delete-count').textContent = '3';
    
    // Show the modal
    document.getElementById('deleteModal').style.display = 'flex';
}

function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
}

function confirmDelete() {
    // Close the modal
    closeDeleteModal();
    
    // Backend team will implement actual deletion logic here
    console.log('Delete confirmed - Backend team to implement');
}


// Purchase Form Tabs Functions
function switchPurchaseFormTab(tabName, event) {
    // Prevent form submission
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // Remove active class from all tab buttons and panels
    document.querySelectorAll('.purchase-tab-nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.purchase-tab-panel-content').forEach(panel => panel.classList.remove('active'));
    
    // Add active class to selected tab button
    const activeButton = document.querySelector(`.purchase-tab-nav-btn[data-tab="${tabName}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Add active class to selected tab panel
    const activePanel = document.getElementById(`${tabName}Tab`);
    if (activePanel) {
        activePanel.classList.add('active');
    }
}

// Links Management Functions
function addLink() {
    const linkInput = document.getElementById('prLinkInput');
    const linksList = document.getElementById('prLinksList');
    
    if (!linkInput || !linksList) return;
    
    const url = linkInput.value.trim();
    if (!url) {
        alert('Please enter a valid URL');
        return;
    }
    
    // Basic URL validation
    try {
        new URL(url);
    } catch (e) {
        alert('Please enter a valid URL');
        return;
    }
    
    // Check if link already exists
    const existingLinks = linksList.querySelectorAll('.purchase-link-url');
    for (let link of existingLinks) {
        if (link.href === url) {
            alert('This link has already been added');
            return;
        }
    }
    
    // Create link item
    const linkItem = document.createElement('div');
    linkItem.className = 'purchase-link-item';
    linkItem.innerHTML = `
        <div class="purchase-link-info">
            <i class="purchase-link-icon fa-solid fa-link"></i>
            <a href="${url}" target="_blank" class="purchase-link-url">${url}</a>
        </div>
        <button type="button" class="purchase-link-remove" onclick="removeLink(this)" title="Remove Link">
            <i class="fa-solid fa-times"></i>
        </button>
    `;
    
    linksList.appendChild(linkItem);
    linkInput.value = '';
}

function removeLink(button) {
    const linkItem = button.closest('.purchase-link-item');
    if (linkItem) {
        linkItem.remove();
    }
}

// Initialize form tabs when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tabs
    const firstTab = document.querySelector('.purchase-tab-nav-btn');
    if (firstTab) {
        firstTab.classList.add('active');
    }
    
    const firstPanel = document.querySelector('.purchase-tab-panel-content');
    if (firstPanel) {
        firstPanel.classList.add('active');
    }
});

// Export tab functions globally
window.switchPurchaseFormTab = switchPurchaseFormTab;
window.addLink = addLink;
window.removeLink = removeLink;



// Note: View toggle functionality is now handled by common-table.js

// Note: Column visibility functionality is now handled by common-table.js
// Keeping purchase-specific functions for backward compatibility
function toggleColumnDropdown() {
    CommonTable.toggleColumnDropdown('columnDropdown');
}

function openColumnDropdown() {
    CommonTable.openColumnDropdown('columnDropdown');
}

function closeColumnDropdown() {
    CommonTable.closeColumnDropdown('columnDropdown');
}

function saveColumnVisibility() {
    CommonTable.saveColumnVisibility('columnDropdown');
}

function initColumnVisibility() {
    CommonTable.initColumnVisibility('columnDropdown', '.data-columns-btn-icon');
}

function setDefaultColumnVisibility() {
    CommonTable.setDefaultColumnVisibility(['col-delivery-location']);
}

function ensureFixedColumnsVisible() {
    CommonTable.ensureFixedColumnsVisible(['col-pr-number', 'col-status', 'col-created-by', 'col-requested-by', 'col-priority']);
}


// Toggle PR Overview Section
function togglePROverview() {
    var overviewSection = document.querySelector('.pr-overview-section');
    overviewSection.classList.toggle('collapsed');
}

// Toggle PR Items Section
function togglePRItems() {
    var itemsSection = document.querySelector('.pr-items-section');
    itemsSection.classList.toggle('collapsed');
}

// Toggle PR Description Section
function togglePRDescription() {
    var descriptionSection = document.querySelector('#prDescriptionContent').closest('.pr-description-section');
    descriptionSection.classList.toggle('collapsed');
}

// Toggle PR Justification Section
function togglePRJustification() {
    var justificationSection = document.querySelector('#prJustificationContent').closest('.pr-description-section');
    justificationSection.classList.toggle('collapsed');
}

// Toggle PR Notes Section
function togglePRNotes() {
    var notesSection = document.querySelector('#prNotesContent').closest('.pr-description-section');
    notesSection.classList.toggle('collapsed');
}

// Initialize drag and drop for PR items table
function initializePRItemsDragDrop() {
    const tbody = document.querySelector('.pr-items-table tbody');
    if (!tbody) return;
    
    let draggedRow = null;
    
    // Add drag handles to each row
    const rows = tbody.querySelectorAll('tr');
    console.log('Found PR items rows:', rows.length);
    
    rows.forEach((row, index) => {
        // Make the entire row draggable
        row.draggable = true;
        row.style.cursor = 'grab';
        
        // Drag events on the row
        row.addEventListener('dragstart', function(e) {
            console.log('PR Items drag started');
            draggedRow = row;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', row.outerHTML);
            
            // Visual feedback
            row.style.opacity = '0.5';
            row.style.transform = 'rotate(2deg)';
            row.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
        });
        
        row.addEventListener('dragend', function(e) {
            console.log('PR Items drag ended');
            // Reset visual effects
            row.style.opacity = '1';
            row.style.transform = 'none';
            row.style.boxShadow = 'none';
            
            // Reset all rows
            tbody.querySelectorAll('tr').forEach(r => {
                r.style.backgroundColor = '';
                r.style.borderTop = '';
            });
            
            draggedRow = null;
        });
        
        row.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            // Highlight drop target
            if (draggedRow && draggedRow !== row) {
                row.style.backgroundColor = '#e0f2fe';
                row.style.borderTop = '3px solid #9885d1';
            }
        });
        
        row.addEventListener('dragleave', function(e) {
            // Remove drop target highlighting
            row.style.backgroundColor = '';
            row.style.borderTop = '';
        });
        
        row.addEventListener('drop', function(e) {
            e.preventDefault();
            console.log('PR Items drop event');
            
            if (draggedRow && draggedRow !== row) {
                // Get the position of dragged row and target row
                const draggedIndex = Array.from(tbody.children).indexOf(draggedRow);
                const targetIndex = Array.from(tbody.children).indexOf(row);
                
                console.log('PR Items dragged index:', draggedIndex, 'Target index:', targetIndex);
                
                // Determine the correct insertion point
                if (draggedIndex < targetIndex) {
                    // Dragging down: insert after the target row
                    if (row.nextSibling) {
                        tbody.insertBefore(draggedRow, row.nextSibling);
                    } else {
                        tbody.appendChild(draggedRow);
                    }
                } else {
                    // Dragging up: insert before the target row
                    tbody.insertBefore(draggedRow, row);
                }
                console.log('PR Items row moved');
            }
            
            // Remove drop target highlighting
            row.style.backgroundColor = '';
            row.style.borderTop = '';
        });
    });
}



// Toggle PR Overview Section
function togglePROverview() {
    var overviewSection = document.querySelector('.pr-overview-section');
    overviewSection.classList.toggle('collapsed');
}

// Toggle PR Items Section
function togglePRItems() {
    var itemsSection = document.querySelector('.pr-items-section');
    itemsSection.classList.toggle('collapsed');
}

// Toggle PR Description Section
function togglePRDescription() {
    var descriptionSection = document.querySelector('#prDescriptionContent').closest('.pr-description-section');
    descriptionSection.classList.toggle('collapsed');
}

// Toggle PR Justification Section
function togglePRJustification() {
    var justificationSection = document.querySelector('#prJustificationContent').closest('.pr-description-section');
    justificationSection.classList.toggle('collapsed');
}

// Toggle PR Notes Section
function togglePRNotes() {
    var notesSection = document.querySelector('#prNotesContent').closest('.pr-description-section');
    notesSection.classList.toggle('collapsed');
}

// Initialize drag and drop for PR items table
function initializePRItemsDragDrop() {
    const tbody = document.querySelector('.pr-items-table tbody');
    if (!tbody) return;
    
    let draggedRow = null;
    
    // Add drag handles to each row
    const rows = tbody.querySelectorAll('tr');
    console.log('Found PR items rows:', rows.length);
    
    rows.forEach((row, index) => {
        // Make the entire row draggable
        row.draggable = true;
        row.style.cursor = 'grab';
        
        // Drag events on the row
        row.addEventListener('dragstart', function(e) {
            console.log('PR Items drag started');
            draggedRow = row;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', row.outerHTML);
            
            // Visual feedback
            row.style.opacity = '0.5';
            row.style.transform = 'rotate(2deg)';
            row.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
        });
        
        row.addEventListener('dragend', function(e) {
            console.log('PR Items drag ended');
            // Reset visual effects
            row.style.opacity = '1';
            row.style.transform = 'none';
            row.style.boxShadow = 'none';
            
            // Reset all rows
            tbody.querySelectorAll('tr').forEach(r => {
                r.style.backgroundColor = '';
                r.style.borderTop = '';
            });
            
            draggedRow = null;
        });
        
        row.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            // Highlight drop target
            if (draggedRow && draggedRow !== row) {
                row.style.backgroundColor = '#e0f2fe';
                row.style.borderTop = '3px solid #9885d1';
            }
        });
        
        row.addEventListener('dragleave', function(e) {
            // Remove drop target highlighting
            row.style.backgroundColor = '';
            row.style.borderTop = '';
        });
        
        row.addEventListener('drop', function(e) {
            e.preventDefault();
            console.log('PR Items drop event');
            
            if (draggedRow && draggedRow !== row) {
                // Get the position of dragged row and target row
                const draggedIndex = Array.from(tbody.children).indexOf(draggedRow);
                const targetIndex = Array.from(tbody.children).indexOf(row);
                
                console.log('PR Items dragged index:', draggedIndex, 'Target index:', targetIndex);
                
                // Determine the correct insertion point
                if (draggedIndex < targetIndex) {
                    // Dragging down: insert after the target row
                    if (row.nextSibling) {
                        tbody.insertBefore(draggedRow, row.nextSibling);
                    } else {
                        tbody.appendChild(draggedRow);
                    }
                } else {
                    // Dragging up: insert before the target row
                    tbody.insertBefore(draggedRow, row);
                }
                console.log('PR Items row moved');
            }
            
            // Remove drop target highlighting
            row.style.backgroundColor = '';
            row.style.borderTop = '';
        });
    });
}

// Initialize offcanvas functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePRItemsDragDrop();
});

// Export PR-specific functions globally
window.openPROffcanvas = openPROffcanvas;
window.closePROffcanvas = closePROffcanvas;
window.switchTab = switchTab;
window.toggleOffcanvasWidth = toggleOffcanvasWidth;
window.togglePROverview = togglePROverview;
window.togglePRItems = togglePRItems;
window.togglePRDescription = togglePRDescription;
window.togglePRJustification = togglePRJustification;
window.togglePRNotes = togglePRNotes;
window.initializePRItemsDragDrop = initializePRItemsDragDrop;


// Initialize offcanvas functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePRItemsDragDrop();
});

// Export PR-specific functions globally
window.openPROffcanvas = openPROffcanvas;
window.closePROffcanvas = closePROffcanvas;
window.switchTab = switchTab;
window.togglePROffcanvasWidth = togglePROffcanvasWidth;
window.approvePR = approvePR;
window.rejectPR = rejectPR;
window.togglePROverview = togglePROverview;
window.togglePRItems = togglePRItems;
window.togglePRDescription = togglePRDescription;
window.togglePRJustification = togglePRJustification;
window.togglePRNotes = togglePRNotes;
window.initializePRItemsDragDrop = initializePRItemsDragDrop;
