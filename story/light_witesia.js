var story_light_witesia = [
    {
        id: 100,
        text: [
            {
                content: [
                    "You stand near the center of your home village in Light Witesia. Villagers are starting daily activities; hunters going into the surrounding forest, travelling merchants setting up stalls, and the delicious smell of fresh bread wavers through the air."
                ]
            }
        ],
        options: [
            {
                text: "Continue",
                scene: 101,
                time: false,
                fatigue: false
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.16",
            legacy_version: "0.1.4"
        }
    }, // 100
    {
        id: 101,
        text: [
            {
                content: [
                    "You've reached Basinfront, a prominent village in the north of Light Witesia. Hunters and explorers frequent this village due to its close proximity to the vast, dense, and unexplored jungles surrounding it."
                ],
                norepeat: true,
                conditions: (player) => player.hometown !== "Basinfront"
            },
            {
                content: [
                    "You wander down the main road of Basinfront."
                ]
            },
            {
                content: [
                    "Although the village is small, the street is busy with many villagers, hunters, and explorers going about their day."
                ],
                conditions: (player) => player.time.getHours() >= 6 && player.time.getHours() <= 18
            },
            {
                content: [
                    "A lot of people are entering a building displaying a \"Hunters Guild\" banner."
                ],
                norepeat: 104,
                conditions: (player) => player.time.getHours() >= 6 && player.time.getHours() <= 10 
            },
            {
                content: [
                    "The Hunters Guild building is open."
                ],
                conditions: (player) => player.time.getHours() >= 6 && player.time.getHours() <= 10,
                norepeat: [104, 1, true]
            }
        ],
        options: [
            {
                text: "Go to the Hunters Guild",
                scene: 104,
                conditions: (player) => player.time.getHours() >= 6 && player.time.getHours() <= 10
            },
            {
                text: "Visit the local inn",
                scene: 113
            },
            {
                text: "Hitchike to Timberside",
                scene: 102,
                time: {minute: 5}
            },
            {
                text: "Hitchike to Oldwatch",
                scene: 111,
                time: {minute: 5}
            },
            {
                text: "Wander through the village",
                scene: 101,
                time: {minute: 15}
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.16",
            legacy_version: "0.1.4"
        }
    }, // 101
    {
        id: 102,
        random: true,
        text: [
            {
                content: [
                    "You try your luck at hitchiking to Timberside."
                ]
            },
            {
                content: [
                    "Unfortunately nobody stops to offer you a lift."
                ],
                conditions: (player) => player.random <= 50,
                alternate: [
                    "A passing explorer offers you a lift."
                ]
            }
        ],
        options: [
            {
                text: "Keep trying",
                conditions: (player) => player.random <= 50,
                time: {minute: 5}
            },
            {
                text: "Give up",
                conditions: (player) => player.random <= 50,
                scene: 101
            },
            {
                text: "Accept the offer",
                scene: 103,
                conditions: (player) => player.random > 50,
                time: {day: 1}
            },
            {
                text: "Decline",
                scene: 101,
                conditions: (player) => player.random > 50
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.16",
            legacy_version: "0.1.4"
        }
    }, // 102
    {
        id: 103,
        text: [
            {
                content: [
                    "You jump in the explorer's wagon and make your way to Timberside.",
                    "You make small talk with the generous explorer on the way."
                ]
            },
            {
                content: [
                    "They passionately explain their theories about hidden villages of humanoid people deep in the jungle."
                ],
                conditions: (player) => player.random >= 90
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
            version: "0.1.16",
            legacy_version: "0.1.4"
        }
    }, // 103
    {
        id: 104,
        text: [
            {
                content: [
                    "You're in the Hunters Guild building. The atmosphere is noisy yet pleasant as you overhear various groups of hunters, explorers, and guild staff planning out their daily expeditions.",
                    "A large wooden noticeboard stands near the entrance, filled with details about quests and parties to join for the surrounding area."
                ],
            }
        ],
        options: [
            {
                text: "Walk up to the noticeboard",
                scene: 105
            },
            {
                text: "Exit",
                scene: 101
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.16",
            legacy_version: "0.1.4"
        }
    }, // 104
    {
        id: 105,
        text: [
            {
                content: [
                    "You stop to look at the noticeboard, it's filled with advertisements and recruitment posters for hunters and explorers."
                ]
            }
        ],
        options: [
            {
                text: "View hunter-related posters",
                scene: 106,
                fatigue: false,
                time: false
            },
            {
                text: "View explorer-related posters",
                scene: 107,
                fatigue: false,
                time: false
            },
            {
                text: "View other posters",
                scene: 108,
                fatigue: false,
                time: false
            },
            {
                text: "Move away",
                scene: 104
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.16",
            legacy_version: "0.1.4"
        }
    }, // 105
    {
        id: 106,
        text: [
            {
                content: [
                    "You look at the hunter-related posters on the board."
                ]
            },
            {
                content: [
                    "A small group of local hunters are going on a daily hunting trip, offering 50 gold to any able hunters who wish to join them."
                ]
            }
        ],
        options: [
            {
                text: "Join the small group of local hunters",
                scene: 109,
                time: {minute: 5}
            },
            {
                text: "Back",
                scene: 105,
                time: false,
                fatigue: false
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.16",
            legacy_version: "0.1.4"
        }
    }, // 106
    {
        id: 107,
        text: [
            {
                content: [
                    "You look at the explorer-related posters on the board."
                ]
            },
            {
                content: [
                    "There's nothing that catches your eye."
                ]
            }
        ],
        options: [
            {
                text: "Back",
                scene: 105,
                time: false,
                fatigue: false
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.16",
            legacy_version: "0.1.4"
        }
    }, // 107
    {
        id: 108,
        text: [
            {
                content: [
                    "You look at the other posters on the board."
                ]
            },
            {
                content: [
                    "There's not much here, and none of them stand out."
                ]
            }
        ],
        options: [
            {
                text: "Back",
                scene: 105,
                time: false,
                fatigue: false
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.16",
            legacy_version: "0.1.4"
        }
    }, // 108
    {
        id: 109,
        text: [
            {
                content: [
                    "You read through the details on the notice and find the group of local hunters sitting at a table in the building. After a quick period of preperation you set off to a lesser-known animal ground."
                ]
            }
        ],
        options: [
            {
                text: "Continue",
                scene: 110,
                time: {hour: 7},
                action: function() {
                    if (player.stats.strength.amount < 5) player.stats.strength.amount += 1;
                    if (player.stats.agility.amount < 5) player.stats.agility.amount += 1;
                    if (player.stats.strength.amount >= 5 && player.stats.agility.amount >= 5 && player.stats.perception.amount < 5) player.stats.perception.amount += 1;
                    player.gold += 50;
                },
                fatigue: 40
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.16",
            legacy_version: "0.1.4"
        }
    }, // 109
    {
        id: 110,
        text: [
            {
                content: [
                    "The hunt is successful, you and the other hunters were able to get quite a few animal corpses without incident.",
                    "They happily hand you the promised gold before leaving towards their homes."
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
            version: "0.1.16",
            legacy_version: "0.1.4"
        }
    }, // 110
    {
        id: 111,
        random: true,
        text: [
            {
                content: [
                    "You try your luck at hitchiking to Oldwatch"
                ]
            },
            {
                content: [
                    "A passing merchant offers you a lift.",
                ],
                conditions: (player) => player.random > 50,
                alternate: [
                    "Unfortunately nobody stops to offer you a lift."
                ]
            }
        ],
        options: [
            {
                text: "Accept it",
                conditions: (player) => player.random > 50,
                time: {day: 1},
                scene: 112
            },
            {
                text: "Decline",
                conditions: (player) => player.random > 50,
                scene: 101
            },
            {
                text: "Keep trying",
                time: {minute: 5},
                conditions: (player) => player.random <= 50 && player.time.getHours() >= 6 && player.time.getHours() <= 18
            },
            {
                text: "Give up",
                scene: 101,
                conditions: (player) => player.random <= 50
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.16",
            legacy_version: "0.1.5"
        }
    }, // 111
    {
        id: 112,
        text: [
            {
                content: [
                    "You accept the merchant's offer and climb into the carriage.",
                    "The dense forests and surrounding jungles slowly fade into open farmlands as you journey to Oldwatch. The day-long journey eventually comes to an end and the merchant bids you farewell as you dismount the carriage."
                ]
            }
        ],
        options: [
            {
                text: "Continue",
                scene: 151
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.16",
            legacy_version: "0.1.5"
        }
    }, // 112
    {
        id: 113,
        text: [
            {
                content: [
                    "You're stand in Basinfront's local inn."
                ],
                conditions: (player) => player.previous_scene == 118 || player.previous_scene == 115,
                alternate: [
                    "You enter Basinfront's local inn."
                ]
            },
            {
                content: [
                    "The innkeeper stands at the bar, serving someone a drink."
                ],
                conditions: (player) => player.time.getHours() >= 7,
                alternate: [
                    "A staff member sits at the inn's counter, working the night shift."
                ]
            }
        ],
        options: [
            {
                text: "Approach the innkeeper",
                conditions: (player) => player.time.getHours() >= 7,
                scene: 115
            },
            {
                text: "Approach the staff member",
                conditions: (player) => player.time.getHours() <= 6,
                scene: 115
            },
            {
                text: "Go upstairs to your room",
                scene: 118,
                conditions: () => has_inn(118)
            },
            {
                text: "Leave",
                scene: 101
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.16",
            legacy_version: "0.1.5"
        }
    }, // 113
    {
        id: 115,
        text: [
            {
                content: [
                    "You walk up to the innkeeper."
                ],
                conditions: (player) => player.time.getHours() >= 7,
                alternate: [
                    "You walk up to the inn staff."
                ]
            },
            {
                content: [
                    "\"A new face, what can I get you?\""
                ],
                norepeat: true,
                conditions: (player) => player.hometown !== "Basinfront",
                alternate: [
                    "\"What can I get you today?\""
                ],
                hard_conditions: (player) => player.time.getHours() >= 7
            },
            {
                content: [
                    "\"Rooms start at 10 gold a night, before you say that sounds expensive know we get a lot of travellers through here, so they're in high demand.\""
                ],
                conditions: (player) => player.time.getHours() >= 7,
                alternate: [
                    "\"Rooms are 10 gold a night.\""
                ]
            }
        ],
        options: [
            {
                text: "Pay for a room",
                conditions: (player) => player.gold >= 10,
                action: function() {
                    add_inn(118);
                    player.gold -= 10;
                },
                scene: 118
            },
            {
                text: "Browse the menu",
                conditions: (player) => player.time.getHours() >= 7,
                scene: 113,
                action: function() {start_trade("Innkeeper")}
            },
            {
                text: "Nevermind",
                scene: 113
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.16",
            legacy_version: "0.1.5"
        }
    }, // 115
    {
        id: 118,
        text: [
            {
                content: [
                    "You get your room key and head down the hallway towards the room."
                ],
                conditions: (player) => player.previous_scene == 115,
                alternate: [
                    "You're in your room at the Basinfront inn."
                ]
            }
        ],
        options: [
            {
                text: "Leave room",
                scene: 113
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.16",
            legacy_version: "0.1.5"
        }
    }, // 118
    {
        id: 151,
        text: [
            {
                content: [
                    "You're now in Oldwatch, Light Witesia's northernomst village. Due to its relatively large distance from Light Witesia's dense forests and jungles, Oldwatch is primarily surrounded by open fields of various crops and animals."
                ],
                norepeat: true,
                conditions: (player) => player.hometown !== "Oldwatch",
                alternate: [
                    "You stand on the streets of Oldwatch."
                ]
            }
        ],
        options: [
            {
                text: "Hitchike to Basinfront",
                conditions: (player) => player.time.getHours() >= 6 && player.time.getHours() <= 18,
                time: {minute: 5}
            },
            {
                text: "Wander the streets",
                time: {minute: 15}
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.16",
            legacy_version: "0.1.5"
        }
    }, // 151
    {
        id: 152,
        random: true,
        text: [
            {
                content: [
                    "You stand on the main road and try to hitchike your way to Basinfront."
                ]
            },
            {
                content: [
                    "A passing hunter offers you a lift."
                ],
                conditions: (player) => player.random > 50,
                alternate: [
                    "Unfortunately nobody stops to offer you a lift."
                ]
            }
        ],
        options: [
            {
                text: "Accept it",
                time: {day: 1},
                scene: 153,
                conditions: (player) => player.random > 50
            },
            {
                text: "Decline",
                scene: 151,
                conditions: (player) => player.random > 50
            },
            {
                text: "Keep trying",
                time: {minute: 5},
                conditions: (player) => player.time.getHours() >= 6 && player.time.getHours() <= 18 && player.random <= 50
            },
            {
                text: "Give up",
                scene: 151,
                conditions: (player) => player.random <= 50
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.16",
            legacy_version: "0.1.5"
        }
    }, // 152
    {
        id: 153,
        text: [
            {
                content: [
                    "You accept the hunter's offer and join them on their journey to Basinfront. The open farmland surroundings soon turn into dense forests and jungle canopies and before long you reach Basinfront."
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
            version: "0.1.16",
            legacy_version: "0.1.5"
        }
    }, // 153
];
story = story.concat(story_light_witesia);
rest_scenes.push(118);