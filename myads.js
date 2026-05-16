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


const container = document.getElementById("myAdsContainer");

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

         html += <div class="card-content"> 
        <h3>${ad.title}</h3> <p>📍 ${ad.location || "No location"}</p> 
        <p><b>${symbolMap[ad.currency] || ad.currency || "$"} ${ad.price}</b></p> 
        <p><strong>Condition:</strong> ${ad.condition || "N/A"}</p> 
        <p>👁️ ${ad.views || 0} views</p> </div> 
        <button onclick="deleteMyAd('${adId}')"> Delete </button> </div> </div> ; });

        container.innerHTML = html;

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
