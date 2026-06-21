const nameEl = document.getElementById("menuRestaurantName");
const descEl = document.getElementById("menuRestaurantDesc");
const noteEl = document.getElementById("menuRestaurantNote");
const customerMenu = document.getElementById("customerMenu");

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function getEncodedData() {
  const searchParams = new URLSearchParams(window.location.search);
  const queryData = searchParams.get("data");
  if (queryData) return queryData;

  // fallback for old QR links
  const hashParams = new URLSearchParams(window.location.hash.replace("#", ""));
  return hashParams.get("data");
}

function decodeMenu() {
  const encoded = getEncodedData();

  if (!encoded) return null;

  try {
    return JSON.parse(decodeURIComponent(escape(atob(encoded))));
  } catch {
    return null;
  }
}

function renderMenu() {
  const data = decodeMenu();

  if (!data) {
    nameEl.textContent = "Menu Not Found";
    descEl.textContent = "This QR code does not contain valid menu data.";
    customerMenu.innerHTML = `<div class="empty-state">Please ask the restaurant to generate a new QR code from the live Vercel website.</div>`;
    return;
  }

  document.title = `${data.restaurantName} Menu`;
  nameEl.textContent = data.restaurantName || "Restaurant Menu";
  descEl.textContent = data.restaurantDesc || "Browse the menu below.";
  noteEl.textContent = data.restaurantNote || "Scan, choose, and order.";

  customerMenu.innerHTML = (data.items || []).map(item => `
    <div class="menu-item">
      <strong>${escapeHtml(item.name)}</strong>
      <span class="price">₹${escapeHtml(item.price)}</span>
    </div>
  `).join("");

  if (!data.items || data.items.length === 0) {
    customerMenu.innerHTML = `<div class="empty-state">No menu items added yet.</div>`;
  }
}

renderMenu();
