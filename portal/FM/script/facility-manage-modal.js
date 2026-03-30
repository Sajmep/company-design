(function () {
  var tabButtons = document.querySelectorAll('.facility-manage-tabs__btn');
  var panels = document.querySelectorAll('.facility-manage-panel');

  function setTab(panelId) {
    tabButtons.forEach(function (btn) {
      var id = btn.getAttribute('aria-controls');
      var on = id === panelId;
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    panels.forEach(function (panel) {
      var on = panel.id === panelId;
      panel.classList.toggle('is-active', on);
      panel.hidden = !on;
    });
  }

  if (tabButtons.length && panels.length) {
    tabButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var panelId = btn.getAttribute('aria-controls');
        if (panelId) setTab(panelId);
      });
    });
  }

  var openBtn = document.getElementById('facilityManageOpen');
  var backdrop = document.getElementById('facilityManageBackdrop');
  var dialog = document.getElementById('facilityManageDialog');
  var closeBtn = document.getElementById('facilityManageClose');

  if (!openBtn || !backdrop || !dialog || !closeBtn) {
    return;
  }

  var lastFocus = null;

  function openModal() {
    lastFocus = document.activeElement;
    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    dialog.focus();
  }

  function closeModal() {
    backdrop.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
    }
  }

  openBtn.addEventListener('click', function (e) {
    e.preventDefault();
    openModal();
  });

  closeBtn.addEventListener('click', closeModal);

  backdrop.addEventListener('click', function (e) {
    if (e.target === backdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !backdrop.hidden) {
      closeModal();
    }
  });
})();
