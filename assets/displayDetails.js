import createInfoHTML from "./template/infoHtml.js";
const campgrounds = [];
let campgroundSelections = [];
const divPlaces = document.querySelector(".places");
const divMap = document.querySelector("#map");
divMap.addEventListener("click", (event) => {
  if (event.target.nodeName === "AREA") {
    document.querySelectorAll(".addStop").forEach((input) => {
      if (input.checked) {
        const stop = divPlaces.querySelector(`#${input.value}`);
        if (!stop) {
          input.checked = false;
          input.disabled = false;
        }
      }
    }, false);
  }

  if (
    event.target.nodeName === "INPUT" &&
    event.target.className === "addStop" &&
    event.target.name === "campgroundOptions"
  ) {
    displayCampground(event);
  }
});
divPlaces.addEventListener(
  "click",
  (event) => {
    if (
      event.target.nodeName === "INPUT" &&
      event.target.className === "deleteStop"
    ) {
      deleteStop(event);
    }
  },
  false
);
export default function displayDetails(campground) {
  campgrounds.push(campground);
  console.log(campground);
  let infoHtml = createInfoHTML(true, campground);

  // TODO: order the campground options from closest distance.
  return infoHtml;
}

function displayCampground(event) {
  const campgroundId = event.target;
  if (event.target.checked) campgroundId.disabled = true;

  const stop = findCampground(event.target.value);
  const camp = createInfoHTML(false, stop);
  const div = document.createElement("div");
  div.setAttribute("class", "campground");
  div.innerHTML = camp;
  divPlaces.appendChild(div);
}

function deleteStop(event) {
  document.getElementById(event.target.value).remove();
  const addStopBtn = document.querySelectorAll(".addStop");
  if (addStopBtn.length) {
    for (let infoWindowStop of addStopBtn) {
      const { value } = infoWindowStop;
      if (value === event.target.value) {
        infoWindowStop.checked = false;
        infoWindowStop.disabled = false;
        return;
      }
    }
  }
}

function findCampground(campgroundId) {
  for (const campgroundItem of campgrounds) {
    const { place_id } = campgroundItem;
    if (place_id === campgroundId) {
      return campgroundItem;
    }
  }
}
