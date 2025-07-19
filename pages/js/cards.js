const categoryFilters = document.querySelectorAll(".filter-item");
const statusFilters = document.querySelectorAll(".filter-button");
const contestItems = document.querySelectorAll(".contest-item");
const cardsContainer = document.querySelector(".contest-cards-list-container");
const categoryFilterContainer = document.querySelector(".category-filters");
const tagFilterContainer = document.querySelector(".tag-filters-container");

const loadMoreBtn = document.getElementById("loadMoreBtn");
let contestsPerLoad = 11;
let allFilteredItems = [];
let currentlyDisplayedCount = 0;

let currentCategory = "all";
let currentStatus = "all";
let activeIntervals = [];
let currentTags = [];
let allContestsData = [];

// const url = "https://contesthopper.onrender.com";
const url = "http://127.0.0.1:3000";

function getUniqueValues(data, key) {
  const allValues = data.flatMap((item) => item[key] || []);
  if (key === "meta.tags") {
    const allTags = data.flatMap((item) => item.meta.tags || []);
    return ["All", ...new Set(allTags)].sort();
  }

  const uniqueValues = [
    ...new Set(
      allValues.map((v) =>
        v.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")
      )
    ),
  ];
  return ["all", ...uniqueValues].sort();
}

// --- NEW: Function to populate filters dynamically ---
function populateFilters(data) {
  categoryFilterContainer.innerHTML = "";
  const uniqueCategories = getUniqueValues(data, "category");
  uniqueCategories.forEach((category) => {
    const a = document.createElement("a");
    a.href = "#";
    a.className = "filter-item";
    a.dataset.category = category;
    a.textContent = category
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
    if (category === "all") {
      a.classList.add("active");
      a.textContent = "All Categories";
    }
    categoryFilterContainer.appendChild(a);
  });

  // 2. Populate Tags
  // tagFilterContainer.innerHTML = ""; // Clear existing
  // const uniqueTags = getUniqueValues(data, "meta.tags");
  // uniqueTags.forEach((tag) => {
  //   const button = document.createElement("button");
  //   button.className = "tag-filter-button";
  //   button.dataset.tag = tag.toLowerCase();
  //   button.textContent = tag;
  //   if (tag === "All") button.classList.add("active");
  //   tagFilterContainer.appendChild(button);
  // });

  // 3. Add event listeners after creation
  addFilterEventListeners();
}

function addFilterEventListeners() {
  // Category Filters
  document.querySelectorAll(".filter-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      document
        .querySelectorAll(".filter-item")
        .forEach((link) => link.classList.remove("active"));
      e.currentTarget.classList.add("active");
      currentCategory = e.currentTarget.dataset.category.toLowerCase();
      renderFilteredContests();
    });
  });

  // Status Filters
  document.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      document
        .querySelectorAll(".filter-button")
        .forEach((btn) => btn.classList.remove("active"));
      e.currentTarget.classList.add("active");
      currentStatus = e.currentTarget.dataset.status.toLowerCase();
      renderFilteredContests();
    });
  });

  // Tag Filters (Handles multi-select logic)
  document.querySelectorAll(".tag-filter-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const clickedTag = e.currentTarget.dataset.tag;

      if (clickedTag === "all") {
        currentTags = [];
        document
          .querySelectorAll(".tag-filter-button")
          .forEach((btn) => btn.classList.remove("active"));
        e.currentTarget.classList.add("active");
      } else {
        // Deactivate the "All" button if another tag is clicked
        document
          .querySelector('.tag-filter-button[data-tag="all"]')
          .classList.remove("active");

        e.currentTarget.classList.toggle("active");
        if (currentTags.includes(clickedTag)) {
          currentTags = currentTags.filter((t) => t !== clickedTag);
        } else {
          currentTags.push(clickedTag);
        }

        // If no tags are selected, re-activate "All"
        if (currentTags.length === 0) {
          document
            .querySelector('.tag-filter-button[data-tag="all"]')
            .classList.add("active");
        }
      }
      renderFilteredContests();
    });
  });
}

