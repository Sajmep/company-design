// Profile Setup Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const profileSetupModal = document.getElementById('profileSetupModal');
    const closeProfileModal = document.getElementById('closeProfileModal');
    const profileSetupBtn = document.querySelector('button[onclick="openProfileModal()"]');

    // Open modal when profile setup button is clicked
    if (profileSetupBtn) {
        profileSetupBtn.addEventListener('click', function() {
            openProfileModal();
        });
    }

    // Close modal when close button is clicked
    if (closeProfileModal) {
        closeProfileModal.addEventListener('click', function() {
            closeProfileModalFunc();
        });
    }

    // Close modal when clicking outside of it
    if (profileSetupModal) {
        profileSetupModal.addEventListener('click', function(e) {
            if (e.target === profileSetupModal) {
                closeProfileModalFunc();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && profileSetupModal && profileSetupModal.classList.contains('active')) {
            closeProfileModalFunc();
        }
    });

    // Function to open the profile setup modal
    function openProfileModal() {
        if (profileSetupModal) {
            profileSetupModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }

    // Function to close the profile setup modal
    function closeProfileModalFunc() {
        if (profileSetupModal) {
            profileSetupModal.classList.remove('active');
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    }

    // Tab functionality
    let currentTabIndex = 0;
    const tabs = [
        { id: 'personal', title: 'Business Profile' },
        { id: 'company', title: 'Shop & Company Images' },
        { id: 'settings', title: 'Ecommerce & Social Media Details' }
    ];

    function initializeTabs() {
        const prevBtn = document.getElementById('prevTab');
        const nextBtn = document.getElementById('nextTab');
        const modalPrevBtn = document.getElementById('modalPrevBtn');
        const modalNextBtn = document.getElementById('modalNextBtn');
        const currentTitle = document.getElementById('currentTabTitle');

        function updateTab() {
            // Update title
            currentTitle.textContent = tabs[currentTabIndex].title;
            
            // Update panels
            document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
            document.getElementById(tabs[currentTabIndex].id).classList.add('active');
            
            // Update button states
            updateButtonStates();
        }

        function updateButtonStates() {
            // Update top navigation buttons
            if (prevBtn) prevBtn.disabled = currentTabIndex === 0;
            if (nextBtn) nextBtn.disabled = currentTabIndex === tabs.length - 1;
            
            // Update modal footer buttons
            if (modalPrevBtn) {
                modalPrevBtn.disabled = currentTabIndex === 0;
                modalPrevBtn.style.opacity = currentTabIndex === 0 ? '0.5' : '1';
            }
            if (modalNextBtn) {
                // On last tab, change to Submit and enable
                if (currentTabIndex === tabs.length - 1) {
                    modalNextBtn.innerHTML = 'Submit <i class="fas fa-check"></i>';
                    modalNextBtn.disabled = false;
                    modalNextBtn.style.opacity = '1';
                } else {
                    modalNextBtn.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
                    modalNextBtn.disabled = false;
                    modalNextBtn.style.opacity = '1';
                }
            }
        }

        function goToPreviousTab() {
            if (currentTabIndex > 0) {
                currentTabIndex--;
                updateTab();
            }
        }

        function goToNextTab() {
            if (currentTabIndex < tabs.length - 1) {
                currentTabIndex++;
                updateTab();
            } else {
                // On last tab, handle submit action
                handleSubmit();
            }
        }

        function handleSubmit() {
            // Add your submit logic here
            console.log('Form submitted!');
            alert('Profile setup completed successfully!');
            // You can add form validation and submission logic here
            // For now, just close the modal
            closeProfileModalFunc();
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
        updateTab();
        
        // Ensure first tab is visible on modal open
        setTimeout(() => {
            const firstTab = document.getElementById(tabs[0].id);
            if (firstTab) {
                firstTab.classList.add('active');
            }
        }, 50);
    }

    // Initialize tabs
    initializeTabs();

    // Simple toggle function
    function toggleSection(element) {
        const content = element.nextElementSibling;
        content.classList.toggle('collapsed');
        element.classList.toggle('collapsed');
    }


    // Make functions globally available
    window.openProfileModal = openProfileModal;
    window.closeProfileModal = closeProfileModalFunc;
    window.toggleSection = toggleSection;
});
