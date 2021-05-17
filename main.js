console.log("main working")

//TODO: FE: Input fields for points:

let origin = "Russellville+AR"
let destination = "duluth+georgia";
let API_KEY_MAPS_GOOGLE = "AIzaSyAnSFwBfrBFZdol9SpLPC-XlW0pC1AHgis";


// Google routes api:

let map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
    });
}