class Map {

    /**
     * @param{URL} image
     * @param{dateTime} timeCreated
     * @param{number} seed
     */
    constructor(image, timeCreated, seed) {
        this.image = image;
        this.timeCreated = timeCreated;
        this.seed = seed;
    }

    /**
     * @returns {string}
     */
    getTimeString() {
        return this.timeCreated.toString();
    }
}
