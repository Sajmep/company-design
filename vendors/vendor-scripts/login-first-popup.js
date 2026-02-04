// Login First Modal Functions
document.addEventListener('DOMContentLoaded', function() {
  var addToContactsBtn = document.getElementById('addToContactsBtn');
  var loginFirstModal = document.getElementById('loginFirstModal');
  
  // Get mobile dropdown button (if it exists)
  var mobileAddToContactsBtn = document.querySelector('.vendor-actions-dropdown .vendor-action-btn[data-tooltip*="Add to Contacts"]');

  function openLoginFirstModal(e) {
    if (e) {
      e.preventDefault();
    }
    if (loginFirstModal) {
      loginFirstModal.style.display = 'flex';
    }
  }

  // Desktop button
  if (addToContactsBtn && loginFirstModal) {
    addToContactsBtn.addEventListener('click', openLoginFirstModal);
  }

  // Mobile dropdown button
  if (mobileAddToContactsBtn && loginFirstModal) {
    mobileAddToContactsBtn.addEventListener('click', openLoginFirstModal);
  }

  // Close modal when clicking outside
  if (loginFirstModal) {
    window.addEventListener('click', function(event) {
      if (event.target == loginFirstModal) {
        loginFirstModal.style.display = 'none';
      }
    });
  }
});

function closeLoginFirstModal() {
  var loginFirstModal = document.getElementById('loginFirstModal');
  if (loginFirstModal) {
    loginFirstModal.style.display = 'none';
  }
}