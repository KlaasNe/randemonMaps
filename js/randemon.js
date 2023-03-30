const imageUrl = "http://127.0.0.1:8000";

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
async function fetch_map() {
    let finalUrl = imageUrl;
    const seed = document.getElementById("seed").value;
    if (seed) {
        finalUrl += "?seed=" + seed;
    }
    disable_buttons();
    return fetch(finalUrl)
        .then(response => response.blob())
        .then(imageBlob => URL.createObjectURL(imageBlob));
}

/**
 * Returns the current date and time as a string.
 * @returns {string}
 */
function dateTimeNow() {
    const d = new Date();
    return `${d.getDay()}-${d.getMonth()}-${d.getFullYear()}_${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`
}

/**
 * Fetches a map from the api and sets it as the current map displayed.
 * Enables buttons when done.
 */
function set_latest_map() {
    const latest = document.getElementById("latest");
    const downloadBtn = document.getElementById("downloadBtn");
    fetch_map()
        .then(map => latest.src = map)
        .then(() => {
            latest.alt = "Latest generated randemon map";
            downloadBtn.href = latest.src;
            downloadBtn.download = dateTimeNow();
            enable_buttons();
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
 * Open the latest map image in a new tab.
 */
function open_in_new_tab() {
    const latest = document.getElementById('latest');
    const url = latest.getAttribute('src');
    window.open(url, '_blank');
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
