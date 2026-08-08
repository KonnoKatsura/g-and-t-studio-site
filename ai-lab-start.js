(() => {
  const startButton = document.querySelector("[data-lab-start]");

  if (!startButton) {
    return;
  }

  const startSounds = [
    "./public/audio/ai-lab/fennec-doya-jackpot.mp3",
    "./public/audio/ai-lab/fennec-doya-jackpot-v1.mp3",
    "./public/audio/ai-lab/glitch-riser-cue.mp3",
    "./public/audio/ai-lab/glitch-riser-cue-v1.mp3",
    "./public/audio/ai-lab/jackpot-impact-burst.mp3",
    "./public/audio/ai-lab/jackpot-impact-burst-v1.mp3",
  ];

  let activeAudio = null;
  const idleLabel = "▷ PRESS START ◁";

  function flashScreen() {
    const flash = document.createElement("span");
    flash.className = "labStartFlash";
    flash.setAttribute("aria-hidden", "true");
    document.body.appendChild(flash);
    flash.addEventListener("animationend", () => flash.remove(), { once: true });
  }

  function playStartSound() {
    const sound = startSounds[Math.floor(Math.random() * startSounds.length)];

    if (activeAudio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    }

    activeAudio = new Audio(sound);
    activeAudio.volume = 0.5;

    startButton.classList.add("isPlaying");
    startButton.textContent = "NOW LOADING";
    flashScreen();

    activeAudio.addEventListener(
      "ended",
      () => {
        startButton.classList.remove("isPlaying");
        startButton.textContent = idleLabel;
      },
      { once: true },
    );

    activeAudio.play().catch(() => {
      startButton.classList.remove("isPlaying");
      startButton.textContent = idleLabel;
    });
  }

  startButton.addEventListener("click", playStartSound);
})();
