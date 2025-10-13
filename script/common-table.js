// Common Table Components - Reusable JavaScript Functions
// This file contains all reusable table functionality that can be used across different modules

// ============================================================================
// SELECT ALL FUNCTIONALITY
// ============================================================================

/**
 * Initialize select all functionality for any table
 * @param {string} selectAllId - ID of the select all checkbox
 * @param {string} rowCheckboxSelector - CSS selector for row checkboxes
 * @param {function} onSelectionChange - Callback function when selection changes
 */
function initSelectAll(selectAllId = 'selectAll', rowCheckboxSelector = '.data-checkbox-row', onSelectionChange = null) {
    const selectAllCheckbox = document.getElementById(selectAllId);
    const rowCheckboxes = document.querySelectorAll(rowCheckboxSelector);
    
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            rowCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            if (onSelectionChange) onSelectionChange();
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
            
            if (onSelectionChange) onSelectionChange();
        });
    });
}

// ============================================================================
// DRAG & DROP REORDERING
// ============================================================================

/**
 * Initialize drag and drop reordering for any table
 * @param {string} tableSelector - CSS selector for the table tbody
 * @param {function} onReorder - Callback function when rows are reordered
 */
function initDragReorder(tableSelector = '.data-table tbody', onReorder = null) {
    const tbody = document.querySelector(tableSelector);
    if (!tbody) {
        return;
    }
    
    // Check if this table is already initialized
    const existingDragHandles = tbody.querySelectorAll('.data-drag-handle');
    if (existingDragHandles.length > 0) {
        return;
    }
    
    let draggedRow = null;
    
    // Add drag handles to each row
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach((row, index) => {
        // Add drag handle cell if it doesn't exist
        let dragCell = row.querySelector('.data-drag-handle');
        if (!dragCell) {
            dragCell = document.createElement('td');
            dragCell.className = 'data-drag-handle';
            dragCell.innerHTML = '<i class="fa fa-bars"></i>';
            dragCell.draggable = true;
            dragCell.style.cursor = 'grab';
            
            // Insert drag handle as second cell (after checkbox)
            const checkboxCell = row.querySelector('.data-checkbox-row').closest('td');
            if (checkboxCell) {
                row.insertBefore(dragCell, checkboxCell.nextSibling);
            } else {
                row.insertBefore(dragCell, row.firstChild);
            }
        }
        
        // Make the entire row draggable
        row.draggable = true;
        row.style.cursor = 'grab';
        
        // Drag events on the row
        row.addEventListener('dragstart', function(e) {
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
            
            if (draggedRow && draggedRow !== row) {
                // Get the position of dragged row and target row
                const draggedIndex = Array.from(tbody.children).indexOf(draggedRow);
                const targetIndex = Array.from(tbody.children).indexOf(row);
                
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
                
                // Call callback if provided
                if (onReorder) onReorder(draggedRow, targetIndex);
            }
            
            // Remove drop target highlighting
            row.style.backgroundColor = '';
            row.style.borderTop = '';
        });
    });
}

// ============================================================================
// VIEW TOGGLE FUNCTIONALITY
// ============================================================================

/**
 * Initialize view toggle functionality (List/Card views)
 * @param {string} listViewId - ID of the list view container
 * @param {string} cardViewId - ID of the card view container
 * @param {string} listBtnSelector - CSS selector for list view button
 * @param {string} cardBtnSelector - CSS selector for card view button
 */
function initViewToggle(listViewId = 'listView', cardViewId = 'cardView', 
                       listBtnSelector = '.data-view-btn[title="List View"]', 
                       cardBtnSelector = '.data-view-btn[title="Card View"]') {
    const listViewBtn = document.querySelector(listBtnSelector);
    const cardViewBtn = document.querySelector(cardBtnSelector);
    const listView = document.getElementById(listViewId);
    const cardView = document.getElementById(cardViewId);
    
    if (listViewBtn && cardViewBtn && listView && cardView) {
        listViewBtn.addEventListener('click', function() {
            showListView(listViewId, cardViewId, listBtnSelector, cardBtnSelector);
        });
        
        cardViewBtn.addEventListener('click', function() {
            showCardView(listViewId, cardViewId, listBtnSelector, cardBtnSelector);
        });
    }
}

