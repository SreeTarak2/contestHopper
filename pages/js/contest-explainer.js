document.addEventListener("DOMContentLoaded", () => {
  const accordionItems = document.querySelectorAll(".explainer-item");
  const previewImage = document.getElementById("explainerPreviewImage");
  const previewTitle = document.getElementById("explainerPreviewTitle");
  const previewCard = document.querySelector(".preview-card");

  if (accordionItems.length > 0) {
    accordionItems.forEach((item) => {
      item.addEventListener("click", () => {
        const wasActive = item.classList.contains("active");

        // Close all items
        accordionItems.forEach((i) => i.classList.remove("active"));

        if (!wasActive) {
          item.classList.add("active");

          const newImageSrc = item.dataset.image;
          const newTitle = item.dataset.title;

          previewImage.classList.add("is-changing");

          setTimeout(() => {
            previewImage.src = newImageSrc;
            previewTitle.textContent = newTitle;

            previewImage.onload = () => {
              previewImage.classList.remove("is-changing");
            };

            // Fallback in case image is cached or fails to trigger onload
            setTimeout(() => previewImage.classList.remove("is-changing"), 300);
          }, 300);
        }
      });
    });
  }

  // 3D Tilt Effect for the preview card
  if (previewCard) {
    previewCard.addEventListener("mousemove", (e) => {
      const rect = previewCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const { width, height } = rect;
      const rotateX = (y / height - 0.5) * -20; // Max rotation 10deg
      const rotateY = (x / width - 0.5) * 20; // Max rotation 10deg

      previewCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    previewCard.addEventListener("mouseleave", () => {
      previewCard.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
    });
  }
});
