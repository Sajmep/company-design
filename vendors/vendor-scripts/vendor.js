// RFQ Modal functionality
function openRFQModal() {
    document.getElementById('rfqModal').style.display = 'flex';
}

function closeRFQModal() {
    document.getElementById('rfqModal').style.display = 'none';
}

// Close modal when clicking outside
document.getElementById('rfqModal').onclick = function(event) {
    if (event.target === this) {
        closeRFQModal();
    }
}

// Functions called by HTML buttons
function createRFQ() {
    openRFQModal();
}

function sendRFQ() {
    openRFQModal();
}