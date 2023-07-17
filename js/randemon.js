class RandemonMap {

    /**
     * @param{URL} imageURL
     * @param{number} seed
     * @param{number} chunkSize
     * @param{number} nbChunksHorizontal
     * @param{number} nbChunksVertical
     * @param{number} maxBuildings
     * @param{boolean} heightMap
     * @param{boolean} island
     * @param{boolean} themedTowns
     */
    constructor(imageURL, seed, chunkSize, nbChunksHorizontal, nbChunksVertical, maxBuildings, heightMap, island, themedTowns) {
        this.imageURL = imageURL;
        this.timeCreated = new Date();
        this.seed = seed;
        this.chunkSize = chunkSize;
        this.nbChunksHorizontal = nbChunksHorizontal;
        this.nbChunksVertical = nbChunksVertical;
        this.maxBuildings = maxBuildings;
        this.heightMap = heightMap;
        this.island = island;
        this.themedTowns = themedTowns;
    }

    /**
     * Returns the moment this object was created as a string.
     * @returns {string}
     */
    timeCreatedFormatted() {
        const d = this.timeCreated;
        return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}_${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`;
    }

    getFullName() {
        return `${this.timeCreatedFormatted()}_${this.seed}`;
    }
}


const imageUrl = "https://randemon.azurewebsites.net/";
// const imageUrl = "http://localhost:8000"
const MAX_MAPS = 5;
let previousMaps = [];
let keepMaps = [];

let downloadBtn;
let keepBtn;
let copySeedBtn;
let openInNewTabBtn;
let reloadBtn;
let latest;
let imageSpinner;

let seedInput;
let chunkSizeInput;
let nbChunksHorizontalInput;
let nbChunksVerticalInput;
let maxBuildingsInput;
let heightMapInput;
let islandInput;
let themedTownsInput;

/**
 * Init first map when loading site.
 */
addEventListener("DOMContentLoaded", () => {
    downloadBtn = document.getElementById("downloadBtn");
    keepBtn = document.getElementById("keepMap");
    copySeedBtn = document.getElementById("copySeed");
    openInNewTabBtn = document.getElementById("openInNewTab");
    reloadBtn = document.getElementById("reload");
    latest = document.getElementById("latest");
    imageSpinner = document.getElementById("loading-img");

    seedInput = document.getElementById("seed");
    chunkSizeInput = document.getElementById("chunkSize");
    nbChunksHorizontalInput = document.getElementById("nbChunksHorizontal");
    nbChunksVerticalInput = document.getElementById("nbChunksVertical");
    maxBuildingsInput = document.getElementById("maxBuildings");
    heightMapInput = document.getElementById("heightMap");
    islandInput = document.getElementById("islandMode");
    themedTownsInput = document.getElementById("themedTowns");
    set_latest_map();
});

/**
 * Fetches a map from the api with the given query parameters.
 * Disables buttons to protect the user.
 * @returns {Promise<string>}
 */
async function fetch_map(seed, chunkSize, nbChunksHorizontal, nbChunksVertical, heightMap, island, themedTowns, maxBuildings, townMap, scale) {
    disable_buttons();
    let finalUrl = imageUrl;
    finalUrl += `?seed=${seed}&chunk_size=${chunkSize}&nb_chunks_horizontal=${nbChunksHorizontal}&nb_chunks_vertical=${nbChunksVertical}&height_map=${heightMap}&island=${island}&themed_towns=${themedTowns}&max_buildings=${maxBuildings}&town_map=${townMap}&scale=${scale}`
    return await fetch(finalUrl)
        .then(response => response.blob())
        .then(blob => URL.createObjectURL(blob))
        .catch(error => {
            hide_loading_spinner();
            previousMaps.splice(0, 1);
            window.alert(`Error fetching image\n${error}\n\nPlease DO NOT refresh while image is loading.`);
        });
}

/**
 * Create a new map and display it when ready.
 */
function create_new_map() {
    const latest = document.getElementById("latest");
    latest.src = "";
    latest.alt = "Loading new map. This might take a few seconds.";
    set_latest_map();
}

/**
 * Fetches a map from the api and sets it as the current map displayed.
 * Enables buttons when done.
 */
function set_latest_map() {
    update_previous_maps();
    let seed = seedInput.value;
    if (!seed) seed = Math.floor(Math.random() * 10000000000000000);
    let chunkSize = document.getElementById("chunkSize").value;
    if (!chunkSize) chunkSize = 50;
    let nbChunksHorizontal = document.getElementById("nbChunksHorizontal").value;
    if (!nbChunksHorizontal) nbChunksHorizontal = 4;
    let nbChunksVertical = document.getElementById("nbChunksVertical").value;
    if (!nbChunksVertical) nbChunksVertical = 4;
    let maxBuildings = document.getElementById("maxBuildings").value;
    if (!maxBuildings) maxBuildings = 16;
    let heightMap = document.getElementById("heightMap").checked;
    let island = document.getElementById("islandMode").checked;
    let themedTowns = document.getElementById("themedTowns").checked;
    let townMap = null;
    let scale = 8;
    if (document.getElementById("townMap").checked) {
        townMap = document.querySelector("input[name='townMap']:checked").value;
        scale = 2 ** document.getElementById("scaleSlider").value;
    }

    fetch_map(seed, chunkSize, nbChunksHorizontal, nbChunksVertical, heightMap, island, themedTowns, maxBuildings, townMap, scale)
        .then(mapURL => {
            if (mapURL) {
                const map = new RandemonMap(mapURL, seed, chunkSize, nbChunksHorizontal, nbChunksVertical, maxBuildings, heightMap, island, themedTowns)
                previousMaps[0] = map;
                latest.src = map.imageURL
                latest.alt = "Latest generated randemon map";
                downloadBtn.href = map.imageURL;
                downloadBtn.download = map.timeCreatedFormatted() + '_' + seed.toString();
                enable_buttons();
            }
        }).catch(error => {
            previousMaps.splice(0, 1);
            window.alert(error);
    });
}

/**
 * Disables buttons that need a map available.
 */
function disable_buttons() {
    downloadBtn.classList.add("disabled");
    keepBtn.classList.add("disabled");
    openInNewTabBtn.classList.add("disabled");
    reloadBtn.classList.add("disabled");
    copySeedBtn.classList.add("disabled");
    latest.hidden = true;
    imageSpinner.hidden = false;
}

/**
 * Enables buttons that need a map available.
 */
function enable_buttons() {
    downloadBtn.classList.remove("disabled");
    keepBtn.classList.remove("disabled");
    openInNewTabBtn.classList.remove("disabled");
    reloadBtn.classList.remove("disabled");
    copySeedBtn.classList.remove("disabled");
    latest.hidden = false;
    hide_loading_spinner();
}

function hide_loading_spinner() {
    imageSpinner.hidden = true;
}

/**
 * Open the latest map image in a new tab.
 */
function open_in_new_tab(imgURL) {
    if (!imgURL) imgURL = previousMaps[0].imageURL;
    window.open(imgURL, '_blank');
}

function copy_to_clipboard(text) {
    navigator.clipboard.writeText(text);
}

function copy_seed_to_clipboard() {
    const seed = previousMaps[0].seed.toString();
    copy_to_clipboard(seed);
}

function clear_seed_input() {
    seedInput.value = '';
}

function delete_map_from_previous(index) {
    previousMaps.splice(index, 1);
    update_cards_previous_maps();
}

function delete_map_from_keep(index) {
    keepMaps.splice(index, 1);
    update_cards_keep_maps();
}

function update_cards_previous_maps() {
    clear_previous_maps();
    const previous = document.getElementById("previous-maps");
    for (let i = 1; i < previousMaps.length; i++) {
        previous.innerHTML += create_card(previousMaps[i], i);
    }
}

function keep_latest_map() {
    const keepBtn = document.getElementById("keepMap");
    keepBtn.classList.add("disabled");
    keep_map(previousMaps[0]);
}

function keep_map_from_previous(index) {
    keep_map(previousMaps[index]);
}

function keep_map(map) {
    keepMaps.push(map);
    clear_keep_maps();
    update_cards_keep_maps();
}

function update_cards_keep_maps() {
    clear_keep_maps();
    const keep = document.getElementById("keep-maps");
    for (let i = 0; i < keepMaps.length; i++) {
        keep.innerHTML += create_card_keep(keepMaps[i], i);
    }
}

function clear_previous_maps() {
    const previous = document.getElementById("previous-maps");
    previous.innerHTML = '';
}

function clear_keep_maps() {
    const keep = document.getElementById("keep-maps");
    keep.innerHTML = '';
}

function update_previous_maps() {
    if (previousMaps[0] != null) previousMaps.unshift(null);
    if (previousMaps.length > MAX_MAPS + 1) previousMaps.pop();
    update_cards_previous_maps();
}

function reload_map(index) {
    const map = previousMaps[index];
    restore_settings(map);
}

function reload_map_keep(index) {
    const map = keepMaps[index];
    restore_settings(map);
}

function restore_settings(map) {
    seedInput.value = map.seed;
    chunkSizeInput.value = map.chunkSize;
    heightMapInput.checked = map.heightMap;
    islandInput.checked = map.island;
    themedTownsInput.checked = map.themedTowns;
    maxBuildingsInput.value = map.maxBuildings;
    nbChunksHorizontalInput.value = map.nbChunksHorizontal;
    nbChunksVerticalInput.value = map.nbChunksVertical;
}

function update_scale_value(scale) {
    document.getElementById("scale").innerText = 'x' + 2**scale;
}

function update_townmap_availability() {
    if (document.getElementById("townMap").checked) {
        document.getElementById("topLeft").disabled = false;
        document.getElementById("topRight").disabled = false;
        document.getElementById("bottomLeft").disabled = false;
        document.getElementById("bottomRight").disabled = false;
        document.getElementById("scaleSlider").disabled = false;
    } else {
        document.getElementById("topLeft").disabled = true;
        document.getElementById("topRight").disabled = true;
        document.getElementById("bottomLeft").disabled = true;
        document.getElementById("bottomRight").disabled = true;
        document.getElementById("scaleSlider").disabled = true;
    }
}

function create_card(map, index) {
    return `<card>
                <div class="card mt-2 me-lg-0 me-2" style="width: min(90vw, 400px);">
                    <img src=${map.imageURL} onclick=open_in_new_tab("${map.imageURL}") class="card-img-top" alt="...">
                    <div class="card-body">
                        <small class="card-text">
                            ${map.timeCreatedFormatted()}
                        </small>
                        <div class="row my-2">
                            <div class="col-9 ps-2 pe-1">
                                <div class="d-grid">
                                    <a class="btn btn-primary" download=${map.getFullName()} href=${map.imageURL}>
                                        <img alt="Bootstrap" src="assets/bootstrap-icons/download.svg"
                                             width="16" height="16">
                                        Save
                                    </a>
                                </div>
                            </div>
                            <div class="col-3 ps-1 pe-2">
                                <div class="d-grid">
                                    <button onclick=delete_map_from_previous(${index}) class="btn btn-danger">
                                        <img src="assets/bootstrap-icons/trash.svg" alt="Bootstrap"
                                             width="16" height="16">
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xxl-4 col-lg-12 col-4 ps-xxl-2 pe-xxl-1 px-lg-2 ps-2 pe-1 my-xxl-0 my-1">
                                <div class="d-grid">
                                    <button onclick=keep_map_from_previous(${index}) class="btn btn-outline-primary">
                                        <!--                                <img src="assets/bootstrap-icons/plus-square.svg" style="color: white;" alt="Bootstrap"-->
                                        <!--                                     width="12" height="12">-->
                                        Keep
                                    </button>
                                </div>
                            </div>
                            <div class="col-xxl-4 col-lg-12 col-4 px-xxl-1 px-lg-2 px-1 my-xxl-0 my-1">
                                <div class="d-grid">
                                    <button onclick=copy_to_clipboard(${map.seed}) class="btn btn-outline-secondary">
                                        Seed
                                    </button>
                                </div>
                            </div>
                            <div class="col-xxl-4 col-lg-12 col-4 ps-xxl-1 pe-xxl-2 px-lg-2 ps-1 pe-2 my-xxl-0 my-1">
                                <div class="d-grid">
                                    <button onclick="reload_map(${index})" class="btn btn-outline-warning">
                                        Restore
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                      <small class="text-body-secondary text-break">Seed: ${map.seed}</small>
                    </div>
                </div>
            </card>`;
}

function create_card_keep(map, index) {
    return `<card>
                <div class="card mt-2 me-lg-0 me-2">
                    <img src=${map.imageURL} onclick=open_in_new_tab("${map.imageURL}") class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${map.seed}</h5>
                        <small class="card-text">
                            ${map.timeCreatedFormatted()}
                        </small>
                        <div class="row g-2 my-2">
                            <div class="col-9">
                                <div class="d-grid">
                                    <a class="btn btn-primary" download=${map.getFullName()} href="${map.imageURL}">
                                        <img alt="Bootstrap" src="assets/bootstrap-icons/download.svg"
                                             width="16" height="16">
                                        Save
                                    </a>
                                </div>
                            </div>
                            <div class="col-3">
                                <div class="d-grid">
                                    <button onclick=delete_map_from_keep(${index}) class="btn btn-danger">
                                        <img src="assets/bootstrap-icons/trash.svg" alt="Bootstrap"
                                             width="16" height="16">
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="row g-2 mt-2">
                            <div class="col-xxl-6 col-lg-12 col-6 my-xxl-0 my-1">
                                <div class="d-grid">
                                    <button onclick=copy_to_clipboard(${map.seed}) class="btn btn-outline-secondary">
                                        Seed
                                    </button>
                                </div>
                            </div>
                            <div class="col-xxl-6 col-lg-12 col-6 my-xxl-0 my-1">
                                <div class="d-grid">
                                    <button onclick="reload_map_keep(${index})" class="btn btn-outline-warning">
                                        Restore
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </card>`;
}
