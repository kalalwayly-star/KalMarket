import { db, auth } from "./firebase-config.js";

import {
    doc,
    getDoc,
    collection,
    addDoc,
    serverTimestamp,
    updateDoc,
    increment
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
        /* Increase ad views */
await updateDoc(adRef, {
    views: increment(1)
});

/* Reload updated data */
const updatedSnap = await getDoc(adRef);
const updatedAd = updatedSnap.data();

/* Replace old ad object */
Object.assign(ad, updatedAd);

        // Title
        document.getElementById("adTitle").innerText = ad.title || "No Title";

        // Category
        document.getElementById("adCategory").innerText = ad.category || "";

        // Price
        document.getElementById("adPrice").innerText = `$${ad.price || "0"}`;

        // Location
        document.getElementById("adLocation").innerText = ad.location || "Unknown";
        
        if (document.getElementById("viewCount")) {
    document.getElementById("viewCount").innerText = ad.views || 0;
}
        // Description
        document.getElementById("adDesc").innerText = ad.description || "No description provided.";

        // Images
// =========================
// IMAGE GALLERY SYSTEM
// =========================

const mainImage = document.getElementById("mainAdImage");
const thumbnailGallery = document.getElementById("thumbnailGallery");
const fallback = "https://dummyimage.com/600x400/cccccc/000000&text=No+Image";

let images = [];

/* CASE 1: array */
if (Array.isArray(ad.image)) {
    images = ad.image;
}

/* CASE 2: object */
else if (ad.image && typeof ad.image === "object") {

    if (typeof ad.image.main === "string") {
        images.push(ad.image.main);
    }

    if (Array.isArray(ad.image.gallery)) {
        images.push(...ad.image.gallery);
    }

    if (typeof ad.image.gallery === "string") {
        images.push(...ad.image.gallery.split(","));
    }
}

/* Clean bad images */
images = images.filter(img =>
    typeof img === "string" &&
    img.startsWith("http")
);

/* Fallback */
if (images.length === 0) {
    images = [fallback];
}

/* Set main image */
mainImage.src = images[0];

/* Build thumbnails */
thumbnailGallery.innerHTML = "";

images.forEach((imgUrl, index) => {
    const thumb = document.createElement("img");
    thumb.src = imgUrl;

    if (index === 0) {
        thumb.classList.add("active");
    }

    thumb.addEventListener("click", () => {
        mainImage.src = imgUrl;

        document.querySelectorAll("#thumbnailGallery img")
            .forEach(img => img.classList.remove("active"));

        thumb.classList.add("active");
    });

    thumbnailGallery.appendChild(thumb);
});
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

