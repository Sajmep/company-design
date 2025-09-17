// PR Offcanvas Functions
function openPROffcanvas() {
    const offcanvas = document.getElementById('prOffcanvas');
    offcanvas.style.display = 'block';
    
    // Show all tabs except create when opening normally
    document.querySelectorAll('.pr-tab-btn').forEach(tab => {
        if (tab.dataset.tab === 'create') {
            tab.style.display = 'none';
        } else {
            tab.style.display = 'flex';
        }
    });
    
    setTimeout(() => {
        offcanvas.classList.add('show');
    }, 10);
}

function closePROffcanvas() {
    const offcanvas = document.getElementById('prOffcanvas');
    offcanvas.classList.remove('show');
    setTimeout(() => {
        offcanvas.style.display = 'none';
    }, 300);
}

// Update offcanvas header
function updateOffcanvasHeader(title) {
    const header = document.querySelector('.purchase-offcanvas-header h3');
    if (header) {
        header.textContent = title;
    }
}

// Tab switching function
function switchTab(tabName) {
    // Remove active class from all tabs and panels
    document.querySelectorAll('.pr-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.pr-tab-panel').forEach(panel => panel.classList.remove('active'));
    
    // Add active class to selected tab and panel
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-panel`).classList.add('active');
    
    // Hide/show tabs container and other tabs based on current tab
    const tabsContainer = document.querySelector('.pr-tabs-container');
    const otherTabs = document.querySelectorAll('.pr-tab-btn:not([data-tab="create"])');
    
    if (tabName === 'create') {
        // Hide tabs container and show create tab
        if (tabsContainer) {
            tabsContainer.style.display = 'none';
        }
        document.querySelector('[data-tab="create"]').style.display = 'flex';
        otherTabs.forEach(tab => tab.style.display = 'none');
    } else {
        // Show tabs container and all tabs except create
        if (tabsContainer) {
            tabsContainer.style.display = 'block';
        }
        otherTabs.forEach(tab => tab.style.display = 'flex');
        document.querySelector('[data-tab="create"]').style.display = 'none';
    }
    
    // Update header based on tab using data attribute
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTab && activeTab.dataset.title) {
        updateOffcanvasHeader(activeTab.dataset.title);
    }
}

// Offcanvas Resize Function
function toggleOffcanvasWidth() {
    var offcanvas = document.querySelector('.purchase-offcanvas-content');
    var resizeBtn = document.querySelector('.purchase-offcanvas-resize-btn');
    var icon = resizeBtn.querySelector('.offcanvas-resize-icon');
    
    // Toggle the full width class
    offcanvas.classList.toggle('purchase-offcanvas-content-full');
    resizeBtn.classList.toggle('purchase-offcanvas-resize-btn-full');
    
    // Change arrow direction based on state
    if (offcanvas.classList.contains('purchase-offcanvas-content-full')) {
        // Expanded state - show right arrow
        icon.className = 'fa-solid fa-chevron-right offcanvas-resize-icon';
    } else {
        // Collapsed state - show left arrow
        icon.className = 'fa-solid fa-chevron-left offcanvas-resize-icon';
    }
}

// PR Staging Functions
function approvePR() {
    // Update status
    const statusValue = document.querySelector('.pr-status-value');
    if (statusValue) {
        statusValue.textContent = 'Approved';
        statusValue.className = 'pr-status-value pr-status-approved';
    }
    
    // Update progress
    const progressFill = document.querySelector('.pr-progress-fill');
    const progressText = document.querySelector('.pr-progress-text');
    if (progressFill && progressText) {
        progressFill.style.width = '100%';
        progressText.textContent = '100% Complete';
    }
    
    // Disable buttons
    const approveBtn = document.querySelector('.pr-staging-approve');
    const rejectBtn = document.querySelector('.pr-staging-reject');
    if (approveBtn) {
        approveBtn.disabled = true;
        approveBtn.style.opacity = '0.5';
        approveBtn.style.cursor = 'not-allowed';
    }
    if (rejectBtn) {
        rejectBtn.disabled = true;
        rejectBtn.style.opacity = '0.5';
        rejectBtn.style.cursor = 'not-allowed';
    }
    
    console.log('PR Approved');
    alert('PR has been approved successfully!');
}

function rejectPR() {
    // Update status
    const statusValue = document.querySelector('.pr-status-value');
    if (statusValue) {
        statusValue.textContent = 'Rejected';
        statusValue.className = 'pr-status-value pr-status-rejected';
    }
    
    // Update progress
    const progressFill = document.querySelector('.pr-progress-fill');
    const progressText = document.querySelector('.pr-progress-text');
    if (progressFill && progressText) {
        progressFill.style.width = '0%';
        progressFill.style.background = '#ef4444';
        progressText.textContent = '0% Complete';
    }
    
    // Disable buttons
    const approveBtn = document.querySelector('.pr-staging-approve');
    const rejectBtn = document.querySelector('.pr-staging-reject');
    if (approveBtn) {
        approveBtn.disabled = true;
        approveBtn.style.opacity = '0.5';
        approveBtn.style.cursor = 'not-allowed';
    }
    if (rejectBtn) {
        rejectBtn.disabled = true;
        rejectBtn.style.opacity = '0.5';
        rejectBtn.style.cursor = 'not-allowed';
    }
    
    console.log('PR Rejected');
    alert('PR has been rejected.');
}

// Toggle PR Overview Section
function togglePROverview() {
    var overviewSection = document.querySelector('.pr-overview-section');
    overviewSection.classList.toggle('collapsed');
}

// Toggle PR Items Section
function togglePRItems() {
    var itemsSection = document.querySelector('.pr-items-section');
    itemsSection.classList.toggle('collapsed');
}

// Toggle PR Description Section
function togglePRDescription() {
    var descriptionSection = document.querySelector('#prDescriptionContent').closest('.pr-description-section');
    descriptionSection.classList.toggle('collapsed');
}

// Toggle PR Justification Section
function togglePRJustification() {
    var justificationSection = document.querySelector('#prJustificationContent').closest('.pr-description-section');
    justificationSection.classList.toggle('collapsed');
}

// Toggle PR Notes Section
function togglePRNotes() {
    var notesSection = document.querySelector('#prNotesContent').closest('.pr-description-section');
    notesSection.classList.toggle('collapsed');
}

// Initialize drag and drop for PR items table
function initializePRItemsDragDrop() {
    const tbody = document.querySelector('.pr-items-table tbody');
    if (!tbody) return;
    
    let draggedRow = null;
    
    // Add drag handles to each row
    const rows = tbody.querySelectorAll('tr');
    console.log('Found PR items rows:', rows.length);
    
    rows.forEach((row, index) => {
        // Make the entire row draggable
        row.draggable = true;
        row.style.cursor = 'grab';
        
        // Drag events on the row
        row.addEventListener('dragstart', function(e) {
            console.log('PR Items drag started');
            draggedRow = row;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', row.outerHTML);
            
            // Visual feedback
            row.style.opacity = '0.5';
            row.style.transform = 'rotate(2deg)';
            row.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
        });
        
        row.addEventListener('dragend', function(e) {
            console.log('PR Items drag ended');
            // Reset visual effects
            row.style.opacity = '1';
            row.style.transform = 'none';
            row.style.boxShadow = 'none';
            
            // Reset all rows
            tbody.querySelectorAll('tr').forEach(r => {
                r.style.backgroundColor = '';
                r.style.borderTop = '';
            });
            
            draggedRow = null;
        });
        
        row.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            // Highlight drop target
            if (draggedRow && draggedRow !== row) {
                row.style.backgroundColor = '#e0f2fe';
                row.style.borderTop = '3px solid #9885d1';
            }
        });
        
        row.addEventListener('dragleave', function(e) {
            // Remove drop target highlighting
            row.style.backgroundColor = '';
            row.style.borderTop = '';
        });
        
        row.addEventListener('drop', function(e) {
            e.preventDefault();
            console.log('PR Items drop event');
            
            if (draggedRow && draggedRow !== row) {
                // Get the position of dragged row and target row
                const draggedIndex = Array.from(tbody.children).indexOf(draggedRow);
                const targetIndex = Array.from(tbody.children).indexOf(row);
                
                console.log('PR Items dragged index:', draggedIndex, 'Target index:', targetIndex);
                
                // Determine the correct insertion point
                if (draggedIndex < targetIndex) {
                    // Dragging down: insert after the target row
                    if (row.nextSibling) {
                        tbody.insertBefore(draggedRow, row.nextSibling);
                    } else {
                        tbody.appendChild(draggedRow);
                    }
                } else {
                    // Dragging up: insert before the target row
                    tbody.insertBefore(draggedRow, row);
                }
                console.log('PR Items row moved');
            }
            
            // Remove drop target highlighting
            row.style.backgroundColor = '';
            row.style.borderTop = '';
        });
    });
}

// Initialize offcanvas functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePRItemsDragDrop();
});

// Export offcanvas functions globally
window.openPROffcanvas = openPROffcanvas;
window.closePROffcanvas = closePROffcanvas;
window.switchTab = switchTab;
window.toggleOffcanvasWidth = toggleOffcanvasWidth;
window.approvePR = approvePR;
window.rejectPR = rejectPR;
window.togglePROverview = togglePROverview;
window.togglePRItems = togglePRItems;
window.togglePRDescription = togglePRDescription;
window.togglePRJustification = togglePRJustification;
window.togglePRNotes = togglePRNotes;
window.initializePRItemsDragDrop = initializePRItemsDragDrop;
