import createInfoHTML from "./template/infoHtml.js"
const campgrounds = [];
let campgroundSelections = [];
const divPlaces = document.querySelector(".places");
const divMap = document.querySelector("#map")
divMap.addEventListener("click", event => {
    // console.log(event.target.nodeName, event.target.className, event.target.name)
    // console.log(event.target.nodeName === "INPUT" && event.target.className === "addStop" &&
    // event.target.name === "campgroundOptions")
    if (event.target.nodeName === "INPUT" && event.target.className === "addStop" &&
        event.target.name === "campgroundOptions") {
        // console.log("click!")
        displayCampground(event)
    };

})
divPlaces.addEventListener("click", event => {
    console.log(event)
    if (event.target.nodeName === "INPUT" && event.target.className === "deleteStop") {
        deleteStop(event)

    }
    // console.log("divPlaces: ", event.target.value);


});
export default function displayDetails(campground) {
    console.log("displayDetails with campground: ", campground)
    campgrounds.push(campground);
    console.log("campgrounds: ", campgrounds)
    let infoHtml = createInfoHTML(campground, true);
    // console.log("and infoHtml: ", infoHtml)


    // TODO: order the campground options from closest distance.
    return infoHtml;
};


function displayCampground(event) {

    const campgroundId = event.target;
    // console.log(campgroundId)
    // console.log("displayCampground")
    // console.log("the return event: ", event.target.checked)
    // console.log("the return event: ", event)
    if (event.target.checked) campgroundId.disabled = true;

    const camp = createInfoHTML(findCampground(event.target.value), false);
    const div = document.createElement("div");
    div.setAttribute("class", "campground")
    div.innerHTML = camp;
    divPlaces.appendChild(div);
};

function deleteStop(event) {
    console.log("deleteStop function", event)
    document.getElementById(event.target.value).remove();
    const addStopBtn = document.querySelectorAll(".addStop");
    console.log(addStopBtn)
    for (let infoWindowStop of addStopBtn) {
        const { value } = infoWindowStop
        if (value === event.target.value) {
            console.log(infoWindowStop)
            infoWindowStop.checked = false;
            infoWindowStop.disabled = false;


        }

    }



}




function findCampground(campgroundId) {
    for (const campgroundItem of campgrounds) {
        const { place_id } = campgroundItem;
        if (place_id === campgroundId) {
            return campgroundItem
        }
    }
}