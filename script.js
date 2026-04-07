import { auth, db } from './firebase-config.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where,
  setDoc,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

// ─── LOCAL IMAGE MAPPING (using your actual files) ───
const localImgPaths = [
  "0913e69b1a70b767b9a803d290e4d7ac.jpg",
  "137a643ef93b506e33d531aa96ce6002.jpg",
  "3ecd72f7131f004a5c1e6cc198d27503.jpg",
  "42c87e61-6d0b-436e-b711-4c80c3ce1b66.png",
  "85dc7682-4dec-4267-814f-baa3fd014f0b.png",
  "9d1d18c7-7ea4-4fc7-8dcf-de63414b2fa3.png",
  "a3b1f4282e5e40cb82929f3cbc095b10.jpg",
  "a63148e2d41209f4acae136f1f294ff9.jpg",
  "ddff8af0-b3fb-46f2-9163-b7dd45c0fded.png",
  "e45c4e2a0a60bb07d7b970ff9afcb688.jpg",
  "edcddbcd-4dfe-425b-8b5f-c5e4b8ffb84b.png",
  "fb000b0b7c9d77135efad63dc2cd4319.jpg",
  "landing.jpg",
  "luke-witter-5zKWJklU8vI-unsplash-removebg-preview.png",
  "luke-witter-5zKWJklU8vI-unsplash.jpg",
  "photos1.jpeg"
];

function getImgPath(index) {
  const filename = localImgPaths[index % localImgPaths.length];
  return `assets/images/${filename}`;
}

