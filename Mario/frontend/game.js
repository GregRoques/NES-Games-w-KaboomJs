kaboom({
  global: true,
  fullscreen: true,
  scale: 2,
  debug: true,
  crisp: true,
  clearColor: [0, 0, 0, 0],
});

// =================================================================================== Start Screen

// ===== load sprites
const startImage =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Super_Mario_Bros._Logo.svg/1280px-Super_Mario_Bros._Logo.svg.png";

loadSprite("startScreen", startImage);

let startImageWidth = "";
let startImageHeight = "";

const img = new Image();
img.onload = function () {
  startImageWidth = this.width * 0.25;
  startImageHeight = this.height * 0.25;
};
img.src = startImage;

// ===== Function to Get High Score
let highScore = "";
async function getHighScore() {
  await fetch("http://localhost:2000/highScore", {
    method: "GET",
  })
    .then((response) => {
      if (response.ok) {
        highScore = response.body.data;
        return true;
      }
    })
    .catch((err) => {
      console.log(`Could not fetch high score: ${err}`);
      return false;
    });
}

// ===== Begin Scene

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
  }
});
// =================================================================================== Start Screen End

// =================================================================================== Game Start

// ===== load Sprites

//loadRoot("https://i.imgur.com/");

//player sprites
loadSprite("mario", "https://i.imgur.com/Wb1qfhK.png");

//brick output/surprises
loadSprite("coin", "https://i.imgur.com/wbKxhcd.png");
loadSprite("mushroom", "https://i.imgur.com/0wMd92p.png");

// sprites reocurring on all stages
loadSprite("surprise", "https://i.imgur.com/gesQ1KP.png");
loadSprite("unboxed", "https://i.imgur.com/bdrLpi6.png");
loadSprite("pipe-top-left", "https://i.imgur.com/ReTPiWY.png");
loadSprite("pipe-top-right", "https://i.imgur.com/hj2GK4n.png");
loadSprite("pipe-bottom-left", "https://i.imgur.com/c1cYSbt.png");
loadSprite("pipe-bottom-right", "https://i.imgur.com/nqQ79eI.png");

//Level 1/ overworld sprites
loadSprite("goomba", "https://i.imgur.com/KPO3fR9.png");
loadSprite("brick", "https://i.imgur.com/pogC9x5.png");
loadSprite("block", "https://i.imgur.com/M6rwarW.png");

// Level 2/ underworld sprits
loadSprite("blue-block", "https://i.imgur.com/fVscIbn.png");
loadSprite("blue-brick", "https://i.imgur.com/3e5YRQd.png");
loadSprite("blue-steel", "https://i.imgur.com/gqVoI2b.png");
loadSprite("blue-goomba", "https://i.imgur.com/SvV4ueD.png");
loadSprite("blue-surprise", "https://i.imgur.com/RMqCc1G.png");

// ===== load sprites (for in game play) end

const moveSpeed = 120;
const smallJumpForce = 360;
let currentJumpForce = smallJumpForce;
const bigBumpForce = 460;
const Fall_Death = height();

