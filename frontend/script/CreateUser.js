/**
 * CreateUser.js - Form Submission & Validation
 */

const registerForm = document.querySelector("#register-form");
const fullnameInput = document.querySelector("#fullname");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const submitBtn = document.querySelector("#submit-btn");
const btnText = document.querySelector("#btn-text");
const togglePwdBtn = document.querySelector("#toggle-pwd-btn");
const togglePwdIcon = document.querySelector("#toggle-pwd-icon");

// Password visibility toggle
if (togglePwdBtn && passwordInput) {
  togglePwdBtn.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";

    if (isPassword) {
      togglePwdIcon.innerHTML = `
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      `;
    } else {
      togglePwdIcon.innerHTML = `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      `;
    }
  });
}

// Form Submission
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullname = fullnameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  // Validation
  if (!fullname) {
    showToast("Please enter a valid full name", "error");
    fullnameInput.focus();
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showToast("Please enter a valid email address", "error");
    emailInput.focus();
    return;
  }

  if (password.length < 6) {
    showToast("Password must be at least 6 characters long", "error");
    passwordInput.focus();
    return;
  }

  const newUser = {
    fullname,
    email,
    password
  };

  // Set loading state
  submitBtn.disabled = true;
  btnText.textContent = "Creating...";

  try {
    await apiRequest("", {
      method: "POST",
      body: JSON.stringify(newUser)
    });

    showToast("User successfully created!", "success");

    setTimeout(() => {
      window.location.href = "AllUsers.html";
    }, 800);
  } catch (error) {
    console.error("Failed to create user:", error);
    showToast("Could not create user. Ensure API server is online.", "error");
    submitBtn.disabled = false;
    btnText.textContent = "Create User";
  }
});
