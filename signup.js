document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signup-form");
  const message = document.getElementById("signup-message");
  const button = document.getElementById("signup-button");


  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    message.textContent = "";
    message.style.color = "red";

    if (password !== confirmPassword) {
      message.textContent = "Passwords do not match.";
      return;
    }

    button.disabled = true;
    button.textContent = "Creating Account...";

    try {
      const response = await fetch(API_BASE + "/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          mobile,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      message.style.color = "green";
      message.textContent = data.message;

      form.reset();
    } catch (error) {
      message.style.color = "red";
      message.textContent = error.message;
    } finally {
      button.disabled = false;
      button.textContent = "Create Account";
    }
  });
});