/**
 * Show list view
 */
function showListView(listViewId = 'listView', cardViewId = 'cardView', 
                     listBtnSelector = '.data-view-btn[title="List View"]', 
                     cardBtnSelector = '.data-view-btn[title="Card View"]') {
    const listView = document.getElementById(listViewId);
    const cardView = document.getElementById(cardViewId);
    const listViewBtn = document.querySelector(listBtnSelector);
    const cardViewBtn = document.querySelector(cardBtnSelector);
    
    if (listView && cardView && listViewBtn && cardViewBtn) {
        listView.style.display = 'block';
        cardView.style.display = 'none';
        
        listViewBtn.classList.add('data-view-btn-active');
        cardViewBtn.classList.remove('data-view-btn-active');
    }
}

/**
 * Show card view
 */
function showCardView(listViewId = 'listView', cardViewId = 'cardView', 
                     listBtnSelector = '.data-view-btn[title="List View"]', 
                     cardBtnSelector = '.data-view-btn[title="Card View"]') {
    const listView = document.getElementById(listViewId);
    const cardView = document.getElementById(cardViewId);
    const listViewBtn = document.querySelector(listBtnSelector);
    const cardViewBtn = document.querySelector(cardBtnSelector);
    
    if (listView && cardView && listViewBtn && cardViewBtn) {
        listView.style.display = 'none';
        cardView.style.display = 'block';
        
        listViewBtn.classList.remove('data-view-btn-active');
        cardViewBtn.classList.add('data-view-btn-active');
    }
}

// ============================================================================
// ACTION DROPDOWN FUNCTIONALITY
// ============================================================================

/**
 * Initialize action dropdown functionality
 * @param {string} dropdownSelector - CSS selector for action dropdowns
 * @param {string} buttonSelector - CSS selector for dropdown buttons
 * @param {function} onSelectionChange - Callback when selection changes
 */
function initActionDropdowns(dropdownSelector = '.data-action-dropdown', 
                           buttonSelector = '.data-action-dropdown-btn',
                           onSelectionChange = null) {
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest(dropdownSelector)) {
            document.querySelectorAll(dropdownSelector).forEach(dropdown => {
                dropdown.classList.remove('active');
                const button = dropdown.querySelector(buttonSelector);
                if (button) button.classList.remove('active');
            });
        }
    });
    
    // Show/hide action dropdowns based on selection
    if (onSelectionChange) {
        onSelectionChange();
    }
}

/**
 * Toggle action dropdown
 * @param {string} dropdownId - ID of the dropdown to toggle
 * @param {string} buttonSelector - CSS selector for the button
 */
function toggleActionDropdown(dropdownId, buttonSelector = '.data-action-dropdown-btn') {
    const dropdown = document.getElementById(dropdownId);
    const button = dropdown.querySelector(buttonSelector);
    
    if (dropdown.classList.contains('active')) {
        dropdown.classList.remove('active');
        button.classList.remove('active');
    } else {
        // Close other dropdowns first
        document.querySelectorAll('.data-action-dropdown').forEach(dd => {
            dd.classList.remove('active');
            const btn = dd.querySelector(buttonSelector);
            if (btn) btn.classList.remove('active');
        });
        
        dropdown.classList.add('active');
        button.classList.add('active');
    }
}

/**
 * Update action dropdown visibility based on selected items
 * @param {string} checkboxSelector - CSS selector for checkboxes
 * @param {string} dropdownSelector - CSS selector for action dropdowns
 */
function updateActionDropdownVisibility(checkboxSelector = '.data-checkbox-row:checked', 
                                     dropdownSelector = '.data-action-dropdown') {
    const selectedCheckboxes = document.querySelectorAll(checkboxSelector);
    const actionDropdowns = document.querySelectorAll(dropdownSelector);
    
    if (selectedCheckboxes.length > 0) {
        actionDropdowns.forEach(dropdown => {
            dropdown.style.display = 'inline-block';
        });
    } else {
        actionDropdowns.forEach(dropdown => {
            dropdown.style.display = 'none';
            dropdown.classList.remove('active');
            const button = dropdown.querySelector('.data-action-dropdown-btn');
            if (button) button.classList.remove('active');
        });
    }
}

