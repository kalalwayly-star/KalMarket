import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import {
    collection,
    query,
    where,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const container = document.getElementById("myAdsContainer");

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        alert("Please log in first.");
        window.location.href = "login.html";
        return;
    }

    loadUserAds(user.uid);
});

async function loadUserAds(userId) {
    const q = query(
        collection(db, "marketplace_ads"),
        where("userId", "==", userId)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        container.innerHTML = "<p>No ads posted yet.</p>";
        return;
    }

    let html = "";

    snapshot.forEach(docSnap => {
        const ad = docSnap.data();
        const adId = docSnap.id;
        const image = Array.isArray(ad.image)
            ? ad.image[0]
            : ad.image || "https://via.placeholder.com/300";

        html += `
            <div class="card">
                <img src="${image}" style="width:100%; height:200px; object-fit:cover;">
                <h3>${ad.title}</h3>
                <p>${ad.location}</p>
                <p><b>$${ad.price}</b></p>
                <button onclick="deleteMyAd('${adId}')">Delete</button>
            </div>
        `;
    });

    container.innerHTML = html;
}

window.deleteMyAd = async function(adId) {
    if (!confirm("Delete this ad?")) return;

    await deleteDoc(doc(db, "marketplace_ads", adId));
    location.reload();
};
