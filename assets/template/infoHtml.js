export default function createInfoHTML(name, rating, address, phoneNumber, distance, placeId, url) {
    return `
         <span><strong>${name}</strong></span >
        <span>${rating} stars</span><br>
        ${address}<br>
  <span>${phoneNumber}</span>
        <span>${Math.round(distance / 1609)} miles </span><br>
        <label for="addBtn" name="campgroundOptions"> <input id="addBtn" name="campgroundOptions" type="radio" value=${placeId}>Add to route</label>
          <a target="_blank" href="${url}"><button>More</button></a>
      `;
};