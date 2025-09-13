   /* apps dropdown */
   // Toggle dropdown
   document.querySelector(".appsDropdownBtn").addEventListener("click", function(e) {
    e.stopPropagation();
    document.querySelector(".appsDropdown").classList.toggle("active");
  });
  
  // Close when clicking outside
  document.addEventListener("click", function(e) {
    const dropdown = document.querySelector(".appsDropdown");
    const dropdownBtn = document.querySelector(".appsDropdownBtn");
    
    // Only close if click is outside both the dropdown and the dropdown button
    if (!dropdown.contains(e.target) && !dropdownBtn.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });
  
  // Enhanced accordion functionality with smooth animations
  document.querySelectorAll(".apps-category-btn").forEach(btn => {
    btn.addEventListener("click", function() {
      let content = this.nextElementSibling;
      let isVisible = content.style.display === "grid";
      
      // Close all other categories first
      document.querySelectorAll(".apps-category-content").forEach(otherContent => {
        if (otherContent !== content) {
          otherContent.style.display = "none";
          otherContent.previousElementSibling.classList.remove("active");
        }
      });
      
      // Toggle current category
      if (isVisible) {
        content.style.display = "none";
        this.classList.remove("active");
      } else {
        content.style.display = "grid";
        this.classList.add("active");
      }
    });
  });
  
  
  // Add click handlers for app links
  document.querySelectorAll(".apps-category-content a").forEach(link => {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      const appName = this.querySelector("span").textContent;
      const appData = this.getAttribute("data-app");
      
      // Add click animation
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "scale(1)";
      }, 150);
      
      // You can add navigation logic here
      console.log(`Opening ${appName} (${appData})`);
      
      // Optional: Close dropdown after selection
      // document.querySelector(".appsDropdown").classList.remove("active");
    });
  });
  
//   =====================================================================================

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


  //   =====================================================================================

  // Create Dropdown JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const createDropdown = document.querySelector('.create-dropdown');
    const createDropdownBtn = document.querySelector('.create-dropdown-btn');
    const createDropdownMenu = document.querySelector('.create-dropdown-menu');
    const categoryBtns = document.querySelectorAll('.create-category-btn');

    // Toggle dropdown visibility
    createDropdownBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        createDropdownMenu.classList.toggle('show');
        
        // Update aria-expanded
        const isExpanded = createDropdownMenu.classList.contains('show');
        createDropdownBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Toggle category expansion
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.closest('.create-category');
            const categoryList = category.querySelector('.create-category-list');
            
            // Toggle expanded class
            this.classList.toggle('expanded');
            
            // Toggle list visibility using CSS class
            categoryList.classList.toggle('show');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!createDropdown.contains(e.target)) {
            createDropdownMenu.classList.remove('show');
            createDropdownBtn.setAttribute('aria-expanded', 'false');
            
            // Collapse all categories
            categoryBtns.forEach(btn => {
                btn.classList.remove('expanded');
                const category = btn.closest('.create-category');
                const categoryList = category.querySelector('.create-category-list');
                categoryList.classList.remove('show');
            });
        }
    });

    // Close dropdown on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            createDropdownMenu.classList.remove('show');
            createDropdownBtn.setAttribute('aria-expanded', 'false');
            
            // Collapse all categories
            categoryBtns.forEach(btn => {
                btn.classList.remove('expanded');
                const category = btn.closest('.create-category');
                const categoryList = category.querySelector('.create-category-list');
                categoryList.classList.remove('show');
            });
        }
    });
});
