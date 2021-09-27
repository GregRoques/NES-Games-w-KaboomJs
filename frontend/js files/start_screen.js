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

let highScore = "";
async function getHighScore() {
  await fetch("http://localhost:2000/highScore", {
    method: "GET",
  })
    .then((response) => {
      if (response.ok) {
        HS = response.body.data;
        return true;
      }
    })
    .catch((err) => {
      console.log(`Could not fetch high score: ${err}`);
      return false;
    });
}

scene("Start", async () => {
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

  if ((await getHighScore()) === true) {
    add([
      text("HIGH SCORES", 8),
      pos((width() - startText.length * 8) / 2, startImageHeight + 60),
    ]);

    highScore.map((score, index) => {
      let descendingHeight = 70;
      add([
        text(`${index + 1}) ${score.initials}—${score.points}`, 8),
        pos(
          (width() - startText.length * 8) / 2,
          startImageHeight + descendingHeight
        ),
      ]);
      descendingHeight += 10;
    });
  } else {
    console.log("fuck you");
  }
});
