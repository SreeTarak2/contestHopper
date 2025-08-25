document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(SplitText);

  const slides = document.querySelectorAll(".slide");
  const contents = document.querySelectorAll(".content-item");
  const nextButton = document.querySelector(".next-button");
  const prevButton = document.querySelector(".prev-button");
  const progressBar = document.querySelector(".slide-progress-bar");
  const totalSlides = slides.length;
  let currentIndex = 0;
  let isAnimating = false;

  // --- Self-contained animation functions ---
  function animateTextIn(content) {
    const tl = gsap.timeline();
    const title = content.querySelector(".title, .hero-title");
    const description = content.querySelector(".description, .hero-subtitle");
    const cta = content.querySelector(".hero-cta");

    // Use SplitText locally
    const titleSplit = new SplitText(title, { type: "chars" });
    const descriptionSplit = new SplitText(description, { type: "lines" });

    tl.from(titleSplit.chars, {
      opacity: 0,
      y: 100,
      rotationX: 90,
      duration: 0.8,
      ease: "back.out(1.7)",
      stagger: { amount: 0.6 },
    }).from(
      descriptionSplit.lines,
      {
        opacity: 0,
        x: -50,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.2,
      },
      0.3
    );

    if (cta) {
      tl.from(
        cta,
        {
          opacity: 0,
          y: 30,
          duration: 0.6,
        },
        0.6
      );
    }
    return tl;
  }

  function animateTextOut(content) {
    const tl = gsap.timeline();
    const titleChars = content.querySelector(".title, .hero-title").children;
    const descriptionLines = content.querySelector(
      ".description, .hero-subtitle"
    ).children;
    const cta = content.querySelector(".hero-cta");

    if (cta) {
      tl.to(cta, { opacity: 0, y: 30, duration: 0.4 }, 0);
    }
    if (descriptionLines.length > 0) {
      tl.to(
        descriptionLines,
        {
          opacity: 0,
          x: -30,
          duration: 0.4,
          ease: "power3.in",
          stagger: 0.1,
        },
        0
      );
    }
    if (titleChars.length > 0) {
      tl.to(
        titleChars,
        {
          opacity: 0,
          y: -100,
          rotationX: -90,
          duration: 0.5,
          ease: "power3.in",
          stagger: { amount: 0.3 },
        },
        0.1
      );
    }
    return tl;
  }

  function updateProgressBar(index) {
    const progress = (index / (totalSlides - 1)) * 100;
    gsap.to(progressBar, {
      width: `${progress}%`,
      duration: 1.2,
      ease: "power3.inOut",
    });
  }

  // --- Slider Initialization ---
  function initializeSlider() {
    // Set initial state for all slides
    slides.forEach((slide, i) => {
      gsap.set(slide, {
        xPercent: i === 0 ? 0 : 120,
        scale: i === 0 ? 1 : 0.6,
        filter: i === 0 ? "brightness(1)" : "brightness(0.4)",
      });
    });

    gsap.set(contents, { opacity: 0 });
    gsap.set(contents[0], { opacity: 1 });

    updateProgressBar(0);
    animateTextIn(contents[0]);
  }

  // --- GLITCH-FREE Core Slide Transition ---
  function goToSlide(newIndex, direction) {
    if (isAnimating) return;
    isAnimating = true;

    const currentSlide = slides[currentIndex];
    const newSlide = slides[newIndex];
    const currentContent = contents[currentIndex];
    const newContent = contents[newIndex];

    // Animate UI immediately
    updateProgressBar(newIndex);
    gsap.set(newContent, { opacity: 1 });

    const masterTL = gsap.timeline({
      onComplete: () => {
        // THE FIX: Intelligently reset ALL slides to their correct "waiting" positions.
        slides.forEach((slide, i) => {
          if (i !== newIndex) {
            // If a slide is "behind" the new active slide, place it on the left.
            // If it's "ahead", place it on the right.
            // This handles wrapping around from the last to first slide and vice-versa.
            const wrapAwareIndex =
              (i < newIndex && newIndex - i < totalSlides / 2) ||
              (i > newIndex && i - newIndex > totalSlides / 2);
            gsap.set(slide, { xPercent: wrapAwareIndex ? -120 : 120 });
          }
        });
        gsap.set(currentContent, { opacity: 0 });
        currentIndex = newIndex;
        isAnimating = false;
      },
    });

    masterTL.add(animateTextOut(currentContent));

    if (direction === "next") {
      masterTL
        .to(
          currentSlide,
          {
            xPercent: -120,
            scale: 0.6,
            filter: "brightness(0.4)",
            duration: 1.2,
            ease: "power3.inOut",
          },
          0
        )
        .fromTo(
          newSlide,
          { xPercent: 120, scale: 0.6, filter: "brightness(0.4)" },
          {
            xPercent: 0,
            scale: 1,
            filter: "brightness(1)",
            duration: 1.2,
            ease: "power3.inOut",
          },
          0
        );
    } else {
      // Direction is 'prev'
      masterTL
        .to(
          currentSlide,
          {
            xPercent: 120,
            scale: 0.6,
            filter: "brightness(0.4)",
            duration: 1.2,
            ease: "power3.inOut",
          },
          0
        )
        .fromTo(
          newSlide,
          { xPercent: -120, scale: 0.6, filter: "brightness(0.4)" },
          {
            xPercent: 0,
            scale: 1,
            filter: "brightness(1)",
            duration: 1.2,
            ease: "power3.inOut",
          },
          0
        );
    }

    masterTL.add(animateTextIn(newContent), 0.4);
  }

  // --- Event Listeners ---
  nextButton.addEventListener("click", () => {
    goToSlide((currentIndex + 1) % totalSlides, "next");
  });

  prevButton.addEventListener("click", () => {
    goToSlide((currentIndex - 1 + totalSlides) % totalSlides, "prev");
  });

  // --- Initialization ---
  initializeSlider();
});
