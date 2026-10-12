/**
 * Shared API Configuration & UI Helpers
 * User Management CRUD Application
 */

const API_CONFIG = {
  renderUrl: "https://jsproject-n6mt.onrender.com/users",
  localUrl: "http://localhost:5000/users",
  // Default to stored choice, or default to renderUrl
  get activeUrl() {
    return localStorage.getItem("crud_api_choice") || this.renderUrl;
  },
  setActiveUrl(url) {
    localStorage.setItem("crud_api_choice", url);
  }
};

/**
 * Fetch helper with automatic fallback and timeout
 */
async function apiRequest(endpoint = "", options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  
  const currentBase = API_CONFIG.activeUrl;
  const targetUrl = endpoint ? `${currentBase}/${endpoint}` : currentBase;

  try {
    const response = await fetch(targetUrl, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    
    // If the active URL was Render and failed, try local fallback automatically
    if (currentBase === API_CONFIG.renderUrl) {
      console.warn("Render endpoint failed or timed out. Attempting localhost fallback...");
      try {
        const localTarget = endpoint ? `${API_CONFIG.localUrl}/${endpoint}` : API_CONFIG.localUrl;
        const localResponse = await fetch(localTarget, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
          }
        });
        if (localResponse.ok) {
          showToast("Connected to local backend (http://localhost:5000)", "info");
          API_CONFIG.setActiveUrl(API_CONFIG.localUrl);
          return await localResponse.json();
        }
      } catch (localErr) {
        // Both failed
      }
    }
    throw err;
  }
}

/**
 * Modern Toast Notification Component
 */
function showToast(message, type = "info") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const icons = {
    success: `<svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>`,
    error: `<svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>`,
    info: `<svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>`
  };

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      ${icons[type] || icons.info}
      <span class="toast-msg">${message}</span>
    </div>
    <button class="toast-close" aria-label="Close">&times;</button>
  `;

  container.appendChild(toast);

  // Auto-remove
  const removeToast = () => {
    toast.classList.add("toast-fadeout");
    setTimeout(() => toast.remove(), 300);
  };

  toast.querySelector(".toast-close").addEventListener("click", removeToast);
  setTimeout(removeToast, 4000);
}

/**
 * Modern Confirmation Modal
 */
function showConfirmModal({ title, message, confirmText = "Confirm", onConfirm }) {
  let modalOverlay = document.getElementById("confirm-modal-overlay");
  if (modalOverlay) modalOverlay.remove();

  modalOverlay = document.createElement("div");
  modalOverlay.id = "confirm-modal-overlay";
  modalOverlay.className = "modal-overlay";

  modalOverlay.innerHTML = `
    <div class="modal-box" role="dialog" aria-modal="true">
      <div class="modal-header">
        <div class="modal-warning-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <h3 class="modal-title">${title}</h3>
      </div>
      <p class="modal-body">${message}</p>
      <div class="modal-actions">
        <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
        <button class="btn btn-danger" id="modal-confirm-btn">${confirmText}</button>
      </div>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  const closeModal = () => modalOverlay.remove();

  modalOverlay.querySelector("#modal-cancel-btn").addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  modalOverlay.querySelector("#modal-confirm-btn").addEventListener("click", async () => {
    closeModal();
    if (typeof onConfirm === "function") {
      await onConfirm();
    }
  });
}

/**
 * Avatar Color Generator based on Name
 */
function getAvatarColor(name = "U") {
  const colors = [
    "linear-gradient(135deg, #6366f1, #8b5cf6)",
    "linear-gradient(135deg, #ec4899, #f43f5e)",
    "linear-gradient(135deg, #3b82f6, #06b6d4)",
    "linear-gradient(135deg, #10b981, #059669)",
    "linear-gradient(135deg, #f59e0b, #d97706)",
    "linear-gradient(135deg, #8b5cf6, #d946ef)"
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}
