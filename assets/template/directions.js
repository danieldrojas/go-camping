let directionsHtmlString = "";

export default function directions(routeSteps) {
  console.log(routeSteps);
  routeSteps.forEach((step) => {
    // console.log(step);
    directionsHtmlString = directionsHtmlString + step.instructions + "<br>";
  });

  return function getDirections() {
    return directionsHtmlString;
  };
}
