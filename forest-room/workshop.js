const content = window.forestContent;
const panel = document.querySelector('#work-panel');
const record = document.querySelector('#record-audio');
const background = new Audio();
background.preload = 'none';
background.loop = true;
background.volume = 0.25;
const message = document.querySelector('#audio-message');
const sound = document.querySelector('#sound-toggle');
const seek = document.querySelector('#record-progress');
const currentTime = document.querySelector('#record-current');
const durationTime = document.querySelector('#record-duration');
const toggleRecord = document.querySelector('#toggle-record');
let index = -1;
let backgroundWanted = false;
let backgroundRequest = 0;
let recordRequest = 0;
let ambience = null;
let night = false;
window.roomUI = { flat: false, paused: false };

function icon(name) { return `<i data-lucide="${name}" aria-hidden="true"></i>`; }
function refreshIcons() { window.lucide.createIcons(); }
function safeLink(value) {
  if (!value) return null;
  try { const url = new URL(value); return url.protocol === 'https:' ? url.href : null; } catch { return null; }
}
function setLinks() {
  for (const anchor of document.querySelectorAll('[data-link]')) {
    const url = safeLink(content.links[anchor.dataset.link]);
    if (url) { anchor.href = url; anchor.target = '_blank'; anchor.rel = 'noopener noreferrer'; }
    else { anchor.removeAttribute('href'); anchor.setAttribute('aria-disabled', 'true'); anchor.title += '（準備中）'; }
  }
}
document.querySelector('#record-subtitle').textContent = content.recordSubtitle || '世界樹の森';
window.openRoomPanel = () => {
  if (panel.open) return;
  window.roomUI.paused = true;
  panel.showModal();
};
function playSoftActionSound() {
  const Context = window.AudioContext || window.webkitAudioContext;
  if (!Context) return;
  const context = window.roomActionContext ||= new Context();
  const now = context.currentTime;
  const gain = context.createGain();
  const filter = context.createBiquadFilter();
  const oscillator = context.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(440, now);
  oscillator.frequency.exponentialRampToValueAtTime(620, now + .16);
  filter.type = 'lowpass'; filter.frequency.value = 1400;
  gain.gain.setValueAtTime(.0001, now);
  gain.gain.linearRampToValueAtTime(.045, now + .035);
  gain.gain.exponentialRampToValueAtTime(.0001, now + .3);
  oscillator.connect(filter).connect(gain).connect(context.destination);
  context.resume().catch(() => {});
  oscillator.start(now); oscillator.stop(now + .32);
}
window.playRoomActionFeedback = playSoftActionSound;
function openExternalAfterSound(url) {
  let tab = null;
  try { tab = window.open('', '_blank'); if (tab) tab.opener = null; } catch {}
  window.setTimeout(() => {
    if (tab && !tab.closed) tab.location.replace(url);
    else location.assign(url);
  }, 180);
}
window.roomAction = key => {
  playSoftActionSound();
  if (key === 'latte') { window.dispatchEvent(new CustomEvent('roombrew')); return; }
  if (key === 'record') { window.setTimeout(window.openRoomPanel, 90); return; }
  const url = safeLink(content.links[key]);
  if (url) openExternalAfterSound(url);
};
for (const button of document.querySelectorAll('[data-record]')) button.onclick = () => window.roomAction('record');
for (const id of ['close-panel', 'back-room']) document.getElementById(id).onclick = () => panel.close();
panel.addEventListener('close', () => { window.roomUI.paused = false; });
window.showRoomFallback = text => {
  window.roomUI.flat = true;
  document.body.classList.add('flat-mode');
  document.querySelector('#flat').hidden = false;
  document.querySelector('#light-mode').setAttribute('aria-pressed', 'true');
  document.querySelector('#light-mode').textContent = '3Dを再表示';
  document.querySelector('#status').textContent = '';
  if (text) document.querySelector('#flat-note').textContent = text;
};
document.querySelector('#light-mode').onclick = () => window.roomUI.flat ? location.reload() : window.showRoomFallback();
window.addEventListener('error', event => {
  if (!window.roomReady && (event.target?.tagName === 'SCRIPT' || event.error)) window.showRoomFallback('FOREST ROOM');
}, true);
setTimeout(() => { if (!window.roomReady) window.showRoomFallback('FOREST ROOM'); }, 15000);
const discoverHint = document.querySelector('#discover-hint');
try {
  if (sessionStorage.getItem('forest-room-discovery-hint')) discoverHint.remove();
  else window.setTimeout(() => { discoverHint.classList.add('is-hidden'); sessionStorage.setItem('forest-room-discovery-hint', '1'); }, 4800);
} catch { window.setTimeout(() => discoverHint.classList.add('is-hidden'), 4800); }

