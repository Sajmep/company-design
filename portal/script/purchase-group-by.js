
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

