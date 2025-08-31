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
