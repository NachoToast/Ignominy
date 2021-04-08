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
                fatigue: false,
                time: false
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
                    "You stand in the main streets of Ebonfront, Ignoma's capital."
                ]
            },
            {
                content: [
                    "Ebonfront is the capital city of Ignoma, located on its Northeast coastline, and has enormous harbors to support its vibrant fishing and trade industry."
                ],
                norepeat: true
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
    },
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
                action: function() {player.gold -= 20}
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
    }
]
story = story.concat(story_ignoma);