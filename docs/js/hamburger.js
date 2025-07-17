document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const mobileNavOverlay = document.getElementById("mobileNavOverlay");
  const closeNav = document.getElementById("closeNav");

  function openMobileNav() {
    document.body.style.overflow = "hidden";
    mobileNavOverlay.classList.add("active");
    mobileNavOverlay.setAttribute("aria-hidden", "false");
    hamburger.setAttribute("aria-expanded", "true");
  }

  function closeMobileNav() {
    document.body.style.overflow = "";
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

  if (scrollTopBtn) {
    const scrollTargets = [
      "#all-contests",
      ".recommendations-section",
      ".hero-section",
    ];

    const bubbles = Array.from(scrollTopBtn.querySelectorAll(".bubble"));

    let currentTargetIndex = 0;

    const updateBubbles = () => {
      const bubbleToHighlightIndex = bubbles.length - 1 - currentTargetIndex;

      bubbles.forEach((bubble, index) => {
        bubble.classList.toggle("active", index === bubbleToHighlightIndex);
      });
    };

    const handleButtonClick = (e) => {
      e.preventDefault();

      const targetSelector = scrollTargets[currentTargetIndex];
      const targetElement = document.querySelector(targetSelector);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        currentTargetIndex = (currentTargetIndex + 1) % scrollTargets.length;
        updateBubbles();
      }
    };

    const handleScroll = () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add("visible");
      } else {
        scrollTopBtn.classList.remove("visible");

        if (currentTargetIndex !== 0) {
          currentTargetIndex = 0;
          updateBubbles();
        }
      }
    };

    scrollTopBtn.addEventListener("click", handleButtonClick);
    window.addEventListener("scroll", handleScroll, { passive: true });

    updateBubbles();
  }
});
