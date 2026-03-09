// Send popup handlers
function openSendPopup() {
  const modal = document.getElementById('sendPopupModal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeSendPopup() {
  const modal = document.getElementById('sendPopupModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

function toggleSendRecipients() {
  const checkbox = document.getElementById('sendByEmail');
  const container = document.getElementById('sendRecipientsContainer');
  if (!checkbox || !container) return;
  container.style.display = checkbox.checked ? 'block' : 'none';
}

function toggleRecipientItem(item) {
  const checkbox = item.querySelector('.send-recipient-checkbox');
  if (checkbox) {
    checkbox.checked = !checkbox.checked;
    updateRecipientSelection(checkbox);
  }
}

function updateRecipientSelection(checkbox) {
  const item = checkbox.closest('.send-recipient-item');
  if (checkbox.checked) {
    item.classList.add('selected');
  } else {
    item.classList.remove('selected');
  }
}

function toggleSelectAllRecipients() {
  const checkboxes = document.querySelectorAll('.send-recipient-checkbox');
  const selectAllBtn = document.querySelector('.send-select-all-btn');
  const allChecked = Array.from(checkboxes).every(cb => cb.checked);
  
  checkboxes.forEach(checkbox => {
    checkbox.checked = !allChecked;
    updateRecipientSelection(checkbox);
  });
  
  if (selectAllBtn) {
    selectAllBtn.textContent = allChecked ? 'Select All' : 'Deselect All';
  }
}

function toggleScheduleDateTime() {
  const container = document.getElementById('scheduleDateTimeContainer');
  if (container) {
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
  }
}

// Expose globally
window.openSendPopup = openSendPopup;
window.closeSendPopup = closeSendPopup;
window.toggleSendRecipients = toggleSendRecipients;
window.toggleRecipientItem = toggleRecipientItem;
window.updateRecipientSelection = updateRecipientSelection;
window.toggleSelectAllRecipients = toggleSelectAllRecipients;
window.toggleScheduleDateTime = toggleScheduleDateTime;
