const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const searchModalOverlay = document.getElementById("search-modal-overlay");
const searchModalBody = document.getElementById("search-modal-body");
const searchModalTitle = document.getElementById("search-modal-title");
const closeSearchModalBtn = document.getElementById("close-search-modal-btn");

const baseUrl = "https://contesthopper.onrender.com";
// const baseUrl = "http://127.0.0.1:3000";

function openSearchModal() {
  searchModalOverlay.classList.add("active");
}

function closeSearchModal() {
  searchModalOverlay.classList.remove("active");
}

closeSearchModalBtn.addEventListener("click", closeSearchModal);
searchModalOverlay.addEventListener("click", (e) => {
  if (e.target === searchModalOverlay) {
    closeSearchModal();
  }
});

function debounce(fn, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

async function fetchAllResultsAndShowModal(query, totalCount) {
  searchResults.style.display = "none";
  searchModalTitle.textContent = `Searching for "${query}"...`;
  searchModalBody.innerHTML = '<div class="loader cards--loader"></div>';
  openSearchModal();

  try {
    const response = await fetch(
      `${baseUrl}/search?q=${encodeURIComponent(query)}&limit=${totalCount}`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();

    populateSearchModal(data.results, query);
  } catch (error) {
    console.error("Failed to fetch all search results:", error);
    searchModalTitle.textContent = `Error`;
    searchModalBody.innerHTML = `<p class="no-results-message">Could not load search results. Please try again.</p>`;
  }
}

function populateSearchModal(results, query) {
  searchModalTitle.textContent = `Showing ${results.length} results for "${query}"`;
  searchModalBody.innerHTML = "";

  if (results.length === 0) {
    searchModalBody.innerHTML =
      '<p class="no-results-message">No matching opportunities found.</p>';
    return;
  }

  results.forEach((contest) => {
    const item = document.createElement("a");
    item.href = `contests.html#${contest._id}`;
    item.classList.add("modal-search-result-item");
    item.innerHTML = `
            <img src="${contest.image.url}" alt="${contest.image.alt}">
            <div class="result-info">
                <h4>${contest.title}</h4>
                <p>${contest.category}</p>
            </div>
        `;
    item.addEventListener("click", closeSearchModal);
    searchModalBody.appendChild(item);
  });
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

    searchResults.innerHTML = "";

    if (totalCount > 0) {
      const list = document.createElement("ul");
      list.className = "search-results-list";
      list.innerHTML = filteredResults
        .map(
          (contest) => `
                <li class="result-item">
                    <a href="contests.html#${contest._id}" class="result-link">
                        <img src="${contest.image.url}" alt="${contest.image.alt}" class="result-image">
                        <span class="result-title">${contest.title}</span>
                    </a>
                </li>`
        )
        .join("");
      searchResults.appendChild(list);

      if (totalCount > filteredResults.length) {
        const viewAllBtn = document.createElement("button");
        viewAllBtn.className = "view-all-results-link";
        viewAllBtn.textContent = `View All ${totalCount} Results`;

        viewAllBtn.addEventListener("click", () => {
          fetchAllResultsAndShowModal(query, totalCount);
        });

        searchResults.appendChild(viewAllBtn);
      }
    } else {
      searchResults.innerHTML = `<div class="no-results">No contests found for "${query}"</div>`;
    }
  } catch (error) {
    console.error("Search failed:", error);
    searchResults.innerHTML = `<div class="no-results error">Search failed.</div>`;
  }
}

document.addEventListener("click", (e) => {
  if (!e.target.closest(".searchbar-wrapper")) {
    searchResults.style.display = "none";
    searchInput.value = "";
  }
});

searchResults.addEventListener("click", (e) => {
  if (e.target.closest("a.result-link")) {
    searchResults.style.display = "none";
  }
});

searchInput.addEventListener(
  "input",
  debounce((e) => {
    searchContests(e.target.value);
  }, 300)
);
