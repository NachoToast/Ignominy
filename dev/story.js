const test = {
    ignoma: {
        ebonfront: {
            main_streets: {
                0: {
                    text: [
                        {
                            content: [
                                'Multiline content',
                                'super epic',
                                'automatically overflows to new line',
                            ],
                        },
                        {
                            content: ['Conditional text'],
                            conditions: (player) =>
                                player.stats.strength.amount >= 5,
                        },
                    ],
                },
                1: {},
            },
        },
    },
    light_witesia: {},
};