// ============================================================================
// COLUMN VISIBILITY FUNCTIONALITY
// ============================================================================

/**
 * Initialize column visibility functionality
 * @param {string} dropdownId - ID of the column dropdown
 * @param {string} buttonSelector - CSS selector for the column button
 * @param {Array} hiddenByDefault - Array of column classes to hide by default
 * @param {Array} fixedColumns - Array of column classes that should always be visible
 */
function initColumnVisibility(dropdownId = 'columnDropdown', 
                            buttonSelector = '.data-columns-btn-icon',
                            hiddenByDefault = ['col-delivery-location'],
                            fixedColumns = ['col-pr-number', 'col-status', 'col-created-by', 'col-requested-by', 'col-priority']) {
    
    // Set default column visibility
    setDefaultColumnVisibility(hiddenByDefault);
    
    // Ensure fixed columns are always visible
    ensureFixedColumnsVisible(fixedColumns);
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const dropdown = document.getElementById(dropdownId);
        const button = document.querySelector(buttonSelector);
        
        if (dropdown && button && !button.contains(e.target) && !dropdown.contains(e.target)) {
            closeColumnDropdown(dropdownId, buttonSelector);
        }
    });
    
    // Close dropdown on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeColumnDropdown(dropdownId, buttonSelector);
        }
    });
    
    // Reposition dropdown on window resize
    window.addEventListener('resize', function() {
        const dropdown = document.getElementById(dropdownId);
        if (dropdown && dropdown.classList.contains('show')) {
            // Close and reopen to recalculate position
            closeColumnDropdown(dropdownId, buttonSelector);
            setTimeout(() => {
                openColumnDropdown(dropdownId, buttonSelector);
            }, 10);
        }
    });
}

/**
 * Toggle column dropdown
 */
function toggleColumnDropdown(dropdownId = 'columnDropdown', buttonSelector = '.data-columns-btn-icon') {
    const dropdown = document.getElementById(dropdownId);
    const button = document.querySelector(buttonSelector);
    
    if (dropdown && button) {
        const isOpen = dropdown.classList.contains('show');
        
        if (isOpen) {
            closeColumnDropdown(dropdownId, buttonSelector);
        } else {
            openColumnDropdown(dropdownId, buttonSelector);
        }
    }
}

/**
 * Open column dropdown
 */
function openColumnDropdown(dropdownId = 'columnDropdown', buttonSelector = '.data-columns-btn-icon') {
    const dropdown = document.getElementById(dropdownId);
    const button = document.querySelector(buttonSelector);
    
    if (dropdown && button) {
        // Close other dropdowns first
        document.querySelectorAll('.data-columns-dropdown-content.show').forEach(dd => {
            dd.classList.remove('show');
        });
        
        // Position dropdown relative to button
        const buttonRect = button.getBoundingClientRect();
        const dropdownWidth = 500; // min-width from CSS
        
        // Position dropdown below and aligned to the right of the button
        dropdown.style.top = (buttonRect.bottom + 8) + 'px';
        dropdown.style.left = (buttonRect.right - dropdownWidth) + 'px';
        
        dropdown.classList.add('show');
        button.classList.add('active');
        
        // Sync checkbox state with column visibility
        const checkboxes = document.querySelectorAll(`#${dropdownId} input[type="checkbox"]`);
        checkboxes.forEach(cb => {
            const columnClass = cb.value;
            const columnElements = document.querySelectorAll(`.${columnClass}`);
            
            // Skip fixed columns - they should always be checked and disabled
            if (cb.hasAttribute('data-fixed')) {
                cb.checked = true;
                cb.disabled = true;
                return;
            }
            
            if (columnElements.length > 0) {
                // Check if any column element is visible (not hidden)
                const isVisible = !columnElements[0].classList.contains('hidden');
                cb.checked = isVisible;
            }
        });
    }
}

/**
 * Close column dropdown
 */
function closeColumnDropdown(dropdownId = 'columnDropdown', buttonSelector = '.data-columns-btn-icon') {
    const dropdown = document.getElementById(dropdownId);
    const button = document.querySelector(buttonSelector);
    
    if (dropdown && button) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
}

