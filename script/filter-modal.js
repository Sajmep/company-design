// ========================================
// FILTER MODAL - MAIN CLASS
// ========================================
class FilterModal {
  constructor() {
    // Get DOM elements
    this.modal = document.getElementById('filter-modal');
    this.modalContent = this.modal.querySelector('.filter-modal-content');
    this.filterBtn = document.getElementById('openFilterModal');
    
    // Get buttons
    this.cancelBtn = this.modal.querySelector('.filter-btn-cancel');
    this.applyBtn = this.modal.querySelector('.filter-btn-apply');
    
    // Applied filters section
    this.appliedFiltersContainer = document.getElementById('appliedFilters');
    this.clearAllAppliedBtn = document.getElementById('clearAllAppliedFilters');
    this.saveFavoriteBtn = document.querySelector('.filter-save-favorite-btn');
    
    // Save favorite modal elements
    this.saveFavoriteModal = document.getElementById('save-favorite-modal');
    this.favoriteNameInput = document.getElementById('favoriteName');
    this.closeSaveFavoriteBtn = document.getElementById('closeSaveFavoriteModal');
    this.cancelSaveFavoriteBtn = document.getElementById('cancelSaveFavorite');
    
    
    this.init();
  }

  // ========================================
  // INITIALIZATION
  // ========================================
  init() {
    this.setupEventListeners();
    this.initSidebarNavigation();
    this.initFilterInteractions();
  }

