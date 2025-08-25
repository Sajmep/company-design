

/*
(function () {
  // Grab all parents that have submenus
  const parents = document.querySelectorAll('.has-submenu');

  function closeAll() {
    parents.forEach(p => {
      p.classList.remove('open');
      const b = p.querySelector('.btn');
      if (b) {
        b.classList.remove('open');
        b.setAttribute('aria-expanded', 'false');
      }
    });
    document.body.classList.remove('submenu-open');
  }

  function openOne(p) {
    // close others first
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

    // Click toggles open/close
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = p.classList.contains('open');
      if (!isOpen) {
        openOne(p);
      } else {
        closeAll();
      }
    });

    // Prevent clicks inside submenu from bubbling to document (so it doesn't close)
    const submenu = p.querySelector('.submenu');
    if (submenu) {
      submenu.addEventListener('click', function (ev) {
        ev.stopPropagation();
      });
    }
  });

  // Click outside to close
  document.addEventListener('click', (ev) => {
    // if click is not inside any open parent, close all
    const anyOpen = Array.from(parents).some(p => p.classList.contains('open') && p.contains(ev.target));
    if (!anyOpen) closeAll();
  });

  // Escape key closes
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') closeAll();
    // Allow Enter/Space on focused .btn to toggle (buttons already handle this)
  });

  // Optional: when window resizes, close submenu (prevents layout glitches)
  window.addEventListener('resize', () => {
    // You can keep it open if you prefer — here we close to be safe
    closeAll();
  });

})();

*/

// replace existing click-based logic for opening submenus with this:
(function () {
const parents = document.querySelectorAll('.has-submenu');

function closeAll() {
parents.forEach(p => {
  p.classList.remove('open');
  const btn = p.querySelector('.btn');
  if (btn) { btn.classList.remove('open'); btn.setAttribute('aria-expanded','false'); }
});
document.body.classList.remove('submenu-open');
}

parents.forEach(p => {
const btn = p.querySelector('.btn');
const submenu = p.querySelector('.submenu');
if (!btn) return;

// open on mouse enter, close on mouse leave
p.addEventListener('mouseenter', () => {
  // open only this one and push content
  parents.forEach(other => {
    if (other !== p) {
      other.classList.remove('open');
      const b = other.querySelector('.btn');
      if (b) { b.classList.remove('open'); b.setAttribute('aria-expanded','false'); }
    }
  });
  p.classList.add('open');
  btn.classList.add('open');
  btn.setAttribute('aria-expanded','true');
  document.body.classList.add('submenu-open');
});

p.addEventListener('mouseleave', () => {
  p.classList.remove('open');
  btn.classList.remove('open');
  btn.setAttribute('aria-expanded','false');
  document.body.classList.remove('submenu-open');
});

// keep submenu clicks from bubbling
if (submenu) submenu.addEventListener('click', ev => ev.stopPropagation());
});

// keep existing "Escape" and outside-click close behavior if you want:
document.addEventListener('click', () => closeAll());
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
})();