/**
 * Save column visibility settings
 */
function saveColumnVisibility(dropdownId = 'columnDropdown') {
    const checkboxes = document.querySelectorAll(`#${dropdownId} input[type="checkbox"]`);
    
    checkboxes.forEach(cb => {
        // Skip fixed columns - they should always remain visible
        if (cb.hasAttribute('data-fixed')) {
            return;
        }
        
        const columnClass = cb.value;
        const columnElements = document.querySelectorAll(`.${columnClass}`);
        
        if (cb.checked) {
            // Show columns
            columnElements.forEach(element => element.classList.remove('hidden'));
        } else {
            // Hide columns
            columnElements.forEach(element => element.classList.add('hidden'));
        }
    });
    
    closeColumnDropdown(dropdownId);
}

/**
 * Set default column visibility
 */
function setDefaultColumnVisibility(hiddenByDefault = ['col-delivery-location']) {
    // Apply hidden class to all elements with these column classes
    hiddenByDefault.forEach(columnClass => {
        const columnElements = document.querySelectorAll(`.${columnClass}`);
        columnElements.forEach(element => element.classList.add('hidden'));
    });
}

/**
 * Ensure fixed columns are always visible
 */
function ensureFixedColumnsVisible(fixedColumns = ['col-pr-number', 'col-status', 'col-created-by', 'col-requested-by', 'col-priority']) {
    fixedColumns.forEach(columnClass => {
        const columnElements = document.querySelectorAll(`.${columnClass}`);
        columnElements.forEach(element => element.classList.remove('hidden'));
    });
}

// ============================================================================
// CLICKABLE ROWS FUNCTIONALITY
// ============================================================================

/**
 * Initialize clickable rows functionality
 * @param {string} clickableSelector - CSS selector for clickable elements
 * @param {function} onClickCallback - Callback function when element is clicked
 */
