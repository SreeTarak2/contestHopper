let filterState = {
  experienceLevel: null,
  entryFee: null,
  mode: null,
};

function getExperienceLevelFilter() {
  const levelFilters = document.querySelectorAll(
    "#experience-level-filters input[type='radio']"
  );
  if (!levelFilters.length) {
    console.warn("No experience level filters found");
    return null;
  }
  const selectedFilter = Array.from(levelFilters).find(
    (filter) => filter.checked
  );
  return selectedFilter ? selectedFilter.value : null;
}

function getEntryFeeFilters() {
  const feeFilters = document.querySelectorAll(
    "#entry-fee-filters input[type='radio']"
  );
  if (!feeFilters.length) {
    console.warn("No entry fee filters found");
    return null;
  }
  const selectedFilter = Array.from(feeFilters).find(
    (filter) => filter.checked
  );
  return selectedFilter ? selectedFilter.value : null;
}

function getModeFilters() {
  const modeFilters = document.querySelectorAll(
    "#mode-filters input[type='radio']"
  );
  if (!modeFilters.length) {
    console.warn("No mode filters found");
    return null;
  }
  const selectedFilter = Array.from(modeFilters).find(
    (filter) => filter.checked
  );
  return selectedFilter ? selectedFilter.value : null;
}

function updateFilterState() {
  filterState.experienceLevel = getExperienceLevelFilter();
  filterState.entryFee = getEntryFeeFilters();
  filterState.mode = getModeFilters();
  return filterState;
}

function initializeFilters(onFilterChange) {
  updateFilterState();

  const allRadioButtons = document.querySelectorAll(
    "#experience-level-filters input[type='radio'], #entry-fee-filters input[type='radio'], #mode-filters input[type='radio']"
  );

  allRadioButtons.forEach((radio) => {
    // Track the last selected value for each group
    let lastSelected = null;

    radio.addEventListener("click", function (event) {
      const groupName = this.name; // Radio buttons in the same group share the same 'name'
      const currentValue = this.value;

      // If the radio was already checked, uncheck it
      if (this.checked && lastSelected === currentValue) {
        this.checked = false;
        lastSelected = null;
      } else {
        lastSelected = currentValue;
      }

      // Update filter state and call callback
      const newFilterState = updateFilterState();
      if (onFilterChange) {
        try {
          onFilterChange(newFilterState);
        } catch (error) {
          console.error("Error in onFilterChange callback:", error);
        }
      }
    });

    // Update lastSelected when a radio is changed via other means (e.g., keyboard)
    radio.addEventListener("change", function () {
      lastSelected = this.checked ? this.value : null;
    });
  });

  return filterState;
}

function setupFilters(onFilterChange) {
  return initializeFilters(onFilterChange);
}