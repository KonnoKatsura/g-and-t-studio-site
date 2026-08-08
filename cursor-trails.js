(() => {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  const navigation = performance.getEntriesByType("navigation")[0];
  const isReload = navigation ? navigation.type === "reload" : performance.navigation?.type === 1;

  if (isReload && !window.location.hash) {
    window.addEventListener(
      "load",
      () => {
        window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
      },
      { once: true },
    );
  }

  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) return;

  const body = document.body;
  const mode = body.dataset.cursorTrail || (body.classList.contains("labPage") ? "lab" : "music");
  const layer = document.createElement("div");
  let last = 0;
  let lastTap = 0;

  layer.className = `cursorTrailLayer cursorTrailLayer-${mode}`;
  layer.setAttribute("aria-hidden", "true");
  body.appendChild(layer);

  const createTrail = (event) => {
    const now = performance.now();
    if (now - last < 22) return;
    last = now;

    const trail = document.createElement("span");
    const angle = mode === "shiro" || mode === "notes" ? Math.random() * 80 - 40 : Math.random() * 42 - 21;
    const driftX = Math.random() * 34 - 17;
    const driftY = Math.random() * -28 - 8;

    trail.className = `cursorTrail cursorTrail-${mode}`;
    trail.style.left = `${event.clientX}px`;
    trail.style.top = `${event.clientY}px`;
    trail.style.setProperty("--trail-angle", `${angle}deg`);
    trail.style.setProperty("--trail-x", `${driftX}px`);
    trail.style.setProperty("--trail-y", `${driftY}px`);
    trail.style.setProperty("--trail-length", `${Math.random() * 28 + 32}px`);
    trail.style.setProperty("--trail-size", `${Math.random() * 5 + 6}px`);

    layer.appendChild(trail);
    trail.addEventListener("animationend", () => trail.remove(), { once: true });
  };

  const createTapBloom = (event) => {
    if (canHover || event.pointerType === "mouse" || event.isPrimary === false) return;

    const now = performance.now();
    if (now - lastTap < 260) return;
    lastTap = now;

    for (let index = 0; index < 4; index += 1) {
      const bloom = document.createElement("span");
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 18 + 8;

      bloom.className = `cursorTapBloom cursorTapBloom-${mode}`;
      bloom.style.left = `${event.clientX}px`;
      bloom.style.top = `${event.clientY}px`;
      bloom.style.setProperty("--tap-x", `${Math.cos(angle) * distance}px`);
      bloom.style.setProperty("--tap-y", `${Math.sin(angle) * distance}px`);
      bloom.style.setProperty("--tap-size", `${Math.random() * 5 + 7}px`);

      layer.appendChild(bloom);
      bloom.addEventListener("animationend", () => bloom.remove(), { once: true });
    }
  };

  if (canHover) {
    window.addEventListener("pointermove", createTrail, { passive: true });
  } else {
    window.addEventListener("pointerdown", createTapBloom, { passive: true });
  }
})();
