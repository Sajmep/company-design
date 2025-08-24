const dropdown = document.querySelector(".dropdown-advanced");
const btn = dropdown.querySelector(".dropdown-btn");

btn.addEventListener("click", () => {
  dropdown.classList.toggle("show");
});

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!dropdown.contains(e.target)) {
    dropdown.classList.remove("show");
  }
});

// Sidebar toggle for mobile
const btnOpen = document.getElementById('btn-open');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');


function openSidebar() { sidebar.classList.add('open'); overlay.classList.add('show') }
function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('show') }


btnOpen && btnOpen.addEventListener('click', () => { if (sidebar.classList.contains('open')) closeSidebar(); else openSidebar(); });
overlay && overlay.addEventListener('click', closeSidebar);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSidebar(); });


// Dropdown accessible toggling for account menu
const ddBtn = document.querySelector('.dropdown-btn');
const ddMenu = document.querySelector('.dropdown-menu');
if (ddBtn) {
  ddBtn.addEventListener('click', (e) => {
    const expanded = ddBtn.getAttribute('aria-expanded') === 'true';
    ddBtn.setAttribute('aria-expanded', !expanded);
    if (!expanded) { ddMenu.style.display = 'block'; ddMenu.setAttribute('aria-hidden', 'false'); } else { ddMenu.style.display = 'none'; ddMenu.setAttribute('aria-hidden', 'true'); }
  });
  // close when clicking outside
  document.addEventListener('click', (e) => { if (!ddBtn.contains(e.target) && !ddMenu.contains(e.target)) { ddMenu.style.display = 'none'; ddMenu.setAttribute('aria-hidden', 'true'); ddBtn.setAttribute('aria-expanded', 'false'); } });
}

const selector = document.getElementById('selector')
const panel = document.getElementById('panel')
const selectedTitle = document.getElementById('selectedTitle')

selector.addEventListener('click', () => {
   const isOpen = panel.style.display === 'block'
    panel.style.display = isOpen ? 'none' : 'block'
      selector.setAttribute('aria-expanded', String(!isOpen))
       panel.setAttribute('aria-hidden', String(isOpen)) })

// item clicks — simple and clickable only
document.querySelectorAll('.panel .item, .item').forEach(el => {
  el.addEventListener('click', () => {
    const title = el.getAttribute('data-title')
    if (title) selectedTitle.textContent = title
    panel.style.display = 'none'
    selector.setAttribute('aria-expanded', 'false')
    panel.setAttribute('aria-hidden', 'true')
  })
})

// GSAP registration
gsap.registerPlugin(CustomEase);
// Custom eases - make sure they're created only once
if (!CustomEase.get("circleEase")) {
  CustomEase.create("circleEase", "0.68, -0.55, 0.265, 1.55");
  CustomEase.create("bounceOut", "0.22, 1.2, 0.36, 1");
  CustomEase.create("slowStart", "0.5, 0, 0.1, 1");
  CustomEase.create("elasticOut", "0.64, 0.57, 0.67, 1.53");
  CustomEase.create("fastSpin", ".17,.67,.83,.67");
  CustomEase.create("smoothFlip", "0.45, 0, 0.55, 1");
}

