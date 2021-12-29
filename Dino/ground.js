import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from "./updateCustomProperty.js";

const SPEED = 0.05;
const groundElems = document.querySelectorAll("[data-ground]");

// initialize ground position
export function setupGround() {
  //ground one in first position
  setCustomProperty(groundElems[0], "--left", 0);
  //ground two... directly behind other element
  setCustomProperty(groundElems[1], "--left", 300);
}

// keeps ground constantly rotating
export function updateGround(delta, speedScale) {
  groundElems.forEach((ground) => {
    incrementCustomProperty(ground, "--left", delta * speedScale * SPEED * -1);

    // check current position of each ground element
    // if one has reached 300% of screen size, restart at farthest end of right side of screen
    if (getCustomProperty(ground, "--left") <= -300) {
      incrementCustomProperty(ground, "--left", 600);
    }
  });
}
