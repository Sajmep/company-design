// Job details – open/close apply offcanvas from the right
document.addEventListener('DOMContentLoaded', function () {
  var overlay = document.getElementById('jobDetailsApplyOverlay');
  var closeBtn = document.getElementById('jobDetailsApplyClose');
  var applyBtn = document.querySelector('.job-details-apply-btn');

  if (!overlay) return;

  function openOffcanvas() {
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
  }

  function closeOffcanvas() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
  }

  if (applyBtn) applyBtn.addEventListener('click', openOffcanvas);
  if (closeBtn) closeBtn.addEventListener('click', closeOffcanvas);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeOffcanvas();
  });
});
