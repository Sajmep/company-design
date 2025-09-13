
// Group By Dropdown Functions
function toggleGroupByDropdown() {
    const dropdown = document.getElementById('groupByDropdown');
    const button = document.querySelector('.group-by-button');
    
    if (dropdown.classList.contains('show')) {
        closeGroupByDropdown();
    } else {
        openGroupByDropdown();
    }
}

function openGroupByDropdown() {
    const dropdown = document.getElementById('groupByDropdown');
    const button = document.querySelector('.group-by-button');
    
    dropdown.classList.add('show');
    button.classList.add('active');
}

function closeGroupByDropdown() {
    const dropdown = document.getElementById('groupByDropdown');
    const button = document.querySelector('.group-by-button');
    
    dropdown.classList.remove('show');
    button.classList.remove('active');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const groupByContainer = document.querySelector('.group-by-container');
    if (groupByContainer && !groupByContainer.contains(event.target)) {
        closeGroupByDropdown();
    }
});

// Toggle section expand/collapse
function toggleSection(sectionName) {
    const section = document.querySelector(`#${sectionName}-content`).closest('.dropdown-section');
    const isExpanded = section.classList.contains('expanded');
    
    if (isExpanded) {
        section.classList.remove('expanded');
    } else {
        section.classList.add('expanded');
    }
}

// Handle sub-item selection
document.addEventListener('click', function(event) {
    if (event.target.closest('.sub-item')) {
        const item = event.target.closest('.sub-item');
        const value = item.getAttribute('data-value');
        
        // Remove previous selection
        document.querySelectorAll('.sub-item').forEach(el => el.classList.remove('selected'));
        
        // Add selection to clicked item
        item.classList.add('selected');
        
        // You can customize this based on your needs
        console.log('Selected group by:', value);
        
        // Close dropdown
        closeGroupByDropdown();
    }
});
