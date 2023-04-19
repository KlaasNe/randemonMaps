class RandemonMap {

    /**
     * @param{URL} imageURL
     * @param{number} seed
     */
    constructor(imageURL, seed) {
        this.imageURL = imageURL;
        this.seed = seed;
        this.timeCreated = new Date();
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


const imageUrl = "http://127.0.0.1:8000";
const MAX_MAPS = 5;
let previousMaps = [];
let keepMaps = [];

/**
 * Init first map when loading site.
 */
addEventListener("DOMContentLoaded", () => {
    set_latest_map();
});

/**
 * Fetches a map from the api with the given query parameters.
 * Disables buttons to protect the user.
 * @returns {Promise<string>}
 */
async function fetch_map(seed) {
    disable_buttons();
    let finalUrl = imageUrl;
    finalUrl += "?seed=" + seed;
    return await fetch(finalUrl)
        .then(response => response.blob())
        .then(blob => URL.createObjectURL(blob))
        .catch(ignored => {
            hide_loading_spinner();
            window.alert('Error fetching image');
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
    const latest = document.getElementById("latest");
    const downloadBtn = document.getElementById("downloadBtn");
    let seed = document.getElementById("seed").value;
    if (!seed) seed = Math.floor(Math.random() * 1000000000000000000);
    fetch_map(seed)
        .then(mapURL => {
            if (mapURL) {
                const map = new RandemonMap(mapURL, seed)
                update_previous_maps(map);
                latest.src = map.imageURL
                latest.alt = "Latest generated randemon map";
                downloadBtn.href = map.imageURL;
                downloadBtn.download = map.timeCreatedFormatted() + '_' + seed.toString();
                enable_buttons();
            }
        });
}

/**
 * Disables buttons that need a map available.
 */
function disable_buttons() {
    const downloadBtn = document.getElementById("downloadBtn");
    const keepBtn = document.getElementById("keepMap");
    const copySeedBtn = document.getElementById("copySeed");
    const openInNewTabBtn = document.getElementById("openInNewTab");
    const reloadBtn = document.getElementById("reload");
    const latest = document.getElementById("latest");
    const loading = document.getElementById("loading-img");
    downloadBtn.classList.add("disabled");
    keepBtn.classList.add("disabled");
    openInNewTabBtn.classList.add("disabled");
    copySeedBtn.classList.add("disabled");
    latest.hidden = true;
    loading.hidden = false;
}

/**
 * Enables buttons that need a map available.
 */
function enable_buttons() {
    const downloadBtn = document.getElementById("downloadBtn");
    const keepBtn = document.getElementById("keepMap");
    const copySeedBtn = document.getElementById("copySeed");
    const openInNewTabBtn = document.getElementById("openInNewTab");
    const reloadBtn = document.getElementById("reload");
    const latest = document.getElementById("latest");
    downloadBtn.classList.remove("disabled");
    keepBtn.classList.remove("disabled");
    openInNewTabBtn.classList.remove("disabled");
    copySeedBtn.classList.remove("disabled");
    latest.hidden = false;
    hide_loading_spinner();
}

function hide_loading_spinner() {
    const loading = document.getElementById("loading-img");
    loading.hidden = true;
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

function update_previous_maps(map) {
    previousMaps.unshift(map);
    if (previousMaps.length > MAX_MAPS + 1) previousMaps.pop();
    update_cards_previous_maps();
}

function create_card(map, index) {
    return `<card>
                <div class="card mt-2 me-lg-0 me-2">
                    <img src=${map.imageURL} onclick=open_in_new_tab("${map.imageURL}") class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${map.seed}</h5>
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
                                    <button class="btn btn-outline-warning disabled">
                                        Reload
                                    </button>
                                </div>
                            </div>
                        </div>
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
                                    <button class="btn btn-outline-warning disabled">
                                        Reload
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </card>`;
}
