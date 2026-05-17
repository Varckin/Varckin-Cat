(function varckincat() {
  const isReducedMotion =
    window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
    window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

  if (isReducedMotion) return;

  const catEl = document.createElement("div");

  let catPosX = 32;
  let catPosY = 32;

  let mousePosX = 0;
  let mousePosY = 0;

  const catSites = [
    "localhost",
  ];

  try {
    const searchParams = location.search
      .replace("?", "")
      .split("&")
      .map((keyvaluepair) => keyvaluepair.split("="));
    tmp = searchParams.find((a) => a[0] == "catx");
    if (tmp && tmp[1]) catPosX = parseInt(tmp[1]);
    tmp = searchParams.find((a) => a[0] == "caty");
    if (tmp && tmp[1]) catPosY = parseInt(tmp[1]);
    tmp = searchParams.find((a) => a[0] == "catdx");
    if (tmp && tmp[1]) mousePosX = parseInt(tmp[1]);
    tmp = searchParams.find((a) => a[0] == "catdy");
    if (tmp && tmp[1]) mousePosY = parseInt(tmp[1]);
  } catch (e) {
    console.error("varckin_cat.js: failed to parse query params.");
    console.error(e);
  }

  function onClick(event) {
    const target = event.target.closest("A");
    if (target === null || !target.getAttribute("href")) {
      return;
    }

    let newLocation;
    try {
      newLocation = new URL(target.href);
    } catch (e) {
      return;
    }
    if (
      (catSites.includes(newLocation.host) && newLocation.pathname == "/") ||
      target.dataset.varckin_cat
    ) {
      newLocation.searchParams.append("catx", Math.floor(catPosX));
      newLocation.searchParams.append("caty", Math.floor(catPosY));
      newLocation.searchParams.append("catdx", Math.floor(mousePosX));
      newLocation.searchParams.append("catdy", Math.floor(mousePosY));
      event.preventDefault();
      window.location.href = newLocation.toString();
    }
  }
  document.addEventListener("click", onClick);

  let frameCount = 0;
  let idleTime = 0;
  let idleAnimation = null;
  let idleAnimationFrame = 0;

  const catSpeed = 10;
  const spriteSets = {
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
    catEl.style.position = "fixed";
    catEl.style.pointerEvents = "none";
    catEl.style.imageRendering = "pixelated";
    catEl.style.left = `${catPosX - 16}px`;
    catEl.style.top = `${catPosY - 16}px`;
    catEl.style.zIndex = Number.MAX_SAFE_INTEGER;

    let catFile = "./varckin_cat.gif"
    const curScript = document.currentScript
    if (curScript && curScript.dataset.cat) {
      catFile = curScript.dataset.cat
    }
    catEl.style.backgroundImage = `url(${catFile})`;

    document.body.appendChild(catEl);

    document.addEventListener("mousemove", function (event) {
      mousePosX = event.clientX;
      mousePosY = event.clientY;
    });

    window.requestAnimationFrame(onAnimationFrame);
  }

  let lastFrameTimestamp;

  function onAnimationFrame(timestamp) {
    if (!catEl.isConnected) {
      return;
    }
    if (!lastFrameTimestamp) {
      lastFrameTimestamp = timestamp;
    }
    if (timestamp - lastFrameTimestamp > 100) {
      lastFrameTimestamp = timestamp
      frame()
    }

    window.requestAnimationFrame(onAnimationFrame);
  }

  function setSprite(name, frame) {
    const sprite = spriteSets[name][frame % spriteSets[name].length];
    catEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
  }

  function resetIdleAnimation() {
    idleAnimation = null;
    idleAnimationFrame = 0;
  }

  function idle() {
    idleTime += 1;

    if (
      idleTime > 10 &&
      Math.floor(Math.random() * 200) == 0 &&
      idleAnimation == null
    ) {
      let avalibleIdleAnimations = ["sleeping", "scratchSelf"];
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
    idleAnimationFrame += 1;
  }

  function frame() {
    frameCount += 1;
    const diffX = catPosX - mousePosX;
    const diffY = catPosY - mousePosY;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    if (distance < catSpeed || distance < 48) {
      idle();
      return;
    }

    idleAnimation = null;
    idleAnimationFrame = 0;

    if (idleTime > 1) {
      setSprite("alert", 0);
      idleTime = Math.min(idleTime, 7);
      idleTime -= 1;
      return;
    }

    let direction;
    direction = diffY / distance > 0.5 ? "N" : "";
    direction += diffY / distance < -0.5 ? "S" : "";
    direction += diffX / distance > 0.5 ? "W" : "";
    direction += diffX / distance < -0.5 ? "E" : "";
    setSprite(direction, frameCount);

    catPosX -= (diffX / distance) * catSpeed;
    catPosY -= (diffY / distance) * catSpeed;

    catPosX = Math.min(Math.max(16, catPosX), window.innerWidth - 16);
    catPosY = Math.min(Math.max(16, catPosY), window.innerHeight - 16);

    catEl.style.left = `${catPosX - 16}px`;
    catEl.style.top = `${catPosY - 16}px`;
  }

  init();
})();