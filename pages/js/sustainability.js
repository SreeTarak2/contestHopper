function showSection(sectionId) {
  const sections = document.querySelectorAll(".tab-section");
  const buttons = document.querySelectorAll(".tab-btn");

  sections.forEach((section) => {
    section.classList.remove("active");
  });
  buttons.forEach((button) => {
    button.classList.remove("active");
  });

  // Show the target section
  const activeSection = document.getElementById(sectionId);
  if (activeSection) {
    activeSection.classList.add("active");
  }
  const activeButton = document.querySelector(
    `.tab-btn[onclick="showSection('${sectionId}')"]`
  );
  if (activeButton) {
    activeButton.classList.add("active");
  }
}
