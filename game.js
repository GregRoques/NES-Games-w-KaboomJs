kaboom({
  global: true,
  fullscreen: true,
  scale: 2,
  debug: true,
  crisp: true,
  clearColor: [0, 0, 1, 1],
});

const moveSpeed = 120;
const smallJumpForce = 360;
let currentJumpForce = smallJumpForce;
const bigBumpForce = 460;

//loadRoot("https://i.imgur.com/");
loadSprite("coin", "https://i.imgur.com/wbKxhcd.png");
loadSprite("goomba", "https://i.imgur.com/KPO3fR9.png");
loadSprite("brick", "https://i.imgur.com/pogC9x5.png");
loadSprite("block", "https://i.imgur.com/M6rwarW.png");
loadSprite("mario", "https://i.imgur.com/Wb1qfhK.png");
loadSprite("mushroom", "https://i.imgur.com/0wMd92p.png");
loadSprite("surprise", "https://i.imgur.com/gesQ1KP.png");
loadSprite("unboxed", "https://i.imgur.com/bdrLpi6.png");
loadSprite("pipe-top-left", "https://i.imgur.com/ReTPiWY.png");
loadSprite("pipe-top-right", "https://i.imgur.com/hj2GK4n.png");
loadSprite("pipe-bottom-left", "https://i.imgur.com/c1cYSbt.png");
loadSprite("pipe-bottom-right", "https://i.imgur.com/nqQ79eI.png");

loadSprite("blue-block", "https://i.imgur.com/fVscIbn.png");
loadSprite("blue-brick", "https://i.imgur.com/3e5YRQd.png");
loadSprite("blue-steel", "https://i.imgur.com/gqVoI2b.png");
loadSprite("blue-goomba", "https://i.imgur.com/SvV4ueD.png");
loadSprite("blue-surprise", "https://i.imgur.com/RMqCc1G.png");

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");

  const maps = [
    "                                      ",
    "                                      ",
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

  add([text(`MARIO`), pos(4, 6)]);
  let scoreZeroPlaceholders = "000000";
  function addToScore(add) {
    if (scoreLabel.value < 999999) {
      scoreLabel.value += add;
      scoreLabel.text =
        scoreZeroPlaceholders.slice(0, scoreLabel.value.toString().length) +
        scoreLabel.value;
    }
  }

  const scoreLabel = add([
    text(scoreZeroPlaceholders),
    pos(4, 16),
    layer("ui"),
    {
      value: 0,
    },
  ]);

  const coinLabelImage = add([sprite("coin"), pos(100, 15), scale(0.65)]);
  const coinLabel = add([
    text(" x00"),
    pos(105, 16),
    layer("ui"),
    {
      value: 0,
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

  add([text(`World`), pos(200, 6)]);
  let world = " 1-1";
  add([text(world), pos(200, 16)]);

  add([text(`Time`), pos(305, 6)]);
  const timeLabel = add([
    text(" 300"),
    pos(305, 16),
    layer("ui"),
    {
      value: 300,
    },
  ]);

  function subtractTime() {
    timeLabel.value--;
    timeLabel.text = ` ${timeLabel.value}`;
  }

  loop(1, () => {
    subtractTime();
  });

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

  action("mushroom", (m) => {
    m.move(-50, 0);
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

loadSprite(
  "startScreen",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Super_Mario_Bros._Logo.svg/1280px-Super_Mario_Bros._Logo.svg.png"
);

scene("Start", () => {
  const background = add([
    sprite("startScreen"),
    layer("bg"),
    pos(20, 20),
    scale(0.25),
  ]);

  console.log(screen.width);

  add([text(`Press Enter to Start`), pos(90, 155)]);
  keyPress("enter", () => {
    go("game");
  });
});

start("Start");
