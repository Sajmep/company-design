
// Property Comparison Modal - Two Step Process
document.addEventListener('DOMContentLoaded', function() {
    const comparisonModal = document.getElementById('comparisonModal');
    const comparisonModalStep2 = document.getElementById('comparisonModalStep2');
    const closeModalBtn = document.getElementById('closeComparisonModal');
    const closeModalBtnStep2 = document.getElementById('closeComparisonModalStep2');
    const compareButtons = document.querySelectorAll('.property-compare-btn');
    const compareNowBtn = document.getElementById('compareNowBtn');
    const backToSelectionBtn = document.getElementById('backToSelectionBtn');
    
    // Open Step 1 modal when compare button is clicked
    compareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openStep1Modal();
        });
    });
    
    // Close Step 1 modal when close button is clicked
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            closeStep1Modal();
        });
    }
    
    // Close Step 2 modal when close button is clicked
    if (closeModalBtnStep2) {
        closeModalBtnStep2.addEventListener('click', function() {
            closeStep2Modal();
        });
    }
    
    // Open Step 2 modal when Compare Now button is clicked
    if (compareNowBtn) {
        compareNowBtn.addEventListener('click', function() {
            openStep2Modal();
        });
    }
    
    // Go back to Step 1 from Step 2
    if (backToSelectionBtn) {
        backToSelectionBtn.addEventListener('click', function() {
            goBackToStep1();
        });
    }
    
    // Close Step 1 modal when clicking outside
    if (comparisonModal) {
        comparisonModal.addEventListener('click', function(e) {
            if (e.target === comparisonModal) {
                closeStep1Modal();
            }
        });
    }
    
    // Close Step 2 modal when clicking outside
    if (comparisonModalStep2) {
        comparisonModalStep2.addEventListener('click', function(e) {
            if (e.target === comparisonModalStep2) {
                closeStep2Modal();
            }
        });
    }
    
    function openStep1Modal() {
        if (comparisonModal) {
            comparisonModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeStep1Modal() {
        if (comparisonModal) {
            comparisonModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    function openStep2Modal() {
        // Close Step 1
        closeStep1Modal();
        
        // Open Step 2
        if (comparisonModalStep2) {
            comparisonModalStep2.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeStep2Modal() {
        if (comparisonModalStep2) {
            comparisonModalStep2.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    function goBackToStep1() {
        // Close Step 2
        closeStep2Modal();
        
        // Open Step 1
        openStep1Modal();
    }
});