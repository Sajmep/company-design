// First form (your modal) - keep the code I just provided
let currentTab = 0;
const totalTabs = 6;

function showTab(n) {
    const panels = document.querySelectorAll('.tab-panel');
    const steps = document.querySelectorAll('.step');
    const circles = document.querySelectorAll('.step-circle');
    const labels = document.querySelectorAll('.step-label');
    
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
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = progress + '%';
    }
    
    // Update buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) prevBtn.disabled = n === 0;
    
    if (nextBtn) {
        if (n === totalTabs - 1) {
            nextBtn.style.display = 'none';
        } else {
            nextBtn.style.display = 'block';
            nextBtn.textContent = n === totalTabs - 2 ? 'Complete' : 'Next';
        }
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

// Initialize first form
showTab(currentTab);

// Second form (dual forms) - keep this separate with different variables
let activeTab1 = 0;
let activeTab2 = 0;
const maxTabs = 4;

function displayTab(tabIndex, formInstance) {
    const container = document.querySelector(`.form-${formInstance}`);
    if (!container) return; // Exit if container doesn't exist
    
    const panels = container.querySelectorAll('.tab-panel');
    const steps = container.querySelectorAll('.step');
    const circles = container.querySelectorAll('.step-circle');
    const labels = container.querySelectorAll('.step-label');
    
    // Hide all panels
    panels.forEach(panel => panel.classList.remove('active'));
    
    // Show current panel
    panels[tabIndex].classList.add('active');
    
    // Update step indicators
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
    
    // Update progress bar
    const progressPercentage = (tabIndex / (maxTabs - 1)) * 100;
    const progressElement = document.getElementById(`progressFill${formInstance}`);
    if (progressElement) {
        progressElement.style.width = progressPercentage + '%';
    }
    
    // Update buttons
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

// Initialize second form when it exists
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dual forms only if they exist
    if (document.querySelector('.form-1')) {
        displayTab(activeTab1, 1);
        
        // Add click listeners for form 1
        document.querySelectorAll('.form-1 .step').forEach((step, index) => {
            step.addEventListener('click', () => {
                activeTab1 = index;
                displayTab(activeTab1, 1);
            });
        });
    }
    
    if (document.querySelector('.form-2')) {
        displayTab(activeTab2, 2);
        
        // Add click listeners for form 2
        document.querySelectorAll('.form-2 .step').forEach((step, index) => {
            step.addEventListener('click', () => {
                activeTab2 = index;
                displayTab(activeTab2, 2);
            });
        });
    }
});


// countries and state dropdown field

function setupCombo(selectedId, boxId, searchId) {
  const selected = document.getElementById(selectedId);
  const optionsBox = document.getElementById(boxId);
  const searchBox = document.getElementById(searchId);
  const options = optionsBox.querySelectorAll(".option");

  // Toggle dropdown
  selected.addEventListener("click", () => {
    optionsBox.style.display = optionsBox.style.display === "block" ? "none" : "block";
    searchBox.value = "";
    filterOptions("");
  });

  // Pick option
  options.forEach(opt => {
    opt.addEventListener("click", () => {
      selected.value = opt.textContent;
      optionsBox.style.display = "none";
    });
  });

  // Search filter
  searchBox.addEventListener("keyup", () => {
    filterOptions(searchBox.value.toLowerCase());
  });

  function filterOptions(value) {
    options.forEach(opt => {
      opt.style.display = opt.textContent.toLowerCase().includes(value) ? "block" : "none";
    });
  }

  // Close if clicked outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(`#${boxId}`) && e.target !== selected) {
      optionsBox.style.display = "none";
    }
  });
}

// Setup for both dropdowns
setupCombo("countrySelected", "countryBox", "countrySearch");
setupCombo("stateSelected", "stateBox", "stateSearch");

