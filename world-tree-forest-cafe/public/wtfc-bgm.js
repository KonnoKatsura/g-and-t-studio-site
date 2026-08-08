(() => {
  const storageKey = "gt-wtfc-bgm-state";
  const params = new URLSearchParams(window.location.search);
  const audio = new Audio("./public/audio/glimmerpou_BGM_v1.mp3");
  audio.loop = true;
  audio.preload = "metadata";
  audio.volume = 0.58;

  let button = document.querySelector(".bgmButton");
  if (!button) {
    button = document.createElement("button");
    button.className = "bgmButton";
    button.type = "button";
    button.innerHTML = '<span class="bgmIcon" aria-hidden="true">♪</span><span>BGM</span>';
    document.body.append(button);
  }

  const readState = () => {
    try {
      return JSON.parse(window.sessionStorage.getItem(storageKey) || "null");
    } catch {
      return null;
    }
  };

  const queryPlaying = params.get("wtfcBgm");
  const saved = queryPlaying === "1"
    ? { playing: true, time: Number(params.get("wtfcBgmTime")) || 0 }
    : readState();
  let resumePending = Boolean(saved?.playing);

  const store = (playing = !audio.paused) => {
    const state = {
      playing,
      time: Number.isFinite(audio.currentTime) ? audio.currentTime : 0,
    };
    try {
      window.sessionStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // Query parameters remain as a fallback for local file pages.
    }
    return state;
  };

  const update = (playing, pending = false) => {
    button.classList.toggle("isPlaying", playing);
    button.classList.toggle("isResumePending", pending);
    button.setAttribute("aria-pressed", String(playing));
    button.setAttribute(
      "aria-label",
      playing ? "森のBGMを止める" : pending ? "森のBGMを続きから再生" : "森のBGMを流す",
    );
    button.title = playing ? "BGMを止める" : pending ? "続きから再生" : "BGMを流す";
  };

  const seek = () => {
    if (!saved?.time || !Number.isFinite(audio.duration)) return;
    audio.currentTime = saved.time % audio.duration;
  };

  const resume = async () => {
    if (!resumePending) return;
    seek();
    try {
      await audio.play();
      resumePending = false;
      update(true);
      store(true);
    } catch {
      update(false, true);
    }
  };

  update(false, resumePending);
  if (audio.readyState >= 1) resume();
  else audio.addEventListener("loadedmetadata", resume, { once: true });

  button.addEventListener("click", async () => {
    if (!audio.paused) {
      audio.pause();
      resumePending = false;
      update(false);
      store(false);
      return;
    }
    seek();
    try {
      await audio.play();
      resumePending = false;
      update(true);
      store(true);
    } catch {
      update(false, resumePending);
    }
  });

  audio.addEventListener("timeupdate", () => store(true));
  audio.addEventListener("play", () => update(true));
  audio.addEventListener("pause", () => update(false, resumePending));

  document.addEventListener("click", (event) => {
    const anchor = event.target.closest("a[href]");
    if (!anchor) return;
    let destination;
    try {
      destination = new URL(anchor.href, window.location.href);
    } catch {
      return;
    }
    if (!destination.pathname.includes("/world-tree-forest-cafe/")) return;
    const state = store(!audio.paused || resumePending);
    destination.searchParams.set("wtfcBgm", state.playing ? "1" : "0");
    if (state.playing) destination.searchParams.set("wtfcBgmTime", state.time.toFixed(2));
    anchor.href = destination.href;
  }, true);

  window.addEventListener("beforeunload", () => store(!audio.paused || resumePending));
})();
