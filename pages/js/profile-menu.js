document.addEventListener('DOMContentLoaded', () => {
    const profileTrigger = document.getElementById('profile-trigger');
    const profileDropdown = document.getElementById('profile-dropdown');

    if (!profileTrigger || !profileDropdown) {
        return; // Exit if elements are not found
    }

    // Toggle the dropdown when the trigger button is clicked
    profileTrigger.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the window click event from firing immediately
        const isActive = profileDropdown.classList.toggle('active');
        profileTrigger.setAttribute('aria-expanded', isActive);
    });

    // Close the dropdown if the user clicks anywhere outside of it
    window.addEventListener('click', (event) => {
        if (!profileDropdown.contains(event.target) && !profileTrigger.contains(event.target)) {
            if (profileDropdown.classList.contains('active')) {
                profileDropdown.classList.remove('active');
                profileTrigger.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // Close the dropdown when the 'Escape' key is pressed
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && profileDropdown.classList.contains('active')) {
            profileDropdown.classList.remove('active');
            profileTrigger.setAttribute('aria-expanded', 'false');
        }
    });
});