/* ============================================================================
 * ITEMS TABLE FUNCTIONALITY
 * ============================================================================
 * handles all functionality: 
 * - Adding new product rows
 * - Drag and drop row reordering
 * - Column visibility management
 * ============================================================================ */

const ItemsTable = {
  dragState: {
    draggedRow: null, // Currently dragged row (shared across all rows)
  },

  // ============================================================================
  // Add a new product row to the table
  // ============================================================================

  addItemRow() {
    const tbody = document.querySelector('#prOffcanvas .items-table tbody');
    const existingRow = tbody?.querySelector('.items-row');
    
    if (!tbody || !existingRow) {
      console.error('Items table tbody or row not found');
      return;
    }
    
    // Clone the existing row
    const newRow = existingRow.cloneNode(true);
    
    // Remove drag initialization attribute if it exists (from cloning)
    if (newRow.dataset.dragInitialized) {
      delete newRow.dataset.dragInitialized;
    }
    
    // Generate unique ID for the new row
    const rowId = 'item-' + Date.now();
    const checkbox = newRow.querySelector('.items-checkbox-row');
    const label = newRow.querySelector('.items-checkbox-label');
    
    // Update checkbox ID and label
    if (checkbox) {
      checkbox.id = rowId;
      checkbox.checked = false;
    }
    if (label) {
      label.setAttribute('for', rowId);
    }
    
    // Clear all form values in the new row
    newRow.querySelectorAll('select, input').forEach(element => {
      if (element.type === 'checkbox') return; // Don't clear checkboxes
      element.value = '';
      
      // Reset select dropdowns to first option
      if (element.tagName === 'SELECT') {
        const firstOption = element.querySelector('option[disabled][selected]');
        if (firstOption) {
          firstOption.selected = true;
        } else {
          element.selectedIndex = 0;
        }
      }
    });
    
    // Add the new row to the table
    tbody.appendChild(newRow);
    
    // Initialize drag and drop functionality for the new row
    this.initRowDragDrop(newRow, tbody);
    
    // Initialize checkbox for the new row
    const newCheckbox = newRow.querySelector('.items-checkbox-row');
    if (newCheckbox && !newCheckbox.dataset.listenerAdded) {
      newCheckbox.dataset.listenerAdded = 'true';
      newCheckbox.addEventListener('change', () => {
        this.updateActionButtonVisibility();
      });
    }
  },

  // ============================================================================
  // DRAG AND DROP FUNCTIONALITY
  // ============================================================================

  /**
   * Initialize drag and drop for a single row
   * @param {HTMLElement} row - The table row element
   * @param {HTMLElement} tbody - The table body element
   */
  initRowDragDrop(row, tbody) {
    // Skip if already initialized
    if (!tbody || row.dataset.dragInitialized === 'true') return;
    
    row.dataset.dragInitialized = 'true';
    const state = this.dragState;
    
    // Make row draggable
    row.draggable = true;
    row.classList.add('items-row-draggable');
    
    // ===== DRAG START EVENT =====
    // Fired when user starts dragging the row
    row.addEventListener('dragstart', function(e) {
      state.draggedRow = row;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', 'drag'); // Required for some browsers
      
      // Visual feedback: make dragged row semi-transparent
      row.classList.add('items-row-dragging');
      tbody.querySelectorAll('.items-row').forEach(r => {
        if (r !== row) r.classList.add('items-row-drag-target');
      });
    });
    
    // ===== DRAG END EVENT =====
    // Fired when user releases the mouse button
    row.addEventListener('dragend', function() {
      // Reset visual effects
      row.classList.remove('items-row-dragging');
      tbody.querySelectorAll('.items-row').forEach(r => {
        r.classList.remove('items-row-drag-target', 'items-row-drag-over');
      });
      state.draggedRow = null;
    });
    
    // ===== DRAG OVER EVENT =====
    // Fired continuously while dragging over this row
    // This is where we perform the actual reordering
    row.addEventListener('dragover', function(e) {
      e.preventDefault();
      if (!state.draggedRow || state.draggedRow === row) return;
      
      // Calculate if cursor is in upper or lower half of row
      const rect = row.getBoundingClientRect();
      const offset = e.clientY - rect.top;
      const halfway = rect.height / 2;
      
      // Insert after target row if cursor is in lower half
      if (offset > halfway) {
        if (row.nextSibling !== state.draggedRow) {
          row.after(state.draggedRow);
        }
      } 
      // Insert before target row if cursor is in upper half
      else {
        if (row.previousSibling !== state.draggedRow) {
          row.before(state.draggedRow);
        }
      }
      
      // Visual feedback: highlight drop target
      row.classList.add('items-row-drag-over');
    });
    
    // ===== DRAG LEAVE EVENT =====
    // Fired when cursor leaves this row
    row.addEventListener('dragleave', function() {
      row.classList.remove('items-row-drag-over');
    });
    
    // ===== DROP EVENT =====
    // Fired when user drops the row
    row.addEventListener('drop', function(e) {
      e.preventDefault();
      e.stopPropagation();
      row.classList.remove('items-row-drag-over');
      // Reordering already happened in dragover, so nothing else needed
      return false;
    });
  },

  /**
   * Initialize drag and drop for all rows in the table
   * Called on page load and when table is shown
   */
  initDragDrop() {
    const tbody = document.querySelector('#prOffcanvas .items-table tbody');
    if (!tbody) return;
    
    const rows = tbody.querySelectorAll('.items-row');
    
    rows.forEach((row) => {
      // Skip if already initialized to prevent duplicate event listeners
      if (row.dataset.dragInitialized === 'true') return;
      this.initRowDragDrop(row, tbody);
    });
  },

  // ============================================================================
  // ACTION BUTTON VISIBILITY
  // ============================================================================

  /**
   * Update action button visibility based on selected rows
   */
  updateActionButtonVisibility() {
    const actionButtonContainer = document.getElementById('itemsActionButtonContainer');
    const selectedCheckboxes = document.querySelectorAll('.items-checkbox-row:checked');
    
    if (!actionButtonContainer) return;
    
    actionButtonContainer.style.display = selectedCheckboxes.length > 0 ? 'block' : 'none';
  },

  /**
   * Initialize checkbox selection functionality
   */
  initCheckboxSelection() {
    const tbody = document.querySelector('#prOffcanvas .items-table tbody');
    if (!tbody) return;
    
    // Handle checkbox changes
    const handleCheckboxChange = () => {
      this.updateActionButtonVisibility();
    };
    
    // Add listeners to existing checkboxes
    tbody.querySelectorAll('.items-checkbox-row').forEach(checkbox => {
      checkbox.addEventListener('change', handleCheckboxChange);
    });
    
    // Watch for new rows and add listeners to their checkboxes
    const observer = new MutationObserver(() => {
      tbody.querySelectorAll('.items-checkbox-row').forEach(checkbox => {
        if (!checkbox.dataset.listenerAdded) {
          checkbox.dataset.listenerAdded = 'true';
          checkbox.addEventListener('change', handleCheckboxChange);
        }
      });
    });
    
    observer.observe(tbody, {
      childList: true,
      subtree: true
    });
  },

  // ============================================================================
  // COLUMN VISIBILITY MANAGEMENT
  // ============================================================================

  /**
   * Toggle the column visibility dropdown
   * Shows/hides the dropdown menu for selecting visible columns
   */
  toggleColumnDropdown(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const dropdown = document.getElementById('itemsColumnDropdown');
    const button = document.querySelector('.items-columns-btn-icon');
    
    if (!dropdown || !button) return false;
    
    const isVisible = dropdown.classList.contains('show');
    
    // Close all other dropdowns
    document.querySelectorAll('.items-columns-dropdown-content.show').forEach(d => {
      if (d !== dropdown) d.classList.remove('show');
    });
    
    if (isVisible) {
      // Hide dropdown
      dropdown.classList.remove('show');
      button.classList.remove('active');
    } else {
      // Show dropdown
      dropdown.classList.add('show');
      button.classList.add('active');
      
      // Position dropdown relative to button
      const rect = button.getBoundingClientRect();
      dropdown.style.top = (rect.bottom + 4) + 'px';
      dropdown.style.left = (rect.left - dropdown.offsetWidth + button.offsetWidth) + 'px';
    }
    
    return false;
  },

  /**
   * Close the column visibility dropdown
   */
  closeColumnDropdown(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const dropdown = document.getElementById('itemsColumnDropdown');
    const button = document.querySelector('.items-columns-btn-icon');
    
    if (dropdown) dropdown.classList.remove('show');
    if (button) button.classList.remove('active');
    
    return false;
  },

  /**
   * Save column visibility preferences
   * Hides/shows columns based on checkbox selections in the dropdown
   */
  saveColumnVisibility(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const dropdown = document.getElementById('itemsColumnDropdown');
    const checkboxes = dropdown?.querySelectorAll('.items-column-option input[type="checkbox"]:not([data-fixed="true"])');
    const table = document.querySelector('.items-table');
    
    if (!checkboxes || !table) return false;
    
    // Loop through each checkbox and toggle column visibility
    checkboxes.forEach(checkbox => {
      const columnValue = checkbox.value;
      const isChecked = checkbox.checked;
      const columnCells = table.querySelectorAll(`.${columnValue}`);
      const columnHeaders = table.querySelectorAll(`th.${columnValue}`);
      
      // Toggle visibility for all cells in this column
      columnCells.forEach(cell => {
        cell.classList.toggle('hidden', !isChecked);
      });
      
      // Toggle visibility for column header
      columnHeaders.forEach(header => {
        header.classList.toggle('hidden', !isChecked);
      });
    });
    
    // Close dropdown after saving
    this.closeColumnDropdown();
    
    return false;
  }
};

