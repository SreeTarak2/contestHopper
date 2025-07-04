const categoryFilters = document.querySelectorAll(".filter-item");
const statusFilters = document.querySelectorAll(".filter-button");
const contestItems = document.querySelectorAll(".contest-item");

let currentCategory = "all";
let currentStatus = "all";

// Main filter function
function filterContests() {
  console.log("Filtering contests...");
  contestItems.forEach((item) => {
    const itemCategory = (item.dataset.category || "").toLowerCase();
    const itemStatus = (item.dataset.status || "").toLowerCase();

    // Debugging: Log values being compared
    console.log(
      "Item Category:",
      itemCategory,
      "Matches Category:",
      currentCategory
    );
    console.log("Item Status:", itemStatus, "Matches Status:", currentStatus);

    const matchesCategory =
      currentCategory === "all" || itemCategory === currentCategory;
    const matchesStatus =
      currentStatus === "all" || itemStatus === currentStatus;

    // Debugging: Check if item is being shown or hidden
    console.log("Should display:", matchesCategory && matchesStatus);

    item.style.display = matchesCategory && matchesStatus ? "flex" : "none";
  });
}

// Category filter click
categoryFilters.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    categoryFilters.forEach((link) => link.classList.remove("active"));
    e.currentTarget.classList.add("active");

    currentCategory = e.currentTarget.dataset.category.toLowerCase();
    // Debugging: Log selected category
    console.log("Selected Category:", currentCategory);
    filterContests();
  });
});

// Status filter click
statusFilters.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    statusFilters.forEach((btn) => btn.classList.remove("active"));
    e.currentTarget.classList.add("active");

    currentStatus = e.currentTarget.dataset.status.toLowerCase();
    // Debugging: Log selected status
    console.log("Selected Status:", currentStatus);
    filterContests();
  });
});


filterContests();

const cardsContainer = document.querySelector(".contest-list-container");

function createContestCard(data) {
  // Create article
  const cardArticle = document.createElement("article");
  cardArticle.classList.add("contest-item", "contest-item--detailed");
  cardArticle.dataset.category = data.category;
  cardArticle.dataset.status = data.status;

  // Image wrapper
  const imageWrapper = document.createElement("div");
  imageWrapper.classList.add("contest-item__image-wrapper");

  const img = document.createElement("img");
  img.src = data.image;
  img.alt = data.title;

  const imageTag = document.createElement("span");
  imageTag.classList.add("image-tag");
  imageTag.textContent = data.imageTag;

  const statusTag = document.createElement("span");
  statusTag.classList.add("status-tag");
// condition checking
  if(data.status.toLowerCase() === "open"){
    statusTag.classList.add('open');
  } else if(data.status.toLowerCase() === "upcoming"){
    statusTag.classList.add('upcoming');
  } else{
    statusTag.classList.add('closed');
  }

  const dot = document.createElement("span");
  dot.classList.add("contest-dot");

  statusTag.appendChild(dot);
  statusTag.append(data.statusText);

  imageWrapper.appendChild(img);
  imageWrapper.appendChild(imageTag);
  imageWrapper.appendChild(statusTag);

  // Content
  const itemContent = document.createElement("div");
  itemContent.classList.add("contest-item__content");

  const itemTitle = document.createElement("h3");
  itemTitle.classList.add("item-title");
  itemTitle.textContent = data.title;

  const itemDescription = document.createElement("p");
  itemDescription.classList.add("item-description");
  itemDescription.textContent = data.description;

  // Meta helper
  const createMeta = (html) => {
    const div = document.createElement("div");
    div.classList.add("item-meta");
    div.innerHTML = html;
    return div;
  };

  const meta1 = createMeta(`
        <span><i class="fa-solid fa-users"></i> ${data.meta.eligibility}</span>
        <span><i class="fa-solid fa-location-dot"></i> ${data.meta.location}</span>
        <span><i class="fa-solid fa-globe"></i> ${data.meta.mode}</span>
    `);

  const meta2 = createMeta(
    `<span><i class="fa-solid fa-tag"></i> ${data.meta.tags}</span>`
  );
  const meta3 = createMeta(
    `<span><i class="fa-solid fa-trophy"></i> Prize: <strong>${data.meta.prize}</strong></span>`
  );
  const meta4 = createMeta(`
        <span>📅 Starts At: <strong>${data.meta.start}</strong></span>
        <span>⏳ Ends At: <strong class="platinum-shine">${data.meta.end}</strong></span>
    `);

  // Apply button
  const applyBtn = document.createElement("a");
  applyBtn.href = data.link;
  applyBtn.classList.add("apply-button");
  applyBtn.innerHTML = `<span>Apply Now</span> <i class="fa-solid fa-arrow-right"></i>`;

  // Assemble card
  itemContent.appendChild(itemTitle);
  itemContent.appendChild(itemDescription);
  itemContent.appendChild(meta1);
  itemContent.appendChild(meta2);
  itemContent.appendChild(meta3);
  itemContent.appendChild(meta4);
  itemContent.appendChild(applyBtn);

  cardArticle.appendChild(imageWrapper);
  cardArticle.appendChild(itemContent);

  return cardArticle;
}

const data = [
  {
    category: "water",
    status: "open",
    image:
      "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
    imageTag: "Water",
    statusText: "open",
    title: "Green Cape FNF Green Pitch Challenge 2025",
    description:
      "XPRIZE Water Scarcity is made possible by the generous support of our title sponsor, the Mohamed bin Zayed Water Initiative.",
    meta: {
      eligibility: "Open to All",
      location: "International",
      mode: "Online",
      tags: "Beginner Friendly, No Code, Ideathon",
      prize: "2000 USD",
      start: "Started",
      end: "30 June 2025",
    },
    link: "/green-cape-challenge-details",
  },
  {
    category: "technology",
    status: "upcoming",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    imageTag: "AI",
    statusText: "upcoming",
    title: "Future of AI Hackathon 2025",
    description:
      "Join minds around the globe to shape the ethical future of artificial intelligence. Hosted by the Global AI Initiative.",
    meta: {
      eligibility: "Students Only",
      location: "Global",
      mode: "Hybrid",
      tags: "Hackathon, AI, Coding",
      prize: "5000 USD",
      start: "1 July 2025",
      end: "10 July 2025",
    },
    link: "/ai-hackathon-2025",
  },
  {
    category: "sustainability",
    status: "closed",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    imageTag: "Eco",
    statusText: "closed",
    title: "Sustainable Cities Challenge 2024",
    description:
      "A challenge for architects and engineers to reimagine the urban future. Sponsored by Green Earth Foundation.",
    meta: {
      eligibility: "Professionals",
      location: "Europe",
      mode: "Offline",
      tags: "Architecture, Sustainability",
      prize: "10000 EUR",
      start: "1 Jan 2024",
      end: "30 March 2024",
    },
    link: "/sustainable-cities-2024",
  },
  {
    category: "design",
    status: "open",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    imageTag: "UX/UI",
    statusText: "open",
    title: "UX/UI Innovation Jam 2025",
    description:
      "Design for impact in this global design sprint focused on accessibility and inclusion.",
    meta: {
      eligibility: "Designers & Students",
      location: "International",
      mode: "Online",
      tags: "Design Sprint, Accessibility",
      prize: "3000 USD",
      start: "5 August 2025",
      end: "15 August 2025",
    },
    link: "/ux-ui-jam-2025",
  },
];

data.forEach((item) => {
  cardsContainer.appendChild(createContestCard(item));
});
