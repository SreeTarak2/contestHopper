document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger");
    const mainNav = document.getElementById("mainNav");

    if (hamburger && mainNav) {
        hamburger.addEventListener("click", () => {
            // Toggle 'active' class on both the hamburger and the nav menu
            // This is useful for changing the hamburger icon (e.g., to an 'X')
            hamburger.classList.toggle("active");
            mainNav.classList.toggle("active");
        });
    }
});