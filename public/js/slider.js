window.addEventListener("load", () => {
    const loadingOverlay = document.getElementById("loadingOverlay");
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.classList.add("hidden");
            document.body.style.overflow = "auto";
        }, 500);
    }

    const heroSection = document.querySelector(".hero-section");
    const sliderWrapper = document.getElementById("sliderWrapper");
    const dotsContainer = document.getElementById("pagination-dots");
    const heroImage = document.getElementById("heroImage");
    const heroTitle = document.getElementById("heroTitle");
    const heroDescription = document.getElementById("heroDescription");
    const heroText = document.querySelector(".hero-text");
    const slideLeftBtn = document.getElementById("slide-left");
    const slideRightBtn = document.getElementById("slide-right");

    if (!sliderWrapper || !heroImage || !heroText) {
        console.error("Slider components are missing from the DOM. Aborting slider script.");
        return;
    }

    const cards = Array.from(document.querySelectorAll(".mini-card"));
    if (cards.length === 0) return;

    let currentIndex = 0;
    let isTransitioning = false;
    let autoSlideInterval;
    let touchStartX = 0;

    function goToSlide(newIndex) {
        if (isTransitioning) return;
        isTransitioning = true;

        currentIndex = (newIndex + cards.length) % cards.length;
        const activeCard = cards[currentIndex];

        heroImage.classList.add("is-fading");
        heroText.classList.add("is-fading");

        setTimeout(() => {
            heroImage.src = activeCard.dataset.bg || "";
            heroTitle.textContent = activeCard.dataset.title || "No Title";
            heroDescription.textContent = activeCard.dataset.description || "No Description";
            heroImage.classList.remove("is-fading");
            heroText.classList.remove("is-fading");
        }, 250);

        cards.forEach((card) => card.classList.remove("active"));
        activeCard.classList.add("active");

        document.querySelectorAll(".dot").forEach((dot, i) => {
            dot.classList.toggle("active", i === currentIndex);
        });

        const cardWidth = cards[0].offsetWidth;
        const gap = parseInt(getComputedStyle(sliderWrapper).gap || "0");
        const offset = -currentIndex * (cardWidth + gap);
        sliderWrapper.style.transform = `translateX(${offset}px)`;

        setTimeout(() => {
            isTransitioning = false;
        }, 500);
    }

    const startAutoSlide = () => {
        stopAutoSlide();
        autoSlideInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 3000);
    };

    const stopAutoSlide = () => {
        clearInterval(autoSlideInterval);
    };

    const resetAutoSlideTimer = () => {
        stopAutoSlide();
        startAutoSlide();
    };

    function initSlider() {
        dotsContainer.innerHTML = "";
        cards.forEach((_, i) => {
            const dot = document.createElement("span");
            dot.classList.add("dot");
            dot.addEventListener("click", () => {
                goToSlide(i);
                resetAutoSlideTimer();
            });
            dotsContainer.appendChild(dot);
        });

        sliderWrapper.style.transition = "none";
        goToSlide(0);
        setTimeout(() => {
            sliderWrapper.style.transition =
                "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
            isTransitioning = false;
        }, 50);

        startAutoSlide();
    }

    slideRightBtn?.addEventListener("click", () => {
        goToSlide(currentIndex + 1);
        resetAutoSlideTimer();
    });

    slideLeftBtn?.addEventListener("click", () => {
        goToSlide(currentIndex - 1);
        resetAutoSlideTimer();
    });

    cards.forEach((card, index) => {
        card.addEventListener("click", () => {
            goToSlide(index);
            resetAutoSlideTimer();
        });
    });

    heroSection?.addEventListener("mouseenter", stopAutoSlide);
    heroSection?.addEventListener("mouseleave", startAutoSlide);

    function isTouchDevice() {
        const result = "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
        // console.log("Is touch device:", result); // Debug log
        return result;
    }

    if (isTouchDevice()) {
        sliderWrapper.addEventListener("touchstart", (e) => {
            console.log("touchstart event triggered");
            e.preventDefault();
            stopAutoSlide();
            touchStartX = e.changedTouches[0].screenX;
            console.log("Touch start detected:", touchStartX);
        }, { passive: true });

        sliderWrapper.addEventListener("touchend", (e) => {
            console.log("touchend event triggered");
            const touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;

            // console.log("Touch end detected:", touchEndX);
            // console.log("Swipe diff:", diff);

            if (Math.abs(diff) > 50) {
                console.log("Swipe detected. Navigating slide.");
                goToSlide(diff > 0 ? currentIndex + 1 : currentIndex - 1);
                resetAutoSlideTimer();
            } else {
                console.log("Swipe too small, no slide change.");
            }

            startAutoSlide();
        });
    }

    initSlider();
});
