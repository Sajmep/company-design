// Company Prequalification Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const companyPrequalificationModal = document.getElementById('companyPrequalificationModal');
    const closeCompanyPrequalificationModal = document.getElementById('closeCompanyPrequalificationModal');
    const companyPrequalificationBtn = document.querySelector('button[onclick="openCompanyPrequalificationModal()"]');
    
    // Open modal when company prequalification button is clicked
    if (companyPrequalificationBtn) {
        companyPrequalificationBtn.addEventListener('click', function() {
            openCompanyPrequalificationModal();
        });
    }
    
    // Close modal when close button is clicked
    if (closeCompanyPrequalificationModal) {
        closeCompanyPrequalificationModal.addEventListener('click', function() {
            closeCompanyPrequalificationModalFunc();
        });
    }
    
    // Close modal when clicking outside of it
    if (companyPrequalificationModal) {
        companyPrequalificationModal.addEventListener('click', function(e) {
            if (e.target === companyPrequalificationModal) {
                closeCompanyPrequalificationModalFunc();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && companyPrequalificationModal && companyPrequalificationModal.classList.contains('active')) {
            closeCompanyPrequalificationModalFunc();
        }
    });
    
    // Function to open the company prequalification modal
    function openCompanyPrequalificationModal() {
        if (companyPrequalificationModal) {
            companyPrequalificationModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }
    
    // Function to close the company prequalification modal
    function closeCompanyPrequalificationModalFunc() {
        if (companyPrequalificationModal) {
            companyPrequalificationModal.classList.remove('active');
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    }
    
    // Tab functionality
    let currentPrequalTabIndex = 0;
    const prequalTabs = [
        { id: 'company-info', title: 'Company Information' },
        { id: 'legal-docs', title: 'Legal Documents' },
        { id: 'financial-info', title: 'Financial Information' },
        { id: 'certifications', title: 'Certifications' },
        { id: 'references', title: 'References' }
    ];

    function initializePrequalTabs() {
        const prevBtn = document.getElementById('prevPrequalTab');
        const nextBtn = document.getElementById('nextPrequalTab');
        const currentTitle = document.getElementById('currentPrequalTabTitle');

        function updatePrequalTab() {
            // Update title
            currentTitle.textContent = prequalTabs[currentPrequalTabIndex].title;
            
            // Update panels
            document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
            document.getElementById(prequalTabs[currentPrequalTabIndex].id).classList.add('active');
        }

        prevBtn.addEventListener('click', function() {
            if (currentPrequalTabIndex > 0) {
                currentPrequalTabIndex--;
                updatePrequalTab();
            }
        });

        nextBtn.addEventListener('click', function() {
            if (currentPrequalTabIndex < prequalTabs.length - 1) {
                currentPrequalTabIndex++;
                updatePrequalTab();
            }
        });

        // Initialize first tab
        updatePrequalTab();
    }

    // Initialize tabs
    initializePrequalTabs();

    // Make functions globally available
    window.openCompanyPrequalificationModal = openCompanyPrequalificationModal;
    window.closeCompanyPrequalificationModal = closeCompanyPrequalificationModalFunc;
});