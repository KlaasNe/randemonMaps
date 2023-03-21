const imageUrl = "http://127.0.0.1:8000";
let loadingImage = true;

addEventListener("DOMContentLoaded", () => {
    set_latest_map();
});

async function fetch_map() {
    loadingImage = true;
    return fetch(imageUrl)
        .then(response => response.blob())
        .then(imageBlob => URL.createObjectURL(imageBlob));
}

function set_latest_map() {
    const latest = document.getElementById("latest");
    fetch_map()
        .then(map => latest.src = map)
        .then(() => {
            latest.alt = "Latest generated randemon map";
            loadingImage = false;
        });
}

function create_new_map() {
    const latest = document.getElementById("latest");
    latest.src = "";
    latest.alt = "Loading new map. This might take a few seconds.";
    set_latest_map();
}

function open_in_new_tab() {
    if (!loadingImage) {
        const latest = document.getElementById('latest');
        const url = latest.getAttribute('src');
        window.open(url, '_blank');
    }
}
