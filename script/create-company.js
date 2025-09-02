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

// Fuzzy search function
function fuzzySearch(query, text) {
    if (!query || !text) return 0;
    
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    
    // Exact match gets highest score
    if (textLower === queryLower) return 100;
    
    // Starts with query gets high score
    if (textLower.startsWith(queryLower)) return 90;
    
    // Contains query gets medium score
    if (textLower.includes(queryLower)) return 70;
    
    // Fuzzy matching algorithm
    let score = 0;
    let queryIndex = 0;
    let textIndex = 0;
    let consecutiveMatches = 0;
    
    while (queryIndex < queryLower.length && textIndex < textLower.length) {
        if (queryLower[queryIndex] === textLower[textIndex]) {
            score += 10;
            consecutiveMatches++;
            queryIndex++;
            textIndex++;
            
            // Bonus for consecutive matches
            if (consecutiveMatches > 1) {
                score += consecutiveMatches * 2;
            }
        } else {
            consecutiveMatches = 0;
            textIndex++;
        }
    }
    
    // Penalty for unmatched query characters
    const unmatchedChars = queryLower.length - queryIndex;
    score -= unmatchedChars * 5;
    
    // Bonus for shorter text (more precise matches)
    if (textLower.length <= queryLower.length * 2) {
        score += 5;
    }
    
    return Math.max(0, score);
}

// Autocomplete functions with fuzzy search
function showAutocomplete(query) {
    const dropdown = document.getElementById('companySuggestions');
    if (!dropdown) return;

    if (!query || query.trim() === '') {
        hideAutocomplete();
        return;
    }

    // Calculate fuzzy scores for all companies
    const companiesWithScores = existingCompanies.map(company => ({
        ...company,
        score: fuzzySearch(query, company.name)
    }));

    // Filter out companies with score 0 and sort by score (highest first)
    const filteredCompanies = companiesWithScores
        .filter(company => company.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8); // Limit to 8 results for better UX

    if (filteredCompanies.length === 0) {
        hideAutocomplete();
        return;
    }

    dropdown.innerHTML = '';
    filteredCompanies.forEach(company => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        
        // Highlight matching characters
        const highlightedName = highlightMatches(query, company.name);
        
        item.innerHTML = `
            <div class="company-icon">${company.icon}</div>
            <div class="company-name">${highlightedName}</div>
            <div class="company-type">${company.type}</div>
        `;
        item.addEventListener('click', () => selectCompany(company.name));
        dropdown.appendChild(item);
    });

    dropdown.classList.add('show');
}

// Function to highlight matching characters
function highlightMatches(query, text) {
    if (!query || !text) return text;
    
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    let result = '';
    let queryIndex = 0;
    
    for (let i = 0; i < text.length; i++) {
        if (queryIndex < queryLower.length && textLower[i] === queryLower[queryIndex]) {
            result += `<span class="highlight-match">${text[i]}</span>`;
            queryIndex++;
        } else {
            result += text[i];
        }
    }
    
    return result;
}

function hideAutocomplete() {
    const dropdown = document.getElementById('companySuggestions');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
}

function selectCompany(companyName) {
    const input = document.getElementById('companyName');
    const searchbox = document.querySelector('.gsc-control-cse-en');
    if (input) {
        input.value = companyName;
        hideAutocomplete();
        
        // Hide Google search suggestions when user selects a company
        const searchSuggestions = document.querySelector('.gssb_e');
        if (searchSuggestions) {
            searchSuggestions.style.display = 'none';
            searchbox.style.display = 'none';
        }
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
    const suggestionsContainer = document.getElementById('companySuggestions');

    // Add autocomplete functionality to company name input
    if (companyNameInput) {
        companyNameInput.addEventListener('input', function() {
            const inputValue = this.value.trim();
            
            // Sync with Google search input
            syncGoogleSearchInput(inputValue);
            
            if (inputValue.length > 0) {
                showAutocomplete(inputValue);
            } else {
                hideAutocomplete();
            }
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

    // Function to sync company name input with Google search input
    function syncGoogleSearchInput(value) {
        // Find the Google search input field
        const googleSearchInput = document.querySelector('.gsc-input-box input');
        const googleSearchButton = document.querySelector('.gsc-search-button.gsc-search-button-v2');
        const searchbox = document.querySelector('.gsc-control-cse-en');
        const searchSuggestions = document.querySelector('.gssb_e');
        
        if (googleSearchInput) {
            googleSearchInput.value = value;
            
            // Show/hide button based on whether there's a value
            if (googleSearchButton) {
                if (value && value.trim() !== '') {
                    googleSearchButton.style.display = 'block';
                    searchbox.style.display = 'block';
                    searchSuggestions.style.display = 'block';
                    // Trigger Google search by simulating user input
                    googleSearchInput.dispatchEvent(new Event('input', { bubbles: true }));
                    googleSearchInput.dispatchEvent(new Event('change', { bubbles: true }));
                } else {
                    googleSearchButton.style.display = 'none';
                    searchbox.style.display = 'none';
                    searchSuggestions.style.display = 'none';
                }
            }
        }
    }

    // Change Google search button text
    setTimeout(() => {
        const button = document.querySelector('.gsc-search-button.gsc-search-button-v2');
        if (button) {
            button.innerHTML = 'Search on Google';
        }
    }, 1000);
});