// ─── LOCAL PRODUCT DATA ───
const localProducts = [
  // ─── MEN (18 products) ───
  { id: "1", name: "AF 1 Low",      company: "nike",       category: "men",   price: 165, img: getImgPath(0) },
  { id: "2", name: "Air Max 270",   company: "nike",       category: "men",   price: 180, img: getImgPath(1) },
  { id: "3", name: "Jordan Retro",  company: "nike",       category: "men",   price: 200, img: getImgPath(2) },
  { id: "4", name: "React Runner",  company: "nike",       category: "men",   price: 155, img: getImgPath(3) },
  { id: "5", name: "Zoom Pegasus",  company: "nike",       category: "men",   price: 130, img: getImgPath(4) },
  { id: "6", name: "Metcon Pro",    company: "nike",       category: "men",   price: 145, img: getImgPath(5) },
  { id: "7", name: "NB 550 Retro",  company: "newbalance", category: "men",   price: 150, img: getImgPath(6) },
  { id: "8", name: "NB 990 v6",     company: "newbalance", category: "men",   price: 185, img: getImgPath(7) },
  { id: "9", name: "NB 2002R",      company: "newbalance", category: "men",   price: 130, img: getImgPath(8) },
  { id: "10", name: "UltraBoost 23", company: "adidas",     category: "men",   price: 190, img: getImgPath(9) },
  { id: "11", name: "Stan Smith",    company: "adidas",     category: "men",   price: 100, img: getImgPath(10) },
  { id: "12", name: "Forum Low",     company: "adidas",     category: "men",   price: 110, img: getImgPath(11) },
  { id: "13", name: "NMD Classic",   company: "adidas",     category: "men",   price: 140, img: getImgPath(12) },
  { id: "14", name: "Samba OG",      company: "adidas",     category: "men",   price: 100, img: getImgPath(13) },
  { id: "15", name: "All Star Hi",   company: "converse",   category: "men",   price: 85,  img: getImgPath(14) },
  { id: "16", name: "Vans Old Skool", company: "vans",       category: "men",   price: 75,  img: getImgPath(15) },
  { id: "17", name: "Vans Authentic", company: "vans",       category: "men",   price: 60,  img: getImgPath(0) },
  { id: "18", name: "Puma Suede",    company: "puma",       category: "men",   price: 90,  img: getImgPath(1) },

  // ─── WOMEN (18 products) ───
  { id: "19", name: "Dunk Low W",     company: "nike",       category: "women", price: 120, img: getImgPath(2) },
  { id: "20", name: "Blazer Mid W",   company: "nike",       category: "women", price: 110, img: getImgPath(3) },
  { id: "21", name: "Air Max 90 W",   company: "nike",       category: "women", price: 140, img: getImgPath(4) },
  { id: "22", name: "Huarache W",     company: "nike",       category: "women", price: 130, img: getImgPath(5) },
  { id: "23", name: "Free Run W",     company: "nike",       category: "women", price: 100, img: getImgPath(6) },
  { id: "24", name: "Court Vision",   company: "nike",       category: "women", price: 75,  img: getImgPath(7) },
  { id: "25", name: "NB 990v5 W",     company: "newbalance", category: "women", price: 195, img: getImgPath(8) },
  { id: "26", name: "NB 327 W",       company: "newbalance", category: "women", price: 100, img: getImgPath(9) },
  { id: "27", name: "NB 574 W",       company: "newbalance", category: "women", price: 95,  img: getImgPath(10) },
  { id: "28", name: "Ozweego W",      company: "adidas",     category: "women", price: 130, img: getImgPath(11) },
  { id: "29", name: "Superstar W",    company: "adidas",     category: "women", price: 90,  img: getImgPath(12) },
  { id: "30", name: "Gazelle Bold",   company: "adidas",     category: "women", price: 115, img: getImgPath(13) },
  { id: "31", name: "Forum Bold",     company: "adidas",     category: "women", price: 120, img: getImgPath(14) },
  { id: "32", name: "Chuck Platform", company: "converse",   category: "women", price: 100, img: getImgPath(15) },
  { id: "33", name: "Sk8-Hi Plat",    company: "vans",       category: "women", price: 85,  img: getImgPath(0) },
  { id: "34", name: "Vans Slip-On",   company: "vans",       category: "women", price: 70,  img: getImgPath(1) },
  { id: "35", name: "RS-X Puma W",    company: "puma",       category: "women", price: 110, img: getImgPath(2) },
  { id: "36", name: "Mayze Stack",    company: "puma",       category: "women", price: 95,  img: getImgPath(3) },

  // ─── KIDS (14 products) ───
  { id: "37", name: "Kids Dunk",      company: "nike",       category: "kids",  price: 70,  img: getImgPath(4) },
  { id: "38", name: "Kids AF 1",      company: "nike",       category: "kids",  price: 80,  img: getImgPath(5) },
  { id: "39", name: "Kids Jordan",    company: "nike",       category: "kids",  price: 95,  img: getImgPath(6) },
  { id: "40", name: "Kids Air Max",   company: "nike",       category: "kids",  price: 85,  img: getImgPath(7) },
  { id: "41", name: "Kids NB 550",    company: "newbalance", category: "kids",  price: 75,  img: getImgPath(8) },
  { id: "42", name: "Kids FreshFoam", company: "newbalance", category: "kids",  price: 65,  img: getImgPath(9) },
  { id: "43", name: "Kids NB 574",    company: "newbalance", category: "kids",  price: 70,  img: getImgPath(10) },
  { id: "44", name: "Kids StanSmith", company: "adidas",     category: "kids",  price: 65,  img: getImgPath(11) },
  { id: "45", name: "Kids Boost",     company: "adidas",     category: "kids",  price: 85,  img: getImgPath(12) },
  { id: "46", name: "Kids Superstar", company: "adidas",     category: "kids",  price: 60,  img: getImgPath(13) },
  { id: "47", name: "Kids Chucks",    company: "converse",   category: "kids",  price: 55,  img: getImgPath(14) },
  { id: "48", name: "Kids Era Vans",  company: "vans",       category: "kids",  price: 50,  img: getImgPath(15) },
  { id: "49", name: "Kids SlipOn",    company: "vans",       category: "kids",  price: 45,  img: getImgPath(0) },
  { id: "50", name: "Kids Puma",      company: "puma",       category: "kids",  price: 60,  img: getImgPath(1) },
];

let products = []; // Start empty - fetch from DB
let cart = JSON.parse(localStorage.getItem('shoebazar_cart')) || [];
let currentUser = null;

// ─── AUTHENTICATION STATE ───
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  updateNavbar();
  if (user) {
    console.log("Logged in:", user.email);
    syncCartFromFirestore();
  } else {
    updateCartCount();
  }
});

