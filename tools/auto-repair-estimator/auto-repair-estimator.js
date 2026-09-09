
/* =========================================================
   KALMARKET - AUTO REPAIR ESTIMATOR
   Service Database + Labour Times + Location/Tax
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       1. CANADIAN LOCATIONS & TAXES
    ===================================================== */

    const canadianLocations = {
        alberta: {
            name: "Alberta",
            tax: 5,
            cities: [
                "Calgary",
                "Edmonton",
                "Red Deer",
                "Lethbridge",
                "Medicine Hat",
                "Grande Prairie",
                "Airdrie",
                "Fort McMurray",
                "Spruce Grove",
                "St. Albert"
            ]
        },

        british_columbia: {
            name: "British Columbia",
            tax: 12,
            cities: [
                "Vancouver",
                "Surrey",
                "Burnaby",
                "Richmond",
                "Abbotsford",
                "Coquitlam",
                "Kelowna",
                "Victoria",
                "Langley",
                "Nanaimo"
            ]
        },

        manitoba: {
            name: "Manitoba",
            tax: 14,
            cities: [
                "Winnipeg",
                "Brandon",
                "Steinbach",
                "Portage la Prairie",
                "Thompson",
                "Winkler",
                "Selkirk",
                "Dauphin",
                "Morden",
                "Flin Flon"
            ]
        },

        new_brunswick: {
            name: "New Brunswick",
            tax: 15,
            cities: [
                "Moncton",
                "Saint John",
                "Fredericton",
                "Dieppe",
                "Miramichi",
                "Bathurst",
                "Edmundston",
                "Riverview"
            ]
        },

        newfoundland_labrador: {
            name: "Newfoundland & Labrador",
            tax: 15,
            cities: [
                "St. John's",
                "Mount Pearl",
                "Corner Brook",
                "Conception Bay South",
                "Paradise",
                "Grand Falls-Windsor",
                "Gander",
                "Happy Valley-Goose Bay"
            ]
        },

        nova_scotia: {
            name: "Nova Scotia",
            tax: 15,
            cities: [
                "Halifax",
                "Dartmouth",
                "Sydney",
                "Truro",
                "New Glasgow",
                "Glace Bay",
                "Kentville",
                "Amherst"
            ]
        },

        ontario: {
            name: "Ontario",
            tax: 13,
            cities: [
                "Toronto",
                "Ottawa",
                "Mississauga",
                "Brampton",
                "Hamilton",
                "London",
                "Markham",
                "Vaughan",
                "Kitchener",
                "Windsor",
                "Oshawa",
                "Barrie",
                "Kingston",
                "Guelph",
                "Sudbury",
                "Thunder Bay",
                "Waterloo",
                "St. Catharines",
                "Niagara Falls"
            ]
        },

        pei: {
            name: "Prince Edward Island",
            tax: 15,
            cities: [
                "Charlottetown",
                "Summerside",
                "Stratford",
                "Cornwall",
                "Montague"
            ]
        },

        quebec: {
            name: "Quebec",
            tax: 14.975,
            cities: [
                "Montreal",
                "Quebec City",
                "Laval",
                "Gatineau",
                "Longueuil",
                "Sherbrooke",
                "Saguenay",
                "Levis",
                "Trois-Rivieres",
                "Terrebonne"
            ]
        },

        saskatchewan: {
            name: "Saskatchewan",
            tax: 11,
            cities: [
                "Saskatoon",
                "Regina",
                "Prince Albert",
                "Moose Jaw",
                "Yorkton",
                "Swift Current",
                "North Battleford",
                "Weyburn"
            ]
        },

        northwest_territories: {
            name: "Northwest Territories",
            tax: 5,
            cities: [
                "Yellowknife",
                "Hay River",
                "Inuvik",
                "Fort Smith"
            ]
        },

        nunavut: {
            name: "Nunavut",
            tax: 5,
            cities: [
                "Iqaluit",
                "Rankin Inlet",
                "Arviat",
                "Cambridge Bay"
            ]
        },

        yukon: {
            name: "Yukon",
            tax: 5,
            cities: [
                "Whitehorse",
                "Dawson City",
                "Watson Lake",
                "Haines Junction"
            ]
        }
    };


    /* =====================================================
       2. INTERNATIONAL LOCATIONS
    ===================================================== */

    const internationalLocations = {

        "united-states": {
            currency: "USD",
            tax: 0,
            regions: [
                "Alabama",
                "Alaska",
                "Arizona",
                "Arkansas",
                "California",
                "Colorado",
                "Connecticut",
                "Delaware",
                "Florida",
                "Georgia",
                "Hawaii",
                "Idaho",
                "Illinois",
                "Indiana",
                "Iowa",
                "Kansas",
                "Kentucky",
                "Louisiana",
                "Maine",
                "Maryland",
                "Massachusetts",
                "Michigan",
                "Minnesota",
                "Mississippi",
                "Missouri",
                "Montana",
                "Nebraska",
                "Nevada",
                "New Hampshire",
                "New Jersey",
                "New Mexico",
                "New York",
                "North Carolina",
                "North Dakota",
                "Ohio",
                "Oklahoma",
                "Oregon",
                "Pennsylvania",
                "Rhode Island",
                "South Carolina",
                "South Dakota",
                "Tennessee",
                "Texas",
                "Utah",
                "Vermont",
                "Virginia",
                "Washington",
                "West Virginia",
                "Wisconsin",
                "Wyoming"
            ]
        },

        "united-kingdom": {
            currency: "GBP",
            tax: 20,
            regions: [
                "England",
                "Scotland",
                "Wales",
                "Northern Ireland"
            ]
        },

        australia: {
            currency: "AUD",
            tax: 10,
            regions: [
                "New South Wales",
                "Victoria",
                "Queensland",
                "Western Australia",
                "South Australia",
                "Tasmania",
                "Australian Capital Territory",
                "Northern Territory"
            ]
        },

        "new-zealand": {
            currency: "NZD",
            tax: 15,
            regions: [
                "Auckland",
                "Canterbury",
                "Wellington",
                "Waikato",
                "Bay of Plenty",
                "Otago",
                "Manawatū-Whanganui",
                "Hawke's Bay",
                "Taranaki",
                "Northland",
                "Southland",
                "Nelson",
                "Marlborough",
                "Gisborne",
                "West Coast"
            ]
        }
    };


    /* =====================================================
       3. REPAIR SERVICE DATABASE
       
       Labour hours are suggested typical shop times.
       They are NOT locked and can be changed by the user.
    ===================================================== */

    const repairServices = {

        /* =================================================
           BRAKES
        ================================================= */

        brakes: {

            "Brake Pads & Rotors": {
                positions: {
                    front: {
                        label: "Front",
                        hours: 2.0
                    },
                    rear: {
                        label: "Rear",
                        hours: 2.0
                    },
                    front_rear: {
                        label: "Front & Rear",
                        hours: 3.5
                    }
                }
            },

            "Brake Pads": {
                positions: {
                    front: {
                        label: "Front",
                        hours: 1.2
                    },
                    rear: {
                        label: "Rear",
                        hours: 1.2
                    },
                    front_rear: {
                        label: "Front & Rear",
                        hours: 2.0
                    }
                }
            },

            "Brake Rotors": {
                positions: {
                    front: {
                        label: "Front",
                        hours: 1.5
                    },
                    rear: {
                        label: "Rear",
                        hours: 1.5
                    },
                    front_rear: {
                        label: "Front & Rear",
                        hours: 2.5
                    }
                }
            },

            "Brake Caliper Replacement": {
                positions: {
                    left_front: {
                        label: "Left Front",
                        hours: 1.5
                    },
                    right_front: {
                        label: "Right Front",
                        hours: 1.5
                    },
                    both_front: {
                        label: "Both Front",
                        hours: 2.5
                    },
                    left_rear: {
                        label: "Left Rear",
                        hours: 1.5
                    },
                    right_rear: {
                        label: "Right Rear",
                        hours: 1.5
                    },
                    both_rear: {
                        label: "Both Rear",
                        hours: 2.5
                    }
                }
            },

            "Brake Fluid Flush": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 1.0
                    }
                }
            },

            "Brake Inspection": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 0.5
                    }
                }
            },

            "Brake Line Repair": {
                positions: {
                    left_front: {
                        label: "Left Front",
                        hours: 1.5
                    },
                    right_front: {
                        label: "Right Front",
                        hours: 1.5
                    },
                    left_rear: {
                        label: "Left Rear",
                        hours: 1.5
                    },
                    right_rear: {
                        label: "Right Rear",
                        hours: 1.5
                    }
                }
            }
        },


        /* =================================================
           OIL & MAINTENANCE
        ================================================= */

        oil: {

            "Engine Oil Change": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 0.5
                    }
                }
            },

            "Oil & Filter Change": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 0.5
                    }
                }
            },

            "Transmission Fluid Service": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 1.0
                    }
                }
            },

            "Coolant Service": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 1.0
                    }
                }
            },

            "General Maintenance Service": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 1.0
                    }
                }
            },

            "Vehicle Inspection": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 0.5
                    }
                }
            }
        },


        /* =================================================
           TIRES
        ================================================= */

        tires: {

            "Tire Mount & Balance": {
                positions: {
                    one: {
                        label: "One Tire",
                        hours: 0.5
                    },
                    two: {
                        label: "Two Tires",
                        hours: 0.8
                    },
                    four: {
                        label: "Four Tires",
                        hours: 1.2
                    }
                }
            },

            "Tire Rotation": {
                positions: {
                    four: {
                        label: "Four Tires",
                        hours: 0.5
                    }
                }
            },

            "Flat Tire Repair": {
                positions: {
                    left_front: {
                        label: "Left Front",
                        hours: 0.4
                    },
                    right_front: {
                        label: "Right Front",
                        hours: 0.4
                    },
                    left_rear: {
                        label: "Left Rear",
                        hours: 0.4
                    },
                    right_rear: {
                        label: "Right Rear",
                        hours: 0.4
                    }
                }
            },

            "Tire Replacement": {
                positions: {
                    front: {
                        label: "Front",
                        hours: 0.8
                    },
                    rear: {
                        label: "Rear",
                        hours: 0.8
                    },
                    all_four: {
                        label: "All Four",
                        hours: 1.2
                    }
                }
            },

            "Wheel Alignment": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 1.0
                    }
                }
            }
        },


        /* =================================================
           SUSPENSION
        ================================================= */

        suspension: {

            "Control Arm Replacement": {
                positions: {
                    left_front: {
                        label: "Left Front",
                        hours: 2.0
                    },
                    right_front: {
                        label: "Right Front",
                        hours: 2.0
                    },
                    both_front: {
                        label: "Both Front",
                        hours: 3.5
                    },
                    left_rear: {
                        label: "Left Rear",
                        hours: 2.0
                    },
                    right_rear: {
                        label: "Right Rear",
                        hours: 2.0
                    },
                    both_rear: {
                        label: "Both Rear",
                        hours: 3.5
                    }
                }
            },

            "Ball Joint Replacement": {
                positions: {
                    left_front: {
                        label: "Left Front",
                        hours: 2.0
                    },
                    right_front: {
                        label: "Right Front",
                        hours: 2.0
                    },
                    both_front: {
                        label: "Both Front",
                        hours: 3.5
                    }
                }
            },

            "Strut Replacement": {
                positions: {
                    left_front: {
                        label: "Left Front",
                        hours: 2.5
                    },
                    right_front: {
                        label: "Right Front",
                        hours: 2.5
                    },
                    both_front: {
                        label: "Both Front",
                        hours: 4.0
                    }
                }
            },

            "Shock Absorber Replacement": {
                positions: {
                    left_rear: {
                        label: "Left Rear",
                        hours: 1.5
                    },
                    right_rear: {
                        label: "Right Rear",
                        hours: 1.5
                    },
                    both_rear: {
                        label: "Both Rear",
                        hours: 2.5
                    }
                }
            },

            "Sway Bar Link Replacement": {
                positions: {
                    left_front: {
                        label: "Left Front",
                        hours: 1.0
                    },
                    right_front: {
                        label: "Right Front",
                        hours: 1.0
                    },
                    both_front: {
                        label: "Both Front",
                        hours: 1.5
                    },
                    left_rear: {
                        label: "Left Rear",
                        hours: 1.0
                    },
                    right_rear: {
                        label: "Right Rear",
                        hours: 1.0
                    },
                    both_rear: {
                        label: "Both Rear",
                        hours: 1.5
                    }
                }
            },

            "Wheel Bearing Replacement": {
                positions: {
                    left_front: {
                        label: "Left Front",
                        hours: 2.0
                    },
                    right_front: {
                        label: "Right Front",
                        hours: 2.0
                    },
                    both_front: {
                        label: "Both Front",
                        hours: 3.5
                    },
                    left_rear: {
                        label: "Left Rear",
                        hours: 1.8
                    },
                    right_rear: {
                        label: "Right Rear",
                        hours: 1.8
                    },
                    both_rear: {
                        label: "Both Rear",
                        hours: 3.0
                    }
                }
            },

            "Suspension Inspection": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 0.7
                    }
                }
            }
        },


        /* =================================================
           STEERING
        ================================================= */

        steering: {

            "Tie Rod Replacement": {
                positions: {
                    left: {
                        label: "Left",
                        hours: 1.2
                    },
                    right: {
                        label: "Right",
                        hours: 1.2
                    },
                    both: {
                        label: "Both",
                        hours: 2.0
                    }
                }
            },

            "Outer Tie Rod Replacement": {
                positions: {
                    left: {
                        label: "Left",
                        hours: 1.0
                    },
                    right: {
                        label: "Right",
                        hours: 1.0
                    },
                    both: {
                        label: "Both",
                        hours: 1.7
                    }
                }
            },

            "Inner Tie Rod Replacement": {
                positions: {
                    left: {
                        label: "Left",
                        hours: 1.5
                    },
                    right: {
                        label: "Right",
                        hours: 1.5
                    },
                    both: {
                        label: "Both",
                        hours: 2.5
                    }
                }
            },

            "Steering Rack Replacement": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 4.0
                    }
                }
            },

            "Power Steering Pump Replacement": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 2.5
                    }
                }
            },

            "Steering Inspection": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 0.7
                    }
                }
            }
        },


        /* =================================================
           ENGINE
        ================================================= */

        engine: {

            "Alternator Replacement": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 1.5
                    }
                }
            },

            "Starter Replacement": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 1.5
                    }
                }
            },

            "Serpentine Belt Replacement": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 0.8
                    }
                }
            },

            "Timing Belt Replacement": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 5.0
                    }
                }
            },

            "Timing Chain Replacement": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 7.0
                    }
                }
            },

            "Water Pump Replacement": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 3.0
                    }
                }
            },

            "Valve Cover Gasket": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 2.0
                    }
                }
            },

            "Head Gasket Replacement": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 10.0
                    }
                }
            },

            "Engine Replacement": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 12.0
                    }
                }
            },

            "Spark Plug Replacement": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 1.0
                    }
                }
            },

            "Engine Diagnostic / Inspection": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 1.0
                    }
                }
            }
        },


        /* =================================================
           TRANSMISSION
        ================================================= */

        transmission: {

            "Transmission Fluid Service": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 1.0
                    }
                }
            },

            "Transmission Pan Gasket": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 2.0
                    }
                }
            },

            "Transmission Mount Replacement": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 2.0
                    }
                }
            },

            "CV Axle Replacement": {
                positions: {
                    left_front: {
                        label: "Left Front",
                        hours: 1.5
                    },
                    right_front: {
                        label: "Right Front",
                        hours: 1.5
                    },
                    both_front: {
                        label: "Both Front",
                        hours: 2.5
                    }
                }
            },

            "Transmission Replacement": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 8.0
                    }
                }
            },

            "Clutch Replacement": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 8.0
                    }
                }
            }
        },


        /* =================================================
           EXHAUST
        ================================================= */

        exhaust: {

            "Muffler Replacement": {
                positions: {
                    rear: {
                        label: "Rear",
                        hours: 1.5
                    }
                }
            },

            "Catalytic Converter Replacement": {
                positions: {
                    front: {
                        label: "Front",
                        hours: 2.0
                    },
                    rear: {
                        label: "Rear",
                        hours: 2.0
                    }
                }
            },

            "Exhaust Pipe Replacement": {
                positions: {
                    front: {
                        label: "Front",
                        hours: 2.0
                    },
                    center: {
                        label: "Center",
                        hours: 1.5
                    },
                    rear: {
                        label: "Rear",
                        hours: 1.5
                    },
                    full_system: {
                        label: "Full System",
                        hours: 3.5
                    }
                }
            },

            "Exhaust Manifold Replacement": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 3.0
                    }
                }
            },

            "Exhaust Leak Repair": {
                positions: {
                    front: {
                        label: "Front",
                        hours: 1.5
                    },
                    center: {
                        label: "Center",
                        hours: 1.0
                    },
                    rear: {
                        label: "Rear",
                        hours: 1.0
                    }
                }
            }
        },


        /* =================================================
           COOLING SYSTEM
        ================================================= */

        cooling: {

            "Radiator Replacement": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 2.0
                    }
                }
            },

            "Thermostat Replacement": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 1.5
                    }
                }
            },

            "Water Pump Replacement": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 3.0
                    }
                }
            },

            "Cooling Fan Replacement": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 1.5
                    }
                }
            },

            "Coolant Flush": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 1.0
                    }
                }
            },

            "Hose Replacement": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 1.0
                    }
                }
            }
        },


        /* =================================================
           ELECTRICAL
        ================================================= */

        electrical: {

            "Battery Replacement": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 0.3
                    }
                }
            },

            "Alternator Replacement": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 1.5
                    }
                }
            },

            "Starter Replacement": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 1.5
                    }
                }
            },

            "Battery / Charging System Test": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 0.5
                    }
                }
            },

            "Electrical Diagnostic": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 1.0
                    }
                }
            },

            "Window Motor Replacement": {
                positions: {
                    left_front: {
                        label: "Left Front",
                        hours: 1.5
                    },
                    right_front: {
                        label: "Right Front",
                        hours: 1.5
                    },
                    left_rear: {
                        label: "Left Rear",
                        hours: 1.5
                    },
                    right_rear: {
                        label: "Right Rear",
                        hours: 1.5
                    }
                }
            }
        },


        /* =================================================
           AIR CONDITIONING
        ================================================= */

        "air-conditioning": {

            "A/C Diagnostic": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 1.0
                    }
                }
            },

            "A/C Recharge": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 1.0
                    }
                }
            },

            "A/C Compressor Replacement": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 3.0
                    }
                }
            },

            "A/C Condenser Replacement": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 2.5
                    }
                }
            },

            "A/C Evaporator Replacement": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 6.0
                    }
                }
            },

            "Blower Motor Replacement": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 2.0
                    }
                }
            }
        },


        /* =================================================
           DIAGNOSTICS
        ================================================= */

        diagnostics: {

            "Check Engine Diagnostic": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 1.0
                    }
                }
            },

            "Electrical Diagnostic": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 1.0
                    }
                }
            },

            "Noise / Vibration Diagnostic": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 1.0
                    }
                }
            },

            "Brake Diagnostic": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 0.8
                    }
                }
            },

            "General Vehicle Diagnostic": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 1.0
                    }
                }
            }
        },


        /* =================================================
           BODYWORK
        ================================================= */

        bodywork: {

            "Bumper Replacement": {
                positions: {
                    front: {
                        label: "Front",
                        hours: 2.0
                    },
                    rear: {
                        label: "Rear",
                        hours: 2.0
                    }
                }
            },

            "Fender Replacement": {
                positions: {
                    left_front: {
                        label: "Left Front",
                        hours: 3.0
                    },
                    right_front: {
                        label: "Right Front",
                        hours: 3.0
                    }
                }
            },

            "Door Replacement": {
                positions: {
                    left_front: {
                        label: "Left Front",
                        hours: 3.0
                    },
                    right_front: {
                        label: "Right Front",
                        hours: 3.0
                    },
                    left_rear: {
                        label: "Left Rear",
                        hours: 3.0
                    },
                    right_rear: {
                        label: "Right Rear",
                        hours: 3.0
                    }
                }
            },

            "Hood Replacement": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 2.0
                    }
                }
            },

            "Trunk / Liftgate Replacement": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 2.5
                    }
                }
            },
 "Minor Dent Repair": {
    positions: {
        na: {
            label: "Not Applicable",
            hours: 2.0
        }
    },
    dentRepair: true
}
        /* =================================================
           OTHER REPAIR
        ================================================= */

        other: {

            "General Repair": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 1.0
                    }
                }
            },

            "Inspection": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 1.0
                    }
                }
            },

            "Custom Repair": {
                positions: {
                    na: {
                        label: "Not Applicable",
                        hours: 1.0
                    }
                }
            }
        }
    };


    /* =====================================================
       4. DOM ELEMENTS
    ===================================================== */

    const countrySelect = document.getElementById("repairCountry");
    const regionSelect = document.getElementById("repairRegion");
    const regionInput = document.getElementById("repairRegionInput");

    const citySelect = document.getElementById("repairCity");
    const cityInput = document.getElementById("repairCityInput");

    const currencySelect = document.getElementById("repairCurrency");
    const customCurrencyGroup =
        document.getElementById("customCurrencyGroup");
    const customCurrencyInput =
        document.getElementById("customCurrency");

    const taxSelect = document.getElementById("repairTax");
    const customTaxGroup =
        document.getElementById("customTaxGroup");
    const customTaxRate =
        document.getElementById("customTaxRate");

    const categorySelect =
        document.getElementById("repairCategory");

    const serviceSelect =
        document.getElementById("repairService");

    const positionSelect =
        document.getElementById("repairPosition");

    const suggestedHoursInput =
        document.getElementById("suggestedLabourHours");

    const labourHoursInput =
        document.getElementById("labourHours");

    const labourRateInput =
        document.getElementById("labourRate");

    const repairDescription =
        document.getElementById("repairDescription");


    /* =====================================================
       5. LOCATION FUNCTIONS
    ===================================================== */

    function populateCanadianRegions() {

        if (!regionSelect) return;

        regionSelect.innerHTML =
            '<option value="">Select province</option>';

        Object.keys(canadianLocations).forEach(key => {

            const option =
                document.createElement("option");

            option.value = key;
            option.textContent =
                canadianLocations[key].name;

            regionSelect.appendChild(option);
        });
    }


    function populateInternationalRegions(country) {

        if (!regionSelect) return;

        regionSelect.innerHTML =
            '<option value="">Select region</option>';

        const data =
            internationalLocations[country];

        if (!data) return;

        data.regions.forEach(region => {

            const option =
                document.createElement("option");

            option.value = region;
            option.textContent = region;

            regionSelect.appendChild(option);
        });
    }


    function populateCanadianCities(province) {

        if (!citySelect) return;

        citySelect.innerHTML =
            '<option value="">Select city</option>';

        const data =
            canadianLocations[province];

        if (!data) return;

        data.cities.forEach(city => {

            const option =
                document.createElement("option");

            option.value = city;
            option.textContent = city;

            citySelect.appendChild(option);
        });
    }


    function updateCityField(country) {

        if (!citySelect || !cityInput) return;

        if (country === "canada") {

            citySelect.style.display = "";
            cityInput.style.display = "none";

        } else {

            citySelect.style.display = "none";
            cityInput.style.display = "";
        }
    }


    function updateRegionField(country) {

        if (!regionSelect || !regionInput) return;

        if (country === "canada") {

            regionSelect.style.display = "";
            regionInput.style.display = "none";

            populateCanadianRegions();

        } else if (internationalLocations[country]) {

            regionSelect.style.display = "";
            regionInput.style.display = "none";

            populateInternationalRegions(country);

        } else {

            regionSelect.style.display = "none";
            regionInput.style.display = "";
        }
    }


    /* =====================================================
       6. CURRENCY
    ===================================================== */

    function updateCurrency(country) {

        if (!currencySelect) return;

        const data =
            internationalLocations[country];

        if (country === "canada") {

            currencySelect.value = "CAD";

        } else if (data) {

            currencySelect.value = data.currency;
        }

        if (currencySelect.value === "other") {

            if (customCurrencyGroup)
                customCurrencyGroup.style.display = "";

        } else {

            if (customCurrencyGroup)
                customCurrencyGroup.style.display = "none";
        }
    }


    function updateCustomCurrency() {

        if (!currencySelect || !customCurrencyGroup)
            return;

        customCurrencyGroup.style.display =
            currencySelect.value === "other"
                ? ""
                : "none";
    }


    /* =====================================================
       7. TAX
    ===================================================== */

    function setTaxValue(value) {

        if (!taxSelect) return;

        const numericValue =
            Number(value);

        const availableOption =
            Array.from(taxSelect.options)
                .find(option =>
                    option.value === String(numericValue)
                );

        if (availableOption) {

            taxSelect.value =
                String(numericValue);

            if (customTaxGroup)
                customTaxGroup.hidden = true;

        } else {

            taxSelect.value = "custom";

            if (customTaxGroup)
                customTaxGroup.hidden = false;

            if (customTaxRate)
                customTaxRate.value =
                    numericValue;
        }
    }


    function updateTaxForLocation() {

        const country =
            countrySelect?.value;

        if (country === "canada") {

            const province =
                regionSelect?.value;

            const data =
                canadianLocations[province];

            if (data) {
                setTaxValue(data.tax);
            }

            return;
        }

        const data =
            internationalLocations[country];

        if (data) {
            setTaxValue(data.tax);
        }
    }


    /* =====================================================
       8. REPAIR SERVICE FUNCTIONS
    ===================================================== */

    function populateRepairServices() {

        if (!serviceSelect) return;

        const category =
            categorySelect?.value;

        serviceSelect.innerHTML =
            '<option value="">Select service</option>';

        clearPositions();
        clearSuggestedHours();

        if (!category || !repairServices[category])
            return;

        const services =
            repairServices[category];

        Object.keys(services).forEach(serviceName => {

            const option =
                document.createElement("option");

            option.value = serviceName;
            option.textContent = serviceName;

            serviceSelect.appendChild(option);
        });
    }


    function clearPositions() {

        if (!positionSelect) return;

        positionSelect.innerHTML =
            '<option value="">Select position</option>';
    }


    function clearSuggestedHours() {

        if (suggestedHoursInput)
            suggestedHoursInput.value = "";
    }


    function populateRepairPositions() {

        if (!positionSelect) return;

        clearPositions();
        clearSuggestedHours();

        const category =
            categorySelect?.value;

        const service =
            serviceSelect?.value;

        if (
            !category ||
            !service ||
            !repairServices[category] ||
            !repairServices[category][service]
        ) {
            return;
        }

        const positions =
            repairServices[category][service].positions;

        Object.keys(positions).forEach(positionKey => {

            const position =
                positions[positionKey];

            const option =
                document.createElement("option");

            option.value = positionKey;
            option.textContent = position.label;

            positionSelect.appendChild(option);
        });

        /*
           If there is only one possible position,
           automatically select it.
        */

        const positionKeys =
            Object.keys(positions);

        if (positionKeys.length === 1) {

            positionSelect.value =
                positionKeys[0];

            updateSuggestedHours();
        }
    }


    function updateSuggestedHours() {

        if (!suggestedHoursInput)
            return;

        const category =
            categorySelect?.value;

        const service =
            serviceSelect?.value;

        const position =
            positionSelect?.value;

        if (
            !category ||
            !service ||
            !position ||
            !repairServices[category] ||
            !repairServices[category][service]
        ) {

            clearSuggestedHours();
            return;
        }

        const positionData =
            repairServices[category][service]
                .positions[position];

        if (!positionData) {

            clearSuggestedHours();
            return;
        }

        const hours =
            Number(positionData.hours);

        suggestedHoursInput.value =
            hours.toFixed(1);

        /*
           The suggested hours are copied into the
           editable Labour Hours field.
        */

        if (labourHoursInput) {

            labourHoursInput.value =
                hours.toFixed(1);
        }
    }


    /* =====================================================
       9. GET SELECTED LOCATION
    ===================================================== */

    function getSelectedRegion() {

        const country =
            countrySelect?.value;

        if (country === "canada") {

            const key =
                regionSelect?.value;

            return canadianLocations[key]?.name || "";
        }

        if (internationalLocations[country]) {

            return regionSelect?.value || "";
        }

        return regionInput?.value?.trim() || "";
    }


    function getSelectedCity() {

        const country =
            countrySelect?.value;

        if (country === "canada") {

            return citySelect?.value || "";
        }

        return cityInput?.value?.trim() || "";
    }


    function getSelectedCurrency() {

        if (
            currencySelect?.value === "other"
        ) {

            return (
                customCurrencyInput?.value
                    ?.trim()
                    .toUpperCase() || "CUR"
            );
        }

        return currencySelect?.value || "CAD";
    }


    function getTaxRate() {

        if (taxSelect?.value === "custom") {

            return Number(
                customTaxRate?.value || 0
            );
        }

        return Number(
            taxSelect?.value || 0
        );
    }


    /* =====================================================
       10. CALCULATION HELPERS
    ===================================================== */

    function getNumber(id) {

        const element =
            document.getElementById(id);

        if (!element) return 0;

        const value =
            parseFloat(element.value);

        return Number.isFinite(value)
            ? value
            : 0;
    }


    function money(value) {

        const currency =
            getSelectedCurrency();

        return `${currency} ${Number(value || 0)
            .toFixed(2)}`;
    }


    /* =====================================================
       11. CALCULATE ESTIMATE
    ===================================================== */

    function calculateRepairEstimate() {

        const labourHours =
            getNumber("labourHours");

        const labourRate =
            getNumber("labourRate");

        const partsCost =
            getNumber("partsCost");

        const partsMarkup =
            getNumber("partsMarkup");

        const shopSupplies =
            getNumber("shopSupplies");

        const diagnosticFee =
            getNumber("diagnosticFee");

        const otherFees =
            getNumber("otherFees");


        /* Labour */

        const labourTotal =
            labourHours * labourRate;


        /* Parts markup */

        const partsMarkupAmount =
            partsCost * (partsMarkup / 100);

        const partsTotal =
            partsCost + partsMarkupAmount;


        /* Subtotal */

        const subtotal =
            labourTotal +
            partsTotal +
            shopSupplies +
            diagnosticFee +
            otherFees;


        /* Tax */

        const taxRate =
            getTaxRate();

        const taxAmount =
            subtotal * (taxRate / 100);


        /* Total */

        const total =
            subtotal + taxAmount;


        /* =================================================
           RESULT ELEMENTS
        ================================================= */

        const repairResults =
            document.getElementById("repairResults");

        const resultLabour =
            document.getElementById("resultLabour");

        const resultParts =
            document.getElementById("resultParts");

        const resultShopSupplies =
            document.getElementById("resultShopSupplies");

        const resultDiagnostic =
            document.getElementById("resultDiagnostic");

        const resultOtherFees =
            document.getElementById("resultOtherFees");

        const resultSubtotal =
            document.getElementById("resultSubtotal");

        const resultTax =
            document.getElementById("resultTax");

        const resultTotal =
            document.getElementById("resultTotal");

        const estimateLocation =
            document.getElementById("estimateLocation");

        const resultVehicle =
            document.getElementById("resultVehicle");

        const resultRepair =
            document.getElementById("resultRepair");


        if (resultLabour)
            resultLabour.textContent =
                money(labourTotal);

        if (resultParts)
            resultParts.textContent =
                money(partsTotal);

        if (resultShopSupplies)
            resultShopSupplies.textContent =
                money(shopSupplies);

        if (resultDiagnostic)
            resultDiagnostic.textContent =
                money(diagnosticFee);

        if (resultOtherFees)
            resultOtherFees.textContent =
                money(otherFees);

        if (resultSubtotal)
            resultSubtotal.textContent =
                money(subtotal);

        if (resultTax)
            resultTax.textContent =
                `${money(taxAmount)} (${taxRate.toFixed(2)}%)`;

        if (resultTotal)
            resultTotal.textContent =
                money(total);


        /* =================================================
           LOCATION DISPLAY
        ================================================= */

        const region =
            getSelectedRegion();

        const city =
            getSelectedCity();

        if (estimateLocation) {

            const locationParts = [];

            if (city)
                locationParts.push(city);

            if (region)
                locationParts.push(region);

            const countryName =
                countrySelect?.options[
                    countrySelect.selectedIndex
                ]?.textContent || "";

            if (countryName)
                locationParts.push(countryName);

            estimateLocation.textContent =
                locationParts.length
                    ? locationParts.join(", ")
                    : "Location not selected";
        }


        /* =================================================
           VEHICLE
        ================================================= */

        const year =
            document.getElementById("vehicleYear")
                ?.value?.trim() || "";

        const make =
            document.getElementById("vehicleMake")
                ?.value?.trim() || "";

        const model =
            document.getElementById("vehicleModel")
                ?.value?.trim() || "";

        const mileage =
            document.getElementById("vehicleMileage")
                ?.value?.trim() || "";


        if (resultVehicle) {

            const vehicleParts = [];

            if (year)
                vehicleParts.push(year);

            if (make)
                vehicleParts.push(make);

            if (model)
                vehicleParts.push(model);

            if (mileage)
                vehicleParts.push(
                    `${mileage} km`
                );

            resultVehicle.textContent =
                vehicleParts.length
                    ? vehicleParts.join(" ")
                    : "Vehicle not specified";
        }


        /* =================================================
           REPAIR DESCRIPTION
        ================================================= */

        const categoryText =
            categorySelect?.options[
                categorySelect.selectedIndex
            ]?.textContent || "";

        const serviceText =
            serviceSelect?.value || "";

        const positionText =
            positionSelect?.options[
                positionSelect.selectedIndex
            ]?.textContent || "";

        const description =
            repairDescription?.value?.trim() || "";


        const repairParts = [];

        if (categoryText &&
            categorySelect?.value) {

            repairParts.push(categoryText);
        }

        if (serviceText)
            repairParts.push(serviceText);

        if (
            positionText &&
            positionSelect?.value
        ) {
            repairParts.push(
                `(${positionText})`
            );
        }

        if (description)
            repairParts.push(
                `- ${description}`
            );


        if (resultRepair) {

            resultRepair.textContent =
                repairParts.length
                    ? repairParts.join(" ")
                    : "Repair not specified";
        }


        /* Show results */

        if (repairResults) {

            repairResults.style.display =
                "block";

            repairResults.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }


    /* =====================================================
       12. RESET
    ===================================================== */

    function resetRepairEstimator() {

        const form =
            document.querySelector(
                ".auto-repair-estimator-form"
            );

        if (form) {
            form.reset();
        }

        if (serviceSelect) {

            serviceSelect.innerHTML =
                '<option value="">Select service</option>';
        }

        if (positionSelect) {

            positionSelect.innerHTML =
                '<option value="">Select position</option>';
        }

        if (suggestedHoursInput)
            suggestedHoursInput.value = "";

        if (labourHoursInput)
            labourHoursInput.value = "1";

        if (repairResults)
            repairResults.style.display = "none";

        updateRegionField(
            countrySelect?.value || "canada"
        );

        updateCityField(
            countrySelect?.value || "canada"
        );

        updateCurrency(
            countrySelect?.value || "canada"
        );

        updateTaxForLocation();
    }


    /* =====================================================
       13. EVENT LISTENERS - LOCATION
    ===================================================== */

    if (countrySelect) {

        countrySelect.addEventListener(
            "change",
            () => {

                const country =
                    countrySelect.value;

                updateRegionField(country);
                updateCityField(country);
                updateCurrency(country);

                if (country === "canada") {

                    if (regionSelect)
                        regionSelect.value = "";

                    if (citySelect) {

                        citySelect.innerHTML =
                            '<option value="">Select city</option>';
                    }

                } else {

                    if (regionInput)
                        regionInput.value = "";

                    if (cityInput)
                        cityInput.value = "";
                }

                updateTaxForLocation();
            }
        );
    }


    if (regionSelect) {

        regionSelect.addEventListener(
            "change",
            () => {

                if (
                    countrySelect?.value === "canada"
                ) {

                    populateCanadianCities(
                        regionSelect.value
                    );
                }

                updateTaxForLocation();
            }
        );
    }


    if (currencySelect) {

        currencySelect.addEventListener(
            "change",
            updateCustomCurrency
        );
    }


    if (taxSelect) {

        taxSelect.addEventListener(
            "change",
            () => {

                if (
                    taxSelect.value === "custom"
                ) {

                    if (customTaxGroup)
                        customTaxGroup.hidden = false;

                } else {

                    if (customTaxGroup)
                        customTaxGroup.hidden = true;
                }
            }
        );
    }


    /* =====================================================
       14. EVENT LISTENERS - REPAIR SERVICE
    ===================================================== */

    if (categorySelect) {

        categorySelect.addEventListener(
            "change",
            populateRepairServices
        );
    }


    if (serviceSelect) {

        serviceSelect.addEventListener(
            "change",
            populateRepairPositions
        );
    }


    if (positionSelect) {

        positionSelect.addEventListener(
            "change",
            updateSuggestedHours
        );
    }


    /* =====================================================
       15. CALCULATE BUTTON
    ===================================================== */

    const calculateButton =
        document.getElementById(
            "calculateRepair"
        );

    if (calculateButton) {

        calculateButton.addEventListener(
            "click",
            calculateRepairEstimate
        );
    }


    /* =====================================================
       16. RESET BUTTON
    ===================================================== */

    const resetButton =
        document.getElementById(
            "resetRepair"
        );

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetRepairEstimator
        );
    }


    /* =====================================================
       17. ENTER KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" &&
                event.target.tagName !== "TEXTAREA"
            ) {

                const activeElement =
                    document.activeElement;

                if (
                    activeElement &&
                    (
                        activeElement.tagName ===
                        "INPUT" ||
                        activeElement.tagName ===
                        "SELECT"
                    )
                ) {

                    event.preventDefault();

                    calculateRepairEstimate();
                }
            }
        }
    );


    /* =====================================================
       18. INITIALIZATION
    ===================================================== */

    if (countrySelect) {

        const initialCountry =
            countrySelect.value || "canada";

        updateRegionField(initialCountry);
        updateCityField(initialCountry);
        updateCurrency(initialCountry);
    }


    if (taxSelect) {

        if (taxSelect.value === "custom") {

            if (customTaxGroup)
                customTaxGroup.hidden = false;

        } else {

            if (customTaxGroup)
                customTaxGroup.hidden = true;
        }
    }


    /* =====================================================
       19. CURRENT YEAR
    ===================================================== */

    const currentYear =
        document.getElementById("currentYear");

    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();
    }


    /* =====================================================
       20. PUBLIC API
    ===================================================== */

    window.KalMarketAutoRepairEstimator = {

        calculate:
            calculateRepairEstimate,

        reset:
            resetRepairEstimator,

        services:
            repairServices,

        canadianLocations:
            canadianLocations,

        internationalLocations:
            internationalLocations
    };

});
