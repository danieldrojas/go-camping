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
let milesToDrive;
const myStops = [];

document.querySelector("form").addEventListener(
  "submit",
  (e) => {
    e.preventDefault();
    // // assign form values to vars
    origin = originField.value;
    destination = destinationField.value;
    milesToDrive = milesField.value * 1609.34; // convert miles to meters
    // (origin = "russellville, ar"),
    //   (destination = "duluth, ga"),
    //   (milesToDrive = 100 * 1609.34);

    startRoute();
    originField.value = "";
    destinationField.value = "";
    milesField.value = "";
  },
  false
);

function startRoute() {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();

  trip.origin = origin;
  trip.destination = destination;
  trip.milesToDrive = milesToDrive;

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
        if (
          milesToDrive >= trip.distance.value ||
          trip.distance.value - milesToDrive <= 100 * 1609.34
        ) {
          if (
            !confirm(
              `You're only ${Math.round(
                (trip.distance.value - milesToDrive) / 1609.34
              )} miles away do you want to stop here?`
            )
          ) {
            return;
          }
        }

        console.log(trip);

        //set the map to resp
        directionsRenderer.setDirections(response);
        directionsRenderer.setMap(map);

        //get the stop location on route
        if (milesToDrive) {
          getAndSetStop();
        }
      } else {
        window.alert("Directions request failed due to " + status);
      }
    }
  );
}

//get a point on the route at milesToDrive
function getAndSetStop() {
  // getRouteStep
  setStopToTrip();

  //initialize placeService
  const placesService = new google.maps.places.PlacesService(map);

  console.log(trip);
  trip.myStops.forEach((stop) => {
    placesService.nearbySearch(
      {
        //nearbySearch call for places Id
        location: stop.stop_point_coors,
        radius: 15000,
        name: "campground",
      },
      (places) => {
        console.log(places);
        if (!places) return;
        let placesId = [];
        //TODO: find better way to make this accessible in display.js
        const { stop_point_coors: stopLatLng } = stop;
        // map.setCenter(trip.myStops[0].stop_point_coors);
        // map.setZoom(10);

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
              console.log(campground);
              if (!campground) return;
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
              campground.distanceToCampground =
                Math.round(distanceToCampground);

              //creates markers and infoWindow
              const content = displayDetails(campground);

              infoWindow(marker, content);
            }
          );
        });
      }
    );
  });
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
  let n = 1;
  //n: stop number

  stopIteration(n);
}

function stopIteration(stopNumber) {
  const numberOfStops = Math.floor(trip.distance.value / milesToDrive);
  let stop;
  //n: stop number
  console.log("calling stopIteration");
  console.log(
    "tripDistance: ",
    trip.distance.value / 1609,
    " trip.distance.value / milesToDriv: ",
    trip.distance.value / milesToDrive
  );
  console.log("with stopNumber: ", stopNumber);
  console.log("with numberOfStops: ", numberOfStops);
  console.log("(stopNumber >= numberOfStops ", stopNumber > numberOfStops);

  if (stopNumber > numberOfStops) return;

  let total = 0;
  for (let i = 0; i < trip.steps.length; i++) {
    total += trip.steps[i].distance.value;
    console.log("inside for loop ", i, "total: ", total / 1609);

    if (total >= milesToDrive * stopNumber) {
      console.log(
        "inside the if total >= milesToDrive * stopNumber: ",
        total >= milesToDrive * stopNumber
      );
      stop = trip.steps[i];
      stop.distance.distance_from_origin = total;
      let distanceTrack = stop.distance.value;
      let distance_from_origin = stop.distance.distance_from_origin;
      let ratio =
        (milesToDrive * stopNumber - (distance_from_origin - distanceTrack)) /
        distanceTrack;
      //Aprox LatLng at stop
      console.log("ratio: ", ratio);
      console.log("distanceTrack: ", distanceTrack / 1609);
      console.log("distance_from_origin: ", distance_from_origin / 1609);
      console.log("milesToDrive: ", milesToDrive / 1609);
      let pathIndex = Math.ceil(ratio * stop.path.length);
      console.log("stop.path[pathIndex] : ", stop.path[pathIndex]);
      let LatLngAtStop = stop.path[pathIndex];

      stop.stop_point_coors = LatLngAtStop;
      myStops.push(stop);
      trip.myStops = myStops;
      addMarker(LatLngAtStop, "S");
      console.log("n before calling the function again: ", stopNumber);
      return stopIteration(stopNumber + 1);
    }
  }
}
