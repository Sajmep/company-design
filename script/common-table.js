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
        console.log('Table body not found for selector:', tableSelector);
        return;
    }
    
    // Check if this table is already initialized
    const existingDragHandles = tbody.querySelectorAll('.data-drag-handle');
    if (existingDragHandles.length > 0) {
        console.log('Table already initialized, skipping drag reorder setup');
        return;
    }
    
    let draggedRow = null;
    
    // Add drag handles to each row
    const rows = tbody.querySelectorAll('tr');
    console.log('Found rows:', rows.length);
    
    rows.forEach((row, index) => {
        // Add drag handle cell if it doesn't exist
        let dragCell = row.querySelector('.data-drag-handle');
        if (!dragCell) {
            dragCell = document.createElement('td');
            dragCell.className = 'data-drag-handle';
            dragCell.innerHTML = '<i class="fa-solid fa-grip-vertical"></i>';
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
// SEARCH FUNCTIONALITY
// ============================================================================

/**
 * Initialize search functionality
 * @param {string} searchInputSelector - CSS selector for search input
 * @param {string} searchTargetSelector - CSS selector for elements to search in
 * @param {function} onSearch - Callback function when search is performed
 */
function initSearch(searchInputSelector = '.data-search-input', 
                   searchTargetSelector = '.data-table tbody tr, .data-card',
                   onSearch = null) {
    const searchInput = document.querySelector(searchInputSelector);
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const targets = document.querySelectorAll(searchTargetSelector);
            
            targets.forEach(target => {
                const text = target.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    target.style.display = '';
                } else {
                    target.style.display = 'none';
                }
            });
            
            if (onSearch) onSearch(searchTerm);
        });
    }
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
    initSearch(config.searchInputSelector, config.searchTargetSelector, config.onSearch);
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
    initSearch,
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
    const defaultWidths = [50, 30, 120, 150, 200, 100, 100, 150, 120, 120, 100, 80, 90, 100, 120, 50];
    
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
window.initSearch = initSearch;
window.initResizableColumns = initResizableColumns;
window.initCommonTable = initCommonTable;
