function getFilters() {
    const levelFilters = document.querySelectorAll("#experience-level-filters input[type='radio']");
    
    if (!levelFilters.length) {
        console.warn('No experience level filters found');
        return null;
    }

    const selectedFilter = Array.from(levelFilters).find(filter => filter.checked);
    if (selectedFilter) {
        console.log('Selected experience level:', selectedFilter.value);
        return selectedFilter.value;
    } else {
        console.log('No experience level selected');
        return null;
    }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
    try {
        getFilters();
    } catch (error) {
        console.error('Error initializing filters:', error);
    }
});

// Update on filter change
document.addEventListener("change", (event) => {
    if (event.target.matches("#experience-level-filters input[type='radio']")) {
        try {
            const selectedValue = getFilters();
            // Add logic here to handle filter change, e.g., update UI or fetch data
            if (selectedValue) {
                console.log('Filter changed to:', selectedValue);
                // Example: trigger a function to update content based on selectedValue
            }
        } catch (error) {
            console.error('Error handling filter change:', error);
        }
    }
});