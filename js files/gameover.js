scene("gameover", (lives, level, score, coins) => {
  var setBgColor = document.getElementById("container");
  setBgColor.style.backgroundColor = "black";
  if (lives > 0) {
    add([
      text(
        `Level: ${level}, Lives: ${lives}, score: ${score}, coins: ${coins}`
      ),
      origin("center"),
      pos(width() / 2, height() / 2),
    ]);
    setTimeout(() => {
      go("game", lives, level, score, coins);
    }, 5000);
  }
  if (lives < 1) {
    add([text("Game Over"), origin("center"), pos(width() / 2, height() / 2)]);
    setTimeout(() => {
      go("Start");
    }, 5000);
  }
});
