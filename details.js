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
const fallback = "dummyimage.com";
let images = [];

// CASE 1: array of images (Using ad.image instead of ad.images)
if (Array.isArray(ad.image)) {
    images = ad.image;
}

// CASE 2: object with main + gallery
else if (ad.image && typeof ad.image === "object") {
    if (typeof ad.image.main === "string") {
        images.push(ad.image.main);
    }

    if (Array.isArray(ad.image.gallery)) {
        images.push(...ad.image.gallery);
    }

    // sometimes gallery stored as string
    if (typeof ad.image.gallery === "string") {
        images.push(...ad.image.gallery.split(","));
    }
}

// clean invalid values
images = images.filter(img => typeof img === "string" && img.startsWith("http"));

if (images.length === 0) {
    images = [fallback];
}

imageContainer.innerHTML = images.map(img => `
    <img src="${img}" 
        style="width:100%; max-height:500px; object-fit:cover; margin-bottom:10px; border-radius:10px;">
`).join("");


        // Store seller info globally
        window.currentSellerId = ad.userId;
        window.currentSellerEmail = ad.userEmail;

        /* ========================================================
           CRITICAL FIX: RUN THE PROBE HERE, RIGHT AFTER IMAGES ARE INJECTED
        ======================================================== */
        const data = await probeimageurls();
        console.log("Probed Image Data:", data);

    } catch (error) {
        console.error("Error loading ad:", error);
        alert("Failed to load ad details.");
    }
}

/* =========================
   SEND MESSAGE
========================= */
window.sendMessage = async function () {

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
            adTitle: document.getElementById("adTitle").innerText || "",
            senderId: user.uid,
            senderEmail: user.email,
            receiverId: window.currentSellerId,
            receiverEmail: window.currentSellerEmail,
            message: messageText,
            createdAt: serverTimestamp(),
            status: "sent"
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
   IMAGE PROBER FUNCTIONS
========================= */
async function probeimageurls() { 
    const images = Array.from(document.querySelectorAll('img')); 
    const results = []; 
    for (const img of images) { 
        results.push({ 
            src: img.src, 
            currentsrc: img.currentSrc, 
            naturalwidth: img.naturalWidth, 
            complete: img.complete, 
            error: img.naturalWidth === 0 && img.complete 
        }); 
    } 
    const perfentries = performance.getEntriesByType("resource")
        .filter(e => e.initiatorType === "img")
        .map(e => ({ name: e.name, duration: e.duration })); 
        
    return { imagestates: results, resourceentries: perfentries }; 
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
    loadAdDetails();
});

