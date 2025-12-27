// Login Popup Functionality

function openLoginPopup() {
  const overlay = document.querySelector('.login-popup-overlay');
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeLoginPopup() {
  const overlay = document.querySelector('.login-popup-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close popup when clicking outside
document.addEventListener('DOMContentLoaded', function() {
  const overlay = document.querySelector('.login-popup-overlay');
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        closeLoginPopup();
      }
    });
  }

  // Close button
  const closeBtn = document.querySelector('.login-popup-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLoginPopup);
  }

  // Remember me checkbox
  const checkbox = document.querySelector('.login-popup-checkbox');
  const rememberLabel = document.querySelector('.login-popup-remember');
  if (checkbox && rememberLabel) {
    rememberLabel.addEventListener('click', function() {
      checkbox.classList.toggle('checked');
    });
  }

  // Password toggle
  const passwordToggle = document.querySelector('.login-popup-password-toggle');
  const passwordInput = document.querySelector('input[type="password"]');
  if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      passwordToggle.innerHTML = type === 'password' ? '<i class="fa fa-eye"></i>' : '<i class="fa fa-eye-slash"></i>';
    });
  }

  // Form submission
  const loginForm = document.querySelector('.login-popup-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // Add your login logic here
      console.log('Login submitted');
    });
  }
});

// Close on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeLoginPopup();
  }
});