// ============================================================================
// EVENT LISTENERS
// ============================================================================

/**
 * Close column dropdown when clicking outside
 */
document.addEventListener('click', function(e) {
  if (!e.target.closest('.items-columns-dropdown')) {
    ItemsTable.closeColumnDropdown();
  }
});

/**
 * Close column dropdown on Escape key press
 */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    ItemsTable.closeColumnDropdown();
  }
});

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize drag and drop when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize drag drop after a short delay to ensure table is rendered
  setTimeout(() => {
    ItemsTable.initDragDrop();
    ItemsTable.initCheckboxSelection();
  }, 300);
});



/**
 * Re-initialize drag and drop when create panel becomes active
 * Uses MutationObserver to watch for class changes on the create panel
 */
const observer = new MutationObserver(function(mutations) {
  const createPanel = document.getElementById('create-panel');
  if (createPanel && createPanel.classList.contains('active')) {
    setTimeout(() => {
      ItemsTable.initDragDrop();
      ItemsTable.initCheckboxSelection();
    }, 200);
  }
});

// Start observing the create panel for changes
const createPanel = document.getElementById('create-panel');
if (createPanel) {
  observer.observe(createPanel, {
    attributes: true,
    attributeFilter: ['class']
  });
}

// ============================================================================
// EXPORT
// ============================================================================

/**
 * Make ItemsTable available globally
 */
window.ItemsTable = ItemsTable;
