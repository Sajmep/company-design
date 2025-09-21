// Inquiries Page JavaScript Functions

function deleteSelectedInquiries() {
  // Update the count in the modal
  document.querySelector('.purchase-delete-count').textContent = '3';
  
  // Show the modal
  document.getElementById('deleteModal').style.display = 'flex';
}

function createInquiryItem(type) {
  console.log('Create inquiry item functionality');
  // Open the offcanvas in create mode
  openPROffcanvas();
  // Switch to create tab
  switchTab('create');
  // Update header
  updateOffcanvasHeader('Create Inquiry');
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

// Delete Modal Functions
function closeDeleteModal() {
  document.getElementById('deleteModal').style.display = 'none';
}

function confirmDelete() {
  // Close the modal
  closeDeleteModal();
  
  // Backend team will implement actual deletion logic here
  console.log('Delete confirmed - Backend team to implement');
}

    // Minimal JavaScript for inquiry dropdown
    function toggleInquiryDropdown() {
      const dropdown = document.getElementById('inquryDropdownMenu');
      const isVisible = dropdown.classList.contains('show');
      
      if (isVisible) {
        dropdown.classList.remove('show');
      } else {
        dropdown.classList.add('show');
      }
    }
    
    function selectInquiryType(type) {
      const dropdown = document.getElementById('inquryDropdownMenu');
      dropdown.classList.remove('show');
      console.log('Selected inquiry type:', type);
    }

// Group by dropdown functionality
function toggleGroupByDropdown() {
  const dropdown = document.getElementById('groupByDropdown');
  const button = document.querySelector('.group-by-button');
  
  if (dropdown && button) {
    dropdown.classList.toggle('show');
    button.classList.toggle('active');
  }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
  const dropdown = document.getElementById('groupByDropdown');
  const button = document.querySelector('.group-by-button');
  
  if (dropdown && button && !dropdown.contains(event.target) && !button.contains(event.target)) {
    dropdown.classList.remove('show');
    button.classList.remove('active');
  }
});

// Initialize inquiries page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Inquiries page loaded');
  
  // Add any initialization logic here
  // The common table functionality is already auto-initialized by common-table.js
});