  setupEventListeners() {
    // Modal open/close events
    this.filterBtn?.addEventListener('click', () => this.openModal());
    this.cancelBtn?.addEventListener('click', () => this.closeModal());
    this.applyBtn?.addEventListener('click', () => this.applyFilters());

    // Clear all filters button in modal
    const clearAllBtn = this.modal.querySelector('#clearAllFilters');
    clearAllBtn?.addEventListener('click', () => this.clearAllFilters());

    // Clear all applied filters button
    this.clearAllAppliedBtn?.addEventListener('click', () => this.clearAllAppliedFilters());
    
    // Save favorite button
    this.saveFavoriteBtn?.addEventListener('click', () => this.openSaveFavoriteModal());
    
    // Save favorite modal events
    this.closeSaveFavoriteBtn?.addEventListener('click', () => this.closeSaveFavoriteModal());
    this.cancelSaveFavoriteBtn?.addEventListener('click', () => this.closeSaveFavoriteModal());
    
    // Close modal when clicking outside
    this.saveFavoriteModal?.addEventListener('click', (e) => {
      if (e.target === this.saveFavoriteModal) this.closeSaveFavoriteModal();
    });
    

    // Close modal events
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('show')) {
        this.closeModal();
      }
    });
  }

  // ========================================
  // MODAL OPEN/CLOSE
  // ========================================
  openModal() {
    this.modal.style.display = 'block';
    this.modal.offsetHeight; // Trigger reflow
    this.modal.classList.add('show');
    this.modalContent.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.modal.classList.remove('show');
    this.modalContent.classList.remove('show');
    
    setTimeout(() => {
      this.modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }, 300);
  }

  // ========================================
  // FILTER ACTIONS
  // ========================================
  applyFilters() {
    const selectedFilters = this.getSelectedFilters();
    console.log('Applied filters:', selectedFilters);
    this.updateAppliedFilters(selectedFilters);
    this.closeModal();
    // Add your filter application logic here
  }


  // ========================================
  // UTILITY METHODS
  // ========================================
  getSelectedFilters() {
    const selectedItems = this.modal.querySelectorAll('.filter-selected-item');
    return Array.from(selectedItems).map(item => item.textContent);
  }

  showMessage(message, type = 'info') {
    const messageEl = document.createElement('div');
    messageEl.className = `filter-message filter-message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 6px;
      color: white;
      font-weight: 500;
      z-index: 1001;
      animation: slideInRight 0.3s ease-out;
      background-color: ${this.getMessageColor(type)};
    `;
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
      messageEl.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => messageEl.remove(), 300);
    }, 3000);
  }

  getMessageColor(type) {
    const colors = {
      success: '#28a745',
      error: '#dc3545',
      info: '#007bff'
    };
    return colors[type] || colors.info;
  }

  // Future utility methods
  addSelectedFilter(filterText) {
    const container = this.modal.querySelector('.filter-selected-items');
    this.addSelectedFilterItem(container, filterText);
  }

  removeSelectedFilter(filterText) {
    const selectedItems = this.modal.querySelectorAll('.filter-selected-item');
    selectedItems.forEach(item => {
      if (item.textContent === filterText) item.remove();
    });
  }

  clearSelectedFilters() {
    const container = this.modal.querySelector('.filter-selected-items');
    container.innerHTML = '';
  }

  clearAllFilters() {
    // Clear all form inputs
    this.clearAllFormInputs();
    
    // Clear the selected filters display
    this.clearSelectedFilters();
    
    // Show confirmation message
    // this.showMessage('All filters cleared!', 'success');
  }

  clearAllFormInputs() {
    // Clear all radio buttons
    const radioButtons = this.modal.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => radio.checked = false);

    // Clear all checkboxes
    const checkboxes = this.modal.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = false);

    // Clear all select dropdowns
    const selects = this.modal.querySelectorAll('select');
    selects.forEach(select => select.selectedIndex = 0);

    // Clear all text inputs
    const textInputs = this.modal.querySelectorAll('input[type="text"], input[type="number"], input[type="date"]');
    textInputs.forEach(input => input.value = '');

    // Show custom date range (always visible now)
    const customDateDiv = this.modal.querySelector('#custom-date-range');
    if (customDateDiv) {
      customDateDiv.style.display = 'block';
    }
  }

  // ========================================
  // SIDEBAR NAVIGATION
  // ========================================
  initSidebarNavigation() {
    const elements = this.getSidebarElements();
    
    this.setupCategoryClicks(elements);
    this.setupSubLinkClicks(elements);
    this.setupScrollDetection(elements);
    
    // Expand first category by default
    if (elements.categoryItems.length > 0) {
      this.expandCategory(elements.categoryItems[0], elements.categoryItems);
    }
  }

  getSidebarElements() {
    return {
      categoryItems: this.modal.querySelectorAll('.filter-category-item'),
      categoryLinks: this.modal.querySelectorAll('.filter-category-link'),
      subLinks: this.modal.querySelectorAll('.filter-sub-link'),
      filterSections: this.modal.querySelectorAll('.filter-section'),
      subSections: this.modal.querySelectorAll('.filter-sub-section'),
      mainSection: this.modal.querySelector('.filter-main-section')
    };
  }

  setupCategoryClicks(elements) {
    elements.categoryLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const categoryItem = link.closest('.filter-category-item');
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = this.modal.querySelector(`#${targetId}`);
        
        this.toggleCategory(categoryItem, elements.categoryItems);
        this.setActiveLink(link, elements.categoryLinks, elements.subLinks);
        
        if (targetSection) {
          this.scrollToSection(targetSection);
        }
      });
    });
  }

  setupSubLinkClicks(elements) {
    elements.subLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = this.modal.querySelector(`#${targetId}`);
        
        if (targetSection) {
          const categoryItem = link.closest('.filter-category-item');
          const categoryLink = categoryItem.querySelector('.filter-category-link');
          
          this.setActiveLink(link, elements.categoryLinks, elements.subLinks);
          categoryLink.classList.add('active');
          this.expandCategory(categoryItem, elements.categoryItems);
          this.scrollToSection(targetSection);
        }
      });
    });
  }

  setupScrollDetection(elements) {
    if (elements.mainSection) {
      elements.mainSection.addEventListener('scroll', () => {
        this.updateActiveSidebarLink(elements);
      });
    }
  }

  // ========================================
  // CATEGORY MANAGEMENT
  // ========================================
  toggleCategory(categoryItem, allCategoryItems) {
    const isExpanded = categoryItem.classList.contains('expanded');
    this.closeAllCategories(allCategoryItems);
    if (!isExpanded) categoryItem.classList.add('expanded');
  }

  expandCategory(categoryItem, allCategoryItems) {
    this.closeAllCategories(allCategoryItems);
    categoryItem.classList.add('expanded');
  }

  closeAllCategories(allCategoryItems) {
    allCategoryItems.forEach(item => item.classList.remove('expanded'));
  }

  setActiveLink(activeLink, categoryLinks, subLinks) {
    categoryLinks.forEach(l => l.classList.remove('active'));
    subLinks.forEach(l => l.classList.remove('active'));
    activeLink.classList.add('active');
  }

  scrollToSection(section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ========================================
  // SCROLL DETECTION
  // ========================================
  updateActiveSidebarLink(elements) {
    const scrollTop = elements.mainSection.scrollTop;
    const containerTop = elements.mainSection.offsetTop;
    const activeSection = this.findActiveSection(elements, scrollTop, containerTop);
    
    if (activeSection) {
      this.activateCorrespondingLink(activeSection, elements);
    }
  }

  findActiveSection(elements, scrollTop, containerTop) {
    // Check sub-sections first (more specific)
    for (const section of elements.subSections) {
      if (this.isSectionInView(section, scrollTop, containerTop)) {
        return section;
      }
    }
    
    // Check main sections
    for (const section of elements.filterSections) {
      if (this.isSectionInView(section, scrollTop, containerTop)) {
        return section;
      }
    }
    return null;
  }

  isSectionInView(section, scrollTop, containerTop) {
    const sectionTop = section.offsetTop - containerTop - 50;
    const sectionBottom = sectionTop + section.offsetHeight;
    return scrollTop >= sectionTop && scrollTop < sectionBottom;
  }

  activateCorrespondingLink(activeSection, elements) {
    const activeId = activeSection.getAttribute('id');
    
    // Clear all active states
    elements.categoryLinks.forEach(link => link.classList.remove('active'));
    elements.subLinks.forEach(link => link.classList.remove('active'));
    
    // Find matching sub-link
    const matchingSubLink = Array.from(elements.subLinks).find(link => 
      link.getAttribute('href') === `#${activeId}`
    );
    
    if (matchingSubLink) {
      this.activateSubLink(matchingSubLink, elements);
    } else {
      this.activateCategoryLink(activeId, elements);
    }
  }

  activateSubLink(subLink, elements) {
    subLink.classList.add('active');
    const categoryItem = subLink.closest('.filter-category-item');
    const categoryLink = categoryItem.querySelector('.filter-category-link');
    categoryLink.classList.add('active');
    this.expandCategory(categoryItem, elements.categoryItems);
  }

  activateCategoryLink(activeId, elements) {
    const matchingCategoryLink = Array.from(elements.categoryLinks).find(link => 
      link.getAttribute('href') === `#${activeId}`
    );
    if (matchingCategoryLink) {
      matchingCategoryLink.classList.add('active');
    }
  }

  // ========================================
  // FILTER INTERACTIONS
  // ========================================
  initFilterInteractions() {
    this.setupCustomDateToggle();
    this.setupFilterChangeListeners();
  }

  setupCustomDateToggle() {
    // Custom date range is now always visible, no toggle needed
    const customDateDiv = this.modal.querySelector('#custom-date-range');
    if (customDateDiv) {
      customDateDiv.style.display = 'block';
    }
  }

  setupFilterChangeListeners() {
    const allFilterInputs = this.modal.querySelectorAll(
      '.filter-radio, .filter-checkbox, .filter-select, .filter-text-input, .filter-number-input, .filter-date-input'
    );
    
    allFilterInputs.forEach(input => {
      input.addEventListener('change', () => this.updateSelectedFiltersDisplay());
      // Also listen for input events for real-time updates on text/number inputs
      if (input.type === 'text' || input.type === 'number') {
        input.addEventListener('input', () => this.updateSelectedFiltersDisplay());
      }
    });
  }

  // ========================================
  // SELECTED FILTERS DISPLAY
  // ========================================
  updateSelectedFiltersDisplay() {
    const selectedItems = this.modal.querySelector('.filter-selected-items');
    selectedItems.innerHTML = '';

    this.addDateRangeFilters(selectedItems);
    this.addCheckboxFilters(selectedItems);
    this.addSelectFilters(selectedItems);
    this.addRangeInputFilters(selectedItems);
    this.addTextInputFilters(selectedItems);
  }

  addDateRangeFilters(container) {
    const selectedDateRadio = this.modal.querySelector('input[name="date-range"]:checked');
    if (selectedDateRadio) {
      const dateText = selectedDateRadio.nextElementSibling.textContent;
      this.addSelectedFilterItem(container, dateText);
    }
  }

  addCheckboxFilters(container) {
    const selectedCheckboxes = this.modal.querySelectorAll('.filter-checkbox:checked');
    selectedCheckboxes.forEach(checkbox => {
      const text = checkbox.nextElementSibling.textContent;
      this.addSelectedFilterItem(container, text);
    });
  }

  addSelectFilters(container) {
    const selectedSelects = this.modal.querySelectorAll('.filter-select');
    selectedSelects.forEach(select => {
      if (select.value) {
        const text = select.options[select.selectedIndex].text;
        this.addSelectedFilterItem(container, text);
      }
    });
  }

  addRangeInputFilters(container) {
    // Handle tender value range inputs
    const rangeInputs = this.modal.querySelectorAll('.filter-range-inputs');
    rangeInputs.forEach(rangeGroup => {
      const inputs = rangeGroup.querySelectorAll('input[type="number"]');
      const minInput = inputs[0];
      const maxInput = inputs[1];
      
      if (minInput && maxInput && (minInput.value || maxInput.value)) {
        const minValue = minInput.value || '0';
        const maxValue = maxInput.value || '∞';
        this.addSelectedFilterItem(container, `Tender Value: ${minValue} - ${maxValue}`);
      }
    });

    // Handle custom date range inputs (always check since there's no radio button)
    const dateRangeInputs = this.modal.querySelectorAll('.filter-date-inputs');
    dateRangeInputs.forEach(dateGroup => {
      const inputs = dateGroup.querySelectorAll('input[type="date"]');
      const startInput = inputs[0];
      const endInput = inputs[1];
      
      if (startInput && endInput && (startInput.value || endInput.value)) {
        const startValue = startInput.value || 'Start';
        const endValue = endInput.value || 'End';
        this.addSelectedFilterItem(container, `Custom Date: ${startValue} to ${endValue}`);
      }
    });
  }

  addTextInputFilters(container) {
    // Get all text and number inputs in the modal, excluding date inputs that are part of custom date range
    const textInputs = this.modal.querySelectorAll('input[type="text"], input[type="number"]');
    
    textInputs.forEach(input => {
      if (input.value.trim()) {
        // Try to find the label for this input
        let label = 'Input';
        
        // Look for label in various ways
        const inputGroup = input.closest('.filter-input-group');
        if (inputGroup) {
          const labelEl = inputGroup.querySelector('.filter-input-label');
          if (labelEl) {
            label = labelEl.textContent;
          }
        }
        
        // If no label found, try to get placeholder or use input name
        if (label === 'Input') {
          if (input.placeholder) {
            label = input.placeholder;
          } else if (input.name) {
            label = input.name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          }
        }
        
        this.addSelectedFilterItem(container, `${label}: ${input.value}`);
      }
    });
  }

  addSelectedFilterItem(container, text) {
    const item = document.createElement('span');
    item.className = 'filter-selected-item';
    
    // Add text content
    const textSpan = document.createElement('span');
    textSpan.textContent = text;
    item.appendChild(textSpan);
    
    // Add remove button
    const removeBtn = document.createElement('button');
    removeBtn.className = 'filter-selected-item-remove';
    removeBtn.innerHTML = '×';
    removeBtn.title = 'Remove filter';
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.removeFilterItem(item, text);
    });
    
    item.appendChild(removeBtn);
    container.appendChild(item);
  }

  removeFilterItem(item, filterText) {
    // Remove the visual item
    item.remove();
    
    // Clear the corresponding form input
    this.clearFormInputForFilter(filterText);
    
    // Update the display
    this.updateSelectedFiltersDisplay();
  }

  clearFormInputForFilter(filterText) {
    // Clear radio buttons
    const radioButtons = this.modal.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
      if (radio.nextElementSibling?.textContent === filterText) {
        radio.checked = false;
      }
    });

    // Clear checkboxes
    const checkboxes = this.modal.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      if (checkbox.nextElementSibling?.textContent === filterText) {
        checkbox.checked = false;
      }
    });

    // Clear select dropdowns
    const selects = this.modal.querySelectorAll('select');
    selects.forEach(select => {
      if (select.options[select.selectedIndex]?.text === filterText) {
        select.selectedIndex = 0;
      }
    });

    // Clear range inputs (tender value)
    if (filterText.includes('Tender Value:')) {
      const rangeInputs = this.modal.querySelectorAll('.filter-range-inputs');
      rangeInputs.forEach(rangeGroup => {
        const inputs = rangeGroup.querySelectorAll('input[type="number"]');
        inputs.forEach(input => input.value = '');
      });
    }

    // Clear date range inputs
    if (filterText.includes('Custom Date:')) {
      const dateRangeInputs = this.modal.querySelectorAll('.filter-date-inputs');
      dateRangeInputs.forEach(dateGroup => {
        const inputs = dateGroup.querySelectorAll('input[type="date"]');
        inputs.forEach(input => input.value = '');
      });
    }

    // Clear individual text inputs
    const textInputs = this.modal.querySelectorAll('input[type="text"], input[type="number"], input[type="date"]');
    textInputs.forEach(input => {
      if (input.value && filterText.includes(input.value)) {
        input.value = '';
      }
    });
  }

  // ========================================
  // APPLIED FILTERS MANAGEMENT
  // ========================================
  updateAppliedFilters(selectedFilters) {
    this.appliedFiltersContainer.innerHTML = '';
    
    selectedFilters.forEach(filterText => {
      this.addAppliedFilterItem(filterText);
    });
    
    // Show/hide buttons based on filter count
    this.toggleButtonsVisibility(selectedFilters.length > 0);
  }

  addAppliedFilterItem(text) {
    const item = document.createElement('span');
    item.className = 'filter-applied-item';
    
    const textSpan = document.createElement('span');
    textSpan.textContent = text;
    item.appendChild(textSpan);

    const removeBtn = document.createElement('button');
    removeBtn.className = 'filter-applied-item-remove';
    removeBtn.innerHTML = '×';
    removeBtn.title = 'Remove filter';
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.removeAppliedFilterItem(item, text);
    });
    item.appendChild(removeBtn);

    this.appliedFiltersContainer.appendChild(item);
  }

  removeAppliedFilterItem(item, filterText) {
    item.remove();
    this.clearFormInputForFilter(filterText);
    
    // Check if there are any remaining filters
    const remainingFilters = this.appliedFiltersContainer.children.length;
    this.toggleButtonsVisibility(remainingFilters > 0);
  }

  clearAllAppliedFilters() {
    this.appliedFiltersContainer.innerHTML = '';
    this.clearAllFormInputs();
    this.toggleButtonsVisibility(false);
    this.showMessage('All applied filters cleared!', 'success');
  }

  toggleButtonsVisibility(show) {
    if (this.clearAllAppliedBtn) {
      this.clearAllAppliedBtn.style.display = show ? 'flex' : 'none';
    }
    if (this.saveFavoriteBtn) {
      this.saveFavoriteBtn.style.display = show ? 'flex' : 'none';
    }
  }

  // ========================================
  // SAVE FAVORITE MODAL (DISPLAY ONLY)
  // ========================================
  openSaveFavoriteModal() {
    if (!this.appliedFiltersContainer.children.length) {
      this.showMessage('No filters selected to save', 'error');
      return;
    }
    
    this.saveFavoriteModal.classList.add('show');
    this.favoriteNameInput.focus();
  }

  closeSaveFavoriteModal() {
    this.saveFavoriteModal.classList.remove('show');
    this.favoriteNameInput.value = '';
  }

}

// ========================================
// INITIALIZATION & STYLES
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  new FilterModal();
});

document.head.appendChild(style);