function updateNavbar() {
  const loginLinks = document.querySelectorAll('a[href="login.html"]');
  loginLinks.forEach(link => {
    if (currentUser) {
      link.textContent = "Logout";
      link.href = "#";
      link.onclick = (e) => {
        e.preventDefault();
        handleLogout();
      };
    } else {
      link.textContent = "Login";
      link.href = "login.html";
      link.onclick = null;
    }
  });
}

async function handleLogout() {
  await signOut(auth);
  window.location.reload();
}

const googleProvider = new GoogleAuthProvider();

async function handleGoogleLogin() {
  try {
    await signInWithPopup(auth, googleProvider);
    window.location.href = "index.html";
  } catch (err) {
    console.error("Google Login Error:", err);
    alert("Google sign-in failed: " + err.message);
  }
}
window.handleGoogleLogin = handleGoogleLogin;

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const isSignUp = document.getElementById("login-title").textContent === "Create Account";

  try {
    if (isSignUp) {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully! Welcome to Shoebazar.");
    } else {
      await signInWithEmailAndPassword(auth, email, password);
    }
    window.location.href = "index.html";
  } catch (err) {
    console.error("Auth Error:", err.code);
    if (err.code === "auth/operation-not-allowed") {
      alert("ERROR: You must enable 'Email/Password' in your Firebase Console (Authentication > Sign-in method).");
    } else {
      alert(err.message);
    }
  }
}
window.handleLogin = handleLogin;

window.toggleAuthMode = function() {
  const title = document.getElementById("login-title");
  const btn = document.querySelector(".login-btn");
  const toggleLink = document.getElementById("toggle-link");
  
  if (title.textContent === "Welcome Back") {
    title.textContent = "Create Account";
    btn.textContent = "Sign Up";
    toggleLink.innerHTML = 'Already have an account? <a href="#" onclick="toggleAuthMode()">Log In</a>';
  } else {
    title.textContent = "Welcome Back";
    btn.textContent = "Log In";
    toggleLink.innerHTML = 'Don\'t have an account? <a href="#" onclick="toggleAuthMode()">Sign Up</a>';
  }
}

// ─── FIRESTORE DATA SYNC ───
async function fetchProductsFromDB() {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    if (!querySnapshot.empty) {
      products = [];
      querySnapshot.forEach((doc) => {
        products.push({ ...doc.data(), id: doc.id });
      });
      console.log("Loaded products from Firestore.");
    } else {
      console.warn("Firestore collection 'products' is empty. Run seedProducts() in console.");
      products = [...localProducts]; // Temporary fallback
    }
  } catch (error) {
    console.error("Firestore Error:", error);
    products = [...localProducts]; // Robust fallback
  }
}

async function syncCartFromFirestore() {
  if (!currentUser) return;
  const cartDoc = await getDoc(doc(db, "carts", currentUser.uid));
  if (cartDoc.exists()) {
    cart = cartDoc.data().items || [];
    localStorage.setItem('shoebazar_cart', JSON.stringify(cart));
    updateCartCount();
    // Re-render if on page
    if (document.getElementById("orders-container")) renderOrdersPage();
  }
}

async function updateCartInFirestore() {
  if (currentUser) {
    await setDoc(doc(db, "carts", currentUser.uid), { items: cart });
  }
}

// ─── CART ACTIONS ───
function updateCartCount() {
  const countEls = document.querySelectorAll('#cart-count');
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  countEls.forEach(el => el.textContent = count);
}

window.addToCart = function(productId) {
  const product = products.find(p => p.id == productId);
  if (!product) return;

  const existing = cart.find(item => item.id == productId);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem('shoebazar_cart', JSON.stringify(cart));
  updateCartCount();
  updateCartInFirestore();
  alert(product.name + " added!");
}

window.removeFromCart = function(productId) {
  cart = cart.filter(item => item.id != productId);
  localStorage.setItem('shoebazar_cart', JSON.stringify(cart));
  updateCartCount();
  updateCartInFirestore();
  renderOrdersPage();
}

