// Minimal tabs logic for Add Project offcanvas
document.addEventListener('DOMContentLoaded', () => {
  const tabs = Array.from(document.querySelectorAll('.project-create-tab-btn'));
  const panels = Array.from(document.querySelectorAll('.project-create-tab-panel'));

  if (!tabs.length || !panels.length) return;

  const setActiveTab = (name) => {
    tabs.forEach((btn) => {
      const isActive = btn.dataset.tab === name;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.tabPanel === name;
      panel.classList.toggle('is-active', isActive);
      panel.toggleAttribute('aria-hidden', !isActive);
    });
  };

  tabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.tab;
      if (!name) return;
      setActiveTab(name);
    });
  });
});

