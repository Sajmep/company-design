// Get the popup element from the page
const popup = document.querySelector('.welcome-popup');

// Function to create confetti celebration effect
function triggerConfetti() {
    // confetti animation duration THREE SECONDS
    const duration = 3000; 
    // Calculate when the animation should end (current time + duration)
    const animationEnd = Date.now() + duration;
    
    // Default settings for all confetti particles
    const defaults = { 
        startVelocity: 30,    // How fast particles start moving
        spread: 360,          // Full circle spread (360 degrees)
        ticks: 60,            // How long each particle lasts
        zIndex: 10000         // Make sure confetti appears above everything
    };

    // Helper function to generate a random number between min and max
    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Create confetti every 250 milliseconds (4 times per second)
    const interval = setInterval(function() {
        // Calculate how much time is left in the animation
        const timeLeft = animationEnd - Date.now();

        // If time is up, stop creating confetti
        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        // Calculate how many particles to create (decreases as time runs out)
        const particleCount = 50 * (timeLeft / duration);
        
        // Create confetti from the left side of screen
        // x: 0.1 to 0.3 means left portion (10% to 30% from left)
        // y: random vertical position
        confetti({
            ...defaults,      // Use the default settings
            particleCount,   // Number of particles for this burst
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        
        // Create confetti from the right side of screen
        // x: 0.7 to 0.9 means right portion (70% to 90% from left)
        // y: random vertical position
        confetti({
            ...defaults,      // Use the default settings
            particleCount,   // Number of particles for this burst
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
    }, 250); // Run this function every 250 milliseconds
}

// Function to show the popup
function openPopup() {
    popup.style.display = 'block';
    // Wait 300ms for popup to appear, then trigger confetti
    setTimeout(() => {
        triggerConfetti();
    }, 300);
}

// Function to hide the popup
function closePopup() {
    popup.style.display = 'none';
}
