export default function createInfoHTML(
  isInfoWindow,
  {
    name = "Name unavailable",
    rating = "",
    adr_address = "Address unavailable",
    formatted_phone_number = "Number unavailable",
    distanceToCampground = "",
    place_id = "00000",
    url = "",
    photos,
    icon,
  }
) {
  console.log(photos[0].getUrl());
  if (!isInfoWindow) {
    return `
      <div id="${place_id}">
        <div class="stopCard">
          <div class="stopInfo">
            <span><strong>${name}</strong></span >
            <span>${rating} stars</span><br>
            ${adr_address}<br>
            <span>${formatted_phone_number}</span>
            <span>${Math.round(distanceToCampground / 1609)} miles </span><br>
            <label for="deleteStop" name="campgroundOptions"> <input class="deleteStop" name="campgroundOptions" type="checkbox" value=${place_id}>remove from trip</label>
            <a target="_blank" href=${url}><button>More</button></a>
          </div>
           <img src=${photos[0].getUrl()}/>

        </div>
     </div>
          `;
  }
  return `
      <div class="infoWindow">
        <span><strong>${name}</strong></span >
        <span>${rating} stars</span><br>
        ${adr_address}<br>
        <span>${formatted_phone_number}</span>
        <span>${Math.round(distanceToCampground / 1609)} miles </span><br>
        <label for="addStop" name="campgroundOptions"> <input class="addStop" name="campgroundOptions" type="checkbox" value=${place_id}>Add to route</label>
        <a target="_blank" href="${url}"><button>More</button></a>
      </div>
        `;
}
