const imageUrl = "http://127.0.0.1:8000";

addEventListener("DOMContentLoaded", () => {
    set_latest_map();
});

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

function set_latest_map() {
    const latest = document.getElementById("latest");
    const downloadBtn = document.getElementById("downloadBtn");
    fetch_map()
        .then(map => latest.src = map)
        .then(() => {
            latest.alt = "Latest generated randemon map";
            downloadBtn.href = latest.src;
            // downloadBtn.download = latest.src;
            enable_buttons();
        });
}

function create_new_map() {
    const latest = document.getElementById("latest");
    latest.src = "";
    latest.alt = "Loading new map. This might take a few seconds.";
    set_latest_map();
}

function open_in_new_tab() {
    const latest = document.getElementById('latest');
    const url = latest.getAttribute('src');
    window.open(url, '_blank');
}

function disable_buttons() {
    const downloadBtn = document.getElementById("downloadBtn");
    const copySeedBtn = document.getElementById("copySeed");
    const openInNewTabBtn = document.getElementById("openInNewTab");
    const reloadBtn = document.getElementById("reload");
    downloadBtn.classList.add("disabled");
    openInNewTabBtn.classList.add("disabled");
}

function enable_buttons() {
    const downloadBtn = document.getElementById("downloadBtn");
    const copySeedBtn = document.getElementById("copySeed");
    const openInNewTabBtn = document.getElementById("openInNewTab");
    const reloadBtn = document.getElementById("reload");
    downloadBtn.classList.remove("disabled");
    openInNewTabBtn.classList.remove("disabled");
}
