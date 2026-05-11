import { auth, db, rtdb } from "./firebase-config.js";

// Full URLs for Auth
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
// Full URLs for Realtime Database
import { ref, onValue, remove } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";
// Full URLs for Firestore
import { collection, onSnapshot, query, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

// Global variable to store ads
let globalAds = [];

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("searchBtn")
    ?.addEventListener("click", applyFilters);

document.getElementById("resetBtn")
    ?.addEventListener("click", resetFilters);

    const userInfoDiv = document.getElementById("user-info-header");
    const emailSpan = document.getElementById("header-user-email");
    const loginLink = document.getElementById("userAuth");
    const logoutBtn = document.getElementById("logout-btn");

    // Firebase authentication state listener
    onAuthStateChanged(auth, (user) => {
        if (user) {
            if (userInfoDiv) userInfoDiv.style.display = "block";
            if (emailSpan) emailSpan.innerText = user.email;
            if (loginLink) loginLink.style.display = "none";
            if (logoutBtn) logoutBtn.style.display = "inline-block";
        } else {
            if (userInfoDiv) userInfoDiv.style.display = "none";
            if (loginLink) loginLink.style.display = "inline-block";
            if (logoutBtn) logoutBtn.style.display = "none";
        }
    });

    // Logout button event listener
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            signOut(auth).then(() => {
                window.location.href = "index.html";
            });
        });
    }
});

/* =========================
   ADS LOAD FROM FIREBASE
========================= */
function initMain() {
    const listingsContainer = document.getElementById("listings");
    if (!listingsContainer) return;

    // Correct way to get ads from Firestore (where post.js sends them)
    const adsCollection = collection(db, "marketplace_ads");

    onSnapshot(adsCollection, (snapshot) => {
        globalAds = [];
        snapshot.forEach((doc) => {
            // Firestore uses doc.id for the key and doc.data() for the info
            globalAds.push({ ...doc.data(), firebaseId: doc.id });
        });

        renderAds(globalAds, "listings");
    });
}


document.addEventListener("DOMContentLoaded", initMain);


/* =========================
   GLOBAL HELPERS
========================= */
function getAds() {
    return globalAds;
}

window.goToDetails = function(id) {
    window.location.href = `details.html?id=${id}`;
};


window.deleteAd = async function(firebaseId) {
    if (!confirm("Are you sure you want to delete this ad?")) return;

    try {
        await deleteDoc(doc(db, "marketplace_ads", firebaseId));
        alert("Ad deleted successfully");
    } catch (error) {
        console.error("Error deleting ad:", error);
        alert("Failed to delete ad.");
    }
};


/* =========================
   FIX #2 — CATEGORY FILTER
========================= */

// REPLACE your full filterByCategory function with this:

// CATEGORY FILTER
window.filterByCategory = function(category) {
    if (!globalAds || globalAds.length === 0) {
        renderAds([], "listings");
        return;
    }

    let filteredAds;

    if (category === "All") {
        filteredAds = globalAds;
    } else {
        filteredAds = globalAds.filter(ad =>
            (ad.category || "").trim().toLowerCase() ===
            category.trim().toLowerCase()
        );
    }

    renderAds(filteredAds, "listings");

    const noItemsMessage = document.getElementById("no-items-message");
    if (noItemsMessage) {
        noItemsMessage.style.display =
            filteredAds.length === 0 ? "block" : "none";
    }
};


// RESET FILTERS
window.resetFilters = function() {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.value = "";

    renderAds(globalAds, "listings");

    const noItemsMessage = document.getElementById("no-items-message");
    if (noItemsMessage) {
        noItemsMessage.style.display = "none";
    }
};

// SEARCH FILTER
window.applyFilters = function() {
    const query = document.getElementById("searchInput")
        ?.value.toLowerCase()
        .trim() || "";

    if (!query) {
        renderAds(globalAds, "listings");
        return;
    }

    const filteredAds = globalAds.filter(ad =>
        (ad.title || "").toLowerCase().includes(query) ||
        (ad.category || "").toLowerCase().includes(query) ||
        (ad.location || "").toLowerCase().includes(query) ||
        (ad.description || "").toLowerCase().includes(query)
    );

    renderAds(filteredAds, "listings");

    const noItemsMessage = document.getElementById("no-items-message");
    if (noItemsMessage) {
        noItemsMessage.style.display =
            filteredAds.length === 0 ? "block" : "none";
    }
};
/* =========================
   RENDER ADS
========================= */
window.renderAds = function(adsArray, containerId = "listings") {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    console.log("Filtered ads:", adsArray);

    if (!adsArray || adsArray.length === 0) {
        container.innerHTML = `<p style="text-align:center;">No items found.</p>`;
        return;
    }

    container.innerHTML = adsArray.map(ad => {
        const uniqueId = ad.firebaseId;

        const currentUser = auth.currentUser;
        const showDelete = currentUser && currentUser.uid === ad.userId;

        const fallbackImage = "https://dummyimage.com/300x200/cccccc/000000&text=No+Image";

const images = Array.isArray(ad.image)
    ? ad.image.filter(img => img && img.startsWith("http"))
    : (ad.image && ad.image.startsWith("http"))
        ? [ad.image]
        : [fallbackImage];

        return `
        <div class="card">

            <div class="slider" id="slider-${uniqueId}">
                ${images.map((img, index) => `
                    <img src="${img}" 
                         class="slide ${index === 0 ? 'active' : ''}" 
                         onclick="goToDetails('${uniqueId}')">
                `).join("")}

                ${images.length > 1 ? `
                    <button class="prev" onclick="event.stopPropagation(); changeSlide('${uniqueId}', -1)">‹</button>
                    <button class="next" onclick="event.stopPropagation(); changeSlide('${uniqueId}', 1)">›</button>
                ` : ""}
            </div>

            <div class="card-content">
                <h3>${ad.title}</h3>
                <p>📍 ${ad.location || "No location"}</p>
                <p><b>$${ad.price}</b></p>
<p><strong>Condition:</strong> ${ad.condition || "N/A"}</p>
               
            </div>

        </div>
        `;
    }).join("");
};

/* =========================
   IMAGE SLIDER FUNCTION
========================= */
window.changeSlide = function(adId, direction) {
    const slider = document.getElementById(`slider-${adId}`);
    if (!slider) return;

    const slides = slider.querySelectorAll(".slide");
    if (!slides.length) return;

    let currentIndex = [...slides].findIndex(slide =>
        slide.classList.contains("active")
    );

    if (currentIndex === -1) currentIndex = 0;

    slides[currentIndex].classList.remove("active");

    currentIndex = (currentIndex + direction + slides.length) % slides.length;

    slides[currentIndex].classList.add("active");
};
