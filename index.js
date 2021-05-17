import API_KEY_MAPS_GOOGLE from "./apikey.js";

window.initMap = initMap

// }
// console.log("index.js")

let map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
    });
}

const script = document.createElement("script")
console.log(script)

script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY_MAPS_GOOGLE}&callback=initMap`;
script.async = true;


document.head.appendChild(script)