// Animation configurations
const animationConfigs = {
  "dots-grid": {
    init: (element) => {
      gsap.set(element.querySelectorAll(".dot"), {
        scale: 1,
        opacity: 1,
        x: 0,
        y: 0
      });
    },
    activate: (element) => {
      const dots = element.querySelectorAll(".dot");
      gsap.to(dots[0], {
        x: 30,
        y: 30,
        scale: 1.2,
        ease: "circleEase",
        duration: 0.6
      });
      gsap.to(dots[1], {
        opacity: 0,
        scale: 5,
        ease: "circleEase",
        duration: 0.6
      });
      gsap.to(dots[2], {
        x: -30,
        y: 30,
        scale: 1.2,
        ease: "circleEase",
        duration: 0.6
      });
      gsap.to(dots[3], {
        opacity: 0,
        scale: 5,
        ease: "circleEase",
        duration: 0.6
      });
      gsap.to(dots[4], {
        scale: 1.2,
        ease: "circleEase",
        duration: 0.6
      });
      gsap.to(dots[5], {
        opacity: 0,
        scale: 5,
        ease: "circleEase",
        duration: 0.3
      });
      gsap.to(dots[6], {
        x: 30,
        y: -30,
        scale: 1.2,
        ease: "circleEase",
        duration: 0.6
      });
      gsap.to(dots[7], {
        opacity: 0,
        scale: 5,
        ease: "circleEase",
        duration: 0.6
      });
      gsap.to(dots[8], {
        x: -30,
        y: -30,
        scale: 1.2,
        ease: "circleEase",
        duration: 0.6
      });
    },
    deactivate: (element) => {
      gsap.to(element.querySelectorAll(".dot"), {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        ease: "circleEase",
        duration: 0.6
      });
    }
  }
};
// Initialize animations and set up corner effects on page load
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all menu animations
  document.querySelectorAll(".menu-container").forEach((container) => {
    const menuElement = container.children[0];
    const type = menuElement.className;
    // Apply initial state if config exists
    if (animationConfigs[type] && animationConfigs[type].init) {
      animationConfigs[type].init(menuElement);
    }
    // Click event handler
    container.addEventListener("click", () => {
      const isActive = menuElement.classList.toggle("active");
      // Run animation based on state and check if config exists
      if (animationConfigs[type]) {
        if (isActive && animationConfigs[type].activate) {
          animationConfigs[type].activate(menuElement);
        } else if (!isActive && animationConfigs[type].deactivate) {
          animationConfigs[type].deactivate(menuElement);
        }
      }
    });
  });

});

//modal functionality

const modal = document.getElementById("myModal");
    const openBtn = document.querySelector(".open-btn");
    const closeBtn = document.getElementById("closeModal");

    openBtn.addEventListener("click", () => {
      modal.style.display = "flex";
    });

    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });


    

// collaps script

function toggleSection(titleElement) {
  const checkboxGroup = titleElement.nextElementSibling;
  const formRow = titleElement.nextElementSibling;
  
  if (checkboxGroup.classList.contains('collapsed')) {
      formRow.classList.remove('collapsed');
      checkboxGroup.classList.remove('collapsed');
      titleElement.classList.remove('collapsed');
  } else {
      checkboxGroup.classList.add('collapsed');
      formRow.classList.add('collapsed');
      titleElement.classList.add('collapsed');
  }
}


// phone number fields for country code 

const input_phone = document.querySelector("#phone");
const input_mobile = document.querySelector("#mobile");
const input_unified_no = document.querySelector("#unified_no");

window.intlTelInput(input_phone, {
  initialCountry: "sa", // Default: Saudi Arabia 🇸🇦
  preferredCountries: ["sa", "us", "gb"], // Optional: show top countries first
  separateDialCode: true, // Show country code separately
});

window.intlTelInput(input_mobile, {
  initialCountry: "sa", // Default: Saudi Arabia 🇸🇦
  preferredCountries: ["sa", "us", "gb"], // Optional: show top countries first
  separateDialCode: true, // Show country code separately
});

window.intlTelInput(input_unified_no, {
  initialCountry: "sa", // Default: Saudi Arabia 🇸🇦
  preferredCountries: ["sa", "us", "gb"], // Optional: show top countries first
  separateDialCode: true, // Show country code separately
});


let activePanel = null;

document.querySelectorAll('.sidebar-item').forEach(item => {
    const panel = item.querySelector('.submenu');
    
    if (panel) {
        item.addEventListener('mouseenter', () => {
            // Hide any currently active panel
            if (activePanel && activePanel !== panel) {
                activePanel.style.display = 'none';
            }
            // Show this panel
            panel.style.display = 'block';
            activePanel = panel;
        });
        
        // Keep panel open when hovering over the panel itself
        panel.addEventListener('mouseenter', () => {
            panel.style.display = 'block';
        });
        
        panel.addEventListener('mouseleave', () => {
            panel.style.display = 'none';
            activePanel = null;
        });
    }
});