// Manage page interactions (tabs, submenu)
(function () {
  const closeProjectSwitch = () => {
    const wrap = document.querySelector('[data-project-switch]');
    if (!wrap) return;
    const btn = wrap.querySelector('[data-project-switch-btn]');
    const menu = wrap.querySelector('[data-project-switch-menu]');
    if (!btn || !menu) return;
    wrap.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  };

  const toggleProjectSwitch = () => {
    const wrap = document.querySelector('[data-project-switch]');
    if (!wrap) return;
    const btn = wrap.querySelector('[data-project-switch-btn]');
    const menu = wrap.querySelector('[data-project-switch-menu]');
    if (!btn || !menu) return;
    const isOpen = !wrap.classList.contains('is-open');
    wrap.classList.toggle('is-open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
    menu.setAttribute('aria-hidden', String(!isOpen));
  };

  // Manage page tabs
  const setManageTab = (name) => {
    if (!name) return;
    document.querySelectorAll('.manage-tab-btn[data-manage-tab]').forEach(function (tabBtn) {
      const isActive = tabBtn.getAttribute('data-manage-tab') === name;
      tabBtn.classList.toggle('is-active', isActive);
      tabBtn.setAttribute('aria-selected', String(isActive));
    });

    document.querySelectorAll('.manage-tab-panel[data-manage-panel]').forEach(function (panel) {
      const isActive = panel.getAttribute('data-manage-panel') === name;
      panel.classList.toggle('is-active', isActive);
      panel.setAttribute('aria-hidden', String(!isActive));
    });
  };

  // Area of work inner tabs (All / Buildings / Floors / Spaces)
  const setAreaTab = (name) => {
    if (!name) return;
    document.querySelectorAll('.manage-subtab-btn[data-area-tab]').forEach(function (btn) {
      const isActive = btn.getAttribute('data-area-tab') === name;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });

    document.querySelectorAll('.manage-area-panel[data-area-panel]').forEach(function (panel) {
      const isActive = panel.getAttribute('data-area-panel') === name;
      panel.classList.toggle('is-active', isActive);
      panel.setAttribute('aria-hidden', String(!isActive));
    });
  };

  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.manage-tab-btn[data-manage-tab]');
    if (!btn) return;
    setManageTab(btn.getAttribute('data-manage-tab'));
  });

  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.manage-subtab-btn[data-area-tab]');
    if (!btn) return;
    setAreaTab(btn.getAttribute('data-area-tab'));
  });

  // Area of work view switch (table/cards) per panel
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-aow-view-btn]');
    if (!btn) return;
    const panel = btn.closest('.manage-area-panel[data-aow-view]');
    if (!panel) return;
    const view = btn.getAttribute('data-aow-view-btn');
    if (!view) return;
    panel.setAttribute('data-aow-view', view);

    panel.querySelectorAll('[data-aow-view-btn]').forEach(function (b) {
      const isActive = b.getAttribute('data-aow-view-btn') === view;
      b.classList.toggle('is-active', isActive);
      b.setAttribute('aria-pressed', String(isActive));
    });
  });

  // Switch project dropdown
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-project-switch-btn]');
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      toggleProjectSwitch();
      return;
    }

    const insideMenu = e.target.closest('[data-project-switch-menu]');
    if (insideMenu) return;

    closeProjectSwitch();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeProjectSwitch();
  });

  // Context sidebar submenu links -> switch tabs
  document.addEventListener('click', function (e) {
    const link = e.target.closest('[data-manage-tab-link]');
    if (!link) return;
    e.preventDefault();
    setManageTab(link.getAttribute('data-manage-tab-link'));
  });

  // Manage submenu toggle
  document.addEventListener('click', function (e) {
    const toggle = e.target.closest('[data-manage-submenu-toggle]');
    if (!toggle) return;
    const wrap = document.querySelector('[data-manage-submenu]');
    if (!wrap) return;
    const isOpen = wrap.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // If URL has hash, open matching tab on load
  if (location.hash) {
    const hash = location.hash.replace('#', '');
    if (hash) setManageTab(hash);
  }

  // Default inner tab selection
  setAreaTab('all');

  // Expand/collapse detail cards (if present)
  document.querySelectorAll('.project-details-card > h3').forEach(function (heading) {
    heading.classList.add('project-details-section-toggle');
    heading.setAttribute('role', 'button');
    heading.setAttribute('tabindex', '0');
    heading.setAttribute('aria-expanded', 'true');

    const toggle = function () {
      const card = heading.closest('.project-details-card');
      if (!card) return;
      const collapsed = card.classList.toggle('is-collapsed');
      heading.setAttribute('aria-expanded', String(!collapsed));
    };

    heading.addEventListener('click', toggle);
    heading.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
})();