class ForestAmbience {
  constructor() { this.context = null; this.master = null; this.pad = []; this.timer = 0; }
  async start() {
    if (!this.context) this.build();
    await this.context.resume();
    this.master.gain.cancelScheduledValues(this.context.currentTime);
    this.master.gain.setTargetAtTime(0.085, this.context.currentTime, 1.2);
    this.schedule();
  }
  stop() {
    clearTimeout(this.timer);
    if (this.context) this.master.gain.setTargetAtTime(0, this.context.currentTime, .35);
  }
  build() {
    this.context = new AudioContext();
    this.master = this.context.createGain(); this.master.gain.value = 0;
    const filter = this.context.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 1250;
    this.master.connect(filter).connect(this.context.destination);
    [110, 164.81, 220].forEach((frequency, i) => {
      const oscillator = this.context.createOscillator(), gain = this.context.createGain();
      oscillator.type = i === 1 ? 'triangle' : 'sine'; oscillator.frequency.value = frequency;
      gain.gain.value = [.045, .018, .012][i]; oscillator.connect(gain).connect(this.master); oscillator.start(); this.pad.push(oscillator);
    });
  }
  chirp() {
    if (!this.context || !backgroundWanted || !record.paused) return;
    const now = this.context.currentTime, oscillator = this.context.createOscillator(), gain = this.context.createGain();
    oscillator.type = night ? 'square' : 'sine';
    const start = night ? 3600 + Math.random() * 700 : 1550 + Math.random() * 850;
    oscillator.frequency.setValueAtTime(start, now);
    oscillator.frequency.exponentialRampToValueAtTime(night ? start * .92 : start * 1.65, now + (night ? .055 : .18));
    gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(night ? .013 : .035, now + .012); gain.gain.exponentialRampToValueAtTime(.0001, now + (night ? .09 : .28));
    oscillator.connect(gain).connect(this.master); oscillator.start(now); oscillator.stop(now + .3);
  }
  schedule() {
    clearTimeout(this.timer); if (!backgroundWanted || !record.paused) return;
    this.chirp();
    this.timer = setTimeout(() => this.schedule(), night ? 130 + Math.random() * 650 : 1800 + Math.random() * 4000);
  }
  retheme() { if (backgroundWanted) this.schedule(); }
}
function usesProceduralAmbience() { return content.bgm.mode === 'procedural'; }
function silenceBackground() { backgroundRequest++; background.pause(); ambience?.stop(); }
async function resumeBackground() {
  const request = ++backgroundRequest;
  if (!backgroundWanted || !record.paused) return;
  if (usesProceduralAmbience()) {
    try { ambience ||= new ForestAmbience(); await ambience.start(); }
    catch { if (request === backgroundRequest) { backgroundWanted = false; updateSound(); message.textContent = '環境音を再生できませんでした。'; } }
    return;
  }
  if (!content.bgm.src) return;
  try {
    await background.play();
    if (request !== backgroundRequest && (!backgroundWanted || !record.paused)) background.pause();
  } catch {
    if (request === backgroundRequest) { backgroundWanted = false; updateSound(); message.textContent = 'BGMを再生できませんでした。もう一度お試しください。'; }
  }
}
function updateSound() {
  sound.setAttribute('aria-pressed', String(backgroundWanted));
  sound.setAttribute('aria-label', backgroundWanted ? 'BGMを停止' : 'BGMを再生');
  sound.title = (content.bgm.src || usesProceduralAmbience()) ? sound.getAttribute('aria-label') : 'BGM（選曲中）';
  sound.innerHTML = icon(backgroundWanted ? 'volume-2' : 'volume-x');
  refreshIcons();
}
if (content.bgm.src) background.src = content.bgm.src;
sound.disabled = !content.bgm.src && !usesProceduralAmbience();
sound.onclick = () => { backgroundWanted = !backgroundWanted; updateSound(); backgroundWanted ? resumeBackground() : silenceBackground(); };
function playable() { return content.tracks.map((t, i) => t.src ? i : -1).filter(i => i >= 0); }
function formatTime(value) {
  if (!Number.isFinite(value) || value < 0) return '0:00';
  return `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
}
function updateTimeline() {
  const duration = Number.isFinite(record.duration) ? record.duration : 0;
  seek.max = String(duration || 100);
  seek.value = String(Math.min(record.currentTime || 0, duration || 100));
  seek.disabled = index < 0 || !duration;
  currentTime.textContent = formatTime(record.currentTime);
  durationTime.textContent = formatTime(duration);
}
function updateSelection() {
  document.querySelectorAll('[data-track]').forEach(b => b.setAttribute('aria-current', String(+b.dataset.track === index)));
  document.querySelector('#now-playing').textContent = !playable().length ? (content.recordMessage || '音源を準備中です') : index < 0 ? 'レコードを選ぶ' : content.tracks[index].title;
  for (const id of ['previous-track', 'next-track']) document.getElementById(id).disabled = playable().length < 2;
  document.querySelector('#stop-record').disabled = index < 0;
  toggleRecord.disabled = index < 0;
  const isPlaying = index >= 0 && !record.paused;
  toggleRecord.setAttribute('aria-label', isPlaying ? '一時停止' : '再生');
  toggleRecord.title = toggleRecord.getAttribute('aria-label');
  toggleRecord.innerHTML = icon(isPlaying ? 'pause' : 'play');
  refreshIcons();
  updateTimeline();
}
async function selectTrack(next) {
  const track = content.tracks[next];
  if (!track?.src) return;
  const request = ++recordRequest;
  index = next;
  silenceBackground();
  message.textContent = '';
  record.src = track.src;
  updateSelection();
  try { await record.play(); } catch {
    if (request === recordRequest) { message.textContent = '再生できませんでした。再生ボタンでお試しください。'; resumeBackground(); }
  }
}
function step(direction) {
  const available = playable();
  if (!available.length) return;
  const current = available.indexOf(index);
  selectTrack(available[(current + direction + available.length) % available.length]);
}
const list = document.querySelector('#track-list');
content.tracks.slice(0, 3).forEach((track, i) => {
  const li = document.createElement('li'), button = document.createElement('button');
  button.dataset.track = i;
  button.disabled = !track.src;
  const number = document.createElement('span'); number.className = 'track-number'; number.textContent = String(i + 1).padStart(2, '0');
  const title = document.createElement('span'); title.className = 'track-title'; title.textContent = track.title;
  button.append(number, title); button.insertAdjacentHTML('beforeend', icon('play'));
  button.onclick = () => selectTrack(i); li.append(button); list.append(li);
});
document.querySelector('#previous-track').onclick = () => step(-1);
document.querySelector('#next-track').onclick = () => step(1);
toggleRecord.onclick = () => {
  if (index < 0) { selectTrack(playable()[0]); return; }
  if (record.paused) record.play().catch(() => { message.textContent = '再生できませんでした。'; });
  else record.pause();
};
document.querySelector('#stop-record').onclick = () => { recordRequest++; record.pause(); if (record.readyState) record.currentTime = 0; resumeBackground(); };
seek.addEventListener('input', () => { if (Number.isFinite(record.duration)) record.currentTime = Number(seek.value); });
record.addEventListener('play', () => { silenceBackground(); updateSelection(); });
record.addEventListener('pause', updateSelection);
record.addEventListener('loadedmetadata', updateTimeline);
record.addEventListener('durationchange', updateTimeline);
record.addEventListener('timeupdate', updateTimeline);
record.addEventListener('ended', () => { recordRequest++; updateSelection(); resumeBackground(); });
record.addEventListener('error', () => { message.textContent = '音源を読み込めませんでした。'; resumeBackground(); });
background.addEventListener('error', () => { backgroundWanted = false; updateSound(); message.textContent = 'BGMを読み込めませんでした。'; });
window.addEventListener('roomthemechange', event => { night = event.detail.night; ambience?.retheme(); });
window.addEventListener('pagehide', () => { backgroundWanted = false; silenceBackground(); record.pause(); updateSound(); });
setLinks(); updateSelection(); updateSound();
