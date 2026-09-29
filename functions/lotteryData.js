const { initializeApp, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

if (!getApps().length) {
    initializeApp();
}

const db = getFirestore();

/* =====================================================
   ROLLING TWO-MONTH WINDOW
===================================================== */

function getTwoMonthWindow() {

    const today = new Date();

    const endDate =
        new Date(today);

    endDate.setHours(
        23, 59, 59, 999
    );

    const startDate =
        new Date(today);

    startDate.setMonth(
        startDate.getMonth() - 2
    );

    startDate.setHours(
        0, 0, 0, 0
    );

    return {
        startDate,
        endDate
    };
}

/* =====================================================
   GET STORED LOTTERY DRAWS
===================================================== */

async function getLotteryDraws(gameId) {

    const {
        startDate,
        endDate
    } = getTwoMonthWindow();

    const snapshot =
        await db
            .collection("lottery_results")
            .doc(gameId)
            .collection("draws")
            .where(
                "drawDate",
                ">=",
                startDate
            )
            .where(
                "drawDate",
                "<=",
                endDate
            )
            .orderBy(
                "drawDate",
                "asc"
            )
            .get();

    return snapshot.docs.map(
        doc => ({
            id: doc.id,
            ...doc.data()
        })
    );
}

/* =====================================================
   CALCULATE LOTTERY STATISTICS
===================================================== */

function calculateLotteryStatistics(
    draws,
    game
) {

    const frequency = {};

    for (
        let number = 1;
        number <= game.mainMax;
        number++
    ) {
        frequency[number] = 0;
    }

    let totalNumbers = 0;
    let totalSum = 0;

    let oddCount = 0;
    let evenCount = 0;

    let lowCount = 0;
    let highCount = 0;

    let sumMin = null;
    let sumMax = null;

    let consecutivePairs = 0;

    const pairFrequency = {};
    const distribution = {};

    /* ---------------------------------------------
       NUMBER FREQUENCY
    --------------------------------------------- */

    draws.forEach(draw => {

        const numbers =
            Array.isArray(
                draw.mainNumbers
            )
                ? [...draw.mainNumbers]
                    .map(Number)
                    .filter(
                        number =>
                            number >= 1 &&
                            number <= game.mainMax
                    )
                : [];

        numbers.sort(
            (a, b) => a - b
        );

        let drawSum = 0;

        numbers.forEach(number => {

            frequency[number]++;

            totalNumbers++;

            drawSum += number;

            if (number % 2 === 0) {
                evenCount++;
            } else {
                oddCount++;
            }

            /*
               Low / High:
               Lower half = low
               Upper half = high
            */

            const midpoint =
                Math.floor(
                    game.mainMax / 2
                );

            if (number <= midpoint) {
                lowCount++;
            } else {
                highCount++;
            }
        });

        totalSum += drawSum;

        if (
            sumMin === null ||
            drawSum < sumMin
        ) {
            sumMin = drawSum;
        }

        if (
            sumMax === null ||
            drawSum > sumMax
        ) {
            sumMax = drawSum;
        }

        /* -----------------------------------------
           CONSECUTIVE NUMBERS
        ----------------------------------------- */

        for (
            let i = 1;
            i < numbers.length;
            i++
        ) {

            if (
                numbers[i] ===
                numbers[i - 1] + 1
            ) {
                consecutivePairs++;
            }
        }

        /* -----------------------------------------
           NUMBER PAIRS
        ----------------------------------------- */

        for (
            let i = 0;
            i < numbers.length;
            i++
        ) {

            for (
                let j = i + 1;
                j < numbers.length;
                j++
            ) {

                const pair =
                    `${numbers[i]}-${numbers[j]}`;

                pairFrequency[pair] =
                    (pairFrequency[pair] || 0) + 1;
            }
        }

        /* -----------------------------------------
           DISTRIBUTION BY DECADE
        ----------------------------------------- */

        numbers.forEach(number => {

            const bucketStart =
                Math.floor(
                    (number - 1) / 10
                ) * 10 + 1;

            const bucketEnd =
                Math.min(
                    bucketStart + 9,
                    game.mainMax
                );

            const bucket =
                `${bucketStart}-${bucketEnd}`;

            distribution[bucket] =
                (distribution[bucket] || 0) + 1;
        });
    });

    /* =================================================
       RECENT FREQUENCY
       Last 25% of available draws, minimum 1 draw
    ================================================= */

    const recentDrawCount =
        Math.max(
            1,
            Math.ceil(
                draws.length * 0.25
            )
        );

    const recentDraws =
        draws.slice(
            -recentDrawCount
        );

    const recentFrequency = {};

    for (
        let number = 1;
        number <= game.mainMax;
        number++
    ) {
        recentFrequency[number] = 0;
    }

    recentDraws.forEach(draw => {

        const numbers =
            Array.isArray(
                draw.mainNumbers
            )
                ? draw.mainNumbers
                : [];

        numbers.forEach(number => {

            number = Number(number);

            if (
                number >= 1 &&
                number <= game.mainMax
            ) {
                recentFrequency[number]++;
            }
        });
    });

    /* =================================================
       MISSING / OVERDUE NUMBERS
    ================================================= */

    const missingNumbers = [];

    for (
        let number = 1;
        number <= game.mainMax;
        number++
    ) {

        let drawsSinceSeen = draws.length;

        for (
            let i = draws.length - 1;
            i >= 0;
            i--
        ) {

            const numbers =
                Array.isArray(
                    draws[i].mainNumbers
                )
                    ? draws[i].mainNumbers
                        .map(Number)
                    : [];

            if (
                numbers.includes(number)
            ) {
                drawsSinceSeen =
                    draws.length - 1 - i;

                break;
            }
        }

        missingNumbers.push({
            number,
            drawsSinceSeen
        });
    }

    missingNumbers.sort(
        (a, b) =>
            b.drawsSinceSeen -
            a.drawsSinceSeen
    );

    /* =================================================
       SORTED FREQUENCIES
    ================================================= */

    const sortedByFrequency =
        Object.entries(frequency)
            .sort(
                (a, b) =>
                    b[1] - a[1] ||
                    Number(a[0]) -
                    Number(b[0])
            )
            .map(
                ([number, count]) => ({
                    number:
                        Number(number),
                    count
                })
            );

    const sortedRecentFrequency =
        Object.entries(
            recentFrequency
        )
            .sort(
                (a, b) =>
                    b[1] - a[1] ||
                    Number(a[0]) -
                    Number(b[0])
            )
            .map(
                ([number, count]) => ({
                    number:
                        Number(number),
                    count
                })
            );

    const commonPairs =
        Object.entries(pairFrequency)
            .sort(
                (a, b) =>
                    b[1] - a[1] ||
                    a[0].localeCompare(
                        b[0]
                    )
            )
            .slice(0, 20)
            .map(
                ([pair, count]) => ({
                    pair,
                    count
                })
            );

    /* =================================================
       BONUS FREQUENCY
    ================================================= */

    const bonusFrequency = {};

    if (game.bonus) {

        const bonusMax =
            game.bonusMax || 0;

        for (
            let number = 1;
            number <= bonusMax;
            number++
        ) {
            bonusFrequency[number] = 0;
        }

        draws.forEach(draw => {

            const bonus =
                Number(
                    draw.bonusNumber
                );

            if (
                bonus >= 1 &&
                bonus <= bonusMax
            ) {
                bonusFrequency[bonus]++;
            }
        });
    }

    /* =================================================
       AVERAGES
    ================================================= */

    const averageSum =
        draws.length
            ? totalSum /
              draws.length
            : 0;

    const averageOdd =
        draws.length
            ? oddCount /
              draws.length
            : 0;

    const averageEven =
        draws.length
            ? evenCount /
              draws.length
            : 0;

    const averageLow =
        draws.length
            ? lowCount /
              draws.length
            : 0;

    const averageHigh =
        draws.length
            ? highCount /
              draws.length
            : 0;

    return {

        drawCount:
            draws.length,

        startDate:
            draws.length
                ? draws[0].drawDate
                : null,

        endDate:
            draws.length
                ? draws[
                    draws.length - 1
                ].drawDate
                : null,

        frequency,

        recentFrequency,

        recentDrawCount,

        sortedByFrequency,

        sortedRecentFrequency,

        missingNumbers,

        totalNumbers,

        averageSum:
            Number(
                averageSum.toFixed(2)
            ),

        sumMin,

        sumMax,

        oddCount,

        evenCount,

        averageOdd:
            Number(
                averageOdd.toFixed(2)
            ),

        averageEven:
            Number(
                averageEven.toFixed(2)
            ),

        lowCount,

        highCount,

        averageLow:
            Number(
                averageLow.toFixed(2)
            ),

        averageHigh:
            Number(
                averageHigh.toFixed(2)
            ),

        consecutivePairs,

        commonPairs,

        distribution,

        bonusFrequency

    };
}

module.exports = {

    getTwoMonthWindow,

    getLotteryDraws,

    calculateLotteryStatistics

};
