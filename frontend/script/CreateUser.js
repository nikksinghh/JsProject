const registerform = document.querySelector("#register-form");
const fullnameInput = document.querySelector("#fullname");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

// API URL - Backend endpoint for users
const API_URL = "https://jsproject-n6mt.onrender.com/users";

registerform.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("form Submitted");

  const newUser = {
    fullname: fullnameInput.value.trim(),
    email: emailInput.value.trim().toLowerCase(),
    password: passwordInput.value,
  };
  console.log("New user payload:", newUser);

  //! SEND NEWUSER TO DATABASE (HTTP POST)
  try {
    let resp = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "content-type": "application/json",
      },
    });

    if (resp.ok) {
      alert("User Created Successfully!");
      //! NAVIGATE TO ALL USERS PAGE
      window.location.href = "AllUsers.html";
    } else {
      alert("Failed to create user. Server responded with error.");
    }
  } catch (error) {
    console.log("Create user error:", error);
    alert("Network error: Could not reach backend server.");
  }
});
