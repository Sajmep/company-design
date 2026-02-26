     // Explore button functionality
     const exploreMain = document.getElementById('exploreMain');
     const createButton = document.getElementById('createButton');
     const categoriesPopover = document.getElementById('categoriesPopover');
     const closePopover = document.getElementById('closePopover');
     const categoryItems = document.querySelectorAll('.category-item');
     const fabBox = document.getElementById('fabBox');

     // Close explore button functionality
     const closeExploreBtn = document.getElementById('closeExploreBtn');
     
     closeExploreBtn.addEventListener('click', function(e) {
       e.preventDefault();
       e.stopPropagation();
       
       // Close any open menus first
       fabBox.classList.remove('active');
       categoriesPopover.classList.remove('show');
       fabBox.classList.remove('popover-open');
       
       // Hide the entire explore button box
       fabBox.style.display = 'none';
       
       // Hide the close button itself
       closeExploreBtn.style.display = 'none';
     });

     // Toggle explore menu on main button click
     exploreMain.addEventListener('click', function(e) {
       e.preventDefault();
       e.stopPropagation();
       
       // Remove hover state to hide tooltip
       this.blur();
       
       // Toggle explore menu
       if (fabBox.classList.contains('active')) {
         fabBox.classList.remove('active');
       } else {
         fabBox.classList.add('active');
         // Close popover if open
         categoriesPopover.classList.remove('show');
         fabBox.classList.remove('popover-open');
       }
     });

     // Open popover on create button click
     createButton.addEventListener('click', function(e) {
       e.preventDefault();
       e.stopPropagation();
       
       // Toggle popover
       if (categoriesPopover.classList.contains('show')) {
         categoriesPopover.classList.remove('show');
         fabBox.classList.remove('popover-open');
       } else {
         categoriesPopover.classList.add('show');
         fabBox.classList.add('popover-open');
         // Close explore menu if open
         fabBox.classList.remove('active');
       }
     });

     // Close popover
     closePopover.addEventListener('click', function(e) {
       e.preventDefault();
       e.stopPropagation();
       categoriesPopover.classList.remove('show');
       fabBox.classList.remove('popover-open');
     });

     // Close both menus when clicking outside
     document.addEventListener('click', function(e) {
       if (!fabBox.contains(e.target)) {
         fabBox.classList.remove('active');
         categoriesPopover.classList.remove('show');
         fabBox.classList.remove('popover-open');
       }
     });

     // Expand/collapse categories (only one open at a time)
     categoryItems.forEach(item => {
       const header = item.querySelector('.category-header');
       const items = item.querySelector('.category-items');
       const expandIcon = item.querySelector('.expand-icon');

       header.addEventListener('click', function(e) {
         e.preventDefault();
         e.stopPropagation();
         
         const isExpanded = items.style.display === 'block';
         
         // Close all other categories first
         categoryItems.forEach(otherItem => {
           if (otherItem !== item) {
             const otherItems = otherItem.querySelector('.category-items');
             const otherExpandIcon = otherItem.querySelector('.expand-icon');
             otherItems.style.display = 'none';
             otherExpandIcon.textContent = '+';
           }
         });
         
         // Toggle current category
         items.style.display = isExpanded ? 'none' : 'block';
         expandIcon.textContent = isExpanded ? '+' : '-';
       });
     });