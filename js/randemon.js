const imageUrl = "http://127.0.0.1:8000";

addEventListener("DOMContentLoaded", (event) => {
    set_current_map();
});

async function fetch_map() {
    return fetch(imageUrl)
        .then(response => response.blob())
        .then(imageBlob => URL.createObjectURL(imageBlob));
}

function set_current_map() {
    const latest = document.getElementById("latest");
    fetch_map().then(map => latest.src = map);
}
