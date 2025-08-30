// bell dropdown script


document.addEventListener('click', e => {
  document.querySelectorAll('.bell-section details[open]').forEach(d => {
    if (!d.contains(e.target)) d.open = false;
  });
});

document.querySelectorAll(".bell-section .tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const parent = btn.closest(".bell-section");
    const tab = btn.dataset.tab;

    // Switch active button
    parent.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // Switch active panel
    parent.querySelectorAll(".bell-tab-content .tab-panel").forEach(panel => {
      panel.classList.remove("active");
    });
    parent.querySelector(`.bell-tab-content .${tab}-tab`).classList.add("active");
  });
});