scene("game", (lives = 3, level = "1-1", startScore = 0, coins = 0) => {
  layers(["bg", "obj", "ui"], "obj");

  var setBgColor = document.getElementById("container");
  if (level === "1-1") {
    setBgColor.style.backgroundColor = "rgb(93,148,251)";
  }

  const maps = [
    "                                      ",
    "                                      ",
    "                                      ",
    "                                      ",
    "                                      ",
    "                                      ",
    "                                      ",
    "                                      ",
    "     %   =*=%=                        ",
    "                                      ",
    "                            -+        ",
    "                    ^   ^   ()        ",
    "==============================   =====",
    "==============================   =====",
  ];

  const levelCfg = {
    width: 20,
    height: 20,
    "=": [sprite("block"), solid(), "block"],
    $: [sprite("coin"), "coin"],
    "%": [sprite("surprise"), solid(), "coin-surprise"],
    "*": [sprite("surprise"), solid(), "mushroom-surprise"],
    "}": [sprite("unboxed"), solid()],
    "(": [sprite("pipe-bottom-left"), solid(), scale(0.5)],
    ")": [sprite("pipe-bottom-right"), solid(), scale(0.5)],
    "-": [sprite("pipe-top-left"), solid(), scale(0.5), "pipe"],
    "+": [sprite("pipe-top-right"), solid(), scale(0.5), "pipe"],
    "^": [sprite("goomba"), solid(), "dangerous"],
    "#": [sprite("mushroom"), solid(), "mushroom", body()],
    "!": [sprite("blue-block"), solid(), scale(0.5)],
    "£": [sprite("blue-brick"), solid(), scale(0.5)],
    z: [sprite("blue-goomba"), solid(), scale(0.5), "dangerous"],
    "@": [sprite("blue-surprise"), solid(), scale(0.5), "coin-surprise"],
    x: [sprite("blue-steel"), solid(), scale(0.5)],
  };

  const gameLevel = addLevel(maps, levelCfg);

  add([text(`MARIO`), pos(10, 6), layer("ui")]);
  let scoreZeroPlaceholders = "000000";
  function addToScore(add) {
    if (scoreLabel.value < 999999) {
      scoreLabel.value += add;
      scoreLabel.text =
        scoreZeroPlaceholders.slice(scoreLabel.value.toString().length) +
        scoreLabel.value;
    }
  }
  const scoreLabel = add([
    text("000000".slice(startScore.toString().length) + startScore),
    pos(10, 16),
    layer("ui"),
    {
      value: startScore,
    },
  ]);

  const coinLabelImage = add([
    sprite("coin"),
    pos(110, 15),
    scale(0.65),
    layer("ui"),
  ]);
  const coinLabel = add([
    text(` x${coins.toString().length <= 1 ? "0" : ""}${coins}`),
    pos(115, 16),
    layer("ui"),
    {
      value: coins,
    },
  ]);

  function addToCoinCount() {
    if (coinLabel.value < 99) {
      coinLabel.value++;
      coinLabel.text = ` x${coinLabel.value.toString().length <= 1 ? "0" : ""}${
        coinLabel.value
      }`;
    } else {
      coinLabel.value = 0;
      coinLabel.text = " x00";
      //addExtraLife()
    }
  }

  add([text(`World`), pos(210, 6), layer("ui")]);
  let world = ` ${level}`;
  add([text(world), pos(210, 16), layer("ui")]);

  add([text(`Time`), pos(315, 6), layer("ui")]);
  const timeLabel = add([
    text(" 300"),
    pos(315, 16),
    layer("ui"),
    {
      value: 300,
    },
  ]);

  function subtractTime() {
    timeLabel.value--;
    timeLabel.text = ` ${timeLabel.value}`;
  }

  function big() {
    let isBig = false;
    return {
      update() {
        if (isBig) {
          currentJumpForce = bigBumpForce;
        }
        if (!isBig) {
          currentJumpForce = smallJumpForce;
        }
      },
      isBig() {
        return isBig;
      },
      smallify() {
        isBig = false;
        this.scale = vec2(1 * Math.sign(player.scale.x), 1);
      },
      biggify() {
        isBig = true;
        this.scale = vec2(1.5 * Math.sign(player.scale.x), 2);
      },
    };
  }

  const player = add([
    sprite("mario"),
    solid(),
    pos(30, 0),
    body(),
    big(),
    origin("bot"),
    scale(vec2(1)),
  ]);

  let isPlayer = true;
  function playerDeath() {
    isPlayer = false;
    destroy(player);
    setTimeout(() => {
      lives--;
      go("gameover", lives, level, scoreLabel.value, coinLabel.value);
    }, 2000);
  }

  loop(1, () => {
    if (timeLabel.value !== 0 && isPlayer) {
      subtractTime();
    }
    if (timeLabel.value === 0 && isPlayer) {
      playerDeath();
    }
  });

  action("mushroom", (m) => {
    m.move(-50, 0);
  });

  camIgnore(["ui"]);
  camPos(width() / 2, height() / 2);
  player.action(() => {
    if (player.pos.x >= width() / 2) {
      camPos(player.pos.x, height() / 2);
    }
  });

  player.on("headbump", (obj) => {
    if (obj.is("coin-surprise")) {
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("}", obj.gridPos.sub(0, 0));
    }
    if (obj.is("mushroom-surprise")) {
      gameLevel.spawn("#", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("}", obj.gridPos.sub(0, 0));
    }
    if (obj.is("block") && player.isBig()) {
      destroy(obj);
    }
  });

  player.action(() => {
    if (player.pos.y > Fall_Death) {
      playerDeath();
    }
  });

  player.collides("mushroom", (m) => {
    destroy(m);
    player.biggify();
    addToScore(200);
  });

  player.collides("coin", (c) => {
    destroy(c);
    addToScore(100);
    addToCoinCount();
  });

  keyDown("left", () => {
    player.move(-moveSpeed, 0);
  });

  keyPress("left", () => {
    player.scale.x =
      Math.sign(player.scale.x) === -1 ? player.scale.x : player.scale.x * -1;
  });

  keyDown("right", () => {
    player.move(moveSpeed, 0);
  });

  keyPress("right", () => {
    player.scale.x = Math.abs(player.scale.x);
  });

  keyPress("space", () => {
    if (player.grounded()) {
      //gravity(980);
      player.jump(currentJumpForce);
    }
  });

  keyRelease("space", () => {
    if (!player.grounded()) {
      player.jump(-(currentJumpForce / 4));
      //gravity(3000);
    }
  });
});

// =================================================================================== Game Screen End

// =================================================================================== Game Over Screen Start

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

// =================================================================================== Game Over Screen End

// =================================================================================== Load Game

start("Start");
