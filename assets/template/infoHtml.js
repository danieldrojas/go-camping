export default function createInfoHTML({ name, rating, adr_address, formatted_phone_number, distanceToCampground, place_id, url }, isInfoWindow) {
      if (!isInfoWindow) {
            return `
         <span><strong>${name}</strong></span >
        <span>${rating} stars</span><br>
        ${adr_address}<br>
  <span>${formatted_phone_number}</span>
        <span>${Math.round(distanceToCampground / 1609)} miles </span><br>
          <a target="_blank" href="${url}"><button>More</button></a>
      `;
      }
      return `
         <span><strong>${name}</strong></span >
        <span>${rating} stars</span><br>
        ${adr_address}<br>
  <span>${formatted_phone_number}</span>
        <span>${Math.round(distanceToCampground / 1609)} miles </span><br>
        <label for="addBtn" name="campgroundOptions"> <input id="addBtn" name="campgroundOptions" type="checkbox" value=${place_id}>Add to route</label>
          <a target="_blank" href="${url}"><button>More</button></a>
      `;
};