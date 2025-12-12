
function createRfq() {
  openPROffcanvas();
  switchTab('create');
  updateOffcanvasHeader('New');
  setTimeout(initializeAutocomplete, 200);
  // Initialize drag and drop for items table
  setTimeout(() => {
    if (window.ItemsTable && window.ItemsTable.initDragDrop) {
      window.ItemsTable.initDragDrop();
    }
  }, 300);
}

// Function to open rfq offcanvas for viewing
function openRfqOffcanvas(mode = 'create') {
  // Open the offcanvas
  openPROffcanvas();
  // Switch to RFQ tab (which is now the create tab)
  switchTab('create');
  updateOffcanvasHeader('RFQ');
}

// Function to switch nested tabs within create panel
function switchCreateTab(tabName) {
  // Get the create panel to scope our selections
  const createPanel = document.getElementById('create-panel');
  if (!createPanel) {
    console.error('Create panel not found');
    return;
  }
  
  // Remove active class from all nested tabs (both in main tabs and in create panel)
  document.querySelectorAll('[data-create-tab]').forEach(btn => {
    btn.classList.remove('active');
  });
  
  createPanel.querySelectorAll('.create-tab-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  
  // Add active class to selected tab (in main tabs container)
  const selectedTab = document.querySelector(`[data-create-tab="${tabName}"]`);
  const selectedPanel = createPanel.querySelector(`#create-${tabName}-panel`);
  
  if (selectedTab) {
    selectedTab.classList.add('active');
  } else {
    console.error(`Tab button not found for: ${tabName}`);
    return;
  }
  
  if (selectedPanel) {
    selectedPanel.classList.add('active');
  } else {
    console.error(`Tab panel not found for: create-${tabName}-panel`);
  }
}

// Function to update hidden priority input in form
function changeFormPriority(priority) {
  const priorityInput = document.getElementById('priority');
  if (priorityInput) {
    priorityInput.value = priority;
  }
}

// Make functions available globally
window.switchCreateTab = switchCreateTab;
window.openRfqOffcanvas = openRfqOffcanvas;
window.changeFormPriority = changeFormPriority;

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

  // Initialize autocomplete when page loads (if elements exist)
  setTimeout(initializeAutocomplete, 300);
});

// Initialize autocomplete for vendors field
function initializeAutocomplete() {
  const input = document.getElementById('AdvancedVendor');
  const dropdown = document.getElementById('AdvancedVendorDropdown');
  
  if (!input || !dropdown) return;
  
  // Prevent duplicate initialization
  if (input.dataset.initialized) return;
  input.dataset.initialized = 'true';
  
  // Show dropdown on focus/input
  input.addEventListener('focus', () => {
    dropdown.classList.add('show');
    dropdown.querySelectorAll('.autocomplete-item').forEach(item => item.classList.remove('hidden'));
  });
  
  // Filter items on input
  input.addEventListener('input', function() {
    const search = this.value.toLowerCase();
    dropdown.querySelectorAll('.autocomplete-item:not(.autocomplete-divider)').forEach(item => {
      item.classList.toggle('hidden', !item.textContent.toLowerCase().includes(search));
    });
    dropdown.classList.add('show');
  });
  
  // Handle item selection
  dropdown.querySelectorAll('.autocomplete-item:not(.autocomplete-divider)').forEach(item => {
    item.addEventListener('click', function(e) {
      e.stopPropagation();
      const text = this.querySelector('span')?.textContent || this.textContent;
      if (text) {
        input.value = text;
        dropdown.classList.remove('show');
      }
    });
  });
  
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.autocomplete-container')) {
      dropdown.classList.remove('show');
    }
  });
}