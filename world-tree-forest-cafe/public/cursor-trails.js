(() => {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  if (!window.location.hash) {
    const restoreTop = () => {
      window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
    };

    restoreTop();
    window.addEventListener("load", restoreTop, { once: true });
    window.addEventListener("pageshow", restoreTop, { once: true });
  }

  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) return;

  const layer = document.createElement("div");
  let last = 0;
  let lastTap = 0;

  layer.className = "forestCursorTrailLayer";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);

  const createTrail = (event) => {
    const now = performance.now();
    if (now - last < 24) return;
    last = now;

    const spark = document.createElement("span");
    spark.className = "forestCursorSpark";
    spark.style.left = `${event.clientX}px`;
    spark.style.top = `${event.clientY}px`;
    spark.style.setProperty("--forest-trail-x", `${Math.random() * 26 - 13}px`);
    spark.style.setProperty("--forest-trail-y", `${Math.random() * -24 - 8}px`);
    spark.style.setProperty("--forest-trail-size", `${Math.random() * 5 + 6}px`);
    layer.appendChild(spark);
    spark.addEventListener("animationend", () => spark.remove(), { once: true });
  };

  const createTapBloom = (event) => {
    if (canHover || event.pointerType === "mouse" || event.isPrimary === false) return;

    const now = performance.now();
    if (now - lastTap < 260) return;
    lastTap = now;

    for (let index = 0; index < 4; index += 1) {
      const spark = document.createElement("span");
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 18 + 8;

      spark.className = "forestTapBloom";
      spark.style.left = `${event.clientX}px`;
      spark.style.top = `${event.clientY}px`;
      spark.style.setProperty("--forest-tap-x", `${Math.cos(angle) * distance}px`);
      spark.style.setProperty("--forest-tap-y", `${Math.sin(angle) * distance}px`);
      spark.style.setProperty("--forest-tap-size", `${Math.random() * 5 + 7}px`);
      layer.appendChild(spark);
      spark.addEventListener("animationend", () => spark.remove(), { once: true });
    }
  };

  if (canHover) {
    window.addEventListener("pointermove", createTrail, { passive: true });
  } else {
    window.addEventListener("pointerdown", createTapBloom, { passive: true });
  }
})();
