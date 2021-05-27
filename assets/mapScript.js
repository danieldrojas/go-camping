
import API_KEY_MAPS_GOOGLE from "./apikey.js";

const script = document.createElement("script")
script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY_MAPS_GOOGLE}&libraries=geometry,places,localContext&callback=initMap`;
script.async = true;
document.head.appendChild(script)

