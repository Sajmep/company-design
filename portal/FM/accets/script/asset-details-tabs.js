(function () {
  var tabs = document.querySelectorAll('.asset-tabs__btn');
  var panels = document.querySelectorAll('.asset-tab-panel');
  if (!tabs.length || !panels.length) return;

  function activate(id) {
    tabs.forEach(function (btn) {
      var on = btn.id === 'tab-btn-' + id;
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    panels.forEach(function (panel) {
      var on = panel.id === 'tab-' + id;
      panel.classList.toggle('is-active', on);
      panel.hidden = !on;
    });
  }

  tabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panelId = btn.getAttribute('aria-controls');
      if (!panelId || panelId.indexOf('tab-') !== 0) return;
      var id = panelId.replace(/^tab-/, '');
      activate(id);
    });
  });

  activate('overview');
})();
