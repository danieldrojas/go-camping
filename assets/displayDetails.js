import createInfoHTML from "./template/infoHtml.js"
const addedCamps = [];

export default function displayDetails(campground, isCampAdded) {
    if (isCampAdded) {
        document.getElementById("addBtn").addEventListener("click", event => {
            console.log("is this event: ", event)


            let campSelectedId = event.target.defaultValue;
            console.log(campSelectedId)
            console.log(addedCamps)
            for (const camp of addedCamps) {
                const { place_id } = camp;
                if (place_id == campSelectedId) {
                    campground = camp;

                    const infoHTML = createInfoHTML(campground);
                    console.log(infoHTML);


                    const div = document.createElement("div");
                    div.setAttribute("class", "infoDetails")
                    document.querySelector(".campground").append(div);

                    const para = document.createElement("p");
                    para.setAttribute("id", `${campground.place_id}`)
                    para.style.padding = "20px"
                    para.innerHTML = infoHTML;
                    div.appendChild(para)
                    break;
                }
            }
        })
        return;
    }

    addedCamps.push(campground)

    // TODO: order the campground options from closest distance.
    let infoHTML = `
         <span><strong>${campground.name}</strong></span>
        <span>${campground.rating} stars</span><br>
  ${campground.adr_address}<br>
  <span>${campground.formatted_phone_number}</span>
        <span>${Math.round(campground.distanceCampground / 1609)} miles </span><br>
        <label for="addBtn" name="campgroundOptions"> <input id="addBtn" name="campgroundOptions" type="radio" value=${campground.place_id}>Add to route</label>
          <a target="_blank" href="${campground.url}"><button>More</button></a>
      `;
    // const marker = addMarkerCb(campground.geometry.location, "C", campground.name)
    // const infoWindow = infoWindowCb(marker, info);

    return infoHTML;












}

