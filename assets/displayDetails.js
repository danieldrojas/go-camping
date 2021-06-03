import createInfoHTML from "./template/infoHtml.js"
const campgrounds = [];
let addBtn;
let deleteBtn;

export default function displayDetails(campground) {

    if (campground) {
        console.log("getting into if with campground: ", campground)
        campgrounds.push(campground);
        let infoHtml = createInfoHTML(campground, true);
        console.log("and infoHtml: ", infoHtml)


        // TODO: order the campground options from closest distance.
        return infoHtml;
    } else {
        displayCampground();
        return;
    }




};


function displayCampground() {
    let campground;
    let campgroundHtml;
    addBtn = document.getElementById("addBtn");
    addBtn.checked = false;
    console.log("checked?", addBtn.checked)
    addBtn.addEventListener("click", event => {

        console.log("is this event: ", event)
        addBtn.checked ? false : true;
        console.log(addBtn)

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

        deleteBtn = document.getElementById("deleteBtn");
        deleteBtn.checked = false;

        deleteBtn.addEventListener("click", event => {
            addBtn.checked = false;
            deleteBtn.checked = true;

            if (event.target.nodeName === "INPUT" && event.target.id === "deleteBtn") {
                console.log(event)
                if (deleteBtn.checked) {
                    const parentNode = document.querySelector(".places")
                    parentNode.removeChild(document.querySelector(".campground"))
                    addBtn.checked = false;
                    deleteBtn.checked = false;
                    console.log(addBtn.checked)
                }

            }

        })
    });
};