function sortContestsByStatusAndDays(dataArray) {
  const statusOrder = { open: 0, upcoming: 1, closed: 2 };
  return dataArray.slice().sort((a, b) => {
    const statusA = a.status || "closed";
    const statusB = b.status || "closed";

    const statusComparison = statusOrder[statusA] - statusOrder[statusB];
    if (statusComparison !== 0) {
      return statusComparison;
    }
    if (statusA === "open" || statusA === "upcoming") {
      const timeA = new Date(a.meta.endISO || 0).getTime();
      const timeB = new Date(b.meta.endISO || 0).getTime();
      return timeA - timeB;
    }
    if (statusA === "closed") {
      const timeA = new Date(a.meta.endISO || 0).getTime();
      const timeB = new Date(b.meta.endISO || 0).getTime();
      return timeB - timeA;
    }
    return 0;
  });
}

function renderFilteredContests() {
  cardsContainer.innerHTML = '<div class="loader cards--loader"></div>';
  activeIntervals.forEach(clearInterval);
  activeIntervals = [];

  if (loadMoreBtn) loadMoreBtn.style.display = "none";

  setTimeout(() => {
    const sortedData = sortContestsByStatusAndDays(allContestsData);

    allFilteredItems = sortedData.filter((item) => {
      const itemCategory = (item.category || "")
        .toLowerCase()
        .replace(/ & /g, "-")
        .replace(/ /g, "-");
      const itemStatus = item.status || "closed";
      const itemTags = (item.meta.tags || []).map((t) => t.toLowerCase());

      // Filtering logic
      const matchesCategory =
        currentCategory === "all" || itemCategory === currentCategory;
      const matchesStatus =
        currentStatus === "all" || itemStatus === currentStatus;

      const matchesTags =
        currentTags.length === 0 ||
        currentTags.every((tag) => itemTags.includes(tag));

      return matchesCategory && matchesStatus && matchesTags;
    });

    // // 2. Clear container and render cards or empty message
    cardsContainer.innerHTML = "";
    currentlyDisplayedCount = 0;

    if (allFilteredItems.length > 0) {
      loadNextBatch();
    } else {
      cardsContainer.innerHTML =
        '<p class="no-results-message">No opportunities match your selected filters. Try a different combination!</p>';
    }
  }, 200);
}

// next 10 cards results
function loadNextBatch() {
  const fragment = document.createDocumentFragment();
  const nextBatchEnd = currentlyDisplayedCount + contestsPerLoad;

  const itemsToLoad = allFilteredItems.slice(
    currentlyDisplayedCount,
    nextBatchEnd
  );
  itemsToLoad.forEach((item) => {
    const card = createContestCard(item);
    fragment.appendChild(card);
  });

  cardsContainer.appendChild(fragment);
  currentlyDisplayedCount += itemsToLoad.length;

  // const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (loadMoreBtn) {
    if (currentlyDisplayedCount >= allFilteredItems.length) {
      loadMoreBtn.style.display = "none";
    } else {
      loadMoreBtn.style.display = "block";
    }
  }
}

