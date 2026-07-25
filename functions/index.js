/**
 * Import function triggers from their respective submodules.
 */

const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

setGlobalOptions({ maxInstances: 10 });

exports.kalMarketTest = onRequest((request, response) => {
  logger.info("KalMarket Functions are working!");
  response.send("KalMarket Firebase Functions are alive!");
});
