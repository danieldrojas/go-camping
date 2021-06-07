export default function createInfoHTML({ name, rating, adr_address, formatted_phone_number, distanceToCampground, place_id, url }, isInfoWindow) {
      if (!isInfoWindow) {
            return `
      <div id="${place_id}">
        <span><strong>${name}</strong></span >
        <span>${rating} stars</span><br>
        ${adr_address}<br>
        <span>${formatted_phone_number}</span>
        <span>${Math.round(distanceToCampground / 1609)} miles </span><br>
        <label for="deleteStop" name="campgroundOptions"> <input class="deleteStop" name="campgroundOptions" type="checkbox" value=${place_id}>remove from trip</label>
        <a target="_blank" href="${url}"><button>More</button></a>
     </div>
          `;
      }
      return `
        <span><strong>${name}</strong></span >
        <span>${rating} stars</span><br>
        ${adr_address}<br>  
        <span>${formatted_phone_number}</span>
        <span>${Math.round(distanceToCampground / 1609)} miles </span><br>
        <label for="addStop" name="campgroundOptions"> <input class="addStop" name="campgroundOptions" type="checkbox" value=${place_id}>Add to route</label>
        <a target="_blank" href="${url}"><button>More</button></a>
      `;
};