
// comany setup modal script

// First form (your modal) variables
let currentTab = 0;
const totalTabs = 6;

// Second form (dual forms) variables  
let activeTab1 = 0;
let activeTab2 = 0;
const maxTabs = 4;

// First form (modal) functions - defined first
// First form functions - handles both modal and separate page
function showTab(n) {
  // Try to find modal first, then page
  const modal = document.getElementById('myModal');
  const page = document.getElementById('page');
  const container = modal || page;
  
  if (!container) return;
  
  const panels = container.querySelectorAll('.tab-panel');
  const steps = container.querySelectorAll('.step');
  const circles = container.querySelectorAll('.step-circle');
  const labels = container.querySelectorAll('.step-label');
  
  // Hide all panels
  panels.forEach(panel => panel.classList.remove('active'));
  
  // Show current panel
  if (panels[n]) {
      panels[n].classList.add('active');
  }
  
  // Update step indicators
  steps.forEach((step, index) => {
      const circle = circles[index];
      const label = labels[index];
      
      if (circle && label) {
          circle.classList.remove('active', 'completed');
          label.classList.remove('active');
          
          if (index < n) {
              circle.classList.add('completed');
          } else if (index === n) {
              circle.classList.add('active');
              label.classList.add('active');
          }
      }
  });
  
  // Update progress bar
  const progress = (n / (totalTabs - 1)) * 100;
  const progressFill = container.querySelector('#progressFill');
  if (progressFill) {
      progressFill.style.width = progress + '%';
  }
  
  // Update buttons
  const prevBtn = container.querySelector('#prevBtn');
  const nextBtn = container.querySelector('#nextBtn');
  const prevArrow = container.querySelector('#prevArrow');
  const nextArrow = container.querySelector('#nextArrow');
  
  if (prevBtn) prevBtn.disabled = n === 0;
  if (prevArrow) {
      if (n === 0) {
          prevArrow.style.opacity = '0.5';
          prevArrow.style.pointerEvents = 'none';
      } else {
          prevArrow.style.opacity = '1';
          prevArrow.style.pointerEvents = 'auto';
      }
  }
  
  if (nextBtn) {
      if (n === totalTabs - 1) {
          nextBtn.style.display = 'none';
      } else {
          nextBtn.style.display = 'block';
          nextBtn.textContent = n === totalTabs - 2 ? 'Complete' : 'Next';
      }
  }
  
  if (nextArrow) {
      nextArrow.style.display = n === totalTabs - 1 ? 'none' : 'block';
  }
}
function changeTab(direction) {
  currentTab += direction;
  if (currentTab < 0) currentTab = 0;
  if (currentTab >= totalTabs) currentTab = totalTabs - 1;
  showTab(currentTab);
}

function changeTabs(direction) {
  changeTab(direction);
}

// Second form (dual forms) functions
function displayTab(tabIndex, formInstance) {
  const container = document.querySelector(`.form-${formInstance}`);
  if (!container) return;

  const panels = container.querySelectorAll('.tab-panel');
  const steps = container.querySelectorAll('.step');
  const circles = container.querySelectorAll('.step-circle');
  const labels = container.querySelectorAll('.step-label');

  panels.forEach(panel => panel.classList.remove('active'));
  panels[tabIndex].classList.add('active');

  steps.forEach((step, index) => {
    const circle = circles[index];
    const label = labels[index];

    circle.classList.remove('active', 'completed');
    label.classList.remove('active');

    if (index < tabIndex) {
      circle.classList.add('completed');
    } else if (index === tabIndex) {
      circle.classList.add('active');
      label.classList.add('active');
    }
  });

  const progressPercentage = (tabIndex / (maxTabs - 1)) * 100;
  const progressElement = document.getElementById(`progressFill${formInstance}`);
  if (progressElement) {
    progressElement.style.width = progressPercentage + '%';
  }

  const prevButton = document.getElementById(`prevBtn${formInstance}`);
  const nextButton = document.getElementById(`nextBtn${formInstance}`);

  if (prevButton) prevButton.disabled = tabIndex === 0;

  if (nextButton) {
    if (tabIndex === maxTabs - 1) {
      nextButton.style.display = 'none';
    } else {
      nextButton.style.display = 'block';
      nextButton.textContent = tabIndex === maxTabs - 2 ? 'Submit' : 'Next';
    }
  }
}

