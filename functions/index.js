const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/https");
const { onSchedule } = require("firebase-functions/scheduler");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

setGlobalOptions({
    maxInstances: 10
});

initializeApp();

const db = getFirestore();

/* =====================================================
   LOTTERY CONFIGURATION
===================================================== */

const LOTTERY_GAMES = {
    lottoMax: {
        name: "Lotto Max",
        mainCount: 7,
        mainMax: 52,
        bonusMax: 52,
        bonus: true
    },

    lotto649: {
        name: "Lotto 6/49",
        mainCount: 6,
        mainMax: 49,
        bonusMax: 49,
        bonus: true
    },

    dailyGrand: {
        name: "Daily Grand",
        mainCount: 5,
        mainMax: 49,
        bonusMax: 49,
        bonus: true,
        bonusMax: 7
    },

    powerball: {
        name: "Powerball",
        mainCount: 5,
        mainMax: 69,
        bonus: true,
        bonusMax: 26
    },

    megaMillions: {
        name: "Mega Millions",
        mainCount: 5,
        mainMax: 70,
        bonus: true,
        bonusMax: 24
    }
};


/* =====================================================
   TEST FUNCTION
===================================================== */

exports.lotteryTest = onRequest((request, response) => {

    response.json({
        success: true,
        message: "KalMarket Lottery backend is alive!",
        games: Object.keys(LOTTERY_GAMES)
    });

});

/* =====================================================
   LOTTERY HISTORY TEST
===================================================== */

const {
    getTwoMonthWindow,
    getLotteryDraws,
    calculateLotteryStatistics
} = require("./lotteryData");


exports.lotteryHistoryTest = onRequest(
    async (request, response) => {

        const origin = request.headers.origin;

        if (
            origin === "https://kalmarket.net" ||
            origin === "https://www.kalmarket.net"
        ) {
            response.set("Access-Control-Allow-Origin", origin);
        }

        response.set(
            "Access-Control-Allow-Methods",
            "GET, OPTIONS"
        );

        response.set(
            "Access-Control-Allow-Headers",
            "Content-Type"
        );

        if (request.method === "OPTIONS") {
            response.status(204).send("");
            return;
        }

        try {

            const gameId =
                request.query.game || "lottoMax";

            const game =
                LOTTERY_GAMES[gameId];

            if (!game) {

                response.status(400).json({
                    success: false,
                    error: "Unknown lottery game."
                });

                return;
            }


            const draws =
                await getLotteryDraws(gameId);


            const statistics =
                calculateLotteryStatistics(
                    draws,
                    game
                );


            const window =
                getTwoMonthWindow();


            response.json({

                success: true,

                game: gameId,

                window: {
                    start:
                        window.startDate.toISOString(),

                    end:
                        window.endDate.toISOString()
                },

                statistics

            });

        } catch (error) {

            console.error(
                "Lottery history error:",
                error
            );

            response.status(500).json({

                success: false,

                error:
                    error.message

            });

        }

    }
);

/* =====================================================
   LOTTERY FIRESTORE SYNC
===================================================== */

const {
    fetchAllLotteryResults
} = require("./lotterySources");

exports.lotteryUpdateTest = onRequest(
    async (request, response) => {

        try {

            const results =
                await fetchAllLotteryResults();

            let saved = 0;

            for (const result of results) {

                const drawDate =
                    new Date(result.drawDate);

                const dateId =
                    drawDate
                        .toISOString()
                        .slice(0, 10);

                const docRef =
                    db
                        .collection("lottery_results")
                        .doc(result.gameId)
                        .collection("draws")
                        .doc(dateId);

                await docRef.set({

                    gameId:
                        result.gameId,

                    drawDate,

                    mainNumbers:
                        result.mainNumbers,

                    bonusNumber:
                        result.bonusNumber ?? null,

                    source:
                        result.source || "Official",

                    updatedAt:
                        new Date()

                }, { merge: true });

                saved++;
            }

            response.json({

                success: true,

                fetched:
                    results.length,

                saved

            });

        } catch (error) {

            console.error(
                "Lottery update error:",
                error
            );

            response.status(500).json({

                success: false,

                error:
                    error.message

            });

        }

    }
);

/* =====================================================
   AUTOMATIC DAILY LOTTERY UPDATE
===================================================== */

exports.lotteryDailyUpdate = onSchedule(
    "every day 03:00",
    async () => {

        try {

            const results =
                await fetchAllLotteryResults();

            let saved = 0;

            for (const result of results) {

                const drawDate =
                    new Date(result.drawDate);

                const dateId =
                    drawDate
                        .toISOString()
                        .slice(0, 10);

                const docRef =
                    db
                        .collection("lottery_results")
                        .doc(result.gameId)
                        .collection("draws")
                        .doc(dateId);

                await docRef.set({

                    gameId:
                        result.gameId,

                    drawDate,

                    mainNumbers:
                        result.mainNumbers,

                    bonusNumber:
                        result.bonusNumber ?? null,

                    source:
                        result.source || "Official",

                    updatedAt:
                        new Date()

                }, { merge: true });

                saved++;
            }

            console.log(
                `Lottery daily update complete: ${saved} draws saved.`
            );

        } catch (error) {

            console.error(
                "Lottery daily update error:",
                error
            );

            throw error;
        }
    }
);
