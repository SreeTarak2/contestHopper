document.addEventListener("DOMContentLoaded", () => {

  const sliderWrapper = document.getElementById("sliderWrapper");
  if (sliderWrapper) {
    const cards = document.querySelectorAll(".mini-card");
    const slideLeftBtn = document.getElementById("slide-left");
    const slideRightBtn = document.getElementById("slide-right");
    const heroBackground = document.querySelector(".hero-background");
    const heroTitle = document.getElementById("heroTitle");
    const heroDescription = document.getElementById("heroDescription");
    const heroImage = document.getElementById("heroImage");

    if (
      cards.length > 0 &&
      heroBackground &&
      heroTitle &&
      heroDescription &&
      heroImage
    ) {
      let currentIndex = 0;
      let isTransitioning = false;

      const updateSliderAndBackground = (newIndex) => {
        if (isTransitioning) return;
        isTransitioning = true;

        if (newIndex >= cards.length) newIndex = 0;
        if (newIndex < 0) newIndex = cards.length - 1;
        currentIndex = newIndex;

        cards.forEach((card) => card.classList.remove("active"));
        const activeCard = cards[currentIndex];
        activeCard.classList.add("active");

        heroImage.src = activeCard.dataset.bg || "";
        heroTitle.textContent = activeCard.dataset.title || "";
        heroDescription.textContent = activeCard.dataset.description || "";

        const cardWidth = cards[0].offsetWidth;
        const gap = parseInt(getComputedStyle(sliderWrapper).gap || "0");
        const offset = -currentIndex * (cardWidth + gap);
        sliderWrapper.style.transition = "transform 0.5s ease-in-out";
        sliderWrapper.style.transform = `translateX(${offset}px)`;

        setTimeout(() => {
          isTransitioning = false;
        }, 500);
      };

      if (slideRightBtn) {
        slideRightBtn.addEventListener("click", () =>
          updateSliderAndBackground(currentIndex + 1)
        );
      }

      if (slideLeftBtn) {
        slideLeftBtn.addEventListener("click", () =>
          updateSliderAndBackground(currentIndex - 1)
        );
      }

      cards.forEach((card, index) => {
        card.addEventListener("click", () => updateSliderAndBackground(index));
      });

      updateSliderAndBackground(0);
    } else {
      console.warn("Slider initialization failed: Missing required elements.");
    }
  }
});