function navigateTab(direction, formInstance) {
  if (formInstance === 1) {
    activeTab1 += direction;
    if (activeTab1 < 0) activeTab1 = 0;
    if (activeTab1 >= maxTabs) activeTab1 = maxTabs - 1;
    displayTab(activeTab1, formInstance);
  } else {
    activeTab2 += direction;
    if (activeTab2 < 0) activeTab2 = 0;
    if (activeTab2 >= maxTabs) activeTab2 = maxTabs - 1;
    displayTab(activeTab2, formInstance);
  }
}

function resetForm(formInstance) {
  if (formInstance === 1) {
    activeTab1 = 0;
    displayTab(activeTab1, formInstance);
  } else {
    activeTab2 = 0;
    displayTab(activeTab2, formInstance);
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize modal or page form if it exists
  const modal = document.getElementById('myModal');
  const page = document.getElementById('page');
  const container = modal || page;
  
  if (container) {
      showTab(currentTab);
      
      // Add click listeners for steps
      container.querySelectorAll('.step').forEach((step, index) => {
          step.addEventListener('click', () => {
              currentTab = index;
              showTab(currentTab);
          });
      });
  }
  
  // Initialize dual forms if they exist (keep this unchanged)
  if (document.querySelector('.form-1')) {
      displayTab(activeTab1, 1);
      document.querySelectorAll('.form-1 .step').forEach((step, index) => {
          step.addEventListener('click', () => {
              activeTab1 = index;
              displayTab(activeTab1, 1);
          });
      });
  }
  
  if (document.querySelector('.form-2')) {
      displayTab(activeTab2, 2);
      document.querySelectorAll('.form-2 .step').forEach((step, index) => {
          step.addEventListener('click', () => {
              activeTab2 = index;
              displayTab(activeTab2, 2);
          });
      });
  }
});

// Also initialize immediately (fallback)
setTimeout(() => {
  const modal = document.getElementById('myModal');
  const page = document.getElementById('page');
  if (modal || page) {
      showTab(currentTab);
  }
}, 100);


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
  panel.setAttribute('aria-hidden', String(isOpen))
})

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

//modal functionality company setup
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

//modal functionality company setup
const profileSetupModal = document.getElementById("profileSetupModal");
const companyProfileBtn = document.querySelector(".company-profile-btn");
const closeProfileModal = document.getElementById("closeProfileModal");

companyProfileBtn.addEventListener("click", () => {
  profileSetupModal.style.display = "flex";
});

closeProfileModal.addEventListener("click", () => {
  profileSetupModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    profileSetupModal.style.display = "none";
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

// Small JS to help on touch devices: tapping a menu item toggles .open.
// Also update aria-expanded.
(function () {
  const parents = document.querySelectorAll('.has-submenu');
  parents.forEach(p => {
    const btn = p.querySelector('.menu-btn');

    // toggle on click for touch devices
    btn.addEventListener('click', (e) => {
      // if already open, let a click inside submenu not be blocked. If not open, open it and prevent default action.
      if (!p.classList.contains('open')) {
        e.preventDefault();
        // close others
        document.querySelectorAll('.has-submenu.open').forEach(x => {
          if (x !== p) x.classList.remove('open');
          const b = x.querySelector('.menu-btn');
          if (b) b.setAttribute('aria-expanded', 'false');
        });
        p.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      } else {
        // if already open, clicking the button closes it
        p.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    // close when clicking elsewhere
    document.addEventListener('click', (ev) => {
      if (!p.contains(ev.target)) {
        p.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });
})();


