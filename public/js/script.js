document.addEventListener("DOMContentLoaded", () => {
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function filterCards(type) {
    const sections = document.querySelectorAll(".card-section");
    const buttons = document.querySelectorAll(".features button");

    sections.forEach((section) => {
      section.classList.remove("active");
    });
    buttons.forEach((button) => {
      button.classList.remove("active-filter");
    });

    const targetSection = document.querySelector(`.${type}-section`);
    const activeButton = Array.from(buttons).find(
      (btn) => btn.getAttribute("onclick") === `filterCards('${type}')`
    );

    if (targetSection) {
      targetSection.classList.add("active");
    } else {
      console.warn(`Filter type "${type}" does not have a matching section.`);
    }

    if (activeButton) {
      activeButton.classList.add("active-filter");
    }
  }

  filterCards("hackathon");
  window.filterCards = filterCards;
});
