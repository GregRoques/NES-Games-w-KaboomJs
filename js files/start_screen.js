// ======================================= Start Screen
const startImage =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Super_Mario_Bros._Logo.svg/1280px-Super_Mario_Bros._Logo.svg.png";

let startImageWidth = "";
let startImageHeight = "";

const img = new Image();
img.onload = function () {
  startImageWidth = this.width * 0.25;
  startImageHeight = this.height * 0.25;
};
img.src = startImage;

loadSprite("startScreen", startImage);

scene("Start", () => {
  var setBgColor = document.getElementById("container");
  setBgColor.style.backgroundColor = "rgb(93,148,251)";
  const background = add([
    sprite("startScreen"),
    layer("bg"),
    pos((width() - startImageWidth) / 2, 20),
    scale(0.25),
  ]);

  var startText = "Press Enter to Start";
  add([
    text(startText, 8),
    pos((width() - startText.length * 8) / 2, startImageHeight + 40),
  ]);
  keyPress("enter", () => {
    go("game");
  });
});
