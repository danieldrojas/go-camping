window.initMap = initMap

let map;

//map instance 
function initMap() {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 35.2784, lng: -93.1338 },
        zoom: 8,
    });
    directionsRenderer.setMap(map);


    submitButton.addEventListener("click", function (e) {
        directions(e, directionsRenderer, directionsService)
    })


}

//input UI
const originField = document.getElementById("origin");
const destinationField = document.getElementById("destination");
const submitButton = document.getElementById("searchBtn")




function directions(e, directionsRenderer, directionsService) {
    e.preventDefault()
    let origin = originField.value;
    let destination = destinationField.value;


    directionsService.route(
        {
            origin: {
                query: origin
            },
            destination: {
                query: destination
            },
            travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
            if (status === "OK") {
                directionsRenderer.setDirections(response);
            } else {
                window.alert("Directions request failed due to " + status);
            }
        }
    );
}










