// Purchase Tab Functionality - Sidebar Version
document.addEventListener('DOMContentLoaded', function() {
    initPurchaseTabs();
    initSelectAll();
    initDragReorder();
    initClickableRows();
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
    switchPurchaseTab(type);
    openPurchaseForm(type);
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

// PR Offcanvas Functions
function openPROffcanvas() {
    const offcanvas = document.getElementById('prOffcanvas');
    offcanvas.style.display = 'block';
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

// Make PR number and title clickable
function initClickableRows() {
    const prNumbers = document.querySelectorAll('.purchase-list-pr-number');
    const prTitles = document.querySelectorAll('.purchase-list-title');
    
    // Make PR numbers clickable
    prNumbers.forEach(prNumber => {
        prNumber.style.cursor = 'pointer';
        prNumber.style.color = '#9885d1';
        prNumber.addEventListener('click', function() {
            openPROffcanvas();
        });
    });
    
    // Make PR titles clickable
    prTitles.forEach(prTitle => {
        prTitle.style.cursor = 'pointer';
        prTitle.addEventListener('click', function() {
            openPROffcanvas();
        });
    });
}

// Select All Functionality
function initSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAllPRs');
    const rowCheckboxes = document.querySelectorAll('.purchase-checkbox-row');
    
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            rowCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
    
    // Update select all when individual checkboxes change
    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const allChecked = Array.from(rowCheckboxes).every(cb => cb.checked);
            const someChecked = Array.from(rowCheckboxes).some(cb => cb.checked);
            
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = allChecked;
                selectAllCheckbox.indeterminate = someChecked && !allChecked;
            }
        });
    });
}

// Drag Up/Down Functionality
function initDragReorder() {
    const tbody = document.querySelector('.purchase-list-table tbody');
    if (!tbody) {
        console.log('Table body not found');
        return;
    }
    
    let draggedRow = null;
    
    // Add drag handles to each row
    const rows = tbody.querySelectorAll('tr');
    console.log('Found rows:', rows.length);
    
    rows.forEach((row, index) => {
        // Add drag handle cell
        const dragCell = document.createElement('td');
        dragCell.className = 'purchase-drag-handle';
        dragCell.innerHTML = '<i class="fa-solid fa-grip-vertical"></i>';
        dragCell.draggable = true;
        dragCell.style.cursor = 'grab';
        
        // Insert drag handle as second cell (after checkbox)
        const checkboxCell = row.querySelector('.purchase-list-checkbox');
        if (checkboxCell) {
            row.insertBefore(dragCell, checkboxCell.nextSibling);
        } else {
            row.insertBefore(dragCell, row.firstChild);
        }
        
        // Make the entire row draggable
        row.draggable = true;
        row.style.cursor = 'grab';
        
        // Drag events on the row
        row.addEventListener('dragstart', function(e) {
            console.log('Drag started');
            draggedRow = row;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', row.outerHTML);
            
            // Visual feedback
            row.style.opacity = '0.5';
            row.style.transform = 'rotate(1deg)';
            row.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
            row.style.border = '2px dashed #9885d1';
            row.style.backgroundColor = '#f8f7ff';
        });
        
        row.addEventListener('dragend', function(e) {
            console.log('Drag ended');
            // Reset visual effects
            row.style.opacity = '1';
            row.style.transform = 'none';
            row.style.boxShadow = 'none';
            row.style.border = 'none';
            row.style.backgroundColor = '';
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
            console.log('Drop event');
            
            if (draggedRow && draggedRow !== row) {
                // Check if we're dropping on the last row
                const isLastRow = row === tbody.lastElementChild;
                
                if (isLastRow) {
                    // If dropping on last row, append after it
                    tbody.appendChild(draggedRow);
                } else {
                    // Otherwise, insert before the target row
                    tbody.insertBefore(draggedRow, row);
                }
                console.log('Row moved');
            }
            
            // Remove drop target highlighting
            row.style.backgroundColor = '';
            row.style.borderTop = '';
        });
    });
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

// Export offcanvas functions globally
window.openPROffcanvas = openPROffcanvas;
window.closePROffcanvas = closePROffcanvas;