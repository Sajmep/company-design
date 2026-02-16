// Views Container - View Switching
document.addEventListener('DOMContentLoaded', function() {
    // View containers mapping
    const views = {
        dashboard: { element: document.querySelector('.bmh-jobs-dashboard-view'), display: 'block' },
        card: { element: document.querySelector('.bmh-jobs-card-view'), display: 'flex' },
        list: { element: document.querySelector('.bmh-jobs-list-view'), display: 'flex' },
        calendar: { element: document.querySelector('.bmh-jobs-calendar-view'), display: 'block' },
        map: { element: document.querySelector('.bmh-jobs-map-view'), display: 'block' }
    };

    // Hide all views
    function hideAllViews() {
        Object.values(views).forEach(view => {
            if (view.element) view.element.style.display = 'none';
        });
    }

    // Show specific view
    function showView(viewType) {
        const view = views[viewType];
        if (view && view.element) {
            hideAllViews();
            view.element.style.display = view.display;
        }
    }

    // Initialize: show card view by default
    showView('card');

    // Override switchView function from toolbar.js
    window.switchView = function(viewType) {
        showView(viewType);
    };

    // Apply popup: open on Apply now, close on overlay or close button
    var overlay = document.getElementById('applyPopupOverlay');
    var closeBtn = document.getElementById('applyPopupClose');
    function openApplyPopup() { overlay.classList.add('is-open'); overlay.setAttribute('aria-hidden', 'false'); }
    function closeApplyPopup() { overlay.classList.remove('is-open'); overlay.setAttribute('aria-hidden', 'true'); }
    overlay.addEventListener('click', closeApplyPopup);
    if (closeBtn) closeBtn.addEventListener('click', closeApplyPopup);
    document.querySelectorAll('.job-card-apply-btn').forEach(function(btn) {
        btn.addEventListener('click', openApplyPopup);
    });
    var applyForm = document.getElementById('applyPopupForm');
    if (applyForm) applyForm.addEventListener('submit', function(e) { e.preventDefault(); });

    // Apply popup steps: Next -> step 2, Back -> step 1, reset on open
    var step1 = document.getElementById('applyPopupStep1');
    var step2 = document.getElementById('applyPopupStep2');
    var nextBtn = document.getElementById('applyPopupNextBtn');
    var backBtn = document.getElementById('applyPopupBackBtn');
    var existingWrap = document.getElementById('applyPopupExistingWrap');
    var uploadWrap = document.getElementById('applyPopupUploadWrap');
    var cvRadios = document.querySelectorAll('.apply-popup-cv-radio');
    var pdfInput = document.getElementById('applyPopupPdf');
    var fileNameEl = document.getElementById('applyPopupFileName');

    function showApplyStep(stepEl) {
      if (step1) step1.hidden = (stepEl !== step1);
      if (step2) step2.hidden = (stepEl !== step2);
    }
    if (nextBtn) nextBtn.addEventListener('click', function() { showApplyStep(step2); });
    if (backBtn) backBtn.addEventListener('click', function() { showApplyStep(step1); });
    function resetApplyPopupSteps() {
      showApplyStep(step1);
      if (existingWrap) existingWrap.hidden = true;
      if (uploadWrap) uploadWrap.hidden = true;
      if (fileNameEl) fileNameEl.textContent = '';
      if (pdfInput) pdfInput.value = '';
      cvRadios.forEach(function(r) { r.checked = false; });
    }
    var openApplyPopupOriginal = openApplyPopup;
    openApplyPopup = function() {
      resetApplyPopupSteps();
      openApplyPopupOriginal();
    };

    cvRadios.forEach(function(radio) {
      radio.addEventListener('change', function() {
        var v = this.value;
        if (existingWrap) existingWrap.hidden = (v !== 'existing');
        if (uploadWrap) uploadWrap.hidden = (v !== 'upload');
        if (v !== 'upload' && fileNameEl) fileNameEl.textContent = '';
        if (v !== 'upload' && pdfInput) pdfInput.value = '';
      });
    });
    if (pdfInput) pdfInput.addEventListener('change', function() {
      var name = this.files && this.files[0] ? this.files[0].name : '';
      if (fileNameEl) fileNameEl.textContent = name;
    });

    // Job card Save button toggle
    document.querySelectorAll('.job-card-save-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var icon = this.querySelector('.job-card-save-icon');
            var text = this.querySelector('.job-card-save-text');
            this.classList.toggle('saved');
            if (this.classList.contains('saved')) {
                icon.classList.remove('fa-bookmark-o');
                icon.classList.add('fa-bookmark');
                if (text) text.textContent = 'Saved';
            } else {
                icon.classList.remove('fa-bookmark');
                icon.classList.add('fa-bookmark-o');
                if (text) text.textContent = 'Save';
            }
        });
    });
});