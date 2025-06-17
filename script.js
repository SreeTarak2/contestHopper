// This function runs when the entire HTML document has been loaded.
document.addEventListener('DOMContentLoaded', () => {
    // Show 'hackathon' section by default when the page loads
    filterCards('hackathon');
});

/**
 * Filters the contest/competition/hackathon cards based on the selected type.
 * @param {string} type - The category to display (e.g., 'hackathon', 'competition').
 */
function filterCards(type) {
    const sections = document.querySelectorAll('.card-section');
    const buttons = document.querySelectorAll('.features button');

    // 1. Hide all card sections
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // 2. Remove the 'active' style from all buttons
    buttons.forEach(button => {
        button.classList.remove('active-filter');
    });

    // 3. Find the button corresponding to the 'type' and add the 'active' style
    const activeButton = Array.from(buttons).find(btn => btn.getAttribute('onclick') === `filterCards('${type}')`);
    if (activeButton) {
        activeButton.classList.add('active-filter');
    }

    // 4. Show the relevant section.
    // Note: 'upcoming' and 'past' filters don't have corresponding sections in the current HTML.
    // The code will gracefully do nothing for them.
    const targetSection = document.querySelector(`.${type}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    } else {
        console.warn(`Filter type "${type}" does not have a matching section.`);
    }
}