scene("gameover", (lives, level, score) => {
  var setBgColor = document.getElementById("container");
  setBgColor.style.backgroundColor = "black";
  if (lives > 0) {
    // display lives and current level
    setTimeout(() => {
      go("game", lives, level, score);
    }, 5000);
  }
  if (lives < 1) {
    //display gameover and score
    setTimeout(() => {
      go("Start");
    }, 10000);
  }
});
