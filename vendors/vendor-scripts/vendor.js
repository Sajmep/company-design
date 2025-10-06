// RFQ Modal functionality
function openRFQModal() {
    document.getElementById('rfqModal').style.display = 'flex';
}

function closeRFQModal() {
    document.getElementById('rfqModal').style.display = 'none';
}

// Close modal when clicking outside
document.getElementById('rfqModal').onclick = function(event) {
    if (event.target === this) {
        closeRFQModal();
    }
}

// Functions called by HTML buttons
function createRFQ() {
    openRFQModal();
}

function sendRFQ() {
    openRFQModal();
}

// Add Product Row functionality
function addProductRow() {
    const tbody = document.querySelector('#rfqModal .data-table tbody');
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
