var story_ignoma = [
    {
        id: 0,
        text: [
            {
                content: [
                    "For better or for worse, you've decided to become an adventurer. As you stand in the streets of Ebonfront, Ignoma's capital city, a warm feeling of freedom, inspiration, and motivation stirs within you. What comes next is entirely up to you and you alone."
                ]
            }
        ],
        options: [
            {
                text: "Continue",
                scene: 1,
                time: false,
                fatigue: false
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.14",
            legacy_version: "0.0.2"
        }
    }, // 0
    {
        id: 1,
        text: [
            {
                content: [
                    "Ebonfront is the capital city of Ignoma, located on its Northeast coastline, and has enormous harbors to support its vibrant fishing and trade industry."
                ],
                norepeat: true,
                alternate: [
                    "You stand in the main streets of Ebonfront, Ignoma's capital."
                    ]
            },
            {
                content: [
                    "The sound of workers at the docks rings throughout the city, and the smell of fresh fish lingers in the air."
                ],
                conditions: (player) =>
                player.time.getHours() >= 7
                &&
                player.time.getHours() <= 13
            },
            {
                content: [
                    "Several signs point towards a local inn."
                ]
            }
        ],
        options: [
            {
                text: "Help out on the docks.",
                scene: 2,
                conditions: (player) =>
                player.time.getHours() >= 7
                &&
                player.time.getHours() <= 13
            },
            {
                text: "Visit an inn.",
                scene: 4
            },
            {
                text: "Head to the city outskirts.",
                scene: 11,
                time: {minute: 5},
                fatigue: 1
            },
            {
                text: "Wander through the streets.",
                time: {minute: 15} 
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.14",
            legacy_version: "0.0.3"
        }
    }, // 1
    {
        id: 2,
        text: [
            {
                content: [
                    "You offer to help load and unload cargo on the docks."
                ]
            },
            {
                content: [
                    "The workers <span style='color: lightgreen'>happily agree</span>, happy to have a helping hand.",
                ]
            }
        ],
        options: [
            {
                text: "Work at the docks.",
                time: {hour: 5},
                scene: 3,
                fatigue: 30,
                action: function() {
                    if (player.stats.strength.amount < 5) player.stats.strength.amount += 1;
                    player.gold += 20;
                    // to do: add messages for stat changes.
                }
            },
            {
                text: "Change your mind and return to the main streets.",
                scene: 1
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.14",
            legacy_version: "0.0.4"
        }
    }, // 2
    {
        id: 3,
        text: [
            {
                content: [
                    "The hours go by in a flash as you help out on the docks."
                ]
            }
        ],
        options: [
            {
                text: "Return to the main streets.",
                scene: 1
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.14",
            legacy_version: "0.0.4"
        }
    }, // 3
    {
        id: 4,
        text: [
            {
                content: [
                    "You make your way to the local inn."
                ]
            },
            {
                content: [
                    "The inn is crowded with people talking and drinking in groups.",
                    "The innkeeper stands at the counter, looking out for trouble."
                ],
                conditions: (player) => player.time.getHours() >= 7
            },
            {
                content: [
                    "The counter is staffed by a night-shift worker, they nonchalantly glance at you upon entrance."
                ],
                conditions: (player) =>
                player.time.getHours() <= 6
            }
        ],
        options: [
            {
                text: "Approach them.",
                scene: 5,
                conditions: (player) => player.time.getHours() >= 7
            },
            {
                text: "Approach them.",
                scene: 6,
                conditions: (player) => player.time.getHours() <= 6
            },
            {
                text: "Head to your room.",
                conditions: () => has_inn(10),
                scene: 8
            },
            {
                text: "Leave the inn and return to the main streets.",
                scene: 1
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.14",
            legacy_version: "0.0.5"
        }
    }, // 4
    {
        id: 5,
        text: [
            {
                content: [
                    "\"Here for a room or some food and drink?\" the innkeeper asks you."
                ]
            },
            {
                content: [
                    "\"The rooms are 10 gold a night.\" they add."
                ],
                conditions: () => has_inn(10) == false
            }
        ],
        options: [
            {
                text: "\"A room please.\"",
                scene: 7,
                conditions: (player) => player.gold >= 10 && has_inn(10) == false,
                action: function() {
                    player.gold -= 10;
                    add_inn(10)
                }
            },
            {
                text: "\"Some food and drink.\"",
                action: function() {start_trade("Innkeeper", "seaside")},
                scene: 9
            },
            {
                text: "\"Nevermind.\"",
                scene: 9
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.14",
            legacy_version: "0.0.5"
        }
    }, // 5
    {
        id: 6,
        text: [
            {
                contents: [
                    "\"Bar's closed, rooms are 10 gold a night.\""
                ]
            }
        ],
        options: [
            {
                text: "\"A room please.\"",
                scene: 7,
                conditions: (player) => player.gold >= 10 && has_inn(10) == false,
                action: function() {
                    player.gold -= 10;
                    add_inn(10)
                }
            },
            {
                text: "\"Nevermind.\"",
                scene: 9
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.14",
            legacy_version: "0.0.5"
        }
    }, // 6
    {
        id: 7,
        text: [
            {
                content: [
                    "You are given your room key and head upstairs."
                ]
            }
        ],
        options: [
            {
                text: "Sleep [1hr] (-10% Fatigue)",
                scene: 10,
                action: function() {player.fatigue *= 0.9},
                fatigue: false,
                time: {hour: 1}
            },
            {
                text: "Sleep [3hr] (-50% Fatigue) (Restores Health)",
                scene: 10,
                action: function() {player.fatigue *= 0.5; player.health = player.max_health},
                fatigue: false,
                time: {hour: 3}
            },
            {
                text: "Sleep [6hr] (-100% Fatigue) (Restors Health & Mana)",
                scene: 10,
                action: function() {player.fatigue = 0; player.health = player.max_health; player.mana = player.max_health},
                fatigue: false,
                time: {hour: 6}
            },
            {
                text: "Go downstairs.",
                scene: 9
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.14",
            legacy_version: "0.0.5"
        }
    }, // 7
    {
        id: 8,
        text: [
            {
                content: [
                    "You head upstairs to your room."
                ]
            }
        ],
        options: [
            {
                text: "Go downstairs.",
                scene: 9
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.14",
            legacy_version: "0.0.5"
        }
    }, // 8
    {
        id: 9,
        text: [
            {
                content: [
                    "You stand inside the local inn, looking around its interior absentmindedly."
                ]
            },
            {
                content: [
                    "The inn is crowded with people talking and drinking in groups."
                ],
                conditions: (player) => player.time.getHours() >= 7
            },
            {
                content: [
                    "The innkeeper stands at the counter, serving someone a drink."
                ],
                conditions: (player) => player.time.getHours() >= 7
            },
            {
                content: [
                    "The counter is staffed by a night-shift worker."
                ],
                conditions: (player) => player.time.getHours() <= 6
            }
        ],
        options: [
            {
                text: "Approach them.",
                scene: 5,
                conditions: (player) => player.time.getHours() >= 7
            },
            {
                text: "Approach them.",
                scene: 6,
                conditions: (player) => player.time.getHours() <= 6
            },
            {
                text: "Head to your room.",
                scene: 8,
                conditions: () => has_inn(10)
            },
            {
                text: "Leave the inn.",
                scene: 1
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.14",
            legacy_version: "0.0.5"
        }
    }, // 9
    {
        id: 10,
        text: [
            {
                content: [
                    "You stand in your room at the inn."
                ]
            }
        ],
        options: [
            {
                text: "Go downstairs.",
                scene: 9
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.14",
            legacy_version: "0.0.5"
        }
    }, // 10
    {
        id: 11,
        text: [
            {
                content: [
                    "You arrive at the outskirts of Ebonfront."
                ]
            },
            {
                content: [
                    "Many travellers are coming in and out of the city, and numerous caravans are preparing to set off."
                ],
                conditions: (player) => player.time.getHours() >= 6 && player.time.getHours() <= 15
            },
            {
                content: [
                    "Many travellers are coming into the city, but it is too late for any caravans to be leaving."
                ],
                conditions: (player) => player.time.getHours() >= 16
            },
            {
                content: [
                    "The streets are deserted, and almost nobody is seen arriving at the city."
                ],
                conditions: (player) => player.time.getHours() <= 5
            }
        ],
        options: [
            {
                text: "Ask to join one.",
                conditions: (player) => player.time.getHours() >= 6 && player.time.getHours() <= 15,
                scene: 12
            },
            {
                text: "Go into the city.",
                scene: 1,
                time: {minute: 5}
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.14",
            legacy_version: "0.1.1"
        }
    }, // 11
    {
        id: 12,
        text: [
            {
                content: [
                    "You approach a group of caravans, they're all headed to different neighbouring regions in Ignoma."
                ]
            }
        ],
        options: [
            {
                text: "Try caravan to Freygrave.",
                scene: 13
            },
            {
                text: "Try caravan to Timberside.",
                scene: 18
            },
            {
                text: "Back",
                scene: 11
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.14",
            legacy_version: "0.1.1"
        }
    }, // 12
    {
        id: 13,
        text: [
            {
                content: [
                    "You ask the head of the caravan if you can tag along.",
                    "\"Sure we got space, ain\'t doing it for free though, it\'s gonna cost ya, what say 20 gold?\""
                ]
            }
        ],
        options: [
            {
                text: "Agree",
                scene: 14,
                conditions: (player) => player.gold >= 20,
                alternate: [
                    "You don't have enough gold to accept this offer."
                ],
                action: function() {player.gold -= 20},
                time: {day: 1, minute:5}
            },
            {
                text: "Decline",
                scene: 11
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.14",
            legacy_version: "0.1.1"
        }
    }, // 13
    {
        id: 14,
        text: [
            {
                content: [
                    "You help organize the caravan and shortly set off for Freygrave. The sound of the ocean fades as you travel further inland, and as the journey nears its end you see the town of Freygrave approaching.",
                    "As you arrive at Freygrave you disembark from the wagon and thank the others as they go on their way."
                ]
            }
        ],
        options: [
            {
                text: "Continue",
                scene: 15
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.14",
            legacy_version: "0.1.1"
        }
    }, // 14
    {
        id: 15,
        text: [
            {
                content: [
                    "Freygrave is a small town on the eastern border of Ignoma. There isn't much to do here as the town is merely used as a checkpoint between Ignoma and The Luma Empire."
                ],
                norepeat: true
            },
            {
                content: [
                    "You stand on the main streets, or rather street, of Freygrave."
                ]
            },
            {
                content: [
                    "A few groups of people on horse-drawn wagons are travelling through the street."
                ],
                conditions: (player) => player.time.getHours() >= 7 && player.time.getHours() <= 18
            },
            {
                content: [
                    "A large caravan headed of Wildedenn is preparing to depart soon."
                ],
                conditions: (player) => player.time.getHours() >= 6 && player.time.getHours() <= 12,
                alternate: [
                    "The daily caravan to Wildedenn has already departed. You'll have to wait until tomorrow if you want to visit The Luma Empire."
                ]
            }
        ],
        options: [
            {
                text: "Approach a wagon headed to Ebonfront.",
                scene: 16,
                conditions: (player) => player.time.getHours() >= 7 && player.time.getHours() <= 18
            },
            {
                text: "Approach a wagon headed towards Timberside.",
                scene: 25,
                conditions: (player) => player.time.getHours() >= 7 && player.time.getHours() <= 18
            },
            {
                text: "Ask to join the Wildedenn caravan.",
                scene: 31,
                conditions: (player) => player.time.getHours() >= 6 && player.time.getHours() <= 12
            },
            {
                text: "Wander the street.",
                time: {minute: 15}
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.15",
            legacy_version: "0.1.1"
        }
    }, // 15
    {
        id: 16,
        text: [
            {
                content: [
                    "You run up to a group of travellers who are headed in the direction of Ebonfront."
                ]
            },
            {
                content: [
                    "\"We've got plenty of room if you need a lift to Ebonfront, don't worry about payment.\""
                ]
            }
        ],
        options: [
            {
                text: "Travel to Ebonfront.",
                scene: 17,
                time: {day: 1}
            },
            {
                text: "Nevermind.",
                scene: 15
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.15",
            legacy_version: "0.1.1"
        }
    }, // 16
    {
        id: 17,
        text: [
            {
                content: [
                    "Thanking the travellers for their kindness, you board the wagon and head to Ebonfront.",
                    "The day-long journey seems to fly by in an instant, and before you know it you're approaching the outskirts of Ebonfront."
                ]
            },
            {
                content: [
                    "You've arrived at Ebonfront, Ignoma's capital city and home to it's reputable fishing industry and glamorous ports."
                ],
                norepeat: true
            }
        ],
        options: [
            {
                text: "Continue",
                scene: 11
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.15",
            legacy_version: "0.1.1"
        }
    }, // 17
    {
        id: 18,
        text: [
            {
                content: [
                    "You run up to the head of the caravan and ask to join.",
                    "\"Sure that's fine, we're in a bit of a hurry though so we're leaving straight away, still on board?\""
                ]
            }
        ],
        options: [
            {
                text: "\"Sure.\"",
                scene: 19,
                time: {hour: 23, minute: 30}
            },
            {
                text: "Nevermind."
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.15",
            legacy_version: "0.1.2"
        }
    }, // 18
    {
        id: 19,
        text: [
            {
                content: [
                    "You hastily join the caravan and set off towards Timberside. As you head further inland the ocean's sound and breeze slowly fades, replaced with the smell of pine.",
                    "The day-long journey goes by quickly and you arrive earlier than expected due to the caravan's haste.",
                    "You thank the travellers for their generosity and quickly disembark the wagon as they make their way further into the residential area of town."
                ]
            }
        ],
        options: [
            {
                text: "Continue",
                scene: 20
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.15",
            legacy_version: "0.1.2"
        }
    }, // 19
    {
        id: 20,
        text: [
            {
                content: [
                    "Welcome to Timberside, a medium-sized town on Ignoma's southeast border. Timberside is a common stopover point and trade center for the various small villages in Light Witesia."
                ],
                conditions: (player) => player.hometown !== "Timberside",
                norepeat: true
            },
            {
                content: [
                    "You wander through the main streets of Timberside."
                ]
            },
            {
                content: [
                    "Various farmers from nearby Ignoman and Light Witesian villages are managing stalls along the main roads, selling fresh produce and a multitude of animal products."
                ],
                conditions: (player) => player.time.getHours() >= 6 && player.time.getHours() <= 18
            },
            {
                content: [
                    "A large hub for arriving and departing caravans is situated further up the main road, crowded with the many travelling merchants, villagers, hunters, and more all looking to go somewhere."
                ],
                conditions: (player) => player.time.getHours() >= 6 && player.time.getHours() <= 18,
                alternate: [
                    "A large hub for arriving and departing caravans is situated further up the main road, at this time little activity is present around it, although it still remains open."
                ]
            }
        ],
        options: [
            {
                text: "Make your way towards the travel hub.",
                scene: 21,
                conditions: (player) => player.time.getHours() >= 6 && player.time.getHours() <= 18
            },
            {
                text: "Visit the local inn.",
                scene: 28
            },
            {
                text: "Wander the streets.",
                time: {minute: 15}
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.15",
            legacy_version: "0.1.2"
        }
    }, // 20
    {
        id: 21,
        text: [
            {
                content: [
                    "You enter the Timberside travel hub through it's large front-facing gateway. It's spaceious interior is full of parked wagons and carriages."
                ]
            },
            {
                content: [
                    "At this time of day, the building is crowded with carriages, wagons, and carts carrying all sorts of goods, standing out amidst a sea of merchants, travellers, and locals.",
                    "A few passenger carriages line up at the far end of the building, likely waiting for customers to transport."
                ],
                conditions: (player) => player.time.getHours() >= 6 && player.time.getHours() <= 18,
                alternate: [
                    "There are very few people wandering around the building at this time, a few guards here and there and sparse merchants, some of whom seem less than savoury."
                ]
            }
        ],
        options: [
            {
                text: "Go towards the taxi carriages.",
                scene: 22,
                conditions: (player) => player.time.getHours() >= 6 && player.time.getHours() <= 18,
                alternate: [
                    "You'll have to wait until 6am if you want to catch a lift anywhere."
                ]
            },
            {
                text: "Leave the building.",
                scene: 20
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.15",
            legacy_version: "0.1.2"
        }
    }, // 21
    {
        id: 22,
        text: [
            {
                content: [
                    "You approach the line of waiting carriages, a staff member nearby walks up to you.",
                    "\"Rides from the Timberside travel hub are priced at the standard 20 gold coins, where are you headed?\""
                ]
            }
        ],
        options: [
            {
                text: "Ebonfront",
                scene: 23,
                conditions: (player) => player.gold >= 20,
                action: function() {player.gold -= 20},
                time: {day: 1}
            },
            {
                text: "Freygrave",
                scene: 24,
                conditions: (player) => player.gold >= 20,
                action: function() {player.gold -= 20},
                time: {hour: 12}
            },
            {
                text: "Basinfront",
                scene: 27,
                conditions: (player) => player.gold >= 20,
                action: function() {player.gold -= 20},
                time: {day: 1}
            },
            {
                text: "Nevermind",
                scene: 21
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.15",
            legacy_version: "0.1.2"
        }
    }, // 22
    {
        id: 23,
        text: [
            {
                content: [
                    "The staff member quickly hails a carriage and sends you off on your way to Ebonfront once you pay your fare.",
                    "The journey is plain and uneventful, and after a day the city of Ebonfront visibly draws closer."
                ]
            },
            {
                content: [
                    "You've arrived at Ebonfront, Ignoma's capital city and home to it's reputable fishing industry and glamorous ports."
                ],
                norepeat: true
            }
        ],
        options: [
            {
                text: "Continue",
                scene: 11
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.15",
            legacy_version: "0.1.2"
        }
    }, // 23
    {
        id: 24,
        text: [
            {
                content: [
                    "The staff member quickly hails a carriage and send you off on your way to Freygrave.",
                    "The journey passes by uneventfully, and once the half-day is up you thank the driver as you dismount the carriage onto the streets of Freygrave."
                ]
            }
        ],
        options: [
            {
                text: "Continue",
                scene: 15
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.15",
            legacy_version: "0.1.2"
        }
    }, // 24
    {
        id: 25,
        text: [
            {
                content: [
                    "You run up to a group of travellers who are headed in the direction of Timberside, one of them stops to talk to you.",
                    "\"15 Gold if you want to tag along, not negotiating.\""
                ]
            }
        ],
        options: [
            {
                text: "Accept",
                scene: 26,
                time: {hour: 12},
                conditions: (player) => player.gold >= 15,
                alternate: [
                    "You do not have enough gold to accept this offer."
                ]
            },
            {
                text: "Decline",
                scene: 15
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.15",
            legacy_version: "0.1.2"
        }
    }, // 25
    {
        id: 26,
        text: [
            {
                content: [
                    "You give the travellers 15 gold and join their caravan. The weather takes a turn on the way to Timberside but luckily the carriages are enclosed by a waterproof layer of tarp.",
                    "As the journey comes to an end and the rain settles, you being to see the outskirts of Timberside coming into view."
                ]
            }
        ],
        options: [
            {
                text: "Continue",
                scene: 20
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.15",
            legacy_version: "0.1.2"
        } 
    }, // 26
    {
        id: 27,
        text: [
            {
                content: [
                    "You give the staff member the gold as they hail a waiting carriage.",
                    "As you being to journey towards Light Witesia, the surrounding woods become more dense and the path less built-up. Signs of human civilization become less frequent all the way up until you reach the village of Basinfront."
                ]
            }
        ],
        options: [
            {
                text: "Continue",
                scene: 101
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.15",
            legacy_version: "0.1.3"
        }
    }, // 27
    {
        id: 28,
        text: [
            {
                content: [
                    "You stand inside Timberside's primary inn."
                ]
            },
            {
                content: [
                    "The innkeeper stands at the counter."
                ],
                conditions: (player) => player.time.getHours() >= 7 && player.time.getHours() <= 22,
                alternate: [
                    "An innkeeper working the night shift stands at the counter."
                ]
            }
        ],
        options: [
            {
                text: "Approach them.",
                scene: 29
            },
            {
                text: "Go upstairs to your room.",
                scene: 30,
                conditions: () => has_inn(30)
            },
            {
                text: "Leave",
                scene: 20
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.15",
            legacy_version: "0.1.5"
        }
    }, // 28
    {
        id: 29,
        text: [
            {
                content: [
                    "You walk up to the counter."
                ]
            },
            {
                content: [
                    "Welcome to the inn, we've got rooms for 12 gold each, and serve meals as well."
                ],
                conditions: (player) => player.time.getHours() >= 7 && player.time.getHours() <= 22,
                alternate: [
                    "Welcome, rooms are 12 gold each and the kitchen opens at 7."
                ]
            }
        ],
        options: [
            {
                text: "\"A room please.\"",
                conditions: (player) => player.gold >= 12 && has_inn(30) == false,
                scene: 28,
                action: function() {player.gold -= 12; add_inn(30)},
                alternate: [
                    "You do not have enough gold for a room."
                ],
                hard_conditions: () => has_inn(30) == false
            },
            {
                text: "\"What's on the menu?\"",
                action: function() {start_trade("Innkeeper")},
                scene: 28
            },
            {
                text: "\"Nevermind.\"",
                scene: 28
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.15",
            legacy_version: "0.1.5"
        }
    }, // 29
    {
        id: 30,
        text: [
            {
                content: [
                    "You are in your room at the Timberside inn."
                ]
            }
        ],
        options: [
            {
                text: "Leave",
                scene: 28
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.15",
            legacy_version: "0.1.5"
        }
    }, // 30
    {
        id: 31,
        text: [
            {
                content: [
                    "You walk to up the caravan overseers and enquire about joining.",
                    "\"It's 30 gold if you're joining as an ordinary traveller, The Luma Empire is a dangerous place and hiring protection is costly. If you're any good with a weapon however, we'd be more than happy having you onboard for free.\""
                ]
            }
        ],
        options: [
            {
                text: "Join Caravan",
                conditions: (player) => player.gold >= 30,
                action: function() {player.gold -= 30},
                time: {day: 5},
                scene: 32,
                alternate: [
                    "You do not have enough gold to join the caravan."
                ]
            },
            {
                text: "Nevermind",
                scene: 15
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.16",
            legacy_version: "0.1.5"
        }
    }, // 31
    {
        id: 32,
        text: [
            {
                content: [
                    "You pay the gold and join the caravan. By midday everyone is ready and you set off on the 5-day journey to Wildedenn.",
                    "The lush forestry and grassy plains of Ignoma are left behind and the surroundings turn into vast sandy deserts and dunes as far as the eye can see.",
                    "You cross few others on the road, most travelling in a similar manner to your caravan, heavily guarded and leveraging safety in numbers.",
                    "Thanks to the caravan's hired guards, most lurking bandits are deterred and you are able to get to Wildedenn without any trouble.",
                    "You thank the caravan organisers for helping you safely get to Wildedenn, they bid you farewell."
                ]
            }
        ],
        options: [
            {
                text: "Continue",
                scene: 201
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.16",
            legacy_version: "0.1.5"
        }
    }, // 32
];
story = story.concat(story_ignoma);
rest_scenes.push(8, 10, 30);