function initClickableRows(clickableSelector = '.purchase-list-pr-number, .purchase-card-pr-number', 
                          onClickCallback = null) {
    const clickableElements = document.querySelectorAll(clickableSelector);

    clickableElements.forEach(element => {
        element.style.cursor = 'pointer';
        element.style.color = '#9885d1';
        element.addEventListener('click', function() {
            if (onClickCallback) {
                onClickCallback(element);
            }
        });
    });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Initialize all common table functionality at once
 * @param {Object} options - Configuration options
 */
function initCommonTable(options = {}) {
    const config = {
        // Select All
        selectAllId: options.selectAllId || 'selectAll',
        rowCheckboxSelector: options.rowCheckboxSelector || '.data-checkbox-row',
        
        // Drag & Drop
        tableSelector: options.tableSelector || '.data-table tbody',
        
        // View Toggle
        listViewId: options.listViewId || 'listView',
        cardViewId: options.cardViewId || 'cardView',
        listBtnSelector: options.listBtnSelector || '.data-view-btn[title="List View"]',
        cardBtnSelector: options.cardBtnSelector || '.data-view-btn[title="Card View"]',
        
        // Action Dropdowns
        dropdownSelector: options.dropdownSelector || '.data-action-dropdown',
        buttonSelector: options.buttonSelector || '.data-action-dropdown-btn',
        
        // Column Visibility
        columnDropdownId: options.columnDropdownId || 'columnDropdown',
        columnButtonSelector: options.columnButtonSelector || '.data-columns-btn-icon',
        hiddenByDefault: options.hiddenByDefault || ['col-delivery-location'],
        fixedColumns: options.fixedColumns || ['col-pr-number', 'col-status', 'col-created-by', 'col-requested-by', 'col-priority'],
        
        // Clickable Rows
        clickableSelector: options.clickableSelector || '.purchase-list-pr-number, .purchase-card-pr-number',
        
        // Search
        searchInputSelector: options.searchInputSelector || '.data-search-input',
        searchTargetSelector: options.searchTargetSelector || '.data-table tbody tr, .data-card',
        
        // Callbacks
        onSelectionChange: options.onSelectionChange || null,
        onReorder: options.onReorder || null,
        onClickCallback: options.onClickCallback || null,
        onSearch: options.onSearch || null
    };
    
    // Initialize all components
    initSelectAll(config.selectAllId, config.rowCheckboxSelector, config.onSelectionChange);
    initDragReorder(config.tableSelector, config.onReorder);
    initViewToggle(config.listViewId, config.cardViewId, config.listBtnSelector, config.cardBtnSelector);
    initActionDropdowns(config.dropdownSelector, config.buttonSelector, () => {
        updateActionDropdownVisibility(config.rowCheckboxSelector + ':checked', config.dropdownSelector);
    });
    initColumnVisibility(config.columnDropdownId, config.columnButtonSelector, config.hiddenByDefault, config.fixedColumns);
    initClickableRows(config.clickableSelector, config.onClickCallback);
    initResizableColumns('.data-table');
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

// Auto-initialize common tables when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit to allow manual initialization to run first
    setTimeout(() => {
        const commonTables = document.querySelectorAll('.data-table');
        
        if (commonTables.length > 0) {
            
            // Initialize each table found
            commonTables.forEach((table, index) => {
                const tbody = table.querySelector('tbody');
                if (tbody) {
                    // Check if this table has already been initialized
                    const existingDragHandles = tbody.querySelectorAll('.data-drag-handle');
                    const hasDragHandles = existingDragHandles.length > 0;
                    
                    // Initialize drag and drop (will add handles if they don't exist)
                    initDragReorder(`.data-table:nth-of-type(${index + 1}) tbody`);
                    
                    // Initialize select all if checkbox exists and not already initialized
                    const selectAllCheckbox = table.querySelector('.data-checkbox-header');
                    if (selectAllCheckbox && !hasDragHandles) {
                        initSelectAll(selectAllCheckbox.id, '.data-checkbox-row', function() {
                            // Update action dropdown visibility when selection changes
                            updateActionDropdownVisibility();
                        });
                    }
                    
                    // Initialize column visibility if dropdown exists and not already initialized
                    const columnDropdown = table.querySelector('.data-columns-dropdown-content');
                    if (columnDropdown && !hasDragHandles) {
                        initColumnVisibility(columnDropdown.id, '.data-columns-btn-icon');
                    }
                    
                    // Initialize clickable rows if not already initialized
                    if (!hasDragHandles) {
                        initClickableRows('.data-item-number, .data-card-item-number', function(element) {
                            // Open appropriate offcanvas when item number is clicked
                            if (typeof openInqOffcanvas === 'function') {
                                openInqOffcanvas('view');
                            } else if (typeof openPROffcanvas === 'function') {
                                openPROffcanvas();
                            }
                        });
                    }
                }
            });
            
            // Initialize view toggle functionality
            initViewToggle();
            
            // Initialize action dropdowns
            initActionDropdowns();
            
            // Initialize resizable columns
            initResizableColumns('.data-table');
        }
        
        // Initialize user contact popup
        const popup = document.getElementById('userContactPopup');
        const closeBtn = document.querySelector('.popup-close');
        const clickableUsers = document.querySelectorAll('.clickable-user');
        
        if (popup && closeBtn && clickableUsers.length > 0) {
            // Show popup
            function showPopup(userElement) {
                // Copy user image and status
                const userImg = userElement.querySelector('.data-user-avatar img');
                const userStatus = userElement.querySelector('.data-user-status');
                const userName = userElement.querySelector('.data-user-name');
                
                if (userImg && userStatus && userName) {
                    const popupUserImage = document.getElementById('popupUserImage');
                    const popupUserName = document.getElementById('popupUserName');
                    const popupUserStatus = document.getElementById('popupUserStatus');
                    
                    if (popupUserImage && popupUserName && popupUserStatus) {
                        popupUserImage.src = userImg.src;
                        popupUserImage.alt = userImg.alt;
                        popupUserName.textContent = userName.textContent;
                        
                        // Copy status class
                        popupUserStatus.className = 'popup-user-status ' + userStatus.className;
                        
                        popup.style.display = 'flex';
                    }
                }
            }
            
            // Hide popup
            function hidePopup() {
                popup.style.display = 'none';
            }
            
            // Event listeners
            clickableUsers.forEach(user => {
                user.addEventListener('click', function() {
                    showPopup(this);
                });
            });
            
            closeBtn.addEventListener('click', hidePopup);
            
            // Close on background click
            popup.addEventListener('click', function(e) {
                if (e.target === popup) {
                    hidePopup();
                }
            });
            
            // Chat Now functionality
            const chatNowBtn = document.getElementById('popupChatNow');
            if (chatNowBtn) {
                chatNowBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Get user information
                    const userName = document.getElementById('popupUserName').textContent;
                    const userPhone = document.getElementById('popupPhone').textContent;
                    const userEmail = document.getElementById('popupEmail').textContent;
                    
                    // Create chat message
                    const chatMessage = `Hi! I'd like to chat about ${userName}. ` +
                                     `Contact: ${userPhone} | ${userEmail}`;
                    
                    // You can customize this to open your preferred chat system
                    // Option 1: Open WhatsApp with pre-filled message
                    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(chatMessage)}`;
                    window.open(whatsappUrl, '_blank');
                    
                    // Option 2: Copy message to clipboard (uncomment if needed)
                    // navigator.clipboard.writeText(chatMessage).then(() => {
                    //     alert('Chat message copied to clipboard!');
                    // });
                    
                    // Option 3: Open internal chat modal (if you have one)
                    // openChatModal(userName, userPhone, userEmail);
                    
                    // Close the popup after action
                    hidePopup();
                });
            }
        }
    }, 50); // Small delay to allow manual initialization
});

// Export all functions to global scope for backward compatibility
window.CommonTable = {
    initSelectAll,
    initDragReorder,
    initViewToggle,
    showListView,
    showCardView,
    initActionDropdowns,
    toggleActionDropdown,
    updateActionDropdownVisibility,
    initColumnVisibility,
    toggleColumnDropdown,
    openColumnDropdown,
    closeColumnDropdown,
    saveColumnVisibility,
    setDefaultColumnVisibility,
    ensureFixedColumnsVisible,
    initClickableRows,
    initCommonTable
};

// ============================================================================
// RESIZABLE COLUMNS - Minimal Implementation
// ============================================================================

/**
 * Initialize resizable columns for any table
 * @param {string} tableSelector - CSS selector for the table
 */
function initResizableColumns(tableSelector = '.data-table') {
    const table = document.querySelector(tableSelector);
    if (!table) return;
    
    // Set table layout to fixed to allow width changes
    table.style.tableLayout = 'fixed';
    
    const headers = table.querySelectorAll('th');
    
    // Set default column widths (skip first 2 columns - checkbox and drag handle)
    const defaultWidths = [50, 30, 120, 150, 200, 100, 100, 150, 120, 120, 125, 100, 100, 100, 120, 120, 50];
    
    headers.forEach((header, index) => {
        // Apply default width if available
        if (defaultWidths[index]) {
            header.style.width = defaultWidths[index] + 'px';
        }
        
        // Skip first two columns (checkbox and drag handle) - they shouldn't be resizable
        if (index < 2) return;
        
        header.addEventListener('mousedown', (e) => {
            const rect = header.getBoundingClientRect();
            const mouseX = e.clientX;
            const headerRight = rect.right;
            
            // Check if mouse is within 4px of the right edge
            if (mouseX >= headerRight - 4 && mouseX <= headerRight) {
                isResizing = true;
                currentHeader = header;
                startX = e.clientX;
                startWidth = header.offsetWidth;
                document.body.style.cursor = 'col-resize';
                document.body.style.userSelect = 'none';
                e.preventDefault();
                e.stopPropagation();
            }
        });
    });
    
    let isResizing = false;
    let currentHeader = null;
    let startX = 0;
    let startWidth = 0;
    
    document.addEventListener('mousemove', (e) => {
        if (!isResizing || !currentHeader) return;
        
        const newWidth = startWidth + (e.clientX - startX);
        if (newWidth >= 60 && newWidth <= 300) {
            currentHeader.style.width = newWidth + 'px';
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            currentHeader = null;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    });
}

 // ============================================================================
  // STATUS DROPDOWN FUNCTIONALITY
  // ============================================================================

  /**
   * Toggle status dropdown for table view
   */
  function toggleStatusDropdown(button) {
    const dropdown = button.closest('.data-status-dropdown');
    const isActive = dropdown.classList.contains('active');
    
    // Close all other dropdowns
    document.querySelectorAll('.data-status-dropdown.active').forEach(dd => {
        dd.classList.remove('active');
    });
    
    // Toggle current dropdown
    if (!isActive) {
        dropdown.classList.add('active');
    }
}

    /**
     * Change status in table view
     */
    function changeStatus(option, newStatus) {
        const dropdown = option.closest('.data-status-dropdown');
        const button = dropdown.querySelector('.data-status-dropdown-btn');
        const badge = button.querySelector('.data-status-badge');
        
        // Update badge class and text
        badge.className = `data-status-badge data-status-${newStatus}`;
        badge.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
        
        // Close dropdown
        dropdown.classList.remove('active');
        
    }

    /**
     * Toggle status dropdown for card view
     */
    function toggleCardStatusDropdown(button) {
        const dropdown = button.closest('.data-card-status-dropdown');
        const isActive = dropdown.classList.contains('active');
        
        // Close all other dropdowns
        document.querySelectorAll('.data-card-status-dropdown.active').forEach(dd => {
            dd.classList.remove('active');
        });
        
        // Toggle current dropdown
        if (!isActive) {
            dropdown.classList.add('active');
        }
    }

    /**
     * Change status in card view
     */
    function changeCardStatus(option, newStatus) {
        const dropdown = option.closest('.data-card-status-dropdown');
        const button = dropdown.querySelector('.data-card-status-dropdown-btn');
        const badge = button.querySelector('.data-status-badge');
        
        // Update badge class and text
        badge.className = `data-status-badge data-status-${newStatus}`;
        badge.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
        
        // Close dropdown
        dropdown.classList.remove('active');
        
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.data-status-dropdown') && !e.target.closest('.data-card-status-dropdown')) {
            document.querySelectorAll('.data-status-dropdown.active, .data-card-status-dropdown.active').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

// Also export individual functions for direct use
window.initSelectAll = initSelectAll;
window.initDragReorder = initDragReorder;
window.initViewToggle = initViewToggle;
window.showListView = showListView;
window.showCardView = showCardView;
window.toggleActionDropdown = toggleActionDropdown;
window.updateActionDropdownVisibility = updateActionDropdownVisibility;
window.initColumnVisibility = initColumnVisibility;
window.toggleColumnDropdown = toggleColumnDropdown;
window.openColumnDropdown = openColumnDropdown;
window.closeColumnDropdown = closeColumnDropdown;
window.saveColumnVisibility = saveColumnVisibility;
window.initClickableRows = initClickableRows;
window.initResizableColumns = initResizableColumns;
window.initCommonTable = initCommonTable;

// ============================================================================
// STATUS DROPDOWN FUNCTIONALITY
// ============================================================================

/**
 * Toggle status dropdown for table view
 */
function toggleStatusDropdown(button) {
    const dropdown = button.closest('.data-status-dropdown');
    const isActive = dropdown.classList.contains('active');
    
    // Close all other dropdowns
    document.querySelectorAll('.data-status-dropdown.active').forEach(dd => {
        dd.classList.remove('active');
    });
    
    // Toggle current dropdown
    if (!isActive) {
        dropdown.classList.add('active');
        
        // Position the dropdown menu
        const menu = dropdown.querySelector('.data-status-dropdown-menu');
        const buttonRect = button.getBoundingClientRect();
        
        menu.style.top = (buttonRect.bottom + 4) + 'px';
        menu.style.left = buttonRect.left + 'px';
    }
}

/**
 * Change status in table view
 */
function changeStatus(option, newStatus) {
    const dropdown = option.closest('.data-status-dropdown');
    const button = dropdown.querySelector('.data-status-dropdown-btn');
    const badge = button.querySelector('.data-status-badge');
    
    // Update badge class and text
    badge.className = `data-status-badge data-status-${newStatus}`;
    badge.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
    
    // Close dropdown
    dropdown.classList.remove('active');
    
}

/**
 * Toggle status dropdown for card view
 */
function toggleCardStatusDropdown(button) {
    const dropdown = button.closest('.data-card-status-dropdown');
    const isActive = dropdown.classList.contains('active');
    
    // Close all other dropdowns
    document.querySelectorAll('.data-card-status-dropdown.active').forEach(dd => {
        dd.classList.remove('active');
    });
    
    // Toggle current dropdown
    if (!isActive) {
        dropdown.classList.add('active');
        
        // Position the dropdown menu
        const menu = dropdown.querySelector('.data-card-status-dropdown-menu');
        const buttonRect = button.getBoundingClientRect();
        
        menu.style.top = (buttonRect.bottom + 4) + 'px';
        menu.style.left = buttonRect.left + 'px';
    }
}

/**
 * Change status in card view
 */
function changeCardStatus(option, newStatus) {
    const dropdown = option.closest('.data-card-status-dropdown');
    const button = dropdown.querySelector('.data-card-status-dropdown-btn');
    const badge = button.querySelector('.data-status-badge');
    
    // Update badge class and text
    badge.className = `data-status-badge data-status-${newStatus}`;
    badge.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
    
    // Close dropdown
    dropdown.classList.remove('active');
    
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.data-status-dropdown') && !e.target.closest('.data-card-status-dropdown')) {
        document.querySelectorAll('.data-status-dropdown.active, .data-card-status-dropdown.active').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
});

// ============================================================================
// PRIORITY DROPDOWN FUNCTIONALITY (MINIMAL)
// ============================================================================

// Priority configurations
const priorityConfig = {
    low: { stars: '<i class="fa fa-star" style="color: #1976d2;"></i>', text: 'Low', title: 'Low Priority' },
    medium: { stars: '<i class="fa fa-star" style="color: #f57c00;"></i><i class="fa fa-star" style="color: #f57c00;"></i>', text: 'Medium', title: 'Medium Priority' },
    high: { stars: '<i class="fa fa-star" style="color: #d32f2f;"></i><i class="fa fa-star" style="color: #d32f2f;"></i><i class="fa fa-star" style="color: #d32f2f;"></i>', text: 'High', title: 'High Priority' },
    urgent: { stars: '<i class="fa fa-exclamation-triangle" style="color: #7b1fa2;"></i>', text: 'Urgent', title: 'Urgent Priority' }
};

// Priority dropdown toggle (same as status dropdown)
function togglePriorityDropdown(button) {
    const dropdown = button.closest('.data-priority-dropdown');
    const isActive = dropdown.classList.contains('active');
    
    // Close all other dropdowns
    document.querySelectorAll('.data-priority-dropdown.active').forEach(dd => {
        dd.classList.remove('active');
    });
    
    // Toggle current dropdown
    if (!isActive) {
        dropdown.classList.add('active');
        
        // Position the dropdown menu
        const menu = dropdown.querySelector('.data-priority-dropdown-menu');
        const buttonRect = button.getBoundingClientRect();
        
        menu.style.top = (buttonRect.bottom + 4) + 'px';
        menu.style.left = buttonRect.left + 'px';
    }
}

// Priority change (same as status dropdown)
function changePriority(option, newPriority) {
    const dropdown = option.closest('.data-priority-dropdown');
    const button = dropdown.querySelector('.data-priority-dropdown-btn');
    const badge = button.querySelector('.data-priority-badge');
    const config = priorityConfig[newPriority];
    
    // Update badge class and content
    badge.className = `data-priority-badge data-priority-${newPriority}`;
    badge.innerHTML = config.stars;
    badge.title = config.title;
    
    // Close dropdown
    dropdown.classList.remove('active');
    
}

// ============================================================================
    // user contact popup functionality
// ============================================================================
// (Moved to main DOMContentLoaded listener above to prevent conflicts)

// Export minimal functions
window.toggleStatusDropdown = toggleStatusDropdown;

window.changeStatus = changeStatus;
window.toggleCardStatusDropdown = toggleCardStatusDropdown;
window.changeCardStatus = changeCardStatus;
window.togglePriorityDropdown = togglePriorityDropdown;
window.changePriority = changePriority;
