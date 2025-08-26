(function () {
  const parents = document.querySelectorAll('.has-submenu');

  function closeAll() {
    parents.forEach(p => {
      p.classList.remove('open');
      const btn = p.querySelector('.btn');
      if (btn) {
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
    document.body.classList.remove('submenu-open');
  }

  function openOne(p) {
    parents.forEach(other => {
      if (other !== p) {
        other.classList.remove('open');
        const b = other.querySelector('.btn');
        if (b) { b.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); }
      }
    });
    p.classList.add('open');
    const btn = p.querySelector('.btn');
    if (btn) { btn.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
    document.body.classList.add('submenu-open');
  }

  parents.forEach(p => {
    const btn = p.querySelector('.btn');
    const submenu = p.querySelector('.submenu');
    if (!btn) return;

    if (window.innerWidth < 992) {
      // 👉 Mobile/tablet → CLICK
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = p.classList.contains('open');
        if (!isOpen) {
          openOne(p);
        } else {
          closeAll();
        }
      });
    } else {
      // 👉 Desktop → HOVER
      p.addEventListener('mouseenter', () => openOne(p));
      p.addEventListener('mouseleave', () => closeAll());
    }

    // Prevent clicks inside submenu from closing it
    if (submenu) submenu.addEventListener('click', ev => ev.stopPropagation());
  });

  // Global close handlers
  document.addEventListener('click', () => closeAll());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

  // Optional: on resize, reset and re-run behavior
  window.addEventListener('resize', () => {
    closeAll();
    // You could reload or re-init listeners if you want dynamic switch
    // (simplest is to just refresh to apply new mode)
  });
})();

document.querySelectorAll(".has-submenu").forEach(item => {
  item.addEventListener("click", function (e) {
    // Only enable click toggle on mobile (width <= 768px)
    if (window.innerWidth <= 768) {
      e.preventDefault();
      this.classList.toggle("submenu-open");
    }
  });
});
