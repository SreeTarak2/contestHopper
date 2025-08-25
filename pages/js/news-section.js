document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("GSAP or ScrollTrigger is not loaded.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  gsap.config({
    force3D: true,
    nullTargetWarn: false
  });

  function initAnimations() {
    gsap.set(".sdg-card", { 
      opacity: 0, 
      y: 50,
      willChange: "transform, opacity"
    });

    const sectionHeader = document.querySelector(".section-header");
    if (sectionHeader) {
      gsap.set(sectionHeader.children, { 
        y: 30, 
        opacity: 0,
        willChange: "transform, opacity"
      });

      gsap.to(sectionHeader.children, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".sdg-section",
          start: "top 80%",
          once: true,
          invalidateOnRefresh: false
        },
      });
    }

    const cards = document.querySelectorAll(".sdg-card");

    ScrollTrigger.batch(cards, {
      onEnter: (elements) => {
        gsap.to(elements, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          overwrite: true,
          onComplete: () => {
            elements.forEach(el => {
              el.style.willChange = "auto";
            });
          }
        });
      },
      start: "top 85%",
      once: true,
      refreshPriority: -1
    });

    ScrollTrigger.refresh();
  }

  requestAnimationFrame(() => {
    initAnimations();
  });

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
  });

  if (!CSS.supports('scroll-behavior', 'smooth')) {
    document.documentElement.style.scrollBehavior = 'smooth';
  }

  if (process.env.NODE_ENV === 'development') {
    ScrollTrigger.addEventListener("refresh", () => {
      console.log("ScrollTrigger refreshed");
    });
  }
});
