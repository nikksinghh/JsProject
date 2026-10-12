const editform = document.querySelector("#edit-form");
const fullnameInput = document.querySelector("#fullname");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

// API URL - Backend endpoint for users
const API_URL = "https://jsproject-n6mt.onrender.com/users";

// Extract user ID from URL query string (e.g., EditUser.html?id=2)
let params = new URLSearchParams(window.location.search);
let id = params.get("id");

// READ (Single User): Populate form inputs with existing user data
async function getEditUser() {
  if (!id) {
    alert("No user ID found in URL!");
    window.location.href = "AllUsers.html";
    return;
  }

  try {
    let resp = await fetch(`${API_URL}/${id}`);
    let data = await resp.json();
    console.log("Existing user data:", data);

    fullnameInput.value = data.fullname || "";
    emailInput.value = data.email || "";
    passwordInput.value = data.password || "";
  } catch (error) {
    console.log("Error fetching user for edit:", error);
    alert("Could not load user data from backend.");
  }
}

getEditUser();

// UPDATE: Send updated user data using HTTP PUT
editform.addEventListener("submit", async (e) => {
  e.preventDefault();

  let updatedData = {
    fullname: fullnameInput.value.trim(),
    email: emailInput.value.trim().toLowerCase(),
    password: passwordInput.value,
  };

  try {
    let resp = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedData),
      headers: {
        "content-type": "application/json",
      },
    });

    if (resp.ok) {
      alert("User Updated Successfully!");
      window.location.href = "AllUsers.html";
    } else {
      alert("Failed to update user on server.");
    }
  } catch (error) {
    console.log("Update user error:", error);
    alert("Network error: Could not reach backend server.");
  }
});