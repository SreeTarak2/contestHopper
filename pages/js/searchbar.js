const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

// const baseUrl = "https://contesthopper.onrender.com";
const baseUrl = "http://127.0.0.1:3000";
// Debounce function
function debounce(fn, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}
async function searchContests(query) {
  if (!query.trim()) {
    searchResults.style.display = "none";
    searchResults.innerHTML = "";
    return;
  }

  searchResults.innerHTML = `<div class="loading-results">Searching...</div>`;
  searchResults.style.display = "flex";

  try {
    const response = await fetch(
      `${baseUrl}/search?q=${encodeURIComponent(query)}`
    );
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    const filteredResults = data.results || [];
    const totalCount = data.totalCount || 0;

    if (totalCount > 0) {
      let html = '<ul class="search-results-list">';
      
      html += filteredResults.map(
          (contest) => `
          <li class="result-item">
            <a href="contests.html#${contest._id}" class="result-link">
                <img src="${contest.image.url}" alt="${contest.image.alt}" class="result-image">
                <span class="result-title">${contest.title}</span>
            </a>
          </li>`
        )
        .join("");

      html += '</ul>';

      if (totalCount > 10) {
        html += `
          <a href="contests.html?search=${encodeURIComponent(query)}" class="view-all-results-link">
            View All ${totalCount} Results
          </a>
        `;
      }
      
      searchResults.innerHTML = html;

    } else {
      searchResults.innerHTML = `<div class="no-results">No contests found for "${query}"</div>`;
    }
  } catch (error) {
    console.error("Search failed:", error);
    searchResults.innerHTML = `<div class="no-results error">Search failed.</div>`;
  }
}
// Hide results when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".searchbar-wrapper")) {
    searchResults.style.display = "none";
    searchInput.value = "";
  }
});

// close the results when user clicks one of the result
searchResults.addEventListener("click", () => {
  searchResults.style.display = "none";
});

// Input listener
searchInput.addEventListener(
  "input",
  debounce((e) => {
    searchContests(e.target.value);
  }, 300)
);
