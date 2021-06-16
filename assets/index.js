import displayDetails from "./displayDetails.js";
import API_KEY_MAPS_GOOGLE from "./apiKey.js";

//map instance
let map;
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 35.2784, lng: -93.1338 },
    zoom: 5,
  });
}

window.initMap = initMap;

const script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY_MAPS_GOOGLE}&libraries=geometry,places,localContext&callback=initMap`;
script.async = true;
document.head.appendChild(script);

// all calculations are done meters

//variables and constants
let trip = {};
const originField = document.getElementById("origin");
const destinationField = document.getElementById("destination");
const milesField = document.getElementById("milesDay");
let origin;
let destination;
let distanceToStop;
//TODO: delete, these are for development
// origin = "133+richland+circle+Russellville+AR";
// destination = "duluth, ga";
// distanceToStop = 300 * 1609;
// trip.origin = origin
// trip.destination = destination
// trip.traveledTarget = distanceToStop;

document.querySelector("form").addEventListener(
  "submit",
  (e) => {
    e.preventDefault(); //for the form
    // assign form values to vars
    origin = originField.value;
    destination = destinationField.value;
    distanceToStop = milesField.value * 1609.34; // convert miles to meters

    startRoute();
  },
  false
);

function startRoute() {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();

  trip.origin = origin;
  trip.destination = destination;
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
          getAndSetStop();
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

  placesService.nearbySearch(
    {
      //nearbySearch call for places Id
      location: trip.stops[0].stop_point_coors,
      radius: 15000,
      name: "campground",
    },
    (places) => {
      let placesId = [];
      //TODO: find better way to make this accessible in display.js
      const { stop_point_coors: stopLatLng } = trip.stops[0];

      places.forEach((place) => {
        placesId.push(place.place_id);
      });
      placesId.forEach((place_id) => {
        placesService.getDetails(
          {
            //call to getDetails for place's details info;
            placeId: place_id,
          },
          (campground) => {
            const marker = addMarker(
              campground.geometry.location,
              "C",
              campground.name
            );

            //marker for each campground opt.
            const distanceToCampground = getDistanceBetweenPoints(
              stopLatLng,
              campground.geometry.location
            );
            //attach to campground obj
            campground.distanceToCampground = Math.round(distanceToCampground);

            //creates markers and infoWindow
            const content = displayDetails(campground);

            infoWindow(marker, content);
          }
        );
      });
    }
  );
}

function addMarker(position, label, title) {
  return new google.maps.Marker({
    position,
    label,
    map,
    title,
  });
}

function infoWindow(marker, content) {
  const infoWindowConst = new google.maps.InfoWindow({
    content,
  });

  marker.addListener("click", () => {
    infoWindowConst.open(map, marker);

    infoWindowConst.addListener("domready", () => {
      google.maps.event.clearListeners(infoWindowConst, "domready");
    });
  });
}

function getDistanceBetweenPoints(startLatLng, endLatLng) {
  return google.maps.geometry.spherical.computeDistanceBetween(
    startLatLng,
    endLatLng
  );
}

function setStopToTrip() {
  let total = 0;
  for (let i = 0; i < trip.steps.length; i++) {
    total += trip.steps[i].distance.value;
    if (total >= distanceToStop) {
      trip.steps[i].distance.distance_from_origin = total;
      trip.stops = [trip.steps[i]];
      break;
    }
  }
  let stop = trip.stops[0];
  let distanceTrack = stop.distance.value;
  let distance_from_origin = stop.distance.distance_from_origin;
  let ratio =
    (distanceToStop - (distance_from_origin - distanceTrack)) / distanceTrack;
  //Aprox LatLng at stop
  let pathIndex = Math.ceil(ratio * stop.path.length);
  let LatLngAtStop = stop.path[pathIndex];

  stop.stop_point_coors = LatLngAtStop;
  addMarker(LatLngAtStop, "S");
}
