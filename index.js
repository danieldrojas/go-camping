//set the init function available to the window.
window.initMap = initMap

// all calculations are done using meters

//variables and constants
let map;
let trip = {};
const originField = document.getElementById("origin");
const destinationField = document.getElementById("destination");
const submitButton = document.getElementById("searchBtn");
const milesField = document.getElementById("miles-day");
let origin;
let destination;
let distanceToStop;
//TODO: delete, these are for development 
origin = "133+richland+circle+Russellville+AR";
destination = "2370+main+street+northwest+duluth+ga";
distanceToStop = 495631
// trip.origin = origin
// trip.destination = destination
// trip.traveledTarget = distanceToStop;

//map instance 
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 35.2784, lng: -93.1338 },
        zoom: 8,
    });
    submitButton.addEventListener("click", e => {
        e.preventDefault(); //for the form
        //assign form values to vars
        // origin = originField.value;
        // destination = destinationField.value;
        // distanceToStop = milesField.value * 1609.34; // convert miles to meters
        startRoute();

    })
}

function startRoute() {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();

    trip.origin = origin
    trip.destination = destination
    trip.distanceToStop = distanceToStop;

    //request the route to google route api
    directionsService.route(
        {
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
            if (status === "OK") {
                trip = response.routes[0].legs[0]; //assign the route to trip

                //set the map to resp 
                directionsRenderer.setDirections(response);
                directionsRenderer.setMap(map);
                //get the stop location on route
                if (distanceToStop) {
                    getAndSetStop()
                }
            } else {
                window.alert("Directions request failed due to " + status);
            }
        }
    );
}

//get a point on the route at distanceToStop
function getAndSetStop() {
    // getRouteStep
    setStopToTrip();

    findPlaces();

};


function getDistanceBetweenPoints(startLatLng, endLatLng) {
    return google.maps.geometry.spherical.computeDistanceBetween(startLatLng, endLatLng)

}

function getDistancePath(path) {
    return google.maps.geometry.spherical.computeLength(path)
}

function setStopToTrip() {
    let total = 0;
    for (let i = 0; i < trip.steps.length; i++) {
        total += trip.steps[i].distance.value;
        if (total >= distanceToStop) {
            trip.steps[i].distance.distance_from_origin = total
            trip.stops = [trip.steps[i]];
            break;
        }
    }
    let stop = trip.stops[0];
    let distanceTrack = stop.distance.value;
    let distance_from_origin = stop.distance.distance_from_origin;
    let ratio = (distanceToStop - (distance_from_origin - distanceTrack)) / distanceTrack;
    //Aprox LatLng at stop 
    let pathIndex = Math.ceil(ratio * stop.path.length);
    let LatLngAtStop = stop.path[pathIndex]

    stop.stop_point_coors = LatLngAtStop
    console.log(trip)
}

function findPlaces() {
    //places
    const placesService = new google.maps.places.PlacesService(map);
    placesService.nearbySearch({
        location: trip.stops[0].stop_point_coors,
        radius: 15000,
        name: "campground"
    }, places => {
        console.log(places);
        let placesId = [];
        places.forEach(place => {
            placesId.push(place.place_id);
        })
        console.log(placesId, "places id arra: ")
        placesId.forEach((place_id) => {
            console.log(place_id)
            placesService.getDetails({
                placeId: place_id
            }, details => {
                console.log(details)

                new google.maps.Marker({
                    map,
                    position: details.geometry.location
                })
                let div = document.createElement("div");
                div.innerHTML = `
                <span>${details.name}</span>
                `
                document.getElementById("places").append(div)
            });
        })
    });
};
