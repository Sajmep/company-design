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

    // File display for attachments
    function displaySelectedFiles(input) {
      const filesList = document.getElementById('attachmentsFilesList');
      filesList.innerHTML = '';
      
      if (input.files && input.files.length > 0) {
        Array.from(input.files).forEach((file, index) => {
          const fileBox = document.createElement('div');
          fileBox.className = 'attachments-file-box';
          fileBox.innerHTML = `
            <div class="attachments-file-info">
              <i class="attachments-file-icon fa-solid fa-file"></i>
              <span class="attachments-file-name">${file.name}</span>
            </div>
            <div class="attachments-file-actions">
              <div class="attachments-file-preview">
                <i class="fa-solid fa-eye"></i>
              </div>
              <button type="button" class="attachments-file-remove" onclick="removeAttachmentFile(${index})" title="Remove">
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
          `;
          filesList.appendChild(fileBox);
        });
      }
    }

    function removeAttachmentFile(index) {
      // For now, just remove the visual element
      // In a real implementation, you'd also remove from the file input
      const fileBoxes = document.querySelectorAll('.attachments-file-box');
      if (fileBoxes[index]) {
        fileBoxes[index].remove();
      }
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
