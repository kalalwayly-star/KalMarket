import { auth, db, rtdb } from "./firebase-config.js";

import { 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

import { 
    ref, 
    onValue, 
    remove 
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

import {
    collection,
    onSnapshot,
    query,
    orderBy,
    deleteDoc,
    doc,
    updateDoc,
    increment,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const symbolMap = {
    USD: "$",
    CAD: "$",
    AUD: "$",
    EUR: "€",
    GBP: "£",

    SAR: "﷼",
    AED: "د.إ",
    QAR: "ر.ق",
    KWD: "د.ك",
    BHD: ".د.ب",
    OMR: "ر.ع",

    IQD: "ع.د",
    JOD: "د.أ",
    LBP: "ل.ل",
    EGP: "ج.م",
    LYD: "ل.د",
    TND: "د.ت",
    DZD: "د.ج",
    MAD: "د.م",

    TRY: "₺",
    INR: "₹",
    PKR: "₨",
    BDT: "৳",
    LKR: "Rs",

    CNY: "¥",
    JPY: "¥",
    KRW: "₩",

    RUB: "₽",
    UAH: "₴",

    CHF: "CHF",
    NOK: "kr",
    SEK: "kr",
    DKK: "kr",

    ZAR: "R",
    NGN: "₦",
    GHS: "₵",
    KES: "KSh",

    BRL: "R$",
    MXN: "$",
    ARS: "$",
    CLP: "$",
    COP: "$"
};let globalAds = [];

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("searchBtn")
?.addEventListener("click", () => {
    window.applyFilters();
});

document.getElementById("resetBtn")
?.addEventListener("click", () => {
    window.resetFilters();
});

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
/* =========================
   ADS LOAD FROM FIREBASE (FIXED)
========================= */
let mainInitialized = false;

function initMain() {
    if (mainInitialized) return;
    mainInitialized = true;

    const listingsContainer = document.getElementById("listings");
    if (!listingsContainer) return;

    const adsQuery = query(
        collection(db, "marketplace_ads"),
        orderBy("featured", "desc"),
        orderBy("createdAt", "desc")
    );

    onSnapshot(adsQuery, (snapshot) => {
        globalAds = [];
        const now = new Date();

        snapshot.forEach((docSnap) => {
            const ad = docSnap.data();

            // Check if featured period expired
            let isFeatured = ad.featured || false;
            if (isFeatured && ad.featuredUntil && ad.featuredUntil.toDate() < now) {
                isFeatured = false;
            }

            globalAds.push({
                ...ad,
                featured: isFeatured,
                firebaseId: docSnap.id
            });
        });

        // FIXED SAFETY SORTING (Handles local pending serverTimestamps)
               // 2. Safe Timestamp Resolution for Mobile Devices
        globalAds.sort((a, b) => {
            if (a.featured !== b.featured) {
                return b.featured - a.featured;
            }

            let timeA = 0;
            let timeB = 0;

            try {
                if (a && a.createdAt) {
                    if (typeof a.createdAt.toDate === 'function') timeA = a.createdAt.toDate().getTime();
                    else if (a.createdAt.seconds) timeA = a.createdAt.seconds * 1000;
                    else if (typeof a.createdAt.toMillis === 'function') timeA = a.createdAt.toMillis();
                    else timeA = Date.now(); 
                }
            } catch(e) { timeA = Date.now(); }

            try {
                if (b && b.createdAt) {
                    if (typeof b.createdAt.toDate === 'function') timeB = b.createdAt.toDate().getTime();
                    else if (b.createdAt.seconds) timeB = b.createdAt.seconds * 1000;
                    else if (typeof b.createdAt.toMillis === 'function') timeB = b.createdAt.toMillis();
                    else timeB = Date.now();
                }
            } catch(e) { timeB = Date.now(); }

            return timeB - timeA;
        });

        // FIXED SAFETY LOGGING LOOP (Will not crash WebView rendering)
        try {
            console.log("========== FINAL ADS ORDER ==========");
            globalAds.forEach((ad, index) => {
                let adDateString = "Pending Server...";
                if (ad && ad.createdAt && typeof ad.createdAt.toDate === 'function') {
                    try {
                        adDateString = ad.createdAt.toDate().toString();
                    } catch(dateErr) {
                        adDateString = "Resolving...";
                    }
                }
                console.log(index + 1, ad.title || "No Title", "Featured:", ad.featured, "Date:", adDateString);
            });
        } catch (logError) {
            console.warn("Logging notice ignored to prevent WebView crash:", logError);
        }

        // GUARANTEED EXECUTION: Render runs outside the logging scope
        renderAds(globalAds, "listings");

    }, (error) => {
        console.error("Firestore Error:", error);
    });
}

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

async function trackVisitor() {
    if (!sessionStorage.getItem("visited")) {
        sessionStorage.setItem("visited", "true");

        const statsRef = doc(db, "site_stats", "global");

        await updateDoc(statsRef, {
            visitors: increment(1)
        }).catch(async () => {
            await setDoc(statsRef, {
                visitors: 1
            });
        });
    }
}

async function displayVisitorCount() {
    const statsRef = doc(db, "site_stats", "global");
    const snap = await getDoc(statsRef);

    const count = snap.exists() ? snap.data().visitors : 0;

    const el = document.getElementById("visitorCount");
    if (el) {
        el.textContent = `👥 Visitors: ${count}`;
    }
}
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
document.getElementById("listings").scrollIntoView({
    behavior: "smooth",
    block: "start"
});
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
window.applyFilters = function () {
    const query = document.getElementById("searchInput")
        ?.value.toLowerCase().trim() || "";

    const location = document.getElementById("locationInput")
        ?.value.toLowerCase().trim() || "";

    const filteredAds = globalAds.filter(ad => {

        const matchesSearch =
            !query ||
            (ad.title || "").toLowerCase().includes(query) ||
            (ad.category || "").toLowerCase().includes(query) ||
            (ad.description || "").toLowerCase().includes(query);

        const matchesLocation =
            !location ||
            (ad.location || "").toLowerCase().includes(location);

        return matchesSearch && matchesLocation;
    });

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
        <div class="card ${ad.status === 'sold' ? 'sold-card' : ''}">

    ${ad.status === "sold" ? `
        <div class="sold-badge" data-i18n="sold_label">
            SOLD
        </div>
    ` : ""}

    ${ad.status === "pending" ? `
        <div class="pending-badge" data-i18n="pending_label">
            Pending
        </div>
    ` : ""}

            <div class="slider" id="slider-${uniqueId}">
             ${ad.featured ? `
        <div class="featured-badge">
            ⭐ FEATURED
        </div>
    ` : ""}
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
<h3><a href="details.html?id=${uniqueId}">${ad.title}</a></h3>                <p>📍 ${ad.location || "No location"}</p>
<p><b>${symbolMap[ad.currency] || ad.currency || "$"} ${ad.price}</b></p><p><strong>Condition:</strong> ${ad.condition || "N/A"}</p>
               <p>👁️ ${ad.views || 0} views</p>
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
document.addEventListener("DOMContentLoaded", async () => {
    initMain();
    await trackVisitor();
    await displayVisitorCount();
});





