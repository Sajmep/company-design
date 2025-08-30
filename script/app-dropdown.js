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
  
  