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

// Make PR number, title, and description clickable
function initClickableRows() {
    const prNumbers = document.querySelectorAll('.purchase-list-pr-number');
    const prTitles = document.querySelectorAll('.purchase-list-title');
    const prDescriptions = document.querySelectorAll('.purchase-list-description');
    
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
    
    // Make PR descriptions clickable
    prDescriptions.forEach(prDescription => {
        prDescription.style.cursor = 'pointer';
        prDescription.style.color = '#9885d1';
        prDescription.addEventListener('click', function() {
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
            updateActionDropdownVisibility();
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
            
            updateActionDropdownVisibility();
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
                // Get the position of dragged row and target row
                const draggedIndex = Array.from(tbody.children).indexOf(draggedRow);
                const targetIndex = Array.from(tbody.children).indexOf(row);
                
                console.log('Dragged index:', draggedIndex, 'Target index:', targetIndex);
                
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
                console.log('Row moved');
            }
            
            // Remove drop target highlighting
            row.style.backgroundColor = '';
            row.style.borderTop = '';
        });
    });
}

// Action Dropdown Functionality
function toggleActionDropdown(tabType) {
    const dropdown = document.getElementById(`${tabType}ActionDropdown`);
    const menu = document.getElementById(`${tabType}ActionMenu`);
    const button = dropdown.querySelector('.purchase-action-dropdown-btn');
    
    if (dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
        button.classList.remove('active');
    } else {
        // Close other dropdowns first
        document.querySelectorAll('.purchase-action-dropdown').forEach(dd => {
            dd.classList.remove('active');
            dd.querySelector('.purchase-action-dropdown-btn').classList.remove('active');
        });
        
        dropdown.classList.add('active');
        button.classList.add('active');
    }
}


// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.purchase-action-dropdown')) {
        document.querySelectorAll('.purchase-action-dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
            dropdown.querySelector('.purchase-action-dropdown-btn').classList.remove('active');
        });
    }
});

// Show action dropdown when rows are selected
function updateActionDropdownVisibility() {
    const selectedCheckboxes = document.querySelectorAll('.purchase-checkbox-row:checked');
    const actionDropdowns = document.querySelectorAll('.purchase-action-dropdown');
    
    if (selectedCheckboxes.length > 0) {
        actionDropdowns.forEach(dropdown => {
            dropdown.style.display = 'inline-block';
        });
    } else {
        actionDropdowns.forEach(dropdown => {
            dropdown.style.display = 'none';
            dropdown.classList.remove('active');
            dropdown.querySelector('.purchase-action-dropdown-btn').classList.remove('active');
        });
    }
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

// Tab switching function
function switchTab(tabName) {
    // Remove active class from all tabs and panels
    document.querySelectorAll('.pr-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.pr-tab-panel').forEach(panel => panel.classList.remove('active'));
    
    // Add active class to selected tab and panel
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-panel`).classList.add('active');
}

// Export offcanvas functions globally
window.openPROffcanvas = openPROffcanvas;
window.closePROffcanvas = closePROffcanvas;

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

// PR Staging Functions
function approvePR() {
    // Update status
    const statusValue = document.querySelector('.pr-status-value');
    if (statusValue) {
        statusValue.textContent = 'Approved';
        statusValue.className = 'pr-status-value pr-status-approved';
    }
    
    // Update progress
    const progressFill = document.querySelector('.pr-progress-fill');
    const progressText = document.querySelector('.pr-progress-text');
    if (progressFill && progressText) {
        progressFill.style.width = '100%';
        progressText.textContent = '100% Complete';
    }
    
    // Disable buttons
    const approveBtn = document.querySelector('.pr-staging-approve');
    const rejectBtn = document.querySelector('.pr-staging-reject');
    if (approveBtn) {
        approveBtn.disabled = true;
        approveBtn.style.opacity = '0.5';
        approveBtn.style.cursor = 'not-allowed';
    }
    if (rejectBtn) {
        rejectBtn.disabled = true;
        rejectBtn.style.opacity = '0.5';
        rejectBtn.style.cursor = 'not-allowed';
    }
    
    console.log('PR Approved');
    alert('PR has been approved successfully!');
}

function rejectPR() {
    // Update status
    const statusValue = document.querySelector('.pr-status-value');
    if (statusValue) {
        statusValue.textContent = 'Rejected';
        statusValue.className = 'pr-status-value pr-status-rejected';
    }
    
    // Update progress
    const progressFill = document.querySelector('.pr-progress-fill');
    const progressText = document.querySelector('.pr-progress-text');
    if (progressFill && progressText) {
        progressFill.style.width = '0%';
        progressFill.style.background = '#ef4444';
        progressText.textContent = '0% Complete';
    }
    
    // Disable buttons
    const approveBtn = document.querySelector('.pr-staging-approve');
    const rejectBtn = document.querySelector('.pr-staging-reject');
    if (approveBtn) {
        approveBtn.disabled = true;
        approveBtn.style.opacity = '0.5';
        approveBtn.style.cursor = 'not-allowed';
    }
    if (rejectBtn) {
        rejectBtn.disabled = true;
        rejectBtn.style.opacity = '0.5';
        rejectBtn.style.cursor = 'not-allowed';
    }
    
    console.log('PR Rejected');
    alert('PR has been rejected.');
}

// Toggle PR Overview Section
function togglePROverview() {
    var overviewSection = document.querySelector('.pr-overview-section');
    overviewSection.classList.toggle('collapsed');
}

// Export staging functions globally
window.approvePR = approvePR;
window.rejectPR = rejectPR;
window.toggleOffcanvasWidth = toggleOffcanvasWidth;
window.togglePROverview = togglePROverview;

// Offcanvas Resize Function
function toggleOffcanvasWidth() {
    var offcanvas = document.querySelector('.purchase-offcanvas-content');
    var resizeBtn = document.querySelector('.purchase-offcanvas-resize-btn');
    var icon = resizeBtn.querySelector('.offcanvas-resize-icon');
    
    // Toggle the full width class
    offcanvas.classList.toggle('purchase-offcanvas-content-full');
    resizeBtn.classList.toggle('purchase-offcanvas-resize-btn-full');
    
    // Change arrow direction based on state
    if (offcanvas.classList.contains('purchase-offcanvas-content-full')) {
        // Expanded state - show right arrow
        icon.className = 'fa-solid fa-chevron-right offcanvas-resize-icon';
    } else {
        // Collapsed state - show left arrow
        icon.className = 'fa-solid fa-chevron-left offcanvas-resize-icon';
    }
}