// ─── SEEDING DB TOOL ───
window.seedProducts = async function() {
  if (!currentUser) {
    alert("Login to Firebase first to push data.");
    return;
  }
  const colRef = collection(db, "products");
  try {
    for (const p of localProducts) {
      await addDoc(colRef, p);
    }
    alert("Successfully pushed 50 shoes to Firestore!");
    fetchProductsFromDB().then(() => {
        if(document.getElementById("product-container")) window.location.reload();
    });
  } catch (err) {
    alert("Push failed. Error: " + err.message);
  }
}

// ─── SEARCH ───
window.handleSearch = function(e) {
  e.preventDefault();
  const q = document.getElementById("searchInput")?.value || document.getElementById("searchInputMobile")?.value || "";
  if (q) window.location.href = `shoes.html?search=${encodeURIComponent(q)}`;
}

// ─── INITIALIZATION ───
document.addEventListener("DOMContentLoaded", async () => {
  await fetchProductsFromDB();
  updateCartCount();

  const loginForm = document.querySelector(".login-container form");
  if (loginForm) loginForm.addEventListener("submit", handleLogin);

  const container = document.getElementById("product-container");
  if (container) {
    let cat = "men", sort = "none", brand = "all";
    const qParams = new URLSearchParams(window.location.search);
    const searchVal = qParams.get('search')?.toLowerCase() || "";

    function render() {
      container.innerHTML = "";
      let filtered = products.filter(p => searchVal ? true : p.category === cat);
      if (searchVal) filtered = filtered.filter(p => (p.name + p.company).toLowerCase().includes(searchVal));
      if (brand !== "all") filtered = filtered.filter(p => p.company === brand);
      if (sort === "asc") filtered.sort((a,b) => a.price - b.price);
      if (sort === "desc") filtered.sort((a,b) => b.price - a.price);

      if (filtered.length === 0) {
        container.innerHTML = `<h3 class="text-white">No items found.</h3>`;
        return;
      }

      filtered.forEach(p => {
        container.innerHTML += `
          <div class="shoe-card">
            <img src="${p.img}" alt="${p.name}">
            <div class="shoe-info">
              <div>
                <h5>${p.name}</h5>
                <p class="brand-label">${p.company.toUpperCase()}</p>
              </div>
              <p class="price-label">€${p.price}</p>
              <button onclick="addToCart('${p.id}')" class="add-btn">Add to Cart</button>
            </div>
          </div>
        `;
      });
    }

    document.querySelectorAll(".cat-tab").forEach(btn => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".cat-tab").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        cat = e.target.getAttribute("data-category");
        render();
      });
    });

    document.getElementById("price-sort")?.addEventListener("change", (e) => { sort = e.target.value; render(); });
    document.getElementById("company-filter")?.addEventListener("change", (e) => { brand = e.target.value; render(); });

    render();
  }

  if (document.getElementById("orders-container")) renderOrdersPage();
});

function renderOrdersPage() {
  const container = document.getElementById("orders-container");
  if (!container) return;
  container.innerHTML = "";
  if (cart.length === 0) {
    container.innerHTML = `<p class="text-white text-center">Empty Cart.</p>`;
    document.getElementById("checkout-panel").style.display = 'none';
    return;
  }
  document.getElementById("checkout-panel").style.display = 'block';
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
    container.innerHTML += `
      <div class="d-flex justify-content-between align-items-center bg-dark p-3 mb-2 rounded border border-secondary text-white">
        <div class="d-flex align-items-center gap-3">
          <img src="${item.img}" style="width:50px; height:50px; object-fit:cover;">
          <div><h6 class="mb-0">${item.name} x${item.quantity}</h6><small>${item.company}</small></div>
        </div>
        <div class="d-flex align-items-center gap-3">
           <span>€${item.price * item.quantity}</span>
           <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart('${item.id}')">X</button>
        </div>
      </div>
    `;
  });
  document.getElementById("total-price").textContent = "€" + total;
}
window.clearCart = function() {
  cart = [];
  localStorage.setItem('shoebazar_cart', JSON.stringify(cart));
  updateCartCount();
  updateCartInFirestore();
}


