const locations = {

    CA: [

        {
            value: "AB",
            name: "Alberta"
        },
        {
            value: "BC",
            name: "British Columbia"
        },
        {
            value: "MB",
            name: "Manitoba"
        },
        {
            value: "NB",
            name: "New Brunswick"
        },
        {
            value: "NL",
            name: "Newfoundland and Labrador"
        },
        {
            value: "NS",
            name: "Nova Scotia"
        },
        {
            value: "NT",
            name: "Northwest Territories"
        },
        {
            value: "NU",
            name: "Nunavut"
        },
        {
            value: "ON",
            name: "Ontario"
        },
        {
            value: "PE",
            name: "Prince Edward Island"
        },
        {
            value: "QC",
            name: "Quebec"
        },
        {
            value: "SK",
            name: "Saskatchewan"
        },
        {
            value: "YT",
            name: "Yukon"
        }

    ],


    US: [

        {
            value: "CA",
            name: "California"
        },
        {
            value: "TX",
            name: "Texas"
        },
        {
            value: "FL",
            name: "Florida"
        },
        {
            value: "NY",
            name: "New York"
        },
        {
            value: "WA",
            name: "Washington"
        },
        {
            value: "IL",
            name: "Illinois"
        },
        {
            value: "AZ",
            name: "Arizona"
        },
        {
            value: "GA",
            name: "Georgia"
        },
        {
            value: "OH",
            name: "Ohio"
        },
        {
            value: "PA",
            name: "Pennsylvania"
        }

    ]

};




function loadRegions(){

    const country =
        document.getElementById("country");

    const region =
        document.getElementById("region");


    if(!country || !region) return;


    region.innerHTML = "";


    locations[country.value].forEach(item => {

        const option =
        document.createElement("option");


        option.value =
        item.value;


        option.textContent =
        item.name;


        region.appendChild(option);


    });

}



document
.getElementById("country")
?.addEventListener(
"change",
loadRegions
);



document.addEventListener(
"DOMContentLoaded",
loadRegions
);
