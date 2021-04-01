var story = [
    {
        id: -1,
        text: [
            {
                content: [
                    "content line 1",
                ],
                conditions: (player) =>
                player.stats.strength.amount >= 5
                ||
                player.stats.strength <= 3,
                alternate: [
                    "alternate line 1"
                ]
            }
        ],
        options: [
            {
                text: "option line",
                time: {
                    year: 1,
                    month: 1,
                    week: 1,
                    day: 1,
                    hour: 1,
                    minute: 1
                },
                scene: -1,
                conditions: (player) =>
                player.homekingdom == "Ignoma",
                alternate: [
                    "poopoo"
                ],
                novisit: true,
                norepeat: true // hide if visited this scene > once
                //norepeat: 5, // hide if visited specified scene > once
                //norepeat: [0, 0, 0], // hide if visited specified scene < min or > max
                //norepeat: [0, 0, true], // hide if visited specified scene < min
            }
        ]
    }
]