document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const mobileNavOverlay = document.getElementById("mobileNavOverlay");
  const closeNav = document.getElementById("closeNav");

  function openMobileNav() {
    document.body.style.overflow = "hidden"; // Prevents background scrolling
    mobileNavOverlay.classList.add("active");
    mobileNavOverlay.setAttribute("aria-hidden", "false");
    hamburger.setAttribute("aria-expanded", "true");
  }

  function closeMobileNav() {
    document.body.style.overflow = ""; // Restore scrolling
    mobileNavOverlay.classList.remove("active");
    mobileNavOverlay.setAttribute("aria-hidden", "true");
    hamburger.setAttribute("aria-expanded", "false");
  }

  hamburger.addEventListener("click", openMobileNav);
  closeNav.addEventListener("click", closeMobileNav);

  // Close mobile nav when clicking the overlay background
  mobileNavOverlay.addEventListener("click", (e) => {
    if (e.target === mobileNavOverlay) {
      closeMobileNav();
    }
  });

  // Close mobile nav on 'Escape' key press
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileNavOverlay.classList.contains("active")) {
      closeMobileNav();
    }
  });

  const scrollTopBtn = document.querySelector(".scroll-top-btn");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  });
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
