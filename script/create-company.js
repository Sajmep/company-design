// Create Company Modal Functionality

// Sample existing companies for autocomplete
const existingCompanies = [
    { name: "Apple Inc.", type: "Technology", icon: "A" },
    { name: "Microsoft Corporation", type: "Technology", icon: "M" },
    { name: "Google LLC", type: "Technology", icon: "G" },
    { name: "Amazon.com Inc.", type: "E-commerce", icon: "A" },
    { name: "Tesla Inc.", type: "Automotive", icon: "T" },
    { name: "Meta Platforms Inc.", type: "Social Media", icon: "M" },
    { name: "Netflix Inc.", type: "Entertainment", icon: "N" },
    { name: "Adobe Inc.", type: "Software", icon: "A" },
    { name: "Salesforce Inc.", type: "CRM Software", icon: "S" },
    { name: "Oracle Corporation", type: "Database", icon: "O" },
    { name: "IBM Corporation", type: "Technology", icon: "I" },
    { name: "Intel Corporation", type: "Semiconductor", icon: "I" },
    { name: "Cisco Systems Inc.", type: "Networking", icon: "C" },
    { name: "NVIDIA Corporation", type: "Graphics", icon: "N" },
    { name: "AMD Inc.", type: "Semiconductor", icon: "A" },
    { name: "Qualcomm Inc.", type: "Wireless", icon: "Q" },
    { name: "PayPal Holdings Inc.", type: "Fintech", icon: "P" },
    { name: "Shopify Inc.", type: "E-commerce", icon: "S" },
    { name: "Zoom Video Communications Inc.", type: "Communication", icon: "Z" },
    { name: "Slack Technologies Inc.", type: "Communication", icon: "S" }
];

// Make functions globally available
window.openCreateCompanyModal = function() {
    const modal = document.getElementById('createCompanyModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
};

window.closeCreateCompanyModal = function() {
    const modal = document.getElementById('createCompanyModal');
    const createCompanyForm = document.getElementById('createCompanyForm');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore background scrolling
        // Reset form
        if (createCompanyForm) {
            createCompanyForm.reset();
        }
        // Hide autocomplete dropdown
        hideAutocomplete();
    }
};

// Autocomplete functions
function showAutocomplete(query) {
    const dropdown = document.getElementById('companySuggestions');
    if (!dropdown) return;

    if (!query || query.trim() === '') {
        hideAutocomplete();
        return;
    }

    const filteredCompanies = existingCompanies.filter(company => 
        company.name.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredCompanies.length === 0) {
        hideAutocomplete();
        return;
    }

    dropdown.innerHTML = '';
    filteredCompanies.forEach(company => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.innerHTML = `
            <div class="company-icon">${company.icon}</div>
            <div class="company-name">${company.name}</div>
            <div class="company-type">${company.type}</div>
        `;
        item.addEventListener('click', () => selectCompany(company.name));
        dropdown.appendChild(item);
    });

    dropdown.classList.add('show');
}

function hideAutocomplete() {
    const dropdown = document.getElementById('companySuggestions');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
}

function selectCompany(companyName) {
    const input = document.getElementById('companyName');
    if (input) {
        input.value = companyName;
        hideAutocomplete();
    }
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const modal = document.getElementById('createCompanyModal');
    const createBtn = document.querySelector('.create-btn');
    const closeBtn = document.querySelector('.create-company-close');
    const createCompanyForm = document.getElementById('createCompanyForm');
    const companyNameInput = document.getElementById('companyName');

    // Add autocomplete functionality to company name input
    if (companyNameInput) {
        companyNameInput.addEventListener('input', function() {
            showAutocomplete(this.value);
        });

        companyNameInput.addEventListener('focus', function() {
            if (this.value.trim() !== '') {
                showAutocomplete(this.value);
            }
        });

        // Hide autocomplete when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.autocomplete-container')) {
                hideAutocomplete();
            }
        });

        // Handle keyboard navigation
        companyNameInput.addEventListener('keydown', function(event) {
            const dropdown = document.getElementById('companySuggestions');
            const items = dropdown ? dropdown.querySelectorAll('.autocomplete-item') : [];
            const selectedItem = dropdown ? dropdown.querySelector('.autocomplete-item.selected') : null;

            if (event.key === 'ArrowDown') {
                event.preventDefault();
                if (items.length > 0) {
                    if (selectedItem) {
                        selectedItem.classList.remove('selected');
                        const nextItem = selectedItem.nextElementSibling;
                        if (nextItem) {
                            nextItem.classList.add('selected');
                        } else {
                            items[0].classList.add('selected');
                        }
                    } else {
                        items[0].classList.add('selected');
                    }
                }
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                if (selectedItem) {
                    selectedItem.classList.remove('selected');
                    const prevItem = selectedItem.previousElementSibling;
                    if (prevItem) {
                        prevItem.classList.add('selected');
                    } else {
                        items[items.length - 1].classList.add('selected');
                    }
                }
            } else if (event.key === 'Enter') {
                event.preventDefault();
                if (selectedItem) {
                    const companyName = selectedItem.querySelector('.company-name').textContent;
                    selectCompany(companyName);
                }
            } else if (event.key === 'Escape') {
                hideAutocomplete();
            }
        });
    }

    // Close modal when clicking on the close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCreateCompanyModal);
    }

    // Close modal when clicking outside of it
    if (modal) {
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeCreateCompanyModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal && modal.style.display === 'block') {
            closeCreateCompanyModal();
        }
    });

    // Handle form submission
    if (createCompanyForm) {
        createCompanyForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const companyName = document.getElementById('companyName').value;
            const companyEmail = document.getElementById('companyEmail').value;
            
            // Here you can add your logic to handle the form data
            console.log('Company Name:', companyName);
            console.log('Company Email:', companyEmail);
            
            // Close modal after submission
            closeCreateCompanyModal();
            
            // Optional: Show success message
            alert('Company created successfully!');
        });
    }
});
