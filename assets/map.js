//set the init function available to the window.
window.initMap = initMap;

//map instance
let map;


function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 35.2784, lng: -93.1338 },
        zoom: 8,
    });
}

export default map;