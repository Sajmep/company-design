// Apply Popup - open/close + steps + CV options
document.addEventListener('DOMContentLoaded', function () {
  var overlay = document.getElementById('applyPopupOverlay');
  if (!overlay) return;

  var step1 = document.getElementById('applyPopupStep1');
  var step2 = document.getElementById('applyPopupStep2');
  var existingWrap = document.getElementById('applyPopupExistingWrap');
  var uploadWrap = document.getElementById('applyPopupUploadWrap');
  var pdfInput = document.getElementById('applyPopupPdf');
  var fileNameEl = document.getElementById('applyPopupFileName');
  var form = document.getElementById('applyPopupForm');

  function setOpen(isOpen) {
    overlay.classList.toggle('is-open', isOpen);
    overlay.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  }

  function showStep(n) {
    if (step1) step1.hidden = n !== 1;
    if (step2) step2.hidden = n !== 2;
  }

  function reset() {
    showStep(1);
    if (existingWrap) existingWrap.hidden = true;
    if (uploadWrap) uploadWrap.hidden = true;
    if (pdfInput) pdfInput.value = '';
    if (fileNameEl) fileNameEl.textContent = '';
    overlay.querySelectorAll('.apply-popup-cv-radio').forEach(function (r) {
      r.checked = false;
    });
  }

  function openPopup() {
    reset();
    setOpen(true);
  }

  function closePopup() {
    setOpen(false);
  }

  // Close when clicking overlay background
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closePopup();
  });

  // One click handler for everything
  document.addEventListener('click', function (e) {
    if (e.target.closest('.job-card-apply-btn')) openPopup();
    if (e.target.closest('#applyPopupClose')) closePopup();
    if (e.target.closest('#applyPopupNextBtn')) showStep(2);
    if (e.target.closest('#applyPopupBackBtn')) showStep(1);
  });

  // Toggle extra UI based on selected CV option
  document.addEventListener('change', function (e) {
    var radio = e.target.closest('.apply-popup-cv-radio');
    if (!radio) return;

    var v = radio.value;
    if (existingWrap) existingWrap.hidden = v !== 'existing';
    if (uploadWrap) uploadWrap.hidden = v !== 'upload';
    if (v !== 'upload') {
      if (pdfInput) pdfInput.value = '';
      if (fileNameEl) fileNameEl.textContent = '';
    }
  });

  if (pdfInput) {
    pdfInput.addEventListener('change', function () {
      var name = this.files && this.files[0] ? this.files[0].name : '';
      if (fileNameEl) fileNameEl.textContent = name;
    });
  }

  if (form) form.addEventListener('submit', function (e) { e.preventDefault(); });
});

