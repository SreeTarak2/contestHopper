window.addEventListener("load", () => {
  const sliderWrapper = document.getElementById("sliderWrapper");
  const sliderViewport = document.querySelector(".slider-viewport");
  const cards = document.querySelectorAll(".mini-card");
  const dotsContainer = document.getElementById("pagination-dots");

  const heroImage = document.getElementById("heroImage");
  const heroTitle = document.getElementById("heroTitle");
  const heroDescription = document.getElementById("heroDescription");

  let currentIndex = 0;


  const getCardWidth = () => cards[0].offsetWidth + 20;


  dotsContainer.innerHTML = "";
  cards.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });


  function goToSlide(index) {
    currentIndex = index;
    const cardWidth = getCardWidth();
    sliderWrapper.style.transition = "transform 0.5s ease-in-out";
    sliderWrapper.style.transform = `translateX(-${cardWidth * currentIndex}px)`;

    updateHeroContent(index);
    updateDots();
  }

  
  function updateHeroContent(index) {
    const card = cards[index];
    const bg = card.dataset.bg;
    const title = card.dataset.title;
    const desc = card.dataset.description;

    heroImage.src = bg;
    heroTitle.textContent = title;
    heroDescription.textContent = desc;
  }


  function updateDots() {
    document.querySelectorAll(".dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  // let startX = 0;
  // let isDragging = false;

  // sliderViewport.addEventListener("touchstart", (e) => {
  //   startX = e.touches[0].clientX;
  //   isDragging = true;
  // });

  // sliderViewport.addEventListener("touchmove", (e) => {
  //   if (!isDragging) return;
  //   const currentX = e.touches[0].clientX;
  //   const diffX = startX - currentX;

  //   sliderWrapper.style.transition = "none";
  //   sliderWrapper.style.transform = `translateX(-${
  //     getCardWidth() * currentIndex + diffX
  //   }px)`;
  // });

  // sliderViewport.addEventListener("touchend", (e) => {
  //   isDragging = false;
  //   const endX = e.changedTouches[0].clientX;
  //   const diff = startX - endX;

  //   sliderWrapper.style.transition = "transform 0.5s ease-in-out";

  //   if (diff > 50 && currentIndex < cards.length - 1) {
  //     goToSlide(currentIndex + 1);
  //   } else if (diff < -50 && currentIndex > 0) {
  //     goToSlide(currentIndex - 1);
  //   } else {
  //     goToSlide(currentIndex); // Snap back
  //   }
  // });

  goToSlide(0);
});

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
