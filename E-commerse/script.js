// Global state
let products = [];
let cart = [];

// DOM Elements
const productsContainer = document.getElementById("productsContainer");
const cartModal = document.getElementById("cartModal");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const loadingSpinner = document.getElementById("loadingSpinner");
const productModal = document.getElementById("productModal");

// Event Listeners
document.getElementById("cartIcon").addEventListener("click", toggleCart);
document.getElementById("closeCart").addEventListener("click", toggleCart);
document
  .getElementById("closeProductModal")
  .addEventListener("click", closeProductModal);

// Fetch products from API
async function fetchProducts() {
  try {
    showLoading();
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) throw new Error("Failed to fetch products");
    products = await response.json();
    renderProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
    productsContainer.innerHTML =
      '<p class="error">Failed to load products. Please try again later.</p>';
  } finally {
    hideLoading();
  }
}

// Render products
function renderProducts() {
  productsContainer.innerHTML = products
    .map(
      (product) => `
        <div class="product-card">
            <img src="${product.image}" alt="${
        product.title
      }" class="product-image" 
                onclick="showProductDetails(${product.id})">
            <h3 class="product-title" onclick="showProductDetails(${
              product.id
            })">${product.title}</h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `
    )
    .join("");
}

// Show product details
function showProductDetails(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const productDetail = document.getElementById("productDetail");
  productDetail.innerHTML = `
        <img src="${product.image}" alt="${
    product.title
  }" style="max-width: 300px;">
        <h2>${product.title}</h2>
        <p class="product-price">$${product.price.toFixed(2)}</p>
        <p>${product.description}</p>
        <button class="add-to-cart" onclick="addToCart(${product.id})">
            Add to Cart
        </button>
    `;

  productModal.style.display = "block";
}

// Close product modal
function closeProductModal() {
  productModal.style.display = "none";
}

// Add to cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCart();
  showCartNotification();
}

// Remove from cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCart();
}

// Update cart display
function updateCart() {
  // Update cart items display
  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-details">
                <h4>${item.title}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                <button class="remove-item" onclick="removeFromCart(${
                  item.id
                })">
                    Remove
                </button>
            </div>
        </div>
    `
    )
    .join("");

  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  // Update cart total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = total.toFixed(2);

  // Save cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Toggle cart modal
function toggleCart() {
  cartModal.style.display =
    cartModal.style.display === "block" ? "none" : "block";
}

// Show loading spinner
function showLoading() {
  loadingSpinner.style.display = "flex";
}

// Hide loading spinner
function hideLoading() {
  loadingSpinner.style.display = "none";
}

// Show cart notification
function showCartNotification() {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = "✨ Added to cart successfully!";
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateX(100%)";
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Initialize
function init() {
  // Load cart from localStorage
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCart();
  }

  // Fetch products
  fetchProducts();
}

// Start the application
init();
