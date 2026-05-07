// fraudDetection.js
// ==========================================
// Marketplace Fraud Detection System
// Compatible with:
// - Firebase Firestore
// - Firebase Auth
// - Your moderationQueue
// - LocalStorage backup
// ==========================================

import { db } from "./firebase-config.js";
import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

/* ==========================================
   MAIN FRAUD CHECK FUNCTION
========================================== */
export async function analyzeAdForFraud(adData) {

    let fraudScore = 0;
    let fraudReasons = [];

    const title = (adData.title || "").toLowerCase();
    const description = (adData.description || "").toLowerCase();
    const price = parseFloat(adData.price) || 0;
    const category = adData.category || "";

    /* ==========================================
       PRICE CHECK
    ========================================== */
    if (price > 0) {

        // Extremely low prices trigger suspicion
        if (
            (category === "Cars & Trucks" && price < 500) ||
            (category === "Real Estate" && price < 1000) ||
            (category === "Electronics" && price < 20)
        ) {
            fraudScore += 35;
            fraudReasons.push("Suspiciously low price");
        }

        // Unrealistically high pricing
        if (price > 10000000) {
            fraudScore += 20;
            fraudReasons.push("Unrealistic price");
        }
    }

    /* ==========================================
       KEYWORD CHECK
    ========================================== */
    const riskyKeywords = [
        "western union",
        "bitcoin only",
        "crypto only",
        "wire transfer",
        "gift card",
        "pay first",
        "no meeting",
        "urgent sale",
        "act fast",
        "limited offer",
        "whatsapp only",
        "telegram only",
        "deposit first"
    ];

    riskyKeywords.forEach(keyword => {
        if (title.includes(keyword) || description.includes(keyword)) {
            fraudScore += 15;
            fraudReasons.push(`Suspicious keyword: ${keyword}`);
        }
    });

    /* ==========================================
       CONTACT AVOIDANCE
    ========================================== */
    if (
        description.includes("email me privately") ||
        description.includes("text only") ||
        description.includes("outside platform")
    ) {
        fraudScore += 20;
        fraudReasons.push("Attempts to move communication off-platform");
    }

    /* ==========================================
       DUPLICATE / SPAM TITLE CHECK
    ========================================== */
    const spamPatterns = [
        "make money fast",
        "guaranteed income",
        "free iphone",
        "100% profit"
    ];

    spamPatterns.forEach(pattern => {
        if (title.includes(pattern)) {
            fraudScore += 25;
            fraudReasons.push(`Spam pattern detected: ${pattern}`);
        }
    });

    /* ==========================================
       IMAGE CHECK
    ========================================== */
    if (!adData.image || adData.image.length === 0) {
        fraudScore += 10;
        fraudReasons.push("No images uploaded");
    }

    /* ==========================================
       FINAL RISK LEVEL
    ========================================== */
    let riskLevel = "Low";

    if (fraudScore >= 70) {
        riskLevel = "High";
    } else if (fraudScore >= 40) {
        riskLevel = "Medium";
    }

    /* ==========================================
       RESULT OBJECT
    ========================================== */
    const fraudResult = {
        score: fraudScore,
        reasons: fraudReasons,
        riskLevel
    };

    /* ==========================================
       AUTO MODERATION
    ========================================== */
    if (fraudScore >= 40) {
        await sendToModerationQueue(adData, fraudResult);
    }

    return fraudResult;
}

/* ==========================================
   SEND TO MODERATION QUEUE
========================================== */
async function sendToModerationQueue(adData, fraudResult) {

    const moderationItem = {
        ...adData,
        fraudScore: fraudResult.score,
        fraudReasons: fraudResult.reasons,
        riskLevel: fraudResult.riskLevel,
        createdAt: new Date().toISOString(),
        reviewed: false
    };

    try {
        // Firebase moderation collection
        await addDoc(collection(db, "moderationQueue"), moderationItem);

        console.log("Ad sent to Firebase moderation queue");

    } catch (error) {

        console.error("Firebase moderation failed, saving locally:", error);

        // Local backup
        const queue = JSON.parse(localStorage.getItem("moderationQueue")) || [];
        queue.push(moderationItem);
        localStorage.setItem("moderationQueue", JSON.stringify(queue));
    }
}

/* ==========================================
   USER TRUST SCORE SYSTEM
========================================== */
export function calculateUserTrust(userData = {}) {

    let trustScore = 100;

    if (userData.flaggedAds > 0) {
        trustScore -= userData.flaggedAds * 15;
    }

    if (userData.deletedAds > 0) {
        trustScore -= userData.deletedAds * 10;
    }

    if (userData.accountAgeDays < 7) {
        trustScore -= 15;
    }

    if (userData.successfulSales > 10) {
        trustScore += 10;
    }

    // Clamp score
    trustScore = Math.max(0, Math.min(100, trustScore));

    return trustScore;
}
