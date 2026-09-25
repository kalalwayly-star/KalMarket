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


function displayStatistics(
    generatedSets,
    game,
    statistics
) {

    if (!statistics) {
        return;
    }

    const allNumbers = [];

    generatedSets.forEach(set => {

        set.mainNumbers.forEach(number => {
            allNumbers.push(number);
        });

    });

    if (!allNumbers.length) {
        statistics.innerHTML = "";
        return;
    }


    /* =========================
       BASIC MATHEMATICAL DATA
    ========================= */

    const sum =
        allNumbers.reduce(
            (total, number) => total + number,
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

    const spread =
        highest - lowest;


    /* =========================
       LOW / HIGH DISTRIBUTION
    ========================= */

    const midpoint =
        Math.floor(game.mainMax / 2);

    const lowNumbers =
        allNumbers.filter(
            number => number <= midpoint
        ).length;

    const highNumbers =
        allNumbers.filter(
            number => number > midpoint
        ).length;


    /* =========================
       NUMBER FREQUENCY
    ========================= */

    const frequency = {};

    allNumbers.forEach(number => {

        frequency[number] =
            (frequency[number] || 0) + 1;

    });


    const repeatedNumbers =
        Object.entries(frequency)
            .filter(
                ([number, count]) => count > 1
            )
            .sort(
                (a, b) =>
                    Number(a[0]) - Number(b[0])
            );


    let repeatedText = "None";

    if (repeatedNumbers.length) {

        repeatedText =
            repeatedNumbers
                .map(
                    ([number, count]) =>
                        `${number} (${count} times)`
                )
                .join(", ");

    }


    /* =========================
       SET-BY-SET ANALYSIS
    ========================= */

    let setAnalysis = "";

    generatedSets.forEach(
        (set, index) => {

            const numbers =
                [...set.mainNumbers].sort(
                    (a, b) => a - b
                );

            const setSum =
                numbers.reduce(
                    (total, number) =>
                        total + number,
                    0
                );

            const setOdd =
                numbers.filter(
                    number => number % 2 !== 0
                ).length;

            const setEven =
                numbers.length - setOdd;

            const setLow =
                numbers.filter(
                    number => number <= midpoint
                ).length;

            const setHigh =
                numbers.length - setLow;

            const consecutivePairs = [];

            for (
                let i = 1;
                i < numbers.length;
                i++
            ) {

                if (
                    numbers[i] ===
                    numbers[i - 1] + 1
                ) {

                    consecutivePairs.push(
                        `${numbers[i - 1]}-${numbers[i]}`
                    );

                }

            }

            const consecutiveText =
                consecutivePairs.length
                    ? consecutivePairs.join(", ")
                    : "None";


            setAnalysis += `

                <div class="set-analysis-box">

                    <h3>Set ${index + 1}</h3>

                    <div class="set-analysis-row">
                        <span>Numbers</span>
                        <strong>
                            ${numbers.join(" - ")}
                        </strong>
                    </div>

                    <div class="set-analysis-row">
                        <span>Total</span>
                        <strong>${setSum}</strong>
                    </div>

                    <div class="set-analysis-row">
                        <span>Odd / Even</span>
                        <strong>
                            ${setOdd} Odd / ${setEven} Even
                        </strong>
                    </div>

                    <div class="set-analysis-row">
                        <span>Low / High</span>
                        <strong>
                            ${setLow} Low / ${setHigh} High
                        </strong>
                    </div>

                    <div class="set-analysis-row">
                        <span>Consecutive Numbers</span>
                        <strong>
                            ${consecutiveText}
                        </strong>
                    </div>

                </div>

            `;

        }
    );


    /* =========================
       DISPLAY MATHEMATICAL ANALYSIS
    ========================= */

    statistics.innerHTML = `

        <div class="mathematical-analysis">

            <h2>📊 Mathematical Number Analysis</h2>

            <p class="analysis-intro">
                These generated number sets are created using
                mathematical calculations and numerical
                distribution patterns. The analysis below
                explains how the generated numbers are distributed.
            </p>


            <div class="statistics-grid">

                <div class="stat-box">
                    <strong>${lowest}</strong>
                    <span>Lowest Number</span>
                    <small>
                        Smallest number generated
                    </small>
                </div>


                <div class="stat-box">
                    <strong>${highest}</strong>
                    <span>Highest Number</span>
                    <small>
                        Largest number generated
                    </small>
                </div>


                <div class="stat-box">
                    <strong>${average.toFixed(1)}</strong>
                    <span>Average</span>
                    <small>
                        Average of all main numbers
                    </small>
                </div>


                <div class="stat-box">
                    <strong>${odd}</strong>
                    <span>Odd Numbers</span>
                    <small>
                        Numbers that cannot be divided evenly by 2
                    </small>
                </div>


                <div class="stat-box">
                    <strong>${even}</strong>
                    <span>Even Numbers</span>
                    <small>
                        Numbers that can be divided evenly by 2
                    </small>
                </div>


                <div class="stat-box">
                    <strong>${lowNumbers}</strong>
                    <span>Low Numbers</span>
                    <small>
                        Numbers from 1 to ${midpoint}
                    </small>
                </div>


                <div class="stat-box">
                    <strong>${highNumbers}</strong>
                    <span>High Numbers</span>
                    <small>
                        Numbers from ${midpoint + 1} to ${game.mainMax}
                    </small>
                </div>


                <div class="stat-box">
                    <strong>${spread}</strong>
                    <span>Number Spread</span>
                    <small>
                        Difference between highest and lowest
                    </small>
                </div>


                <div class="stat-box">
                    <strong>${sum}</strong>
                    <span>Total of All Numbers</span>
                    <small>
                        Combined total of all generated numbers
                    </small>
                </div>


                <div class="stat-box">
                    <strong>
                        ${repeatedNumbers.length}
                    </strong>
                    <span>Repeated Numbers</span>
                    <small>
                        Numbers appearing in more than one set
                    </small>
                </div>

            </div>


            <div class="repeated-numbers-box">

                <h3>🔁 Repeated Numbers Between Sets</h3>

                <p>
                    ${repeatedText}
                </p>

            </div>


            <div class="set-analysis">

                <h3>📐 Analysis of Each Generated Set</h3>

                ${setAnalysis}

            </div>


            <div class="analysis-explanation">

                <h3>How to Read This Analysis</h3>

                <p>
                    <strong>Odd / Even:</strong>
                    Shows how many odd and even numbers are in
                    the generated numbers.
                </p>

                <p>
                    <strong>Low / High:</strong>
                    Shows how the numbers are distributed between
                    the lower and upper half of the game's number range.
                </p>

                <p>
                    <strong>Number Spread:</strong>
                    Shows the distance between the smallest and
                    largest generated numbers.
                </p>

                <p>
                    <strong>Consecutive Numbers:</strong>
                    Shows whether two or more numbers are next
                    to each other, such as 12 and 13.
                </p>

                <p>
                    <strong>Repeated Numbers:</strong>
                    Shows numbers that appeared in more than one
                    generated set.
                </p>

            </div>


            <div class="lottery-mathematical-disclaimer">

                <strong>
                    Important:
                </strong>

                These numbers are mathematically generated using
                numerical calculations and statistical distribution
                methods for analysis and entertainment.

                Mathematical analysis cannot predict a random
                lottery draw or guarantee winning numbers.

                Each lottery draw is independent and random.

            </div>

        </div>

    `;

}
