
function createRfq() {
  // Open the offcanvas in create mode
  openPROffcanvas();
  // Switch to create tab
  switchTab('create');
  // Update header
  updateOffcanvasHeader('Create RFQ');
}

// Function to open rfq offcanvas for viewing
function openRfqOffcanvas(mode = 'view') {
  // Open the offcanvas
  openPROffcanvas();
  // Switch to appropriate tab
  if (mode === 'create') {
    switchTab('create');
    updateOffcanvasHeader('Create RFQ');
  } else {
    switchTab('rfq');
    updateOffcanvasHeader('RFQ-2025');
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



/* vendor selection modal */

function openVendorModal() {
  document.getElementById('vendorModal').style.display = 'block';
}

function closeVendorModal() {
  document.getElementById('vendorModal').style.display = 'none';
}


// Close vendor modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('vendorModal');
  if (event.target == modal) {
    closeVendorModal();
  }
}


// Offer Modal Functions
function openofferModal(button) {
  const modal = document.getElementById('offerModal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeofferModal() {
  const modal = document.getElementById('offerModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// Close offer modal when clicking outside
window.addEventListener('click', function(event) {
  const modal = document.getElementById('offerModal');
  if (event.target === modal) {
    closeofferModal();
  }
});


// Generic modal handler
function setupModal(modalId, openFn, closeFn) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  // Close on outside click
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeFn();
  });

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeFn();
    }
  });
}

// Modal functions
function openCreateOfferModal() {
  const modal = document.getElementById('createOfferModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeCreateOfferModal() {
  const modal = document.getElementById('createOfferModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}


function submitCreateOffer() {
  const form = document.querySelector('.create-offer-form');
  if (form && form.checkValidity()) {
    console.log('Creating offer...');
    closeCreateOfferModal();
  } else {
    form.reportValidity();
  }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Setup modals (createMessageModal setup is in chat.js)
  setupModal('createOfferModal', openCreateOfferModal, closeCreateOfferModal);

  // Create Offer button
  const createOfferBtn = document.querySelector('.offers-create-btn');
  if (createOfferBtn) {
    createOfferBtn.addEventListener('click', openCreateOfferModal);
  }

  // Offers Compare Functionality
  const compareButtons = document.querySelectorAll('.offer-compare-btn-icon');
  const comparePopup = document.getElementById('offersComparePopup');
  const compareCount = document.getElementById('offersCompareCount');
  const compareDropdown = document.getElementById('offersCompareDropdown');
  const compareNowBtn = document.getElementById('offersCompareNowBtn');
  const compareModal = document.getElementById('offersCompareModal');
  const closeCompareModal = document.getElementById('closeoffersCompareModal');

  let selectedCount = 0;

  // Handle compare button clicks on offer cards - only increment counter
  compareButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (button.disabled) return;

      // Mark selected and disable to prevent duplicates
      button.disabled = true;

      // Increase count and show popup
      selectedCount++;
      if (compareCount) compareCount.textContent = selectedCount;
      if (comparePopup && selectedCount > 0) comparePopup.style.display = 'block';
    });
  });

  // Toggle dropdown when clicking popup
  if (comparePopup) {
    comparePopup.addEventListener('click', function(e) {
      e.stopPropagation();
      if (compareDropdown) compareDropdown.classList.toggle('show');
    });
  }

  // Close dropdown on outside click
  document.addEventListener('click', function() {
    if (compareDropdown) compareDropdown.classList.remove('show');
  });

  // Open compare modal
  if (compareNowBtn) {
    compareNowBtn.addEventListener('click', function() {
      if (compareModal) compareModal.classList.add('show');
    });
  }

  // Close compare modal
  if (closeCompareModal) {
    closeCompareModal.addEventListener('click', function() {
      if (compareModal) compareModal.classList.remove('show');
    });
  }

  // Close compare modal when clicking outside
  if (compareModal) {
    compareModal.addEventListener('click', function(e) {
      if (e.target === compareModal) {
        compareModal.classList.remove('show');
      }
    });
  }
});