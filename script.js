const itemsContainer = document.getElementById("items");
const addItemBtn = document.getElementById("addItemBtn");
const generateBtn = document.getElementById("generateBtn");
const errorMsg = document.getElementById("errorMsg");
const qrBox = document.getElementById("qrBox");
const menuUrlInput = document.getElementById("menuUrl");
const openMenuLink = document.getElementById("openMenuLink");
const downloadQrBtn = document.getElementById("downloadQrBtn");
const preview = document.getElementById("preview");

function addItem(name = "", price = "") {
  const row = document.createElement("div");
  row.className = "item-row";

  row.innerHTML = `
    <input class="item-name" type="text" placeholder="Item name" value="${escapeHtml(name)}" />
    <input class="item-price" type="number" min="0" placeholder="Price ₹" value="${escapeHtml(price)}" />
    <button class="remove-btn" type="button" aria-label="Remove item">×</button>
  `;

  row.querySelector(".remove-btn").addEventListener("click", () => {
    if (document.querySelectorAll(".item-row").length > 1) row.remove();
  });

  itemsContainer.appendChild(row);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function getMenuData() {
  const restaurantName = document.getElementById("restaurantName").value.trim();
  const restaurantDesc = document.getElementById("restaurantDesc").value.trim();
  const restaurantNote = document.getElementById("restaurantNote").value.trim();

  const items = [...document.querySelectorAll(".item-row")]
    .map(row => ({
      name: row.querySelector(".item-name").value.trim(),
      price: row.querySelector(".item-price").value.trim()
    }))
    .filter(item => item.name && item.price);

  return { restaurantName, restaurantDesc, restaurantNote, items };
}

function validateMenu(data) {
  if (!data.restaurantName) return "Please enter the restaurant name.";
  if (data.items.length === 0) return "Please add at least one menu item with price.";
  if (data.items.length > 12) return "For reliable QR scanning, please keep this demo menu under 12 items.";
  return "";
}

function encodeMenu(data) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
}

function getBaseUrl() {
  const current = window.location.href.split("?")[0].split("#")[0];
  return current.replace(/index\.html$/i, "");
}

function renderPreview(data) {
  preview.innerHTML = `
    <h2>${escapeHtml(data.restaurantName)}</h2>
    <p class="muted">${escapeHtml(data.restaurantDesc || "Digital menu")}</p>
    ${data.items.map(item => `
      <div class="preview-item">
        <strong>${escapeHtml(item.name)}</strong>
        <span class="price">₹${escapeHtml(item.price)}</span>
      </div>
    `).join("")}
  `;
}

function generateQr() {
  const data = getMenuData();
  const validationError = validateMenu(data);

  if (validationError) {
    errorMsg.textContent = validationError;
    return;
  }

  errorMsg.textContent = "";

  const encoded = encodeMenu(data);

  // Query parameter is used instead of #hash because some phone QR scanners remove URL fragments.
  const menuUrl = `${getBaseUrl()}menu.html?data=${encodeURIComponent(encoded)}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&ecc=M&margin=10&data=${encodeURIComponent(menuUrl)}`;

  qrBox.innerHTML = `<img class="qr-img" src="${qrImageUrl}" alt="QR code that opens the restaurant menu page" />`;

  menuUrlInput.value = menuUrl;
  openMenuLink.href = menuUrl;
  openMenuLink.classList.remove("disabled");

  downloadQrBtn.href = qrImageUrl;
  downloadQrBtn.classList.remove("disabled");

  renderPreview(data);
}

addItemBtn.addEventListener("click", () => addItem());
generateBtn.addEventListener("click", generateQr);

addItem("Chicken Biryani", "180");
addItem("Cold Coffee", "90");
addItem("Veg Sandwich", "120");
