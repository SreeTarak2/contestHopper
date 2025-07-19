document.addEventListener("DOMContentLoaded", () => {
  const shareModalOverlay = document.getElementById("share-modal-overlay");
  const modalContestTitle = document.getElementById("modal-contest-title");
  const modalShareUrlInput = document.getElementById("modal-share-url");
  const qrCodeContainer = document.getElementById("qr-code-container");
  const closeModalBtn = document.querySelector(".modal-close-btn");
  const copyLinkBtn = document.getElementById("copy-link-btn");
  const toast = document.getElementById("toast-notification");

  if (!toast) {
    console.error('Missing #toast-notification element in HTML.');
  }

  let qrCodeInstance = null;

  const getWishlist = () => JSON.parse(localStorage.getItem('contestWishlist')) || [];
  const saveWishlist = (w) => localStorage.setItem('contestWishlist', JSON.stringify(w));

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  };

  document.addEventListener('click', function(event) {
    const shareIcon = event.target.closest('.share-icon');
    if (shareIcon) {
      event.stopPropagation();
      const contestItem = shareIcon.closest(".contest-item");
      if (!contestItem) return;

      const title = contestItem.querySelector(".item-title").textContent.trim();
      const contestId = contestItem.id;
      if (!contestId) return;

      const internalUrl = `${window.location.origin}${window.location.pathname}#${contestId}`;
      modalContestTitle.textContent = title;
      modalShareUrlInput.value = internalUrl;

      qrCodeContainer.innerHTML = "";
      qrCodeInstance = new QRCode(qrCodeContainer, {
        text: internalUrl,
        width: 150,
        height: 150,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });

      const encodedUrl = encodeURIComponent(internalUrl);
      const encodedTitle = encodeURIComponent(title);
      document.getElementById("share-whatsapp").href = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
      document.getElementById("share-twitter").href = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
      document.getElementById("share-facebook").href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      document.getElementById("share-linkedin").href = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`;

      shareModalOverlay.classList.add("show");
    }

    const bookmarkIcon = event.target.closest('.fa-bookmark');
    if (bookmarkIcon) {
      const contestItem = bookmarkIcon.closest(".contest-item");
      if (!contestItem) return;

      const id = contestItem.dataset.id;
      if (id) {
        let list = getWishlist();
        const isBookmarked = list.includes(id);
        list = isBookmarked ? list.filter(i => i !== id) : [...list, id];
        saveWishlist(list);
        showToast(isBookmarked ? 'Removed from wishlist' : 'Added to wishlist!');
        bookmarkIcon.classList.toggle('bookmarked', !isBookmarked);
        bookmarkIcon.classList.add('icon-bounce-animation');
        bookmarkIcon.addEventListener('animationend', () => bookmarkIcon.classList.remove('icon-bounce-animation'), { once: true });
      }
    }
  });

  copyLinkBtn.addEventListener("click", function () {
    navigator.clipboard.writeText(modalShareUrlInput.value).then(() => {
      showToast("Link copied!");
      this.textContent = "Copied!";
      setTimeout(() => {
        this.textContent = "Copy";
      }, 2000);
    });
  });

  const closeTheModal = () => shareModalOverlay.classList.remove("show");
  closeModalBtn.addEventListener("click", closeTheModal);
  shareModalOverlay.addEventListener("click", (e) => {
    if (e.target === shareModalOverlay) closeTheModal();
  });

  const updateAllBookmarkIcons = () => {
    const list = getWishlist();
    document.querySelectorAll('.contest-item').forEach(card => {
      const id = card.dataset.id;
      if (id) {
        const icon = card.querySelector('.fa-bookmark');
        if (icon) icon.classList.toggle('bookmarked', list.includes(id));
      }
    });
  };

  const highlightCardFromHash = () => {
    const id = window.location.hash.substring(1);
    if (id) {
      const card = document.getElementById(id);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('highlighted');
        setTimeout(() => card.classList.remove('highlighted'), 2500);
      }
    }
  };

  updateAllBookmarkIcons();
  highlightCardFromHash();
});
