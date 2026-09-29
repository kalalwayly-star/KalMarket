/* =====================================================
   OFFICIAL LOTTERY RESULT SOURCES
===================================================== */

const WCLC_URLS = [
    "https://www.wclc.com/winning-numbers/lottomax-extra.htm",
    "https://www.wclc.com/winning-numbers/lotto-649.htm",
    "https://www.wclc.com/winning-numbers/daily-grand.htm"
];

const POWERBALL_URL =
    "https://www.powerball.com/previous-results";

const MEGA_MILLIONS_URL =
    "https://www.megamillions.com/winning-numbers/last-25-drawings";


/* =====================================================
   DATE PARSER
===================================================== */

function parseDate(dateText) {

    const date = new Date(dateText);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    date.setHours(12, 0, 0, 0);

    return date;
}


/* =====================================================
   CLEAN HTML
===================================================== */

function cleanHtml(html) {

    return html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/\s+/g, " ")
        .trim();

}


/* =====================================================
   EXTRACT NUMBER LIST
===================================================== */

function numbersFromText(text) {

    return text
        .match(/\b\d{1,2}\b/g)
        ?.map(Number) || [];

}


/* =====================================================
   WCLC
   LOTTO MAX / LOTTO 6/49 / DAILY GRAND
===================================================== */


function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const https = require("https");

        function request(currentUrl) {
            https.get(currentUrl, {
                headers: {
                    "User-Agent": "Mozilla/5.0"
                }
            }, response => {

                if (
                    response.statusCode >= 300 &&
                    response.statusCode < 400 &&
                    response.headers.location
                ) {
                    const nextUrl =
                        new URL(
                            response.headers.location,
                            currentUrl
                        ).href;

                    request(nextUrl);
                    return;
                }

                let data = "";

                response.on("data", chunk => {
                    data += chunk;
                });

                response.on("end", () => {
                    if (response.statusCode !== 200) {
                        reject(
                            new Error(
                                `HTTP ${response.statusCode}: ${currentUrl}`
                            )
                        );
                        return;
                    }

                    resolve(data);
                });

            }).on("error", reject);
        }

        request(url);
    });
}

async function fetchWclcResults() {

    const games = [
        {
            gameId: "lottoMax",
            page: "lotto-max-extra.htm",
            mainCount: 7,
            hasBonus: true,
            bonusLabel: "Bonus"
        },
        {
            gameId: "lotto649",
            page: "lotto-649-extra.htm",
            mainCount: 6,
            hasBonus: true,
            bonusLabel: "Bonus"
        },
        {
            gameId: "dailyGrand",
            page: "daily-grand-extra.htm",
            mainCount: 5,
            hasBonus: true,
            bonusLabel: "Grand Number"
        }
    ];

    const results = [];

    const today = new Date();

    const startDate = new Date(today);
    startDate.setMonth(startDate.getMonth() - 2);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999);

    /*
       WCLC monthly history:
       back=0 = current month
       back=1 = previous month
       back=2 = month before that

       We fetch three months so a rolling two-month
       window is always covered.
    */

    for (const game of games) {

        for (let back = 0; back <= 2; back++) {

            const url =
                `https://www.wclc.com/${game.page}?back=${back}`;

            const html =
                await fetchUrl(url);

            const blocks =
                html
                    .split('<div class="pastWinNum">')
                    .slice(1);

            for (const block of blocks) {

                /*
                   Date
                */

                const dateMatch =
                    block.match(
                        /<(?:h3|h4)[^>]*>[\s\S]*?([A-Za-z]+,\s+[A-Za-z]+\s+\d{1,2},\s+\d{4})[\s\S]*?<\/(?:h3|h4)>/i
                    );

                if (!dateMatch) {
                    continue;
                }

                const drawDate =
                    new Date(dateMatch[1]);

                if (Number.isNaN(drawDate.getTime())) {
                    continue;
                }

                drawDate.setHours(12, 0, 0, 0);

                /*
                   Rolling two-month filter
                */

                if (
                    drawDate < startDate ||
                    drawDate > endDate
                ) {
                    continue;
                }

                /*
                   Remove HTML and inspect the draw text.
                */

                const text =
                    block
                        .replace(
                            /<script[\s\S]*?<\/script>/gi,
                            " "
                        )
                        .replace(
                            /<style[\s\S]*?<\/style>/gi,
                            " "
                        )
                        .replace(
                            /<[^>]+>/g,
                            " "
                        )
                        .replace(
                            /&nbsp;/gi,
                            " "
                        )
                        .replace(
                            /&amp;/gi,
                            "&"
                        )
                        .replace(
                            /\s+/g,
                            " "
                        )
                        .trim();

                let mainNumbers = [];
                let bonusNumber = null;

                /*
                   Lotto Max and Lotto 6/49:
                   use the number elements from the draw block.
                */

                if (
                    game.gameId === "lottoMax" ||
                    game.gameId === "lotto649"
                ) {

                    const numberMatches =
                        [
                            ...block.matchAll(
                                /<li[^>]*class="pastWinNumber"[^>]*>(\d+)<\/li>/gi
                            )
                        ];

                    mainNumbers =
                        numberMatches
                            .map(match => Number(match[1]))
                            .slice(0, game.mainCount);

                    const bonusMatch =
                        block.match(
                            /<li[^>]*class="pastWinNumberBonus"[^>]*>[\s\S]*?(\d+)<\/li>/i
                        );

                    if (bonusMatch) {
                        bonusNumber =
                            Number(bonusMatch[1]);
                    }
                }

                /*
                   Daily Grand:
                   extract numbers following MAIN DRAW.
                */

                if (game.gameId === "dailyGrand") {

                    const mainMatch =
                        text.match(
                            /MAIN DRAW\s+((?:\d+\s+){4}\d+)\s+Grand Number\s+(\d+)/i
                        );

                    if (mainMatch) {

                        mainNumbers =
                            mainMatch[1]
                                .trim()
                                .split(/\s+/)
                                .map(Number)
                                .slice(0, game.mainCount);

                        bonusNumber =
                            Number(mainMatch[2]);
                    }
                }

                if (
                    mainNumbers.length !==
                    game.mainCount
                ) {
                    continue;
                }

                results.push({

                    gameId: game.gameId,

                    drawDate:
                        drawDate.toISOString(),

                    mainNumbers,

                    bonusNumber,

                    source: "WCLC"
                });
            }
        }
    }

    /*
       Remove duplicate draws.
    */

    const unique = new Map();

    for (const result of results) {

        const key =
            `${result.gameId}_${result.drawDate}`;

        unique.set(key, result);
    }

    return Array.from(unique.values())
        .sort(
            (a, b) =>
                new Date(b.drawDate) -
                new Date(a.drawDate)
        );
}

