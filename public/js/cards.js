const categoryFilters = document.querySelectorAll(".filter-item");
const statusFilters = document.querySelectorAll(".filter-button");
const contestItems = document.querySelectorAll(".contest-item");

let currentCategory = "all";
let currentStatus = "all";


// Main filter function
function filterContests() {
  console.log('Filtering contests...');
  contestItems.forEach(item => {
    const itemCategory = (item.dataset.category || "").toLowerCase();
    const itemStatus = (item.dataset.status || "").toLowerCase();

    // Debugging: Log values being compared
    console.log('Item Category:', itemCategory, 'Matches Category:', currentCategory);
    console.log('Item Status:', itemStatus, 'Matches Status:', currentStatus);

    const matchesCategory = currentCategory === "all" || itemCategory === currentCategory;
    const matchesStatus = currentStatus === "all" || itemStatus === currentStatus;

    // Debugging: Check if item is being shown or hidden
    console.log('Should display:', matchesCategory && matchesStatus);

    item.style.display = (matchesCategory && matchesStatus) ? "flex" : "none";
  });
}

// Category filter click
categoryFilters.forEach(item => {
  item.addEventListener("click", e => {
    e.preventDefault();
    categoryFilters.forEach(link => link.classList.remove("active"));
    e.currentTarget.classList.add("active");

    currentCategory = e.currentTarget.dataset.category.toLowerCase();
    // Debugging: Log selected category
    console.log('Selected Category:', currentCategory);
    filterContests();
  });
});

// Status filter click
statusFilters.forEach(button => {
  button.addEventListener("click", e => {
    e.preventDefault();
    statusFilters.forEach(btn => btn.classList.remove("active"));
    e.currentTarget.classList.add("active");

    currentStatus = e.currentTarget.dataset.status.toLowerCase();
    // Debugging: Log selected status
    console.log('Selected Status:', currentStatus);
    filterContests();
  });
});

// Initial filter to show all on page load
filterContests();
