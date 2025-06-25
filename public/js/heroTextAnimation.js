const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  {
    threshold: 0.1,
  }
);

document.querySelectorAll(".reveal").forEach((el) => {
  observer.observe(el);
});

// 3D Card Hover Effect
const cards = document.querySelectorAll(".overview-card");

cards.forEach((card) => {
  const cardInner = card.querySelector(".card-inner");
  const glow = card.querySelector(".card-glow");

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((rect.height / 2 - y) / (rect.height / 2)) * -10; // Max 10deg rotation
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 10; // Max 10deg rotation

    cardInner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    glow.style.setProperty("--glow-x", `${x}px`);
    glow.style.setProperty("--glow-y", `${y}px`);
  });

  card.addEventListener("mouseleave", () => {
    cardInner.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
  });
});

// Back to top
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}