let directionsHtmlString = "";

export default function directions(routeSteps) {
  routeSteps.forEach((step) => {
    directionsHtmlString = directionsHtmlString + step.instructions + "<br>";
  });

  return function getDirections() {
    return directionsHtmlString;
  };
}
