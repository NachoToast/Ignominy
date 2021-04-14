var story = [
    {
        id: -1,
        text: [
            {
                content: [
                    "content line 1"
                ],
                conditions: (player) =>
                player.stats.strength.amount >= 5
                ||
                player.stats.agility.amount <= 3,
                alternate: [
                    "alternate line 1" // text & option alternate is colored gray by default.
                ]
            }
        ],
        random: true, // update player random to value between 1-100 (inclusive)
        //random: 11 // update player random to value between 1-11 (exclusive).
        options: [
            {
                text: "option line",
                time: {
                    year: 1,
                    month: 1,
                    week: 1,
                    day: 1,
                    hour: 1,
                    minute: 1,
                    second: 1
                },
                //time: false, // if time tag absent will increment by default amount. 
                scene: -1,
                conditions: (player) =>
                player.homekingdom == "Ignoma",
                alternate: [
                    "alternate line 1"
                ],
                novisit: true, // doesn't add scene to player's visited scenes list (or increment visited amount), false does the same
                norepeat: true, // hide if visited this (current) scene [NOT the scene the option points to] > once, false does NOT do the same (instead has no effect).
                //norepeat: 5, // hide if visited specified scene > once
                //norepeat: [id, min, max], // hide if visited specified scene < min or > max
                //norepeat: [id, min, true], // hide if visited specified scene < min
                fatigue: false,
                //fatigue: number, // increments fatigue by number, if fatigue tab absent will increment by default amount.
                perm_timestamps: true, // always shows time stamps
                action: function() {
                    if (player.stats.strength.amount < 5) player.stats.strength.amount += 1,
                    player.homekingdom = "The Kingdom of Dalia"
                }
            }
        ],
        meta: {
            authors: ["NachoToast"],
            version: "0.1.11",
            legacy_version: "0.0.1"
        }
    }
]