async function fetchPowerballResults() {

    const response =
        await fetch(POWERBALL_URL);

    if (!response.ok) {
        throw new Error(
            `Powerball request failed: ${response.status}`
        );
    }

    const html =
        await response.text();

    const results = [];

    const cardRegex =
        /<a class="card" href="https:\/\/www\.powerball\.com\/draw-result\?gc=powerball&date=(\d{4}-\d{2}-\d{2})">([\s\S]*?)<\/a>/gi;

    let match;

    while ((match = cardRegex.exec(html)) !== null) {

        const drawDate =
            parseDate(match[1]);

        if (!drawDate) {
            continue;
        }

        const card =
            match[2];

        const numbers =
            Array.from(
                card.matchAll(
                    /class="[^"]*\b(?:white-balls|powerball)\b[^"]*"[\s\S]*?<div>\s*(\d{1,2})\s*<\/div>/gi
                )
            )
            .map(item => Number(item[1]));

        if (numbers.length < 6) {
            continue;
        }

        results.push({

            gameId: "powerball",

            drawDate:
                drawDate.toISOString(),

            mainNumbers:
                numbers.slice(0, 5),

            bonusNumber:
                numbers[5],

            source:
                "Powerball Official"

        });
    }

    return results;
}

/* =====================================================
   MEGA MILLIONS
===================================================== */

async function fetchMegaMillionsResults() {

    const today = new Date();

    const startDate = new Date(today);
    startDate.setMonth(startDate.getMonth() - 2);

    const formatDate = date =>
        `${String(date.getMonth() + 1).padStart(2, "0")}/` +
        `${String(date.getDate()).padStart(2, "0")}/` +
        `${date.getFullYear()}`;

    const body = JSON.stringify({
        pageNumber: 1,
        pageSize: 50,
        startDate: formatDate(startDate),
        endDate: formatDate(today)
    });

    const response = await fetch(
        "https://www.megamillions.com/cmspages/utilservice.asmx/GetDrawingPagingData",
        {
            method: "POST",
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Content-Type": "application/json; charset=utf-8"
            },
            body
        }
    );

    if (!response.ok) {
        throw new Error(
            `Mega Millions API request failed: ${response.status}`
        );
    }

    const json = await response.json();

    const data =
        typeof json.d === "string"
            ? JSON.parse(json.d)
            : json.d;

    const drawings =
        Array.isArray(data?.DrawingData)
            ? data.DrawingData
            : [];

    return drawings.map(draw => ({
        gameId: "megaMillions",
        drawDate: new Date(draw.PlayDate),
        mainNumbers: [
            draw.N1,
            draw.N2,
            draw.N3,
            draw.N4,
            draw.N5
        ].map(Number),
        bonusNumber: Number(draw.MBall),
        source: "Mega Millions official API"
    }));
}


/* =====================================================
   FETCH ALL OFFICIAL RESULTS
===================================================== */

async function fetchAllLotteryResults() {

    const [

        canadianResults,

        powerballResults,

        megaMillionsResults

    ] = await Promise.all([

        fetchWclcResults(),

        fetchPowerballResults(),

        fetchMegaMillionsResults()

    ]);


    return [

        ...canadianResults,

        ...powerballResults,

        ...megaMillionsResults

    ];

}


module.exports = {

    fetchWclcResults,

    fetchPowerballResults,

    fetchMegaMillionsResults,

    fetchAllLotteryResults

};
