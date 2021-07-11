{
    const ebonfront = {
        main_streets: {
            new_start: {
                text: [
                    {
                        content: [
                            "For better or for worse, you've decided to become an adventurer. As you stand in the streets of Ebonfront, Ignoma's capital city, a warm feeling of freedom, inspiration, and motivation stirs within you. What comes next is entirely up to you and you alone.",
                        ],
                    },
                ],
                options: [
                    {
                        text: 'Continue',
                        scene: 'stand',
                        time: false,
                        fatigue: false,
                    },
                ],
                meta: {
                    authors: ['NachoToast'],
                    version: '0.1.14',
                    legacy_version: '0.0.2',
                },
            },
            stand: {
                text: [
                    {
                        content: [
                            'Ebonfront is the capital city of Ignoma, located on its Northeast coastline, it has enormous harbous which support its vibrant fishing and trade industry.',
                        ],
                        norepeat: true,
                        alternate: [
                            "You stand in the main streets of Ebonfront, Ignoma's capital.",
                        ],
                    },
                    {
                        content: [
                            'The sound of workers at the docks rings throughout the city, and the smell of fresh fish lingers in the air.',
                        ],
                        conditions: (player) =>
                            player.time.getHours() >= 7 &&
                            player.time.getHours() <= 13,
                    },
                    {
                        content: ['Several signs point towards a local inn.'],
                    },
                ],
                options: [
                    {
                        text: 'Help out on the docks.',
                        scene: ['docks', 'offer_help'],
                        conditions: (player) =>
                            player.time.getHours() >= 7 &&
                            player.time.getHours() <= 13,
                    },
                    {
                        text: 'Visit an inn.',
                        scene: ['inn', 'enter'],
                    },
                    {
                        text: 'Head to the city outskirts.',
                        scene: ['outskirts', 'arrive'],
                        time: { minute: 5 },
                        fatigue: 1,
                    },
                    {
                        text: 'Wander through the streets.',
                        time: { minute: 15 },
                    },
                ],
                meta: {
                    authors: ['NachoToast'],
                    version: '0.1.14',
                    legacy_version: '0.0.3',
                },
            },
        },
        docks: {
            offer_help: {
                text: [
                    {
                        content: [
                            'You offer to help load and unload cargo on the docks.',
                        ],
                    },
                    {
                        content: [
                            "The workers <span style='color: lightgreen'>happily agree,</span>, happy to have a helping hand.",
                        ],
                    },
                ],
                options: [
                    {
                        text: 'Work at the docks.',
                        time: { hour: 5 },
                        scene: 'work',
                        fatigue: 30,
                        action: () => {
                            if (player.stats.strength.amount < 5) {
                                player.stats.strength.amount += 1;
                            }
                            player.gold += 20;
                        },
                    },
                    {
                        text: 'Change your mind and return to the main streets.',
                        scene: ['main_streets', 'stand'],
                    },
                ],
            },
        },
    };
    Object.assign(IGNOMINY_STORY.ignoma.ebonfront, ebonfront);
}

console.log('done load!');
