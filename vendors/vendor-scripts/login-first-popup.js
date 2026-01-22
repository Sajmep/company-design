 // Login First Modal Functions
 var addToContactsBtn = document.getElementById('addToContactsBtn');
 var loginFirstModal = document.getElementById('loginFirstModal');

 if (addToContactsBtn) {
   addToContactsBtn.addEventListener('click', function(e) {
     e.preventDefault();
     loginFirstModal.style.display = 'flex';
   });
 }

 function closeLoginFirstModal() {
   loginFirstModal.style.display = 'none';
 }

 // Close modal when clicking outside
 window.onclick = function (event) {
   var commentModal = document.getElementById('commentModal');
   var reportModal = document.getElementById('reportModal');
   if (event.target == commentModal) {
     commentModal.style.display = 'none';
   }
   if (event.target == reportModal) {
     reportModal.style.display = 'none';
   }
   if (event.target == loginFirstModal) {
     loginFirstModal.style.display = 'none';
   }
 }