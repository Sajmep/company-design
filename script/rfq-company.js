
function createRfq() {
  // Open the offcanvas in create mode
  openPROffcanvas();
  // Switch to create tab
  switchTab('create');
  // Update header
  updateOffcanvasHeader('Create RFQ');
}

// Function to open inquiry offcanvas for viewing
function openInqOffcanvas(mode = 'view') {
  console.log('Opening inquiry offcanvas in', mode, 'mode');
  // Open the offcanvas
  openPROffcanvas();
  // Switch to appropriate tab
  if (mode === 'create') {
    switchTab('create');
    updateOffcanvasHeader('Create Inquiry');
  } else {
    switchTab('inquiry');
    updateOffcanvasHeader('INQ-2025');
  }
  
}




// Add Product Row functionality
function addProductRow() {
  const tbody = document.querySelector('#prOffcanvas .data-table tbody');
  const existingRow = tbody.querySelector('tr');
  
  if (!tbody || !existingRow) return;
  
  // Clone the existing row
  const newRow = existingRow.cloneNode(true);
  
  // Generate unique ID for the new row
  const rowId = 'rfq-' + Date.now();
  const checkbox = newRow.querySelector('.data-checkbox-row');
  const label = newRow.querySelector('.data-checkbox-label');
  
  // Update checkbox ID and label
  if (checkbox) {
      checkbox.id = rowId;
      checkbox.checked = false;
  }
  if (label) {
      label.setAttribute('for', rowId);
  }
  
  // Clear all form values
  newRow.querySelectorAll('select, input').forEach(element => {
      if (element.type === 'checkbox') return; // Don't clear checkboxes
      element.value = '';
  });
  
  // Add the new row to the table
  tbody.appendChild(newRow);
}
