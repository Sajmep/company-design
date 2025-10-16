// Compare Property Functionality
document.addEventListener('DOMContentLoaded', function() {
    const compareButtons = document.querySelectorAll('.property-compare-btn');
    const comparePopup = document.getElementById('comparePopup');
    const compareCount = document.getElementById('compareCount');
    const compareDropdown = document.getElementById('compareDropdown');
    let selectedCount = 0;

    // Handle compare button clicks
    compareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (button.disabled) return;
            
            // Disable the button
            button.disabled = true;
            
            // Increase count
            selectedCount++;
            compareCount.textContent = selectedCount;
            
            // Show popup if not already visible
            if (selectedCount > 0) {
                comparePopup.style.display = 'block';
            }
        });
    });
    
    // Toggle dropdown when clicking popup
    comparePopup.addEventListener('click', function(e) {
        e.stopPropagation();
        compareDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        compareDropdown.classList.remove('show');
    });

    // Handle Compare Now button click
    const compareNowBtn = document.getElementById('compareNowBtn');
    const compareModal = document.getElementById('compareModal');
    const closeCompareModal = document.getElementById('closeCompareModal');

    if (compareNowBtn) {
        compareNowBtn.addEventListener('click', function() {
            compareModal.classList.add('show');
        });
    }

    // Close modal when clicking close button
    if (closeCompareModal) {
        closeCompareModal.addEventListener('click', function() {
            compareModal.classList.remove('show');
        });
    }

    // Close modal when clicking outside
    compareModal.addEventListener('click', function(e) {
        if (e.target === compareModal) {
            compareModal.classList.remove('show');
        }
    });
});