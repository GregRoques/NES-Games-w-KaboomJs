kaboom({
  global: true,
  fullscreen: true,
  scale: 2,
  debug: true,
  crisp: true,
  clearColor: [0, 0, 0, 0],
});

const moveSpeed = 120;
const smallJumpForce = 360;
let currentJumpForce = smallJumpForce;
const bigBumpForce = 460;

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
        scoreZeroPlaceholders.slice(0, scoreLabel.value.toString().length) +
        scoreLabel.value;
    }
  }

  const scoreLabel = add([
    text(scoreZeroPlaceholders),
    pos(10, 16),
    layer("ui"),
    {
      value: 0,
    },
  ]);

  const coinLabelImage = add([
    sprite("coin"),
    pos(110, 15),
    scale(0.65),
    layer("ui"),
  ]);
  const coinLabel = add([
    text(" x00"),
    pos(115, 16),
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

  add([text(`World`), pos(210, 6), layer("ui")]);
  let world = " 1-1";
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

// ======================================= Load Game

start("Start");