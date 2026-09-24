// ================================
// PRODUCT.JS — CLEANED & DYNAMIC (FULL FIX)
// ================================

// ===== GET URL PARAMETERS =====
const params = new URLSearchParams(window.location.search);

const name = params.get("name") || "Product";
const basePrice = Number(params.get("price")) || 0;
const discount = Number(params.get("discount")) || 0;
const description = decodeURIComponent(params.get("description") || "");
const specs = decodeURIComponent(params.get("specs") || "");
const sizechart = params.get("sizechart") || "";
const type = params.get("type") || "";

// ===== IMAGES =====
const img1 = decodeURIComponent(params.get("img1") || "");
const img2 = decodeURIComponent(params.get("img2") || "");
const img3 = decodeURIComponent(params.get("img3") || "");

// ===== PARSE SIZES =====
let sizes = {};
try {
  sizes = JSON.parse(decodeURIComponent(params.get("sizes") || "{}"));
} catch {
  sizes = {};
}

// ===== PARSE COLORS =====
let colors = {};
const rawColors = params.get("colors");

try {
  colors = JSON.parse(decodeURIComponent(rawColors));
} catch {
  colors = (rawColors || "")
    .split(",")
    .map(c => c.trim())
    .filter(c => c);
}

// ===== FINAL PRICE =====
let finalPrice = discount > 0
  ? basePrice - (basePrice * discount / 100)
  : basePrice;

// ================================
// PAGE LOAD
// ================================
document.addEventListener("DOMContentLoaded", function () {

  const nameEl = document.getElementById("product-name");
  const priceEl = document.getElementById("product-price");
  const descEl = document.getElementById("product-description");
  const specsBox = document.getElementById("product-specs");

  const sizeSelect = document.getElementById("size");
  const sizeContainer = document.getElementById("size-container");
  const colorSelect = document.getElementById("color");
  const colorContainer = document.getElementById("color-container");

  const shippingEl = document.getElementById("shipping-info");
  const deliveryEl = document.getElementById("delivery-date");
  const sizeChartImg = document.getElementById("size-chart-img");
  const sizeChartBox = document.getElementById("size-chart");

  const mainImg = document.getElementById("main-img");

  // ===== SET PRODUCT INFO =====
  if (nameEl) nameEl.textContent = name;
  if (descEl) descEl.innerHTML = description;
  if (priceEl) {
    priceEl.textContent = "C$" + finalPrice.toFixed(2);
    priceEl.dataset.price = finalPrice;
  }
  if (specsBox && specs) specsBox.innerHTML = specs;

  // ===== IMAGES =====
  if (mainImg && img1) mainImg.src = img1;

  ["thumb1","thumb2","thumb3"].forEach((id, i) => {
    const el = document.getElementById(id);
    const src = [img1, img2, img3][i];
    if (el && src) {
      el.src = src;
      el.onclick = () => mainImg.src = src;
    }
  });

  // ===== SHIPPING =====
  if (shippingEl) {
    shippingEl.innerText = finalPrice >= 149
      ? "Free Shipping (Orders over $149)"
      : "Standard Shipping: $17.99";
  }

  // ===== DELIVERY =====
  if (deliveryEl) {
    const today = new Date();
    const start = new Date(); start.setDate(today.getDate() + 12);
    const end = new Date(); end.setDate(today.getDate() + 24);
    deliveryEl.innerText = `Estimated Delivery: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  }

  // ================================
  // OPTIONS SETUP
  // ================================
  const setupProductOptions = () => {

    // RESET
    if (sizeSelect && sizeContainer) {
      sizeSelect.innerHTML = '<option value="">Select Size</option>';
      sizeContainer.style.display = "none";
    }

    if (colorSelect && colorContainer) {
      colorSelect.innerHTML = '<option value="">Select Color</option>';
      colorContainer.style.display = "none";
    }

    // ===== SIZE =====
    if (sizes && Object.keys(sizes).length > 0) {
      sizeContainer.style.display = "block";

      Object.keys(sizes).forEach(size => {
        const opt = document.createElement("option");
        opt.value = size;
        opt.textContent = size;
        sizeSelect.appendChild(opt);
      });
    }

    // ===== COLOR =====
    let colorArray = [];

    if (Array.isArray(colors)) {
      colorArray = colors;
    } else if (typeof colors === "object") {
      colorArray = Object.keys(colors);
    }

    colorArray = colorArray.filter(c => c && c !== "undefined" && c !== "null");

    if (colorArray.length > 0) {
      colorContainer.style.display = "block";

      colorArray.forEach(color => {
        const opt = document.createElement("option");
        opt.value = color;
        opt.textContent = color;
        colorSelect.appendChild(opt);
      });
    }

    // ================================
    // ✅ PRICE UPDATE (FIXED)
    // ================================
    const updatePrice = () => {
      let newPrice = finalPrice;

      const selectedSize = sizeSelect ? sizeSelect.value : "";
      const selectedColor = colorSelect ? colorSelect.value : "";

      if (selectedSize && sizes[selectedSize]?.price) {
        newPrice = sizes[selectedSize].price;
      }

      if (
        selectedColor &&
        typeof colors === "object" &&
        !Array.isArray(colors) &&
        colors[selectedColor]?.price
      ) {
        newPrice = colors[selectedColor].price;
      }

      priceEl.textContent = "C$" + newPrice.toFixed(2);
      priceEl.dataset.price = newPrice;
    };

    if (sizeSelect) sizeSelect.onchange = updatePrice;
    if (colorSelect) colorSelect.onchange = updatePrice;
  };

  setupProductOptions();

  // ===== SIZE CHART =====
  const sizeChartContainer = document.getElementById("sizeChartContainer");

  if (sizeChartContainer) {
    if (sizechart && sizechart !== "undefined") {
      sizeChartContainer.style.display = "block";
      if (sizeChartImg) sizeChartImg.src = sizechart;
    } else {
      sizeChartContainer.style.display = "none";
    }
  }

});

// ================================
// ADD TO CART
// ================================
function addToCart() {
  const sizeElem = document.getElementById("size");
  const colorElem = document.getElementById("color");

  const sizeValue = sizeElem ? sizeElem.value : null;
  const colorValue = colorElem ? colorElem.value : null;

  let price = parseFloat(document.getElementById("product-price").dataset.price);
  if (isNaN(price)) price = 0;

  const product = {
    name: document.getElementById("product-name").textContent,
    price: price,
    size: sizeValue,
    color: colorValue,
    quantity: 1
  };

  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Product added to cart!");
}
