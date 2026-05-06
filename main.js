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
   FILTERS (CLEAN VERSION)
========================= */
// UPDATED: filterByCategory
window.filterByCategory = function(category) {
    const allAds = getAds();
    let filteredAds = [];

    if (category === 'All') {
        filteredAds = allAds;  // If 'All' is selected, show all ads
    } else {
    const filteredAds = globalAds.filter(ad => ad.category === category);
    }

    // Log filtered ads for debugging
    console.log("Filtered ads:", filteredAds);

    // Render filtered ads
    renderAds(filteredAds, "listings");

    // Show or hide "No items found" message based on the filtered results
    const noItemsMessage = document.getElementById('no-items-message');
    if (filteredAds.length === 0) {
        noItemsMessage.style.display = 'block';  // Show "No items found" if no ads match
    } else {
        noItemsMessage.style.display = 'none';  // Hide message if ads are found
    }
};

// UPDATED: Reset Filters
window.resetFilters = function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';  // Reset search input
    renderAds(getAds(), "listings");  // Render all ads
    const noItemsMessage = document.getElementById('no-items-message');
    noItemsMessage.style.display = 'none';  // Hide "No items found" message
};

// UPDATED: Apply Filters (search)
window.applyFilters = function() {
    const searchInput = document.getElementById('searchInput');
    const query = document.getElementById("searchInput").value.toLowerCase().trim();

    if (!query) {
      globalAds.sort((a, b) => new Date(b.date) - new Date(a.date)); 
        renderAds(globalAds, "listings");// If search is empty, show all ads
        return;
    }

    const filteredAds = globalAds.filter(ad =>
        (ad.title || "").toLowerCase().includes(query) || 
        (ad.category || "").toLowerCase().includes(query)
    );

    renderAds(filteredAds, "listings");

    // Show or hide the "No items found" message based on the filtered results
    const noItemsMessage = document.getElementById('no-items-message');
    if (filteredAds.length === 0) {
        noItemsMessage.style.display = 'block';  // Show "No items found" if no matching ads
    } else {
        noItemsMessage.style.display = 'none';  // Hide message if ads are found
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

        const images = Array.isArray(ad.image)
            ? ad.image
            : [ad.image || 'https://via.placeholder.com/300'];

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

                ${showDelete ? `<button onclick="deleteAd('${uniqueId}')">Delete</button>` : ""}
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
