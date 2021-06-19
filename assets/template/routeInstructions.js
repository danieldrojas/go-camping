let routeInstructions = "";

export default function instructions(routeSteps) {
  routeSteps.forEach((step) => {
    console.log(step);
    routeInstructions = routeInstructions + step.instructions;
    console.log(routeInstructions);
  });
}
