const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

admin.initializeApp();

setGlobalOptions({ maxInstances: 10 });


// Test function
exports.kalMarketTest = onRequest((request, response) => {
  logger.info("KalMarket Functions are working!");
  response.send("KalMarket Firebase Functions are alive!");
});


// Weekly reminder test scheduler
exports.weeklyKalMarketReminder = onSchedule(
  {
    schedule: "every sunday 10:00",
    timeZone: "America/Winnipeg",
  },
  async () => {

    const db = admin.firestore();

    const usersSnapshot = await db
      .collection("users")
      .get();

    logger.info(
      `Found ${usersSnapshot.size} users`
    );

    usersSnapshot.forEach((doc) => {
      logger.info(
        `User reminder check: ${doc.id}`
      );
    });

    return null;
  }
);
