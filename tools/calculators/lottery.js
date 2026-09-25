/* =====================================================
   KALMARKET LOTTERY CALCULATOR
   Lotto Max
   Lotto 6/49
   Daily Grand
   Powerball
   Mega Millions
===================================================== */


/* =====================================================
   LOTTERY RULES
===================================================== */

const LOTTERY_GAMES = {

    lottoMax: {
        name: "Lotto Max",
        mainCount: 7,
        mainMax: 52,
        bonus: false,
        country: "Canada",
        description: "7 numbers from 1 to 52."
    },

    lotto649: {
        name: "Lotto 6/49",
        mainCount: 6,
        mainMax: 49,
        bonus: false,
        country: "Canada",
        description: "6 numbers from 1 to 49."
    },

    dailyGrand: {
        name: "Daily Grand",
        mainCount: 5,
        mainMax: 49,
        bonus: true,
        bonusName: "Grand Number",
        bonusMax: 7,
        country: "Canada",
        description: "5 numbers from 1 to 49 + 1 Grand Number from 1 to 7."
    },

    powerball: {
        name: "Powerball",
        mainCount: 5,
        mainMax: 69,
        bonus: true,
        bonusName: "Powerball",
        bonusMax: 26,
        country: "USA",
        description: "5 numbers from 1 to 69 + 1 Powerball from 1 to 26."
    },

    megaMillions: {
        name: "Mega Millions",
        mainCount: 5,
        mainMax: 70,
        bonus: true,
        bonusName: "Mega Ball",
        bonusMax: 24,
        country: "USA",
        description: "5 numbers from 1 to 70 + 1 Mega Ball from 1 to 24."
    }

};


/* =====================================================
   DOM
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const gameSelect = document.getElementById("lotteryGame");
    const setsSelect = document.getElementById("numberOfSets");
    const generateButton = document.getElementById("generateButton");

    if (!gameSelect || !setsSelect || !generateButton) {

        console.error(
            "Lottery Calculator: Required HTML elements were not found."
        );

        return;
    }


    updateGameInfo();


    gameSelect.addEventListener("change", updateGameInfo);

    generateButton.addEventListener(
        "click",
        generateLotteryNumbers
    );

});


/* =====================================================
   UPDATE GAME INFORMATION
===================================================== */

function updateGameInfo() {

    const gameSelect = document.getElementById("lotteryGame");
    const gameInfo = document.getElementById("gameInfo");

    if (!gameSelect || !gameInfo) {
        return;
    }

    const game = LOTTERY_GAMES[gameSelect.value];

    if (!game) {
        gameInfo.innerHTML = "";
        return;
    }

    gameInfo.innerHTML = `
        <div class="game-info-title">
            ${game.name}
        </div>

        <div class="game-info-details">
            ${game.description}
        </div>

        <div class="game-info-country">
            ${game.country}
        </div>
    `;
}


/* =====================================================
   RANDOM NUMBER GENERATOR
===================================================== */

function getRandomNumber(max) {

    return Math.floor(Math.random() * max) + 1;

}


/* =====================================================
   GENERATE UNIQUE NUMBERS
===================================================== */

function generateUniqueNumbers(count, max) {

    const numbers = new Set();

    while (numbers.size < count) {

        numbers.add(
            getRandomNumber(max)
        );

    }

    return Array.from(numbers).sort(
        (a, b) => a - b
    );

}


/* =====================================================
   GENERATE BONUS NUMBER
===================================================== */

function generateBonusNumber(max) {

    return getRandomNumber(max);

}


/* =====================================================
   GENERATE LOTTERY NUMBERS
===================================================== */

function generateLotteryNumbers() {

    const gameSelect = document.getElementById("lotteryGame");
    const setsSelect = document.getElementById("numberOfSets");
    const results = document.getElementById("results");
    const statistics = document.getElementById("statistics");

    if (!gameSelect || !setsSelect || !results) {
        return;
    }

    const game = LOTTERY_GAMES[gameSelect.value];

    if (!game) {
        return;
    }

    const numberOfSets =
        Number(setsSelect.value) || 1;


    const generatedSets = [];


    /* ================================================
       GENERATE SETS
    ================================================= */

    for (let i = 0; i < numberOfSets; i++) {

        const mainNumbers =
            generateUniqueNumbers(
                game.mainCount,
                game.mainMax
            );

        let bonusNumber = null;

        if (game.bonus) {

            bonusNumber =
                generateBonusNumber(
                    game.bonusMax
                );

        }

        generatedSets.push({
            mainNumbers,
            bonusNumber
        });

    }


    /* ================================================
       DISPLAY RESULTS
    ================================================= */

    results.innerHTML = "";

    const title = document.createElement("h2");

    title.textContent =
        `${game.name} — Generated Numbers`;

    results.appendChild(title);


    generatedSets.forEach(
        (set, index) => {

            const row =
                document.createElement("div");

            row.className =
                "lottery-result-row";


            const setLabel =
                document.createElement("div");

            setLabel.className =
                "lottery-set-label";

            setLabel.textContent =
                `Set ${index + 1}`;

            row.appendChild(setLabel);


            const numbers =
                document.createElement("div");

            numbers.className =
                "lottery-numbers";


            set.mainNumbers.forEach(
                number => {

                    const ball =
                        document.createElement("span");

                    ball.className =
                        "lottery-ball";

                    ball.textContent =
                        number;

                    numbers.appendChild(ball);

                }
            );


            if (set.bonusNumber !== null) {

                const bonus =
                    document.createElement("span");

                bonus.className =
                    "lottery-ball lottery-bonus";

                bonus.textContent =
                    set.bonusNumber;

                numbers.appendChild(bonus);

            }


            row.appendChild(numbers);

            results.appendChild(row);

        }
    );


    /* ================================================
       STATISTICS
    ================================================= */

    displayStatistics(
        generatedSets,
        game,
        statistics
    );

}


/* =====================================================
   STATISTICS
===================================================== */

function displayStatistics(
    generatedSets,
    game,
    statistics
) {

    if (!statistics) {
        return;
    }


    const allNumbers = [];


    generatedSets.forEach(
        set => {

            set.mainNumbers.forEach(
                number => {

                    allNumbers.push(number);

                }
            );

        }
    );


    if (!allNumbers.length) {
        statistics.innerHTML = "";
        return;
    }


    const sum =
        allNumbers.reduce(
            (total, number) =>
                total + number,
            0
        );


    const average =
        sum / allNumbers.length;


    const odd =
        allNumbers.filter(
            number => number % 2 !== 0
        ).length;


    const even =
        allNumbers.length - odd;


    const lowest =
        Math.min(...allNumbers);


    const highest =
        Math.max(...allNumbers);


    statistics.innerHTML = `

        <h2>Quick Statistics</h2>

        <div class="statistics-grid">

            <div class="stat-box">
                <strong>${lowest}</strong>
                <span>Lowest</span>
            </div>

            <div class="stat-box">
                <strong>${highest}</strong>
                <span>Highest</span>
            </div>

            <div class="stat-box">
                <strong>${average.toFixed(1)}</strong>
                <span>Average</span>
            </div>

            <div class="stat-box">
                <strong>${odd}</strong>
                <span>Odd Numbers</span>
            </div>

            <div class="stat-box">
                <strong>${even}</strong>
                <span>Even Numbers</span>
            </div>

            <div class="stat-box">
                <strong>${sum}</strong>
                <span>Total</span>
            </div>

        </div>
    `;

}
