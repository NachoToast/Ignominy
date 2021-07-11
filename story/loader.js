const IGNOMINY_STORY = {
    ignoma: {
        ebonfront: {},
        basinfront: {},
    },
    light_witesia: {},
};

class StoryLoader {
    static tracking = true;
    static trackingColor = 'rgb(255, 238, 139)';

    static defaultModules = {
        ignoma: ['ebonfront'],
    };

    static addScript(path) {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = `${path}.js`;
            script.onload = () => resolve();
            document.body.appendChild(script);
        });
    }

    static async loadDefaultModules() {
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

                if (this.tracking) {
                    console.log(
                        `%c[${this.name}]%c Loading ${kingdom}/${area}`,
                        `color: ${this.trackingColor}`,
                        `color: white`
                    );
                }

                await this.addScript(`story/${kingdom}/${area}`);
                console.log('fully done load');
            }
        }

        // const startScript = document.createElement('script');
        // startScript.src = 'js/start.js';
        // document.body.appendChild(startScript);
        // TODO: script loading to initialise menu and rest of game, AFTER configmanager and storyloader.
    }
}
