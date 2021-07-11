class Map extends Menu {
    static tracking = true;
    static trackingColor = 'rgb(255, 238, 139)';

    static menuElement = document.getElementById('mapMenu');
    static map = document.getElementById('map');
    static currentPlaceShown = 'ignoma';

    static mapNames = {
        ignoma: 'ignoma.png',
        light_witesia: 'light_witesia.png',
    };

    static change(newMapName) {
        if (this.tracking) {
            console.log(
                `%c[${this.name}]%c Changing map to ${newMapName} (was ${this.currentPlaceShown})`,
                `color: ${this.trackingColor}`,
                `color: white`
            );
        }

        this.map.src = `img/map/${
            this.mapNames[newMapName] ?? newMapName + '.png'
        }`;

        this.currentPlaceShown = newMapName;
    }
}
