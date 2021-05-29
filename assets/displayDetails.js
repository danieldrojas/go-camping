import createInfoHTML from "./template/infoHtml.js"
const campgrounds = [];

export default function displayDetails(campground) {

    if (campground) {
        console.log("getting into if with campground: ", campground)
        campgrounds.push(campground);
        let infoHtml = createInfoHTML(campground, true);
        console.log("and infoHtml: ", infoHtml)

        // TODO: order the campground options from closest distance.
        return infoHtml;
    } else {
        console.log("without campground: ", campground)
        displayCampground();
        return;
    }




};


function displayCampground() {
    let campground;
    let campgroundHtml;
    document.getElementById("addBtn").addEventListener("click", event => {
        console.log("is this event: ", event)

        let campSelectedId = event.target.defaultValue;
        console.log(campSelectedId)
        console.log(campgrounds)
        for (const campgroundItem of campgrounds) {
            const { place_id } = campgroundItem;
            if (place_id == campSelectedId) {
                campground = campgroundItem;
                campgroundHtml = createInfoHTML(campground, false);
                break;
            };
        };
        const div = document.createElement("div");
        div.setAttribute("class", "campground");
        document.querySelector(".places").append(div);

        const para = document.createElement("p");
        para.setAttribute("id", `${campgroundHtml.place_id}`);
        para.innerHTML = campgroundHtml;
        div.appendChild(para);
    });
};