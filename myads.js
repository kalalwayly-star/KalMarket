import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const symbolMap = {
    USD: "$",
    CAD: "$",
    AUD: "$",
    EUR: "€",
    GBP: "£",
    SAR: "﷼",
    AED: "د.إ",
    IQD: "ع.د",
    JOD: "د.أ",
    EGP: "ج.م",
    INR: "₹",
    PKR: "₨",
    CNY: "¥",
    JPY: "¥",
    KRW: "₩",
    CHF: "CHF",
    NOK: "kr",
    SEK: "kr",
    DKK: "kr",
    ZAR: "R",
    NGN: "₦",
    BRL: "R$",
    MXN: "$"
};

const container = document.getElementById("myAdsContainer");

if (!container) {
    console.error("myAdsContainer not found.");
}

// Wait for login state
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        alert("Please log in first.");
        window.location.href = "login.html";
        return;
    }

    loadUserAds(user.uid);
});

// Load only logged-in user's ads
async function loadUserAds(userId) {
    try {
        const adsQuery = query(
            collection(db, "marketplace_ads"),
            where("userId", "==", userId)
        );

        const snapshot = await getDocs(adsQuery);

        if (snapshot.empty) {
            container.innerHTML = `<p style="text-align:center;">You have no active ads.</p>`;
            return;
        }

        let html = "";

        snapshot.forEach((docSnap) => {
            const ad = docSnap.data();
            const adId = docSnap.id;

            const image = Array.isArray(ad.image)
                ? ad.image[0]
                : (ad.image || "https://via.placeholder.com/300");

            html += `
<div class="card" data-status="${ad.status || 'active'}">                 
<img src="${image}" alt="${ad.title}" class="ad-image">

                    <div class="card-content">
                        <h3>${ad.title}</h3>
                        <p>📍 ${ad.location || "No location"}</p>
                        <p><b>${symbolMap[ad.currency] || ad.currency || "$"} ${ad.price}</b></p>
                        <p><strong>Condition:</strong> ${ad.condition || "N/A"}</p>
                        <p>👁️ ${ad.views || 0} views</p>

                        <button onclick="deleteMyAd('${adId}')">
                            Delete
                        </button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        // FILTER BUTTONS
const filterButtons = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".card");

filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

        // Active button style
        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        const filter = button.dataset.filter;

        cards.forEach((card) => {

            const status = card.dataset.status;

            if (filter === "all" || status === filter) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }

        });

    });

});

    } catch (error) {
        console.error("Error loading ads:", error);
        container.innerHTML = `<p style="color:red;">Failed to load ads.</p>`;
    }
}

// Delete ad
window.deleteMyAd = async function(adId) {
    if (!confirm("Are you sure you want to delete this ad?")) return;

    try {
        await deleteDoc(doc(db, "marketplace_ads", adId));
        alert("Ad deleted successfully!");
        location.reload();
    } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete ad.");
    }
};
