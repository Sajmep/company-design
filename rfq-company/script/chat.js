
// Create Message Modal Functions
function openCreateMessageModal() {
  const modal = document.getElementById('createMessageModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeCreateMessageModal() {
  const modal = document.getElementById('createMessageModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Setup Create Message Modal (requires setupModal function from rfq-company.js)
function setupCreateMessageModal() {
  if (typeof setupModal === 'function') {
    setupModal('createMessageModal', openCreateMessageModal, closeCreateMessageModal);
  }
}

// Chat Members Dropdown Toggle
function toggleChatMembersDropdown() {
  const menu = document.getElementById('chatMembersMenu');
  if (menu) {
    menu.classList.toggle('show');
  }
}

// Invite Member Modal Functions
function openInviteMemberModal() {
  const modal = document.getElementById('inviteMemberModal');
  const membersMenu = document.getElementById('chatMembersMenu');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Close members dropdown when opening invite modal
    if (membersMenu) {
      membersMenu.classList.remove('show');
    }
  }
}

function closeInviteMemberModal() {
  const modal = document.getElementById('inviteMemberModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close chat members dropdown when clicking outside
document.addEventListener('click', function(event) {
  const dropdown = document.querySelector('.chat-header-members-dropdown');
  const menu = document.getElementById('chatMembersMenu');
  
  if (menu && menu.classList.contains('show')) {
    if (dropdown && !dropdown.contains(event.target)) {
      menu.classList.remove('show');
    }
  }
});

// Close invite member modal when clicking outside
document.addEventListener('click', function(event) {
  const modal = document.getElementById('inviteMemberModal');
  if (modal && modal.classList.contains('active')) {
    if (event.target === modal) {
      closeInviteMemberModal();
    }
  }
});

// Close invite member modal on Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const modal = document.getElementById('inviteMemberModal');
    if (modal && modal.classList.contains('active')) {
      closeInviteMemberModal();
    }
  }
});

// Initialize chat functionality when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Setup create message modal
  setupCreateMessageModal();
  // Chat input toggle
  const chatInput = document.getElementById('chatInput');
  const voiceBtn = document.getElementById('voiceBtn');
  const sendBtn = document.getElementById('sendBtn');
  const fileInput = document.getElementById('fileInput');

  if (chatInput && voiceBtn && sendBtn) {
    chatInput.addEventListener('input', function() {
      const hasText = this.value.trim() !== '';
      voiceBtn.style.display = hasText ? 'none' : 'flex';
      sendBtn.style.display = hasText ? 'flex' : 'none';
    });
  }

  // File selection handler
  if (fileInput) {
    fileInput.addEventListener('change', function() {
      if (this.files.length > 0) {
        const fileNames = Array.from(this.files).map(file => file.name).join(', ');
        console.log('Selected files:', fileNames);
      }
    });
  }

  // Select all vendors toggle
  const vendorSelectAll = document.getElementById('vendorSelectAll');
  const vendorCheckboxes = document.querySelectorAll('.vendor-selection-item input[type="checkbox"]');
  
  if (vendorSelectAll && vendorCheckboxes.length > 0) {
    vendorSelectAll.addEventListener('change', function() {
      vendorCheckboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
      });
    });

    // Update select all when individual checkboxes change
    vendorCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        const allChecked = Array.from(vendorCheckboxes).every(cb => cb.checked);
        const someChecked = Array.from(vendorCheckboxes).some(cb => cb.checked);
        vendorSelectAll.checked = allChecked;
        vendorSelectAll.indeterminate = someChecked && !allChecked;
      });
    });
  }
});

