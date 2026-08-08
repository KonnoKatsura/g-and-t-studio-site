(() => {
  const stateKey = 'gt-shiro-bgm-state';
  const params = new URLSearchParams(window.location.search);
  const audio = new Audio('./public/audio/shiro/kajiru.mp3');
  audio.loop = true;
  audio.preload = 'metadata';
  audio.volume = 0.42;
  let isUnloading = false;
  let resumePending = false;

  const readStoredState = () => {
    try {
      return JSON.parse(window.sessionStorage.getItem(stateKey) || 'null');
    } catch (error) {
      return null;
    }
  };

  const writeStoredState = (playing = !audio.paused) => {
    const state = {
      playing,
      time: Number.isFinite(audio.currentTime) ? audio.currentTime : 0,
      updatedAt: Date.now(),
    };
    try {
      window.sessionStorage.setItem(stateKey, JSON.stringify(state));
    } catch (error) {
      // The URL parameters below remain as a fallback for local file pages.
    }
    return state;
  };

  const queryValue = params.get('shiroBgm');
  const queryState = queryValue === '1' || queryValue === '0'
    ? { playing: queryValue === '1', time: Number(params.get('shiroBgmTime')) || 0 }
    : null;
  const savedState = queryState || readStoredState();
  resumePending = Boolean(savedState?.playing);

  const updateCurrentUrlState = (playing) => {
    const current = new URL(window.location.href);
    current.searchParams.set('shiroBgm', playing ? '1' : '0');
    if (playing && Number.isFinite(audio.currentTime)) {
      current.searchParams.set('shiroBgmTime', audio.currentTime.toFixed(2));
    } else {
      current.searchParams.delete('shiroBgmTime');
    }
    window.history.replaceState(null, '', current.href);
  };

  const button = document.createElement('button');
  button.className = 'shiroBgmButton';
  button.type = 'button';
  button.setAttribute('aria-label', 'シロちゃんのテーマソング「齧」を再生');
  button.setAttribute('aria-pressed', 'false');
  button.innerHTML = '<span aria-hidden="true">🧵</span><small>「齧」BGM</small>';
  document.body.append(button);

  const setState = (playing, pending = false) => {
    button.classList.toggle('isPlaying', playing);
    button.classList.toggle('isResumePending', pending);
    button.setAttribute('aria-pressed', String(playing));
    button.setAttribute('aria-label', playing ? 'シロちゃんのテーマソング「齧」を停止' : pending ? 'シロちゃんのテーマソング「齧」を続きから再生' : 'シロちゃんのテーマソング「齧」を再生');
    const label = button.querySelector('small');
    if (label) label.textContent = playing ? 'BGM ON' : pending ? '続きから再生' : '「齧」BGM';
  };

  const seekToSavedTime = () => {
    if (!savedState || !Number.isFinite(savedState.time) || savedState.time <= 0 || !Number.isFinite(audio.duration)) return;
    audio.currentTime = savedState.time % audio.duration;
  };

  const attemptResume = async () => {
    if (!resumePending) return;
    seekToSavedTime();
    try {
      await audio.play();
      resumePending = false;
      setState(true);
      writeStoredState(true);
    } catch (error) {
      setState(false, true);
    }
  };

  if (audio.readyState >= 1) {
    attemptResume();
  } else {
    audio.addEventListener('loadedmetadata', attemptResume, { once: true });
  }

  setState(false, resumePending);

  button.addEventListener('click', async () => {
    if (!audio.paused) {
      audio.pause();
      resumePending = false;
      setState(false);
      writeStoredState(false);
      updateCurrentUrlState(false);
      return;
    }
    try {
      seekToSavedTime();
      await audio.play();
      resumePending = false;
      setState(true);
      writeStoredState(true);
      updateCurrentUrlState(true);
    } catch (error) {
      setState(false, resumePending);
      console.warn('Shiro BGM could not start.', error);
    }
  });

  audio.addEventListener('timeupdate', () => writeStoredState(true));
  audio.addEventListener('pause', () => {
    if (isUnloading) return;
    setState(false);
  });

  document.addEventListener('click', (event) => {
    const anchor = event.target.closest('a[href]');
    if (!anchor) return;

    let destination;
    try {
      destination = new URL(anchor.href, window.location.href);
    } catch (error) {
      return;
    }

    const filename = destination.pathname.split('/').pop() || '';
    if (!filename.startsWith('shiro') || !filename.endsWith('.html')) return;

    const continuing = !audio.paused || resumePending;
    const state = writeStoredState(continuing);
    destination.searchParams.set('shiroBgm', continuing ? '1' : '0');
    if (continuing) destination.searchParams.set('shiroBgmTime', state.time.toFixed(2));
    else destination.searchParams.delete('shiroBgmTime');
    anchor.href = destination.href;
  }, true);

  window.addEventListener('beforeunload', () => {
    isUnloading = true;
    writeStoredState(!audio.paused || resumePending);
  });
})();
