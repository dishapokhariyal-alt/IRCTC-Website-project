document.addEventListener("DOMContentLoaded", async function () {
  const authNav = document.getElementById("auth-nav");

  if (!authNav) return;

  const API_BASE = "http://localhost:3000";

  try {
    const response = await fetch(API_BASE + "/api/auth/me", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      showLoggedOut();
      return;
    }

    const data = await response.json();

    showLoggedIn(data.user);
  } catch (error) {
    console.error("Authentication check failed:", error);
    showLoggedOut();
  }

  function showLoggedOut() {
    authNav.innerHTML = `
            <a href="signup.html">Sign Up</a>
            <a href="login.html">Log In</a>
        `;
  }

  function showLoggedIn(user) {
    authNav.innerHTML = `
            <span>Welcome, ${escapeHTML(user.fullName)}</span>
            <button id="logout-button">Log Out</button>
        `;

    document.getElementById("logout-button").addEventListener("click", logout);
  }

  async function logout() {
    try {
      const response = await fetch(API_BASE + "/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        alert("Unable to log out. Please try again.");
        return;
      }

      window.location.reload();
    } catch (error) {
      alert("Logout failed. Please check your connection.");
    }
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[char];
    });
  }
});
