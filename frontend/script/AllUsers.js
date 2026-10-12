const userscontainer = document.querySelector("#users-container");

// API URL - Backend endpoint for users
const API_URL = "https://jsproject-n6mt.onrender.com/users";

// READ: Fetch all users from database
async function getAllUser() {
  try {
    let resp = await fetch(API_URL);
    let data = await resp.json();
    console.log("Fetched users:", data);
    displayUsers(data);
  } catch (error) {
    console.log("Error fetching users:", error);
    userscontainer.innerHTML = `
      <div class="empty-state">
        <p>Unable to load users. Backend server might be sleeping or offline.</p>
        <button class="retry-btn" onclick="getAllUser()">Retry</button>
      </div>
    `;
  }
}

// Initial fetch on page load
getAllUser();

// DOM MANIPULATION: Render user cards dynamically
function displayUsers(users) {
  // Clear previous content to prevent duplicate cards
  userscontainer.innerHTML = "";

  if (!users || users.length === 0) {
    userscontainer.innerHTML = `
      <div class="empty-state">
        <p>No users found in database.</p>
        <a href="./CreateUser.html" class="create-link-btn">Create User</a>
      </div>
    `;
    return;
  }

  users.forEach((user) => {
    let { fullname, email, password, id } = user;
    const userDiv = document.createElement("div");
    userDiv.className = "user-card";
    userDiv.id = `user-${id}`;

    // First letter for avatar icon
    const initial = fullname ? fullname.trim()[0].toUpperCase() : "U";

    userDiv.innerHTML = `
      <figure class='user-avata'>${initial}</figure>
      <h3 class='user-name'>${fullname}</h3>
      <p class='user-email'>📧 ${email}</p>
      <p class='user-password'>🔑 ${password}</p>
      <div class='card-buttons'>
        <button class='edit-btn' onclick='editUser(${id})'>Edit</button>
        <button class='delete-btn' onclick='deleteUser(${id})'>Delete</button>
      </div>
    `;
    userscontainer.append(userDiv);
  });
}

// UPDATE NAVIGATION: Redirect to Edit page with user ID in URL
function editUser(id) {
  console.log("Editing user ID:", id);
  window.location.href = `EditUser.html?id=${id}`;
}

// DELETE: Remove user by ID using HTTP DELETE
async function deleteUser(id) {
  let isConfirm = confirm("Are you sure you want to delete this user?");
  if (!isConfirm) return;

  try {
    let resp = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (resp.ok) {
      alert("User Deleted");
      // Immediate DOM update: remove deleted user card without full page reload
      const userCard = document.getElementById(`user-${id}`);
      if (userCard) {
        userCard.remove();
      }
    } else {
      alert("Failed to delete user from server.");
    }
  } catch (error) {
    console.log("Delete error:", error);
    alert("Error occurred while deleting user.");
  }
}
