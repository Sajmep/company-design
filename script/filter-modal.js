// Filter Modal JavaScript
class FilterModal {
  constructor() {
    this.modal = document.getElementById('filter-modal');
    this.modalContent = this.modal.querySelector('.filter-modal-content');
    this.cancelBtn = this.modal.querySelector('.filter-btn-cancel');
    this.applyBtn = this.modal.querySelector('.filter-btn-apply');
    this.saveFavoriteBtn = this.modal.querySelector('.filter-btn-save-favorite');
    this.filterBtn = document.querySelector('.filter-btn i');
    
    this.init();
  }

  init() {
    // Add click event to filter button
    if (this.filterBtn) {
      this.filterBtn.addEventListener('click', () => this.openModal());
    }

    // Add click event to cancel button
    if (this.cancelBtn) {
      this.cancelBtn.addEventListener('click', () => this.closeModal());
    }

    // Add click event to apply button
    if (this.applyBtn) {
      this.applyBtn.addEventListener('click', () => this.applyFilters());
    }

    // Add click event to save favorite button
    if (this.saveFavoriteBtn) {
      this.saveFavoriteBtn.addEventListener('click', () => this.saveAsFavorite());
    }

    // Close modal when clicking outside of it
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('show')) {
        this.closeModal();
      }
    });
  }

  openModal() {
    this.modal.style.display = 'block';
    // Trigger reflow to ensure display change is applied
    this.modal.offsetHeight;
    this.modal.classList.add('show');
    this.modalContent.classList.add('show');
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.modal.classList.remove('show');
    this.modalContent.classList.remove('show');
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
      this.modal.style.display = 'none';
      // Restore body scroll
      document.body.style.overflow = 'auto';
    }, 300);
  }

  applyFilters() {
    // Get selected filters (placeholder for now)
    const selectedFilters = this.getSelectedFilters();
    
    // Log the applied filters (replace with actual filter logic)
    console.log('Applied filters:', selectedFilters);
    
    // Close modal after applying
    this.closeModal();
    
    // You can add custom logic here to actually apply the filters
    // For example: update the page content, make API calls, etc.
  }

  saveAsFavorite() {
    // Get selected filters (placeholder for now)
    const selectedFilters = this.getSelectedFilters();
    
    // Log the saved filters (replace with actual save logic)
    console.log('Saved as favorite:', selectedFilters);
    
    // You can add custom logic here to save the filter configuration
    // For example: save to localStorage, make API call, etc.
    
    // Show a temporary success message
    this.showMessage('Filter saved as favorite!', 'success');
  }

  getSelectedFilters() {
    // Placeholder method to get selected filters
    // This will be expanded when actual filter content is added
    const selectedItems = this.modal.querySelectorAll('.filter-selected-item');
    return Array.from(selectedItems).map(item => item.textContent);
  }

  showMessage(message, type = 'info') {
    // Create a temporary message element
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
    `;
    
    // Set background color based on type
    switch (type) {
      case 'success':
        messageEl.style.backgroundColor = '#28a745';
        break;
      case 'error':
        messageEl.style.backgroundColor = '#dc3545';
        break;
      default:
        messageEl.style.backgroundColor = '#007bff';
    }
    
    document.body.appendChild(messageEl);
    
    // Remove message after 3 seconds
    setTimeout(() => {
      messageEl.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => {
        if (messageEl.parentNode) {
          messageEl.parentNode.removeChild(messageEl);
        }
      }, 300);
    }, 3000);
  }

  // Method to add new selected filter (for future use)
  addSelectedFilter(filterText) {
    const selectedItems = this.modal.querySelector('.filter-selected-items');
    const filterItem = document.createElement('span');
    filterItem.className = 'filter-selected-item';
    filterItem.textContent = filterText;
    selectedItems.appendChild(filterItem);
  }

  // Method to remove selected filter (for future use)
  removeSelectedFilter(filterText) {
    const selectedItems = this.modal.querySelectorAll('.filter-selected-item');
    selectedItems.forEach(item => {
      if (item.textContent === filterText) {
        item.remove();
      }
    });
  }

  // Method to clear all selected filters (for future use)
  clearSelectedFilters() {
    const selectedItems = this.modal.querySelector('.filter-selected-items');
    selectedItems.innerHTML = '';
  }
}

// Initialize the filter modal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new FilterModal();
});

// Add CSS animations for messages
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

