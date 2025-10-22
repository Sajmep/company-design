// Minimal JS to open/close album modal with static images
document.addEventListener('DOMContentLoaded', function () {
  const albumCards = document.querySelectorAll('.album-card');
  const albumModal = document.getElementById('albumModal');
  const albumModalClose = document.getElementById('albumModalClose');
  const albumModalBackdrop = document.getElementById('albumModalBackdrop');

  function openAlbumModal() {
    if (albumModal) {
      albumModal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeAlbumModal() {
    if (albumModal) {
      albumModal.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

  albumCards.forEach(card => {
    card.addEventListener('click', openAlbumModal);
  });

  if (albumModalClose) albumModalClose.addEventListener('click', closeAlbumModal);
  if (albumModalBackdrop) albumModalBackdrop.addEventListener('click', closeAlbumModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAlbumModal();
  });

  // Book Property Modal
  const bookPropertyBtn = document.querySelector('.book-property-btn');
  const bookPropertyModal = document.getElementById('bookPropertyModal');
  const closeBookModal = document.getElementById('closeBookModal');

  if (bookPropertyBtn) {
    bookPropertyBtn.addEventListener('click', function() {
      bookPropertyModal.classList.add('show');
    });
  }

  if (closeBookModal) {
    closeBookModal.addEventListener('click', function() {
      bookPropertyModal.classList.remove('show');
    });
  }

  // Date Range Picker
  const checkinDate = document.getElementById('checkinDate');
  const checkoutDate = document.getElementById('checkoutDate');
  const durationText = document.getElementById('durationText');

  function calculateDuration() {
    if (checkinDate.value && checkoutDate.value) {
      const checkin = new Date(checkinDate.value);
      const checkout = new Date(checkoutDate.value);
      const diffTime = Math.abs(checkout - checkin);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        durationText.textContent = `${diffDays} night${diffDays > 1 ? 's' : ''}`;
      } else {
        durationText.textContent = 'Check-out must be after check-in';
      }
    } else {
      durationText.textContent = 'Select dates to see duration';
    }
  }

  if (checkinDate) checkinDate.addEventListener('change', calculateDuration);
  if (checkoutDate) checkoutDate.addEventListener('change', calculateDuration);

  // Simple Guest Counter
  let guestsCount = 1;

  const guestsMinus = document.getElementById('guestsMinus');
  const guestsPlus = document.getElementById('guestsPlus');
  const guestsCountSpan = document.getElementById('guestsCount');

  function updateGuests(change) {
    guestsCount = Math.max(1, guestsCount + change);
    guestsCountSpan.textContent = guestsCount;
  }

  if (guestsMinus) guestsMinus.addEventListener('click', () => updateGuests(-1));
  if (guestsPlus) guestsPlus.addEventListener('click', () => updateGuests(1));

  // Pricing Calculator
  const ratePerNight = 700; // $700 per night
  const nightsCountSpan = document.getElementById('nightsCount');
  const totalCostSpan = document.getElementById('totalCost');

  function calculatePricing() {
    if (checkinDate.value && checkoutDate.value) {
      const checkin = new Date(checkinDate.value);
      const checkout = new Date(checkoutDate.value);
      const diffTime = Math.abs(checkout - checkin);
      const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (nights > 0) {
        const totalCost = nights * ratePerNight;
        nightsCountSpan.textContent = nights;
        totalCostSpan.textContent = `$${totalCost.toFixed(2)}`;
      } else {
        nightsCountSpan.textContent = '0';
        totalCostSpan.textContent = '$0.00';
      }
    } else {
      nightsCountSpan.textContent = '0';
      totalCostSpan.textContent = '$0.00';
    }
  }

  // Update pricing when dates change
  if (checkinDate) checkinDate.addEventListener('change', calculatePricing);
  if (checkoutDate) checkoutDate.addEventListener('change', calculatePricing);

  // Explore Button
  const exploreBtn = document.getElementById('exploreBtn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', function() {
      alert('Explore functionality coming soon!');
    });
  }
});

// Media Tab Functionality
document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.media-tab');
    const contents = document.querySelectorAll('.media-tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            const targetTab = this.getAttribute('data-tab');

            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
});