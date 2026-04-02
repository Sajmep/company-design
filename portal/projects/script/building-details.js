// Minimal tabs logic for Building Details page
(function () {
  const tabs = Array.from(document.querySelectorAll('.bd-tab-btn[data-bd-tab]'));
  const panels = Array.from(document.querySelectorAll('.bd-tab-panel[data-bd-panel]'));
  if (!tabs.length || !panels.length) return;

  const setActive = (name) => {
    if (!name) return;
    tabs.forEach(function (btn) {
      const isActive = btn.getAttribute('data-bd-tab') === name;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });

    panels.forEach(function (panel) {
      const isActive = panel.getAttribute('data-bd-panel') === name;
      panel.classList.toggle('is-active', isActive);
      panel.setAttribute('aria-hidden', String(!isActive));
    });
  };

  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.bd-tab-btn[data-bd-tab]');
    if (!btn) return;
    setActive(btn.getAttribute('data-bd-tab'));
  });
})();

