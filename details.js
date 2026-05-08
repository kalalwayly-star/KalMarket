import { db, auth } from "./firebase-config.js";

import {
    doc,
    getDoc,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

/* =========================
   GET AD ID FROM URL
========================= */
const params = new URLSearchParams(window.location.search);
const adId = params.get("id");

/* =========================
   LOAD AD DETAILS
========================= */
async function loadAdDetails() {

    if (!adId) {
        alert("Ad not found.");
        return;
    }

    try {
        const adRef = doc(db, "marketplace_ads", adId);
        const adSnap = await getDoc(adRef);

        if (!adSnap.exists()) {
            alert("Ad not found.");
            return;
        }

        const ad = adSnap.data();

        // Title
        document.getElementById("adTitle").innerText = ad.title || "No Title";

        // Category
        document.getElementById("adCategory").innerText = ad.category || "";

        // Price
        document.getElementById("adPrice").innerText = `$${ad.price || "0"}`;

        // Location
        document.getElementById("adLocation").innerText = ad.location || "Unknown";

        // Description
        document.getElementById("adDesc").innerText = ad.description || "No description provided.";

        // Images
        const imageContainer = document.getElementById("adImageContainer");

        const fallbackImage = "https://dummyimage.com/600x400/cccccc/000000&text=No+Image";

        let images = [];

        if (Array.isArray(ad.image)) {
            images = ad.image.filter(img => img && img.startsWith("http"));
        } else if (ad.image && ad.image.startsWith("http")) {
            images = [ad.image];
        }

        if (images.length === 0) {
            images = [fallbackImage];
        }

        imageContainer.innerHTML = images.map(img => `
            <img src="${img}" 
                 style="width:100%; max-height:500px; object-fit:cover; margin-bottom:10px; border-radius:10px;">
        `).join("");

        // Store seller info globally
        window.currentSellerId = ad.userId;
        window.currentSellerEmail = ad.userEmail;

    } catch (error) {
        console.error("Error loading ad:", error);
        alert("Failed to load ad details.");
    }
}

/* =========================
   SEND MESSAGE
========================= */
window.sendMessage = async function() {

    const user = auth.currentUser;

    if (!user) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    const messageText = document.getElementById("messageText").value.trim();

    if (!messageText) {
        alert("Message cannot be empty.");
        return;
    }

    try {
        await addDoc(collection(db, "marketplace_messages"), {
            adId: adId,
            senderId: user.uid,
            senderEmail: user.email,
            receiverId: window.currentSellerId,
            receiverEmail: window.currentSellerEmail,
            message: messageText,
            createdAt: serverTimestamp()
        });

        alert("Message sent successfully!");
        document.getElementById("messageText").value = "";

    } catch (error) {
        console.error("Message error:", error);
        alert("Failed to send message.");
    }
};

/* =========================
   REPORT SYSTEM
========================= */
window.showReportModal = function() {
    document.getElementById("reportModal").style.display = "block";
};

window.closeModal = function() {
    document.getElementById("reportModal").style.display = "none";
};

window.submitReport = async function() {

    const reason = document.getElementById("reportReason").value;

    try {
        await addDoc(collection(db, "flaggedAds"), {
            adId,
            reason,
            timestamp: new Date().toISOString()
        });

        alert("Report submitted.");
        closeModal();

    } catch (error) {
        console.error("Report failed:", error);
        alert("Failed to submit report.");
    }
};

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
    loadAdDetails();
});
