let currentTab = 0;
const totalTabs = 4;

function showTab(n) {
  const panels = document.querySelectorAll('.tab-panel');
  const steps = document.querySelectorAll('.step');
  const circles = document.querySelectorAll('.step-circle');
  const labels = document.querySelectorAll('.step-label');

  // Hide all panels
  panels.forEach(panel => panel.classList.remove('active'));

  // Show current panel
  panels[n].classList.add('active');

  // Update step indicators
  steps.forEach((step, index) => {
    const circle = circles[index];
    const label = labels[index];

    circle.classList.remove('active', 'completed');
    label.classList.remove('active');

    if (index < n) {
      circle.classList.add('completed');
    } else if (index === n) {
      circle.classList.add('active');
      label.classList.add('active');
    }
  });

  // Update progress bar
  const progress = (n / (totalTabs - 0)) * 100;
  document.getElementById('progressFill').style.width = progress + '%';

  // Update buttons
  document.getElementById('prevBtn').disabled = n === 0;

  const nextBtn = document.getElementById('nextBtn');
  if (n === totalTabs - 1) {
    nextBtn.style.display = 'none';
  } else {
    nextBtn.style.display = 'block';
    nextBtn.textContent = n === totalTabs - 2 ? 'Complete' : 'Next';
  }
}

function changeTab(direction) {
  currentTab += direction;

  if (currentTab < 0) currentTab = 0;
  if (currentTab >= totalTabs) currentTab = totalTabs - 1;

  showTab(currentTab);
}

// Allow clicking on steps to navigate
document.querySelectorAll('.step').forEach((step, index) => {
  step.addEventListener('click', () => {
    currentTab = index;
    showTab(currentTab);
  });
});

// Initialize
showTab(currentTab);


(function () {
  document.querySelectorAll('.collapsible-box').forEach(box => {
    const header = box.querySelector('.collapsible-header');
    const toggleBtn = box.querySelector('.toggle-btn');

    function setOpen(isOpen) {
      box.setAttribute('data-open', String(isOpen));
      header.setAttribute('aria-expanded', String(isOpen));
      toggleBtn.setAttribute('aria-label', isOpen ? 'Collapse' : 'Expand');
    }

    function toggle() {
      const isOpen = box.getAttribute('data-open') === 'true';
      setOpen(!isOpen);
    }

    header.addEventListener('click', toggle);
    toggleBtn.addEventListener('click', e => { e.stopPropagation(); toggle(); });
    header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); toggle();
      }
    });

    // handle image preview if present
    const fileInput = box.querySelector('.image-input');
    const preview = box.querySelector('.image-preview');
    if (fileInput && preview) {
      fileInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = ev => {
            preview.src = ev.target.result;
            preview.style.display = 'block';
          };
          reader.readAsDataURL(file);
        } else {
          preview.src = '';
          preview.style.display = 'none';
        }
      });
    }

    // initialize state
    setOpen(box.getAttribute('data-open') === 'true');
  });
})();