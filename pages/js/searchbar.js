const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

const url = "https://contesthopper.onrender.com";
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

  const response = await fetch(
    `${url}/search?q=${encodeURIComponent(query)}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  const filtered = data.results || [];
  console.log(data);
  console.log(filtered);
  if (filtered.length > 0) {
    searchResults.innerHTML = `
      <ul class="search-results-list">
        ${filtered
          .map(
            (contest) => `
            <li class="result-item">
            <a href="${contest.link}" class="result-link">
                <img src="${contest.image.url}" alt="${contest.image.alt}" class="result-image">
                <span class="result-title">${contest.title}</span>
            </a>
            </li>`
          )
          .join("")}
      </ul>
    `;
  } else {
    searchResults.innerHTML = `
      <div class="no-results">No contests found</div>
    `;
  }

  searchResults.style.display = "flex";
}

// Hide results when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".searchbar-wrapper")) {
    searchResults.style.display = "none";
  }
});

// Input listener
searchInput.addEventListener(
  "input",
  debounce((e) => {
    searchContests(e.target.value);
  }, 300)
);
