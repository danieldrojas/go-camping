let campgrounds = [];

export default function displayDetails(campground) {
    console.log("ditails func: ", campground)
    campgrounds.push({
        place_id: campground.place_id,
        url: campground.url,
    });

    const div = document.createElement("div");
    document.querySelector(".campground").append(div);

    const para = document.createElement("p");
    para.setAttribute("id", `${campground.place_id}`)
    para.style.padding = "20px"

    // div.addEventListener("click", event => {
    //     console.log(event)
    //     if (event.target.nodeName == "BUTTON") {

    //     }


    // })
    TODO: //order the campground options from closest distance.
    para.innerHTML = `
         <span><strong>${campground.name}</strong></span>
        <span>${campground.rating} stars</span><br>
  ${campground.adr_address}<br>
        <span>${Math.round(campground.distanceCampground / 1609)} miles </span><br>
       <a href="${campground.url}" target="_blank"> <button>Google maps</button> </a>
      `;
    div.appendChild(para)
    console.log(div)
    console.log("array of campgrounds: ", campgrounds)









}