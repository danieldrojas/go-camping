let campgroundsSelected = [];

export default function displayDetails(campground, addMarkerCb, infoWindowCb) {
    console.log("ditails func: ", campground)
    // campgroundsSelected.push({
    //     place_id: campground.place_id,
    //     url: campground.url,
    // });

    const div = document.createElement("div");
    document.querySelector(".campground").append(div);

    const para = document.createElement("p");
    para.setAttribute("id", `${campground.place_id}`)
    para.style.padding = "20px"

    div.addEventListener("click", event => {
        console.log(event)
        event
        if (event.target.nodeName == "INPUT" && event.target.id == "addBtn") {
            campgroundsSelected.push(event.target.defaultValue)

            console.log(campgroundsSelected)

        }
    })

    // TODO: order the campground options from closest distance.
    let info = `
         <span><strong>${campground.name}</strong></span>
        <span>${campground.rating} stars</span><br>
  ${campground.adr_address}<br>
  <span>${campground.formatted_phone_number}</span>
        <span>${Math.round(campground.distanceCampground / 1609)} miles </span><br>
        <label for="addBtn" name="campgroundOptions"> <input id="addBtn" name="campgroundOptions" type="radio" value=${campground.place_id}>Add to route</label>
          <a target="_blank" href="${campground.url}"><button>More</button></a>
      `;
    para.innerHTML = info;
    const marker = addMarkerCb(campground.geometry.location, "C")
    infoWindowCb(marker, info);
    div.appendChild(para)









}