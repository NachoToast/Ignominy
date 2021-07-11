const IGNOMINY_STORY = {
    ignoma: {
        basinfront: 'stuff',
    },
};

class StoryLoader {
    static tracking = true;
    static trackingColor = 'rgb(255, 238, 139)';

    static defaultModules = {
        ignoma: ['ebonfront'],
    };

    static loadDefaultModules() {
        if (this.tracking) {
            console.log(
                `%c[${this.name}]%c Loading default modules`,
                `color: ${this.trackingColor}`,
                `color: white`
            );
        }

        const defaultModuleKeys = Object.keys(this.defaultModules);
        for (let i = 0, len = defaultModuleKeys.length; i < len; i++) {
            const kingdom = defaultModuleKeys[i];
            const subModuleArray = this.defaultModules[kingdom];
            for (let j = 0, len = subModuleArray.length; j < len; j++) {
                const area = subModuleArray[j];
                const s = document.createElement('script');
                s.src = `story/${kingdom}/${area}.js`;
                document.body.appendChild(s);
            }
        }
        // TODO: script loading to initialise menu and rest of game, AFTER configmanager and storyloader.
    }
}

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

//Object.assign(IGNOMINY_STORY, test);
GeneralPurpose.updateSharedKeys(IGNOMINY_STORY, test);
