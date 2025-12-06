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
        { id: 'project-list', title: 'Company Information' },
        { id: 'equipment-list', title: 'Equipment List' },
        { id: 'company-documents', title: 'Company Documents' },
        { id: 'certificate-documents', title: 'Certificate Documents' }
    ];

    function initializePrequalTabs() {
        const prevBtn = document.getElementById('prevPrequalTab');
        const nextBtn = document.getElementById('nextPrequalTab');
        const modalPrevBtn = document.getElementById('prequalModalPrevBtn');
        const modalNextBtn = document.getElementById('prequalModalNextBtn');
        const currentTitle = document.getElementById('currentPrequalTabTitle');

        function updatePrequalTab() {
            // Update title
            if (currentTitle) {
                currentTitle.textContent = prequalTabs[currentPrequalTabIndex].title;
            }
            
            // Update panels - look in the page content or modal
            const prequalModal = document.getElementById('companyPrequalificationModal');
            const prequalPageContent = document.querySelector('.prequalification-page-content');
            const container = prequalModal || prequalPageContent;
            
            if (container) {
                container.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
                const targetPanel = container.querySelector('#' + prequalTabs[currentPrequalTabIndex].id);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            } else {
                // Fallback: search entire document
                document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
                const targetPanel = document.getElementById(prequalTabs[currentPrequalTabIndex].id);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            }
        }

        function goToPreviousTab() {
            if (currentPrequalTabIndex > 0) {
                currentPrequalTabIndex--;
                updatePrequalTab();
            }
        }

        function goToNextTab() {
            if (currentPrequalTabIndex < prequalTabs.length - 1) {
                currentPrequalTabIndex++;
                updatePrequalTab();
            }
        }

        // Top navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', goToPreviousTab);
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', goToNextTab);
        }

        // Modal footer buttons
        if (modalPrevBtn) {
            modalPrevBtn.addEventListener('click', goToPreviousTab);
        }

        if (modalNextBtn) {
            modalNextBtn.addEventListener('click', goToNextTab);
        }

        // Initialize first tab
        updatePrequalTab();
    }

    // Initialize tabs
    initializePrequalTabs();

    // Make functions globally available
    window.openCompanyPrequalificationModal = openCompanyPrequalificationModal;
    window.closeCompanyPrequalificationModal = closeCompanyPrequalificationModalFunc;
});