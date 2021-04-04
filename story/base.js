var story = [
    {
        id: -1,
        text: [
            {
                content: [
                    "This content does not exist. If you believe this is an error, please report it to NachoToast on Discord.",
                ]
            },
            {
                content: [
                    "This text is unconditional and multiline.",
                    "This is the <span class='st_a'>second line</span>.\nMultiline can't be done inline with \\n and such, and what happens if you have a really really lon g line?",
                ]
            },
            {
                content: [
                    "This text is conditional.",
                    "You need a strength of above 5 to view it.",
                    "And an agility of 0."
                ],
                conditions: (player) =>
                    player.stats.strength.amount >= 5
                    &&
                    player.stats.agility.amount == 0,
                alternate: [
                    "peepee poopoo"
                ]
            }
        ],
        options: [
            {
                text: "inc 5m",
                time: {
                    minute: 5
                },
                scene: -1,
                conditions: (player) =>
                player.stats.strength > 5
                ||
                player.homekingdom == "Ignjoma",
                alternate: [
                    "unlucky ooz"
                ]
            },
            {
                text: "false",
                conditions: (player) => player.stats.strength < 0,
                alternate: ["oof", "mb"]
            },
            {
                text: "inc 5hr",
                time: {
                    hour: 5
                },
                scene: -1,
                novisit: true
            },
            {
                text: "inc 5d",
                time: {
                    day: 5
                }
            },
            {
                text: "inc 5w",
                time: {
                    week: 5
                }
            },
            {
                text: "inc 5m",
                time: {
                    month: 5
                }
            },
            {
                text: "inc 5y",
                time: {
                    year: 5
                },
            },
            {
                text: "go to 0",
                scene: 0
            },
            {
                text: "this option can only be done if this scene hasn't been visited yet",
                norepeat: 0
            },
            {
                text: "add strength",
                action: function() {
                    if (player.stats.strength.amount < 5) player.stats.strength.amount += 1;
                }
            },
            {
                text: "9"
            },
            {
                text: "0"
            },
            {
                text: "shift 1?"
            },
            {
                text: "shift 2???"
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.11",
            legacy_version: "0.0.1"
        }
    },
    {
        id: 0,
        text: [
            {
                content: [
                    "For better or for worse, you\'ve decided to become an adventurer. As you stand in the streets of Ebonfront, Ignoma\'s capital city, a warm feeling of freedom, inspiration, and motivation stirs within you.",
                    "What comes next is entirely up to you and you alone."
                ]
            }
        ],
        options: [
            {
                text: "go to -1",
                scene: -1
            },
            {
                text: "go to 54",
                scene: 54
            },
            {
                text: "go to this",
                time: {
                    minute: 1
                }
            }
        ]
    }
]