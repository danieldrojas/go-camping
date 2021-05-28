//set the init function available to the window.
window.initMap = initMap;
import displayDetails from "./assets/displayDetails.js";

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
destination = "glacier national park, MT";
distanceToStop = 400 * 1609;
trip.origin = origin
trip.destination = destination
trip.traveledTarget = distanceToStop;

//map instance 
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 35.2784, lng: -93.1338 },
        zoom: 8,
    });
}


submitButton.addEventListener("click", e => {
    e.preventDefault(); //for the form
    //assign form values to vars
    // origin = originField.value;
    // destination = destinationField.value;
    // distanceToStop = milesField.value * 1609.34; // convert miles to meters
    startRoute();
})

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

                console.log("trip after response: ", trip)
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
    const placesService = new google.maps.places.PlacesService(map);

    placesService.nearbySearch({  //nearbySearch call for places Id
        location: trip.stops[0].stop_point_coors,
        radius: 15000,
        name: "campground"
    }, places => {
        console.log("places form nearby", places);

        let placesId = [];
        //TODO: find better way to make this accessible in display.js
        const { stop_point_coors: stopLatLng } = trip.stops[0];

        places.forEach(place => {
            placesId.push(place.place_id);
        })
        placesId.forEach((place_id) => {
            placesService.getDetails({ //call to getDetails for place's details info;
                placeId: place_id
            }, campground => {
                let distanceCampground;
                //marker for each campground opt.
                distanceCampground = getDistanceBetweenPoints(stopLatLng, campground.geometry.location);
                //attach to campground obj
                campground.distanceCampground = Math.round(distanceCampground);

                //creates markers and infowindow
                const content = displayDetails(campground)
                const marker = addMarker(campground.geometry.location, "C", campground.name)
                infoWindow(marker, content);

            });
        })
    });
};

function addMarker(position, label, title) {
    return new google.maps.Marker({
        position,
        label,
        map,
        title,
    });
};

function infoWindow(marker, content) {
    let isCampAdded = false;
    const infoWindowConst = new google.maps.InfoWindow({
        content,
    });


    marker.addListener("click", (e) => {
        infoWindowConst.open(map, marker);
    })

    infoWindowConst.addListener("domready", () => {
        isCampAdded = true;
        // const addBtn = document.getElementById("addBtn");
        // addBtn.addEventListener("click", e => {
        //     console.log(e)
        displayDetails(undefined, isCampAdded)
        // })    
    })



}

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
    addMarker(LatLngAtStop, "S")
}

