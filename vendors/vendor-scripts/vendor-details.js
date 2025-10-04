// Vendor Details Tab Switching
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.vendor-tab-btn');
    const tabContents = document.querySelectorAll('.vendor-tab-content');

    // Tab switching function
    function switchTab(targetTab) {
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked button
        const activeButton = document.querySelector(`[data-tab="${targetTab}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }

        // Show corresponding content
        const activeContent = document.getElementById(targetTab);
        if (activeContent) {
            activeContent.classList.add('active');
        }
    }

    // Add click event listeners to all tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
});

// Expertise Tabs functionality
document.addEventListener('DOMContentLoaded', function() {
    const expertiseTabButtons = document.querySelectorAll('.expertise-tab-btn');
    const expertiseTabContents = document.querySelectorAll('.expertise-tab-content');

    // Expertise tab switching function
    function switchExpertiseTab(targetTab) {
        // Remove active class from all expertise buttons and contents
        expertiseTabButtons.forEach(btn => btn.classList.remove('active'));
        expertiseTabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked button
        const activeButton = document.querySelector(`[data-expertise-tab="${targetTab}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }

        // Show corresponding content
        const activeContent = document.getElementById(`expertise-${targetTab}`);
        if (activeContent) {
            activeContent.classList.add('active');
        }
    }

    // Add click event listeners to all expertise tab buttons
    expertiseTabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-expertise-tab');
            switchExpertiseTab(targetTab);
        });
    });
});


// RFQ Modal functionality
function openRFQModal() {
    document.getElementById('rfqModal').style.display = 'flex';
}

function closeRFQModal() {
    document.getElementById('rfqModal').style.display = 'none';
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const rfqModal = document.getElementById('rfqModal');
    if (rfqModal) {
        rfqModal.onclick = function(event) {
            if (event.target === this) {
                closeRFQModal();
            }
        }
    }
});

// Functions called by HTML buttons
function createRFQ() {
    openRFQModal();
}

function sendRFQ() {
    openRFQModal();
}