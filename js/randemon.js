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
        return `${d.getDay()}-${d.getMonth()}-${d.getFullYear()}_${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`
    }
}

const imageUrl = "http://127.0.0.1:8000";
let maps = [];
const MAX_MAPS = 5;

/**
 * Init first map when loading site.
 */
addEventListener("DOMContentLoaded", () => {
    set_latest_map();
    const previous = document.getElementById("previous-maps");
    previous.innerHTML = create_card() + create_card();
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
        .catch(ignored => window.alert('Error fetching image'));
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
 * Create a new map and display it when ready.
 */
function create_new_map() {
    const latest = document.getElementById("latest");
    latest.src = "";
    latest.alt = "Loading new map. This might take a few seconds.";
    set_latest_map();
}

/**
 * Disables buttons that need a map available.
 */
function disable_buttons() {
    const downloadBtn = document.getElementById("downloadBtn");
    const copySeedBtn = document.getElementById("copySeed");
    const openInNewTabBtn = document.getElementById("openInNewTab");
    const reloadBtn = document.getElementById("reload");
    downloadBtn.classList.add("disabled");
    openInNewTabBtn.classList.add("disabled");
}

/**
 * Enables buttons that need a map available.
 */
function enable_buttons() {
    const downloadBtn = document.getElementById("downloadBtn");
    const copySeedBtn = document.getElementById("copySeed");
    const openInNewTabBtn = document.getElementById("openInNewTab");
    const reloadBtn = document.getElementById("reload");
    downloadBtn.classList.remove("disabled");
    openInNewTabBtn.classList.remove("disabled");
}

/**
 * Open the latest map image in a new tab.
 */
function open_in_new_tab() {
    const latest = document.getElementById('latest');
    const url = latest.getAttribute('src');
    window.open(url, '_blank');
}

function copy_seed_to_clipboard() {
    const seed = maps[0].seed.toString();
    navigator.clipboard.writeText(seed);
}

function create_card() {
    return `<card>
                <div class="card m-2">
                    <img src="assets/placeholder-img/2023-02-05_23-52-19_8397485239334123638.png"
                         class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">7117294270402732484</h5>
                        <p class="card-text">
                            2023-01-25_19-47-51_7117294270402732484.png
                        </p>
                        <div class="row mb-2">
                            <div class="col-xxl-7 col-lg-6 col-sm-8 ps-2 pe-1">
                                <div class="d-grid">
                                    <button class="btn btn-primary">
                                        <img src="assets/bootstrap-icons/download.svg" alt="Bootstrap"
                                             width="12" height="12">
                                        Save
                                    </button>
                                </div>
                            </div>
                            <div class="col-xxl-5 col-lg-6 col-sm-4 ps-1 pe-2">
                                <div class="d-grid">
                                    <button class="btn btn-danger disabled">
                                        <img src="assets/bootstrap-icons/trash.svg" alt="Bootstrap"
                                             width="12" height="12">
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xxl-4 col-lg-12 col-4 ps-xxl-2 pe-xxl-1 ps-2 pe-1 my-xxl-0 my-1">
                                <div class="d-grid">
                                    <button class="btn btn-outline-primary disabled">
                                        <!--                                <img src="assets/bootstrap-icons/plus-square.svg" style="color: white;" alt="Bootstrap"-->
                                        <!--                                     width="12" height="12">-->
                                        Keep
                                    </button>
                                </div>
                            </div>
                            <div class="col-xxl-4 col-lg-12 col-4 px-xxl-1 px-1 my-xxl-0 my-1">
                                <div class="d-grid">
                                    <button class="btn btn-outline-secondary">
                                        Seed
                                    </button>
                                </div>
                            </div>
                            <div class="col-xxl-4 col-lg-12 col-4 ps-xxl-1 pe-xxl-2 ps-1 pe-2 my-xxl-0 my-1">
                                <div class="d-grid">
                                    <button class="btn btn-outline-warning disabled">
                                        Reload
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </card>`
}

function update_previous_maps(map) {
    maps.unshift(map);
    if (maps.length > MAX_MAPS + 1) maps.pop();
}
