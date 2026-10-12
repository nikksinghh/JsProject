/**
 * AllUsers.js - Directory Management & Live Search
 */

const usersContainer = document.querySelector("#users-container");
const searchInput = document.querySelector("#search-input");
const countBadge = document.querySelector("#user-count-badge");

let allUsers = [];

// Show skeleton loading cards
function showSkeletons() {
  usersContainer.innerHTML = Array(3).fill(0).map(() => `
    <div class="skeleton-card">
      <div style="display: flex; gap: 14px; align-items: center;">
        <div class="skeleton" style="width: 50px; height: 50px; border-radius: 50%;"></div>
        <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
          <div class="skeleton" style="height: 16px; width: 60%;"></div>
          <div class="skeleton" style="height: 12px; width: 30%;"></div>
        </div>
      </div>
      <div class="skeleton" style="height: 60px; width: 100%; border-radius: 10px;"></div>
      <div style="display: flex; gap: 10px;">
        <div class="skeleton" style="height: 36px; flex: 1;"></div>
        <div class="skeleton" style="height: 36px; flex: 1;"></div>
      </div>
    </div>
  `).join("");
}

// Fetch users from API
async function getAllUsers() {
  showSkeletons();
  countBadge.textContent = "Connecting to API...";

  try {
    const data = await apiRequest();
    allUsers = Array.isArray(data) ? data : [];
    renderUsers(allUsers);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    usersContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon" style="background: var(--danger-light); color: var(--danger);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h3 class="empty-title">Unable to Connect to Server</h3>
        <p class="empty-subtitle">
          The API service may be starting up (Render free tier) or local server is offline.
        </p>
        <button class="btn btn-primary" onclick="getAllUsers()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"></polyline>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>
          Retry Connection
        </button>
      </div>
    `;
    countBadge.textContent = "0 users found";
    showToast("Server connection timed out or offline", "error");
  }
}

// Render user cards
function renderUsers(users) {
  usersContainer.innerHTML = "";
  countBadge.textContent = `${users.length} ${users.length === 1 ? 'user' : 'users'} found`;

  if (users.length === 0) {
    usersContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
          </svg>
        </div>
        <h3 class="empty-title">No Users Found</h3>
        <p class="empty-subtitle">There are no users matching your criteria.</p>
        <a href="./CreateUser.html" class="btn btn-primary">Create First User</a>
      </div>
    `;
    return;
  }

  users.forEach((user) => {
    const { id, fullname = "User", email = "", password = "" } = user;
    const initial = (fullname && fullname.trim()) ? fullname.trim()[0].toUpperCase() : "U";
    const avatarBackground = getAvatarColor(fullname);

    const userDiv = document.createElement("div");
    userDiv.className = "user-card";
    userDiv.id = `user-card-${id}`;

    userDiv.innerHTML = `
      <div class="card-top">
        <figure class="user-avatar" style="background: ${avatarBackground};">
          ${initial}
        </figure>
        <div class="user-meta">
          <h3>${escapeHtml(fullname)}</h3>
          <span class="user-id-tag">User #${id}</span>
        </div>
      </div>

      <div class="card-info">
        <div class="info-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <span class="info-val" title="${escapeHtml(email)}">${escapeHtml(email)}</span>
        </div>
        <div class="info-row password-row">
          <div style="display: flex; align-items: center; gap: 8px;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span class="info-val password-text" id="pwd-text-${id}" data-real-pwd="${escapeHtml(password)}">••••••••</span>
          </div>
          <button class="password-toggle-btn" title="Toggle password" onclick="togglePasswordVisibility(${id})">
            <svg id="pwd-icon-${id}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="card-actions">
        <button class="btn btn-secondary btn-sm" onclick="editUser(${id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Edit
        </button>
        <button class="btn btn-outline-danger btn-sm" onclick="promptDeleteUser(${id}, '${escapeHtml(fullname)}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          Delete
        </button>
      </div>
    `;

    usersContainer.appendChild(userDiv);
  });
}

// Password toggle helper
function togglePasswordVisibility(id) {
  const pwdElement = document.getElementById(`pwd-text-${id}`);
  const icon = document.getElementById(`pwd-icon-${id}`);
  if (!pwdElement) return;

  const realPassword = pwdElement.dataset.realPwd;
  if (pwdElement.textContent === "••••••••") {
    pwdElement.textContent = realPassword;
    icon.innerHTML = `
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    `;
  } else {
    pwdElement.textContent = "••••••••";
    icon.innerHTML = `
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    `;
  }
}

// Search handler with instant filter
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase().trim();
    if (!term) {
      renderUsers(allUsers);
      return;
    }
    const filtered = allUsers.filter((u) => 
      (u.fullname && u.fullname.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term))
    );
    renderUsers(filtered);
  });
}

// Navigation to Edit page
function editUser(id) {
  window.location.href = `EditUser.html?id=${id}`;
}

// Prompt Delete Modal
function promptDeleteUser(id, fullname) {
  showConfirmModal({
    title: "Delete User Profile?",
    message: `Are you sure you want to delete ${fullname || 'this user'}? This action cannot be undone.`,
    confirmText: "Delete User",
    onConfirm: async () => {
      try {
        await apiRequest(id, { method: "DELETE" });
        showToast("User successfully removed", "success");
        // Optimistic UI update
        allUsers = allUsers.filter(u => String(u.id) !== String(id));
        renderUsers(allUsers);
      } catch (err) {
        console.error("Delete failed:", err);
        showToast("Failed to delete user. Please try again.", "error");
      }
    }
  });
}

// Prevent XSS
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Initial Load
getAllUsers();
