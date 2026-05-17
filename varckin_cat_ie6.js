function varckincat() {
  var catEl = document.createElement("div");

  var catPosX = 32;
  var catPosY = 32;

  var mousePosX = 0;
  var mousePosY = 0;

  var frameCount = 0;
  var idleTime = 0;
  var idleAnimation = null;
  var idleAnimationFrame = 0;
  var direction;

  var IE = document.all ? true : false;

  var catSpeed = 10;
  var spriteSets = {
    idle: [[-3, -3]],
    alert: [[-7, -3]],
    scratchSelf: [
      [-5, 0],
      [-6, 0],
      [-7, 0],
    ],
    scratchWallN: [
      [0, 0],
      [0, -1],
    ],
    scratchWallS: [
      [-7, -1],
      [-6, -2],
    ],
    scratchWallE: [
      [-2, -2],
      [-2, -3],
    ],
    scratchWallW: [
      [-4, 0],
      [-4, -1],
    ],
    tired: [[-3, -2]],
    sleeping: [
      [-2, 0],
      [-2, -1],
    ],
    N: [
      [-1, -2],
      [-1, -3],
    ],
    NE: [
      [0, -2],
      [0, -3],
    ],
    E: [
      [-3, 0],
      [-3, -1],
    ],
    SE: [
      [-5, -1],
      [-5, -2],
    ],
    S: [
      [-6, -3],
      [-7, -2],
    ],
    SW: [
      [-5, -3],
      [-6, -1],
    ],
    W: [
      [-4, -2],
      [-4, -3],
    ],
    NW: [
      [-1, 0],
      [-1, -1],
    ],
  };
  function init() {
    catEl.id = "varckin_cat";
    catEl.ariaHidden = true;
    catEl.style.width = "32px";
    catEl.style.height = "32px";
    catEl.style.position = "absolute";
    catEl.style.pointerEvents = "none";
    catEl.style.backgroundImage = "url('varckin_cat.gif')";
    catEl.style.imageRendering = "pixelated";
    catEl.style.left = catPosX - 16 + "px";
    catEl.style.top = catPosY - 16 + "px";
    catEl.style.zIndex = Number.MAX_VALUE;

    document.body.appendChild(catEl);
    function mousePos(event) {
      if (IE) {
        event = window.event;
      }
      mousePosX = event.clientX;
      mousePosY = event.clientY - 16;
    }
    document.onmousemove = mousePos;
    window.varckin_cat_interval = setInterval(frame, 100);
  }

  function setSprite(name, frame) {
    var length = spriteSets[name].length;
    if (IE) {
      length = 0;
      while (length < spriteSets[name].length) {
        if (spriteSets[name][length] != null) {
          length = length + 1;
          continue;
        }
        break;
      }
    }
    var sprite = spriteSets[name][frame % length];
    catEl.style.backgroundPosition =
      sprite["0"] * 32 + "px " + sprite["1"] * 32 + "px";
  }

  function resetIdleAnimation() {
    idleAnimation = null;
    idleAnimationFrame = 0;
  }

  function idle() {
    idleTime = idleTime + 1;

    if (
      idleTime > 10 &&
      Math.floor(Math.random() * 200) == 0 &&
      idleAnimation == null
    ) {
      var avalibleIdleAnimations = ["sleeping", "scratchSelf"];
      if (catPosX < 32) {
        avalibleIdleAnimations.push("scratchWallW");
      }
      if (catPosY < 32) {
        avalibleIdleAnimations.push("scratchWallN");
      }
      if (catPosX > window.innerWidth - 32) {
        avalibleIdleAnimations.push("scratchWallE");
      }
      if (catPosY > window.innerHeight - 32) {
        avalibleIdleAnimations.push("scratchWallS");
      }
      idleAnimation =
        avalibleIdleAnimations[
          Math.floor(Math.random() * avalibleIdleAnimations.length)
        ];
    }

    switch (idleAnimation) {
      case "sleeping":
        if (idleAnimationFrame < 8) {
          setSprite("tired", 0);
          break;
        }
        setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
        if (idleAnimationFrame > 192) {
          resetIdleAnimation();
        }
        break;
      case "scratchWallN":
      case "scratchWallS":
      case "scratchWallE":
      case "scratchWallW":
      case "scratchSelf":
        setSprite(idleAnimation, idleAnimationFrame);
        if (idleAnimationFrame > 9) {
          resetIdleAnimation();
        }
        break;
      default:
        setSprite("idle", 0);
        return;
    }
    idleAnimationFrame = idleAnimationFrame + 1;
  }

  function frame() {
    frameCount = frameCount + 1;
    var diffX = catPosX - mousePosX;
    var diffY = catPosY - mousePosY;
    var distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));

    if (distance < catSpeed || distance < 48) {
      idle();
      return;
    }

    idleAnimation = null;
    idleAnimationFrame = 0;

    if (idleTime > 1) {
      setSprite("alert", 0);
      idleTime = Math.min(idleTime, 7);
      idleTime = idleTime - 1;
      return;
    }

    direction = "";
    if (diffY / distance > 0.5) {
      direction = "N";
    } else if (diffY / distance < -0.5) {
      direction = "S";
    }
    if (diffX / distance > 0.5) {
      direction = direction + "W";
    } else if (diffX / distance < -0.5) {
      direction = direction + "E";
    }
    setSprite(direction, frameCount);

    if (distance > catSpeed) {
      catPosX = catPosX - (diffX / distance) * catSpeed;
      catPosY = catPosY - (diffY / distance) * catSpeed;
    } else {
      catPosX = mousePosX;
      catPosY = mousePosY;
    }

    catPosX = Math.min(
      Math.max(16, catPosX),
      document.getElementsByTagName("body")[0].clientWidth - 16
    );
    catPosY = Math.min(
      Math.max(16, catPosY),
      document.getElementsByTagName("body")[0].clientHeight - 16
    );

    catEl.style.left = catPosX - 16 + "px";
    catEl.style.top = catPosY - 16 + "px";
  }
  init();
}
varckincat();