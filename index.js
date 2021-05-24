//set the init function available to the window.
window.initMap = initMap

// all calculations are done using meters

//variables and constants
let map;
let trip = {};
const originField = document.getElementById("origin");
const destinationField = document.getElementById("destination");
const submitButton = document.getElementById("searchBtn");
const milesField = document.getElementById("miles-day")

//map instance 
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 35.2784, lng: -93.1338 },
        zoom: 8,
    });
    submitButton.addEventListener("click", e => {
        directions(e)
    })
}


//TODO: delete, these are for development 
let origin = "133+richland+circle+Russellville+AR";
let destination = "2370+main+street+northwest+duluth+ga";
let miles = 495631
trip.origin = origin
trip.destination = destination
trip.traveledTarget = miles;



function directions(e) {
    e.preventDefault()

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();

    // let origin = originField.value;
    // let destination = destinationField.value;

    //pass miles to meters
    // let miles = milesField.value*1609.34;

    directionsService.route(
        {
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
            if (status === "OK") {
                trip = response.routes[0].legs[0];

                directionsRenderer.setDirections(response);
                directionsRenderer.setMap(map);

                if (miles) {
                    getPointAtMiles()
                }
            } else {
                window.alert("Directions request failed due to " + status);
            }
        }
    );
}

//get a point on the route at miles
function getPointAtMiles() {
    // getRouteStep
    let total = 0;
    for (let i = 0; i < trip.steps.length; i++) {
        total += trip.steps[i].distance.value;
        if (total >= miles) {
            trip.steps[i].distance.distance_from_origin = total
            trip.stops = [trip.steps[i]];
            break;
        }
    }
    let stop = trip.stops[0];
    let distanceTrack = stop.distance.value;
    let distance_from_origin = stop.distance.distance_from_origin;
    let ratio = (miles - (distance_from_origin - distanceTrack)) / distanceTrack;
    //Aprox LatLng at stop 
    let pathIndex = Math.ceil(ratio * stop.path.length);
    let LatLngAtStop = stop.path[pathIndex]

    stop.stop_point_coors = LatLngAtStop
    console.log(trip)

    //places

    const placesService = new google.maps.places.PlacesService(map);
    placesService.nearbySearch({
        location: trip.stops[0].stop_point_coors,
        radius: 15000,
        name: "campground"
    }, places => {
        console.log(places);
        placesService.getDetails({
            placeId: places[0].place_id
        }, details => {
            console.log(details)
            new google.maps.Marker({
                map,
                position: details.geometry.location
            })
        });


    });
    console.log(placesService)

}


function getDistanceBetweenPoints(startLatLng, endLatLng) {
    return google.maps.geometry.spherical.computeDistanceBetween(startLatLng, endLatLng)

}

function getDistancePath(path) {
    return google.maps.geometry.spherical.computeLength(path)
}

