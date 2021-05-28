import createInfoHTML from "./template/infoHtml.js"
const campgrounds = [];

export default function displayDetails(campground, typeOfStop) {

    if (campground) {
        campgrounds.push(campground);
        let infoHtml = createInfoHTML(campground);

        // TODO: order the campground options from closest distance.
        return infoHtml;
    };


    switch (typeOfStop) {
        case "campground":
            displayCampground();

            break;
        case "gas station":
            console.log("gas station on work");
            break
        default:
            console.log("default from switch on work");
    }
    return;
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
                campgroundHtml = createInfoHTML(campground);
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
    return;
};