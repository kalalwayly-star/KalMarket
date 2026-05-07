// storage.js
// SAFE helper functions for Marketplace

/* =========================
   GET USER ADS FROM CACHE
========================= */
function getCachedAds() {
    return JSON.parse(localStorage.getItem("cached_ads")) || [];
}

/* =========================
   SAVE CACHE
========================= */
function saveCachedAds(adsArray) {
    localStorage.setItem("cached_ads", JSON.stringify(adsArray));
}

/* =========================
   FIND AD BY ID
========================= */
function getCachedAdById(id) {
    const ads = getCachedAds();

    return ads.find(ad =>
        String(ad.firebaseId) === String(id)
    );
}

/* =========================
   MODERATION QUEUE
========================= */
function sendToModerationQueue(ad, fraudData = {}) {

    const queue =
        JSON.parse(localStorage.getItem("moderationQueue")) || [];

    queue.push({
        ...ad,

        fraudScore: fraudData.score || 0,
        fraudReasons: fraudData.reasons || [],
        riskLevel: fraudData.riskLevel || "low",

        createdAt: Date.now()
    });

    localStorage.setItem(
        "moderationQueue",
        JSON.stringify(queue)
    );
}

/* =========================
   EXPOSE TO WINDOW
========================= */
window.getCachedAds = getCachedAds;
window.saveCachedAds = saveCachedAds;
window.getCachedAdById = getCachedAdById;
window.sendToModerationQueue = sendToModerationQueue;
