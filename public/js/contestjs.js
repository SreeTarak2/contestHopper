document.addEventListener("DOMContentLoaded", () => {
  const contestSection = document.querySelector(".contests-section");
  if (contestSection) {
    const allCards = document.querySelectorAll(".contest-card");
    const filterButtons = document.querySelectorAll(".filters-section .filter-button");
    const dropdown = document.querySelector(".category-filter-dropdown");

    const filterContestCards = (filter) => {
      allCards.forEach((card) => {
        card.classList.remove("expanded");
        if (
          filter === "all" ||
          (card.dataset.category && card.dataset.category.includes(filter))
        ) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    };

    allCards.forEach((card) => {
      const closeButton = card.querySelector(".card-close-btn");

      card.addEventListener("click", () => {
        if (card.classList.contains("expanded")) return;
        allCards.forEach((c) => c.classList.remove("expanded"));
        card.classList.add("expanded");
      });

      if (closeButton) {
        closeButton.addEventListener("click", (e) => {
          e.stopPropagation();
          card.classList.remove("expanded");
        });
      }
    });

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        filterContestCards(button.dataset.filter);
      });
    });

    if (dropdown) {
      const toggleButton = document.getElementById("categoryFilterToggle");
      const menu = document.getElementById("categoryFilterMenu");
      const toggleText = toggleButton.querySelector("span");
      const dropdownItems = menu.querySelectorAll(".dropdown-item");

      toggleButton.addEventListener("click", () => {
        dropdown.classList.toggle("open");
        toggleButton.setAttribute(
          "aria-expanded",
          dropdown.classList.contains("open")
        );
      });

      dropdownItems.forEach((item) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          const category = item.dataset.category;
          toggleText.textContent = item.textContent;
          dropdown.classList.remove("open");
          toggleButton.setAttribute("aria-expanded", "false");
          filterContestCards(category);
        });
      });

      window.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove("open");
          toggleButton.setAttribute("aria-expanded", "false");
        }
      });
    }
  }

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
