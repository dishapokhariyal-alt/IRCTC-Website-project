document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("login-form");
  const message = document.getElementById("login-message");
  const button = document.getElementById("login-button");

  const API_BASE = "http://localhost:3000";

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    message.textContent = "";
    button.disabled = true;
    button.textContent = "Logging In...";

    try {
      const response = await fetch(API_BASE + "/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed.");
      }

      message.style.color = "green";
      message.textContent = "Welcome back, " + data.user.fullName + "!";

      form.reset();
    } catch (error) {
      message.style.color = "red";
      message.textContent = error.message;
    } finally {
      button.disabled = false;
      button.textContent = "Log In";
    }
  });
});
