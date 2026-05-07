// trustSystem.js
// ==========================================
// Full Marketplace User Trust System
// Works with:
// - Firebase Auth
// - Firestore
// - fraudDetection.js
// - admin.js
// - post.js
// ==========================================

import { db } from "./firebase-config.js";
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    increment,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

/* ==========================================
   DEFAULT TRUST PROFILE
========================================== */
function createDefaultTrustProfile(user) {
    return {
        uid: user.uid,
        email: user.email || "",
        trustScore: 50,              // Start neutral
        flaggedCount: 0,
        approvedAds: 0,
        deletedAds: 0,
        successfulSales: 0,
        reportsReceived: 0,
        accountCreated: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        riskLevel: "Medium"
    };
}

/* ==========================================
   GET USER TRUST PROFILE
========================================== */
export async function getUserTrustProfile(user) {

    if (!user || !user.uid) return null;

    const userRef = doc(db, "userTrustScores", user.uid);

    try {
        const snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
            return snapshot.data();
        }

        // Create profile if missing
        const newProfile = createDefaultTrustProfile(user);

        await setDoc(userRef, {
            ...newProfile,
            createdAt: serverTimestamp()
        });

        return newProfile;

    } catch (error) {
        console.error("Error loading trust profile:", error);
        return createDefaultTrustProfile(user);
    }
}

/* ==========================================
   UPDATE TRUST SCORE AFTER FRAUD CHECK
========================================== */
export async function updateTrustScore(user, fraudResult) {

    if (!user || !user.uid) return null;

    const userRef = doc(db, "userTrustScores", user.uid);

    try {
        const currentProfile = await getUserTrustProfile(user);

        let trustScore = currentProfile.trustScore ?? 50;
        let flaggedCount = currentProfile.flaggedCount ?? 0;
        let approvedAds = currentProfile.approvedAds ?? 0;
        let deletedAds = currentProfile.deletedAds ?? 0;
        let reportsReceived = currentProfile.reportsReceived ?? 0;

        /* ==========================================
           TRUST SCORE RULES
        ========================================== */

        // HIGH RISK
        if (fraudResult.score >= 70) {
            trustScore -= 20;
            flaggedCount += 1;
        }

        // MEDIUM RISK
        else if (fraudResult.score >= 40) {
            trustScore -= 10;
        }

        // SAFE AD
        else {
            trustScore += 5;
            approvedAds += 1;
        }

        /* ==========================================
           EXTRA PENALTIES
        ========================================== */

        if (reportsReceived >= 5) {
            trustScore -= 10;
        }

        if (deletedAds >= 3) {
            trustScore -= 15;
        }

        /* ==========================================
           CLAMP SCORE
        ========================================== */
        trustScore = Math.max(0, Math.min(100, trustScore));

        /* ==========================================
           DETERMINE RISK LEVEL
        ========================================== */
        let riskLevel = "Low";

        if (trustScore < 30) {
            riskLevel = "High";
        } else if (trustScore < 60) {
            riskLevel = "Medium";
        }

        /* ==========================================
           SAVE TO FIRESTORE
        ========================================== */
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email || "",
            trustScore,
            flaggedCount,
            approvedAds,
            deletedAds,
            successfulSales: currentProfile.successfulSales || 0,
            reportsReceived,
            riskLevel,
            lastUpdated: new Date().toISOString(),
            updatedAt: serverTimestamp()
        }, { merge: true });

        return {
            trustScore,
            flaggedCount,
            approvedAds,
            deletedAds,
            reportsReceived,
            riskLevel
        };

    } catch (error) {
        console.error("Trust score update failed:", error);
        return null;
    }
}

/* ==========================================
   REPORT USER
========================================== */
export async function reportUser(userId) {

    if (!userId) return;

    const userRef = doc(db, "userTrustScores", userId);

    try {
        await updateDoc(userRef, {
            reportsReceived: increment(1),
            lastUpdated: new Date().toISOString(),
            updatedAt: serverTimestamp()
        });

    } catch (error) {
        console.error("Error reporting user:", error);
    }
}

/* ==========================================
   RECORD SUCCESSFUL SALE
========================================== */
export async function recordSuccessfulSale(userId) {

    if (!userId) return;

    const userRef = doc(db, "userTrustScores", userId);

    try {
        await updateDoc(userRef, {
            successfulSales: increment(1),
            trustScore: increment(3),
            lastUpdated: new Date().toISOString(),
            updatedAt: serverTimestamp()
        });

    } catch (error) {
        console.error("Error recording sale:", error);
    }
}

/* ==========================================
   RECORD DELETED AD
========================================== */
export async function recordDeletedAd(userId) {

    if (!userId) return;

    const userRef = doc(db, "userTrustScores", userId);

    try {
        await updateDoc(userRef, {
            deletedAds: increment(1),
            trustScore: increment(-10),
            lastUpdated: new Date().toISOString(),
            updatedAt: serverTimestamp()
        });

    } catch (error) {
        console.error("Error recording deleted ad:", error);
    }
}

/* ==========================================
   TRUST BADGE DISPLAY
========================================== */
export function getTrustBadge(trustScore) {

    if (trustScore >= 80) {
        return {
            label: "Trusted Seller",
            color: "green"
        };
    }

    if (trustScore >= 50) {
        return {
            label: "Standard Seller",
            color: "orange"
        };
    }

    return {
        label: "High Risk Seller",
        color: "red"
    };
}
