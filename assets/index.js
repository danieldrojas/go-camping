import displayDetails from "./displayDetails.js";
import API_KEY_MAPS_GOOGLE from "./apiKey.js";
import directions from "./template/directions.js";

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
const directionsTab = document.querySelector("#directions-tab");
const mapForm = document.querySelector("#mapForm");
const directionsData = document.querySelector("#directionsData");

//map-tab:
document.querySelector("#map-tab").addEventListener("click", (event) => {
  if (event.target.id === "map-tab") {
    mapForm.style.display = "block";
    directionsData.style.display = "none";
  }
});

directionsTab.addEventListener("click", (event) => {
  if (event.target.id === "directions-tab") {
    mapForm.style.display = "none";
    directionsData.style.display = "block";
    // mapTab.style.display = "block";

    if (trip.routeDirectionsHtml) {
      directionsData.innerHTML = trip.routeDirectionsHtml();
    } else {
      directionsData.innerHTML = `<p>You need to search to see directions</p>`;
    }
  }
});

document.querySelector("form").addEventListener(
  "submit",
  (e) => {
    e.preventDefault();
    // assign form values to vars
    origin = originField.value;
    destination = destinationField.value;
    milesToDrive = milesField.value * 1609.34; // convert miles to meters

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
        trip.routeDirectionsHtml = directions(trip.steps);

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

  trip.myStops.forEach((stop) => {
    placesService.nearbySearch(
      {
        //nearbySearch call for places Id
        location: stop.stop_point_coors,
        radius: 10 * 1609.34,
        name: "campground",
      },
      (places) => {
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
              getDetails(campground);

              function getDetails(campground) {
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

function drawCircle(LatLngAtStop) {
  const cityCircle = new google.maps.Circle({
    strokeColor: "#d36832",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#873e23",
    fillOpacity: 0.5,
    map,
    center: LatLngAtStop,
    radius: 10 * 1609.34,
  });
}

//geocoding
function reverseGeocoder() {
  let delay; //set delay based on time of geocoding response ok;
  let timeBefore;
  let timeAfter;

  const geocoder = new google.maps.Geocoder();

  const stopsCoorsList = [];
  trip.myStops.forEach((stop) => {
    const { stop_point_coors } = stop;
    stopsCoorsList.push(stop_point_coors);
  });

  // for (let i = 0; i < stopsCoorsList.length; i++) {
  //   (i);
  // }

  getStopInfo(0);

  function getStopInfo(n) {
    if (n >= stopsCoorsList.length) return;

    timeBefore = performance.now();
    geocoder.geocode({ location: stopsCoorsList[n] }, (results, status) => {
      if (status === "OK") {
        timeAfter = performance.now();

        if (results[0]) {
          const formatted_address = `<span><strong>Stop at  ${
            (milesToDrive * n) / 1609.34
          } miles</strong></span><br>
        <span> ${results[0].formatted_address}.</span>
         `;
          infoWindow(addMarker(stopsCoorsList[n], "S"), formatted_address);
          drawCircle(stopsCoorsList[n]);
          delay = timeAfter - timeBefore;

          setTimeout(() => {
            getStopInfo(n + 1);
          }, 800);
          return;
        } else {
          alert("Stop at ", (milesToDrive * n) / 1609.34 + " no found");
        }
      } else {
        console.log("Somthing went wrong: ", status);
        setTimeout(() => {
          getStopInfo(n);
        }, 1000);
      }
    });
  }
  return;
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
  if (stopNumber > numberOfStops) {
    reverseGeocoder();
    return;
  }

  let total = 0;
  for (let i = 0; i < trip.steps.length; i++) {
    total += trip.steps[i].distance.value;

    if (total >= milesToDrive * stopNumber) {
      stop = trip.steps[i];
      stop.distance.distance_from_origin = total;
      let distanceTrack = stop.distance.value;
      let distance_from_origin = stop.distance.distance_from_origin;
      let ratio =
        (milesToDrive * stopNumber - (distance_from_origin - distanceTrack)) /
        distanceTrack;
      //Approximate LatLng at stop
      let pathIndex = Math.ceil(ratio * stop.path.length);
      let LatLngAtStop = stop.path[pathIndex];

      stop.stop_point_coors = LatLngAtStop;
      myStops.push(stop);
      trip.myStops = myStops;

      return stopIteration(stopNumber + 1);
    }
  }
}