function formatDateToLong(dateString) {
  if (!dateString) return "--";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "--";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function calculateDaysLeft(endDateString) {
  if (!endDateString) return "--";
  const endDate = new Date(endDateString);
  const presentDate = new Date();

  if (isNaN(endDate.getTime())) return "--";

  const diffTime = endDate.getTime() - presentDate.getTime();

  if (diffTime < 0) {
    return "Ended";
  }

  if (diffTime < 24 * 60 * 60 * 1000) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    const diffSeconds = Math.floor((diffTime % (1000 * 60)) / 1000);
    return `${String(diffHours).padStart(2, "0")}:${String(
      diffMinutes
    ).padStart(2, "0")}:${String(diffSeconds).padStart(2, "0")}`;
  }

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function startCountdown(element) {
  const endDateString = element.dataset.end;
  if (!endDateString) return;

  const endDate = new Date(endDateString);

  const intervalId = setInterval(() => {
    const now = new Date().getTime();
    const timeLeft = endDate.getTime() - now;

    if (timeLeft <= 0) {
      clearInterval(intervalId);
      element.textContent = "Ended";
      element.classList.remove("days-left-count");
      element.classList.add("days-left-text");

      const card = element.closest(".contest-item");
      const statusTag = card?.querySelector(".status-tag");
      if (statusTag) {
        statusTag.className = "status-tag closed";
        statusTag.innerHTML = '<span class="contest-dot"></span>Closed';
      }
      return;
    }

    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    element.textContent = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, 1000);

  activeIntervals.push(intervalId);
}

function createContestCard(data) {
  const cardArticle = document.createElement("article");
  cardArticle.id = data._id;
  cardArticle.classList.add("contest-item", "contest-item--detailed");
  const statusFromDB = data.status || "closed";
  cardArticle.dataset.category = (data.category || "")
    .toLowerCase()
    .replace(/ & /g, "-")
    .replace(/ /g, "-");
  cardArticle.dataset.status = statusFromDB;
  cardArticle.dataset.endiso = data.meta.endISO || "";

  const imageWrapper = document.createElement("div");
  imageWrapper.classList.add("contest-item__image-wrapper");

  const img = document.createElement("img");
  img.src = data.image.url;
  img.alt = data.image.alt;
  img.loading = "lazy";

  const imageTag = document.createElement("span");
  imageTag.classList.add("image-tag");
  imageTag.textContent = data.imageTag;

  const statusTag = document.createElement("span");
  statusTag.classList.add("status-tag", statusFromDB);
  const dot = document.createElement("span");
  dot.classList.add("contest-dot");
  statusTag.append(
    dot,
    statusFromDB.charAt(0).toUpperCase() + statusFromDB.slice(1)
  );

  imageWrapper.append(img, imageTag, statusTag);

  const itemContent = document.createElement("div");
  itemContent.classList.add("contest-item__content");

  const itemTitle = document.createElement("h3");
  itemTitle.classList.add("item-title");
  itemTitle.textContent = data.title;

  const itemDescription = document.createElement("p");
  itemDescription.classList.add("item-description");
  itemDescription.textContent = data.description;

  const createMeta = (html) => {
    const div = document.createElement("div");
    div.classList.add("item-meta");
    div.innerHTML = html;
    return div;
  };

  const formattedDate = formatDateToLong(data.meta.endISO);
  const prizeText = data.meta.prize?.amount
    ? `${data.meta.prize.currency} ${data.meta.prize.amount}`
    : data.meta.prize?.description || "Not Specified";

  const meta1 = createMeta(`
    <span><i class="fa-solid fa-users"></i> ${data.meta.eligibility}</span>
    <span><i class="fa-solid fa-location-dot"></i> ${data.meta.location}</span>
    <span><i class="fa-solid fa-globe"></i> ${data.meta.mode}</span>
  `);
  const meta2 = createMeta(
    `<span><i class="fa-solid fa-tag"></i> ${data.meta.tags.join(", ")}</span>`
  );
  const meta3 = createMeta(`
    <span><i class="fa-solid fa-trophy"></i> Prize: <strong>${prizeText}</strong></span>
  `);
  const meta4 = createMeta(`
    <span>📅 Starts At: <strong>${
      formatDateToLong(data.meta.startDate) || "--"
    }</strong></span>
    <span>⏳ Ends At: <strong class="platinum-shine">${formattedDate}</strong></span>
  `);

  const actionWrapper = document.createElement("div");
  actionWrapper.classList.add("actions-wrapper");

  const applyBtn = document.createElement("a");
  applyBtn.href = data.link;
  applyBtn.target = "_blank";
  applyBtn.rel = "noopener noreferrer";
  applyBtn.classList.add("apply-button");
  applyBtn.innerHTML = `<span>Apply Now</span> <i class="fa-solid fa-arrow-right"></i>`;

  if (statusFromDB === "closed") {
    applyBtn.innerHTML = `<span>Contest Ended</span> <i class="fa-solid fa-times-circle"></i>`;
    applyBtn.classList.add("disabled");
    applyBtn.style.pointerEvents = "none";
  } else if (statusFromDB === "upcoming") {
    applyBtn.innerHTML = `<span>Opens Soon</span> <i class="fa-solid fa-clock"></i>`;
    // applyBtn.classList.add("disabled");
    applyBtn.style.pointerEvents = "none";
  }

  // icons div
  const iconDiv = document.createElement("div");
  iconDiv.classList.add("icons-wrapper");

  // share icon
  const shareIcon = document.createElement("i");
  shareIcon.classList.add("fa-solid", "fa-share", "action-icon", "share-icon");
  shareIcon.title = "Share";

  // bookmark icon
  const bookmarkIcon = document.createElement("i");
  bookmarkIcon.classList.add(
    "fa-solid",
    "fa-bookmark",
    "action-icon",
    "bookmark-icon"
  );
  bookmarkIcon.title = "Bookmark";

  iconDiv.append(shareIcon, bookmarkIcon);

  actionWrapper.append(applyBtn, iconDiv);

  itemContent.append(
    itemTitle,
    itemDescription,
    meta1,
    meta2,
    meta3,
    meta4,
    actionWrapper
  );

  const daysLeftBox = document.createElement("div");
  daysLeftBox.classList.add("days-left-box");

  const label = document.createElement("div");
  label.classList.add("days-left-label");

  const count = document.createElement("div");
  count.dataset.end = data.meta.endISO || "";

  const daysLeft = calculateDaysLeft(data.meta.endISO);
  count.textContent = daysLeft;

  if (typeof daysLeft === "number") {
    label.textContent = daysLeft === 1 ? "Day Left" : "Days Left";
    count.classList.add("days-left-count");
  } else if (typeof daysLeft === "string" && daysLeft.includes(":")) {
    label.textContent = "Ends In";
    count.classList.add("days-left-count", "countdown-timer");
    startCountdown(count);
  } else {
    label.textContent = "Status";
    count.classList.add("days-left-text");
  }

  daysLeftBox.append(label, count);
  cardArticle.append(imageWrapper, itemContent, daysLeftBox);
  return cardArticle;
}

categoryFilters.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    categoryFilters.forEach((link) => link.classList.remove("active"));
    e.currentTarget.classList.add("active");
    const category = e.currentTarget.dataset.category.toLowerCase();
    currentCategory = category.replace(/ & /g, "-").replace(/ /g, "-");
    console.log(currentCategory);
    renderFilteredContests();
  });
});

