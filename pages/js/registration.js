document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://127.0.0.1:3000";

  // ---------- Elements ----------
  const loginForm = document.querySelector("#login-form");
  const signupForm = document.querySelector("#signup-form");
  const loginMessage = document.getElementById("login-message");
  const signupMessage = document.getElementById("signup-message");

  const userProfileContainer = document.getElementById("userProfile");
  const actionIconsContainer = document.getElementById("actionIcons");
  const signinBtn = document.getElementById("signinBtn");

  // ---------- LOGIN ----------
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      handleAuthForm(loginForm, loginMessage, "login");
    });
  }

  // ---------- SIGNUP ----------
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      handleAuthForm(signupForm, signupMessage, "register");
    });
  }

  // ---------- AUTH FORM HANDLER ----------
  async function handleAuthForm(form, messageEl, type) {
    const payload = Object.fromEntries(new FormData(form));
    messageEl.textContent = "";
    messageEl.className = "form-message";

    try {
      const res = await fetch(`${API_BASE}/api/auth/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        // Save token and user
        localStorage.setItem("token", data.token);
        localStorage.setItem("currentUser", JSON.stringify(data.user));

        messageEl.textContent =
          type === "login"
            ? "Login successful!"
            : "Account created successfully!";
        messageEl.classList.add("success");

        // Redirect to contests.html
        setTimeout(() => {
          window.location.href = "./contests.html";
        }, 1000);
      } else {
        messageEl.textContent = data.msg || "Error occurred";
        messageEl.classList.add("error");
      }
    } catch (err) {
      messageEl.textContent = "Network error. Please try again.";
      messageEl.classList.add("error");
    }
  }

  // ---------- HEADER RENDERING ----------
  renderHeader();

  function renderHeader() {
    console.log("render header...");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!userProfileContainer || !actionIconsContainer || !signinBtn) return;

    userProfileContainer.innerHTML = "";
    actionIconsContainer.innerHTML = "";

    if (currentUser) {
      signinBtn.style.display = "none";
      userProfileContainer.style.display = "flex";
      actionIconsContainer.style.display = "flex";
      createUserProfile(
        userProfileContainer,
        actionIconsContainer,
        currentUser
      );
    } else {
      signinBtn.style.display = "block";
      userProfileContainer.style.display = "none";
      actionIconsContainer.style.display = "none";
    }
  }

  function createUserProfile(profileContainer, actionsContainer, user) {
    const profileBtn = document.createElement("button");
    profileBtn.className = "profile-trigger";
    profileBtn.setAttribute("aria-label", "View user profile");
    profileBtn.innerHTML = `
      <img src="${
        user.avatar || "default-avatar.png"
      }" alt="User avatar" class="avatar">
      <div class="user-info">
        <span class="user-name" title="${user.username}">${user.username}</span>
        <span class="email">${user.email}</span>
      </div>
    `;
    profileContainer.appendChild(profileBtn);

    const icons = [
      { id: "likes", icon: "fa-heart", tooltip: "Likes" },
      { id: "collections", icon: "fa-bookmark", tooltip: "Collections" },
      {
        id: "signout",
        icon: "fa-right-from-bracket",
        tooltip: "Sign Out",
        onClick: logout,
      },
    ];

    icons.forEach(({ id, icon, tooltip, onClick }) => {
      const a = document.createElement("a");
      a.href = "#";
      a.className = "icon-btn";
      a.id = id;
      a.setAttribute("aria-label", tooltip);
      a.setAttribute("data-tooltip", tooltip);
      a.innerHTML = `<i class="fa-solid ${icon}"></i>`;
      if (onClick) a.addEventListener("click", onClick);
      actionsContainer.appendChild(a);
    });
  }

  function logout(e) {
    e.preventDefault();
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    renderHeader();
  }

  const loginToggleBtn = document.getElementById("login-toggle-btn");
  const signupToggleBtn = document.getElementById("signup-toggle-btn");
  const formSlider = document.getElementById("form-slider");
  const sliderIndicator = document.getElementById("slider-indicator");

  if (loginToggleBtn && signupToggleBtn && formSlider && sliderIndicator) {
    loginToggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      // Add active class
      signupToggleBtn.classList.remove("active");
      loginToggleBtn.classList.add("active");

      // Move slider and form
      sliderIndicator.style.transform = "translateX(0%)";
      formSlider.style.transform = "translateX(0%)";
    });

    signupToggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      // Add active class
      loginToggleBtn.classList.remove("active");
      signupToggleBtn.classList.add("active");
      sliderIndicator.style.transform = "translateX(100%)";
      formSlider.style.transform = "translateX(-50%)";
    });
  }
});
