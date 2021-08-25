kaboom({
  global: true,
  fullscreen: true,
  scale: 2,
  debug: true,
  clearColor: [0, 0, 1, 1],
});

const moveSpeed = 120;
const jumpForce = 360;

loadRoot("https://i.imgur.com/");
loadSprite("coin", "wbKxhcd.png");
loadSprite("goomba", "KPO3fR9.png");
loadSprite("brick", "pogC9x5.png");
loadSprite("block", "M6rwarW.png");
loadSprite("mario", "Wb1qfhK.png");
loadSprite("mushroom", "0wMd92p.png");
loadSprite("surprise", "gesQ1KP.png");
loadSprite("unboxed", "bdrLpi6.png");
loadSprite("pipe-top-left", "ReTPiWY.png");
loadSprite("pipe-top-right", "hj2GK4n.png");
loadSprite("pipe-bottom-left", "c1cYSbt.png");
loadSprite("pipe-bottom-right", "nqQ79eI.png");

loadSprite("blue-block", "fVscIbn.png");
loadSprite("blue-brick", "3e5YRQd.png");
loadSprite("blue-steel", "gqVoI2b.png");
loadSprite("blue-goomba", "SvV4ueD.png");
loadSprite("blue-surprise", "RMqCc1G.png");

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");

  const maps = [
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
  ];

  const levelCfg = {
    width: 20,
    height: 20,
    "=": [sprite("block"), solid()],
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

  let score = 0;
  const scoreLabel = add([
    text(score),
    pos(30, 6),
    layer("ui"),
    {
      value: score,
    },
  ]);

  add([text(`level test`), pos(4, 6)]);

  function big() {
    let isBig = false;
    return {
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
  });

  player.collides("mushroom", (m) => {
    destroy(m);
    player.biggify();
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
      player.jump(jumpForce);
    }
  });
});

start("game");