statusFilters.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    statusFilters.forEach((btn) => btn.classList.remove("active"));
    e.currentTarget.classList.add("active");
    currentStatus = e.currentTarget.dataset.status.toLowerCase();
    renderFilteredContests();
  });
});

function scrollToAndHighlight(contestId) {
  const targetCard = document.getElementById(contestId);
  if (targetCard) {
    targetCard.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    targetCard.classList.add("highlight");
    setTimeout(() => {
      targetCard.classList.remove("highlight");
    }, 2500);
  }
}

async function handleHashNavigation() {
  const contestId = window.location.hash.substring(1);
  if (!contestId) return;

  history.pushState(
    "",
    document.title,
    window.location.pathname + window.location.search
  );

  if (document.getElementById(contestId)) {
    scrollToAndHighlight(contestId);
    return;
  }

  const targetItem = allContestsData.find((item) => item._id === contestId);
  if (!targetItem) {
    return;
  }

  document
    .querySelectorAll(
      ".filter-button.active, .filter-item.active, .tag-filter-button.active"
    )
    .forEach((el) => el.classList.remove("active"));
  document
    .querySelector('.filter-button[data-status="all"]')
    .classList.add("active");
  document
    .querySelector('.filter-item[data-category="all"]')
    .classList.add("active");

  currentStatus = "all";
  currentCategory = "all";
  currentTags = [];

  renderFilteredContests();

  setTimeout(() => {
    const loadInterval = setInterval(() => {
      const cardExists = document.getElementById(contestId);
      const canLoadMore = currentlyDisplayedCount < allFilteredItems.length;

      if (cardExists) {
        clearInterval(loadInterval);
        scrollToAndHighlight(contestId);
      } else if (canLoadMore) {
        loadNextBatch();
      } else {
        clearInterval(loadInterval);
      }
    }, 100);
  }, 300);
}

// main function

async function initializePage() {
  try {
    const response = await fetch(`${url}/contests`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const apiData = await response.json();
    allContestsData = apiData.results || [];

    if (allContestsData.length > 0) {
      populateFilters(allContestsData);
      renderFilteredContests();
      handleHashNavigation();
    } else {
      if (loadMoreBtn) loadMoreBtn.style.display = "none";
      cardsContainer.innerHTML =
        '<p class="no-results-message">No opportunities are available at this time.</p>';
    }
  } catch (err) {
    console.error("Failed to fetch and initialize contests:", err);
    if (cardsContainer)
      cardsContainer.innerHTML =
        '<p class="no-results-message">Could not load opportunities. Please try again later.</p>';
  }
}

if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", loadNextBatch);
}

window.addEventListener("hashchange", handleHashNavigation);

initializePage();
