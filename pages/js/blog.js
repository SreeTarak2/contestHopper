document.addEventListener("DOMContentLoaded", function () {

    // === 1. INTERACTIVE MOUSE-FOLLOW BACKGROUND ===
    const body = document.body;
    const xTo = gsap.quickTo(body.style, "--mouse-x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(body.style, "--mouse-y", { duration: 0.5, ease: "power3" });

    window.addEventListener("mousemove", (e) => {
        xTo(e.clientX + "px");
        yTo(e.clientY + "px");
    });


    // === 2. ENHANCED FEATURED POSTS CAROUSEL ===
    const sliderSection = document.querySelector(".featured-post-section");
    const container = document.querySelector(".featured-posts-container");
    const posts = document.querySelectorAll(".featured-post");
    const paginationContainer = document.querySelector(".featured-pagination");

    if (container && posts.length > 0) {
        let currentIndex = 0;
        let autoPlayInterval;

        // Create pagination dots
        posts.forEach((_, index) => {
            const dot = document.createElement("button");
            dot.classList.add("pagination-dot");
            dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
            dot.dataset.index = index;
            paginationContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll(".pagination-dot");

        function goToSlide(index) {
            container.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach((dot) => dot.classList.remove("active"));
            dots[index].classList.add("active");
            currentIndex = index;
        }

        function nextSlide() {
            const newIndex = (currentIndex + 1) % posts.length;
            goToSlide(newIndex);
        }

        function resetAutoplay() {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(nextSlide, 5000);
        }

        // --- Event Listeners ---
        paginationContainer.addEventListener("click", (e) => {
            if (e.target.matches(".pagination-dot")) {
                const index = parseInt(e.target.dataset.index, 10);
                goToSlide(index);
                resetAutoplay(); // ✅ FIX: Reset autoplay after manual click
            }
        });

        // Pause on hover
        sliderSection.addEventListener("mouseenter", () => clearInterval(autoPlayInterval));
        sliderSection.addEventListener("mouseleave", resetAutoplay);

        // ✅ FIX: Scope keydown to the container to avoid global conflicts
        container.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight") {
                e.preventDefault(); // Prevent page scroll
                nextSlide();
                resetAutoplay();
            } else if (e.key === "ArrowLeft") {
                e.preventDefault(); // Prevent page scroll
                const newIndex = (currentIndex - 1 + posts.length) % posts.length;
                goToSlide(newIndex);
                resetAutoplay();
            }
        });
        
        // --- Initialization ---
        goToSlide(0);
        resetAutoplay(); // Start the autoplay
        container.setAttribute("tabindex", "0"); // Make it focusable
    }


    // === 3. "LOAD MORE" & GSAP CARD ANIMATION ===
    const loadMoreBtn = document.querySelector(".load-more-btn");
    const blogsContainer = document.querySelector('.blogs-container');

    // Setup the Intersection Observer for card animations
    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                gsap.fromTo(
                    entry.target,
                    { opacity: 0, y: 50, scale: 0.95 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.8,
                        ease: "power3.out",
                    }
                );
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, { threshold: 0.1 });

    // Initially, observe only the visible cards
    document.querySelectorAll(".blog-card:not(.hidden)").forEach(card => cardObserver.observe(card));

    // Logic for the "Load More" button
    if (loadMoreBtn && blogsContainer) {
        loadMoreBtn.addEventListener("click", () => {
            const hiddenCards = blogsContainer.querySelectorAll(".blog-card.hidden");
            const cardsToShow = 3; // How many cards to reveal per click

            for (let i = 0; i < cardsToShow && i < hiddenCards.length; i++) {
                const card = hiddenCards[i];
                card.classList.remove("hidden");
                
                // ✅ FIX: Now we observe the newly visible card so it can be animated
                cardObserver.observe(card);
            }

            // Hide the "Load More" button if no cards are left
            if (blogsContainer.querySelectorAll(".blog-card.hidden").length === 0) {
                loadMoreBtn.style.display = "none";
            }
        });
    }
});