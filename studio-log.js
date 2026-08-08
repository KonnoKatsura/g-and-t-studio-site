(() => {
  const statuses = {
    t: [
      ["🟢 T", "オンライン"],
      ["🔥 T", "仕様変更中"],
      ["☕ T", "コーヒー補給中"],
      ["🌙 T", "深夜テンション"],
      ["💡 T", "ひらめき中"],
    ],
    g: [
      ["🟢 G", "設計中"],
      ["☕ G", "コーヒー休憩中"],
      ["📐 G", "半年後を見ています"],
      ["💭 G", "構成会議中"],
      ["😊 G", "8割完成を提案中"],
    ],
    ko: [
      ["🟢 こーちゃん", "実装中..."],
      ["🛠️ こーちゃん", "CSS調整中"],
      ["📏 こーちゃん", "保守性確認中"],
      ["🎧 こーちゃん", "Listening Room点検中"],
      ["⚙️ こーちゃん", "差分チェック中"],
    ],
    andrew: [
      ["🟢 Andrew", "調査待機中"],
      ["🔎 Andrew", "参考資料探し中"],
      ["📚 Andrew", "調査結果あります"],
      ["😪 Andrew", "昼寝中"],
      ["☕ Andrew", "コーヒー休憩中"],
    ],
    claude: [
      ["🟢 くーちゃん", "物語考察中"],
      ["🧘 くーちゃん", "深掘り中"],
      ["📖 くーちゃん", "文章推敲中"],
      ["🌙 くーちゃん", "余韻を見ています"],
      ["☕ くーちゃん", "静かに休憩中"],
    ],
    p: [
      ["🟢 P", "資料検索中"],
      ["🔍 P", "出典確認中"],
      ["📚 P", "情報整理中"],
      ["🧭 P", "調査ルート確認中"],
      ["☕ P", "司書席で休憩中"],
    ],
  };

  const pick = (items) => items[Math.floor(Math.random() * items.length)];
  let audioContext;

  const getAudioContext = () => {
    if (!window.AudioContext && !window.webkitAudioContext) {
      return null;
    }

    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    return audioContext;
  };

  const playTone = (frequency, startTime, duration, type = "sine", volume = 0.04) => {
    const context = getAudioContext();
    if (!context) {
      return;
    }

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.02);
  };

  const playCapsuleSound = (kind) => {
    const context = getAudioContext();
    if (!context) {
      return;
    }

    const now = context.currentTime;
    if (kind === "select") {
      playTone(880, now, 0.055, "triangle", 0.045);
      playTone(1320, now + 0.055, 0.06, "triangle", 0.032);
      return;
    }

    if (kind === "brew") {
      [196, 233, 174, 220, 185, 247].forEach((frequency, index) => {
        playTone(frequency, now + index * 0.075, 0.09, index % 2 ? "sawtooth" : "triangle", 0.035);
      });
      return;
    }

    if (kind === "done") {
      playTone(660, now, 0.08, "sine", 0.05);
      playTone(990, now + 0.08, 0.1, "sine", 0.044);
      playTone(1320, now + 0.18, 0.14, "triangle", 0.035);
    }
  };

  const playElevatorSound = (kind) => {
    const context = getAudioContext();
    if (!context) return;
    const now = context.currentTime;

    if (kind === "human") {
      [784, 988, 880, 1175, 1047].forEach((frequency, index) => {
        playTone(frequency, now + index * 0.105, 0.13, index % 2 ? "sine" : "triangle", 0.04);
      });
      return;
    }

    const noiseLength = Math.floor(context.sampleRate * 0.68);
    const buffer = context.createBuffer(1, noiseLength, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < noiseLength; index += 1) {
      const decay = 1 - index / noiseLength;
      data[index] = (Math.random() * 2 - 1) * decay * (index % 110 < 16 ? 0.8 : 0.18);
    }
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer;
    filter.type = "bandpass";
    filter.frequency.value = 720;
    filter.Q.value = 0.72;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.085, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.68);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    source.start(now);
    playTone(118, now, 0.52, "sawtooth", 0.025);
    playTone(176, now + 0.48, 0.16, "triangle", 0.035);
  };

  const floorLabels = {
    "1F": "1F 公開フロア",
    "2F": "2F 開発室",
    B1: "B1 試作室",
    TREE: "世界樹の森",
    CANOPY: "樹冠の灯",
    BOOK: "世界樹の書架",
  };

  const arrivalNode = document.querySelector("[data-floor-arrival]");

  const updateFloorArrival = (floor) => {
    if (!arrivalNode || !floor) return;
    const label = floorLabels[floor] || `${floor} フロア`;
    arrivalNode.textContent = `${label}へ到着しました。`;
    arrivalNode.classList.remove("is-arrived");
    void arrivalNode.offsetWidth;
    arrivalNode.classList.add("is-arrived");
  };

  const openStudioWorkMapFloor = (floor) => {
    const rooms = [...document.querySelectorAll("[data-work-floor]")];
    if (!floor || rooms.length === 0) return;

    const workTab = document.querySelector("[data-studio-tab='work']");
    if (workTab) workTab.click();
    updateFloorArrival(floor);

    rooms.forEach((room) => {
      room.classList.toggle("is-floor-highlight", room.dataset.workFloor === floor);
    });

    const firstRoom = rooms.find((room) => room.dataset.workFloor === floor);
    if (firstRoom) {
      window.setTimeout(() => {
        firstRoom.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 80);
    }
  };

  document.querySelectorAll("[data-floor-nav]").forEach((button) => {
    button.addEventListener("click", () => {
      playCapsuleSound("select");
      openStudioWorkMapFloor(button.dataset.floorNav);
    });
  });

  document.querySelector("[data-return-elevator]")?.addEventListener("click", () => {
    playCapsuleSound("select");
    arrivalNode?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (arrivalNode) {
      arrivalNode.textContent = "2F 受付エレベーターホールへ戻りました。";
      arrivalNode.classList.remove("is-arrived");
      void arrivalNode.offsetWidth;
      arrivalNode.classList.add("is-arrived");
    }
  });

  document.querySelectorAll("[data-elevator]").forEach((elevator) => {
    const callButton = elevator.querySelector("[data-elevator-call]");
    const statusNode = elevator.querySelector("[data-elevator-status]");
    const floorNode = elevator.querySelector("[data-elevator-floor]");
    const kind = elevator.dataset.elevator;
    const targetFloor = elevator.dataset.elevatorFloorTarget;
    if (!callButton || !statusNode || !floorNode) return;

    callButton.addEventListener("click", () => {
      if (elevator.classList.contains("is-running")) return;
      elevator.classList.remove("is-arrived");
      elevator.classList.add("is-running");
      callButton.disabled = true;
      statusNode.textContent = "MOVING";
      floorNode.textContent = kind === "human" ? "↘" : "✦";

      if (kind === "forest") playElevatorSound("forest");

      window.setTimeout(() => {
        floorNode.textContent = kind === "human" ? "1" : "🌳";
        statusNode.textContent = "ARRIVED";
        elevator.classList.remove("is-running");
        elevator.classList.add("is-arrived");
        callButton.disabled = false;
        playElevatorSound(kind === "human" ? "human" : "forest");
        openStudioWorkMapFloor(targetFloor);
      }, kind === "human" ? 1450 : 1900);
    });
  });

  document.querySelectorAll("[data-studio-member]").forEach((card) => {
    const member = card.dataset.studioMember;
    const status = statuses[member];

    if (!status) {
      return;
    }

    const [name, text] = pick(status);
    const nameNode = card.querySelector("[data-studio-name]");
    const statusNode = card.querySelector("[data-studio-status]");

    if (nameNode) {
      nameNode.textContent = name;
    }

    if (statusNode) {
      statusNode.textContent = text;
    }
  });

  const drinks = [
    { name: "アイスコーヒー", description: "ホワイトボード前の定番メニュー。" },
    { name: "ホットコーヒー", description: "設計会議が少し落ち着く香り。" },
    { name: "G&Tブレンド", description: "物語と実装を半分ずつ混ぜた一杯。" },
    { name: "開発室ブレンド", description: "今日の作業にちょうどいい濃さ。" },
    { name: "デバッグブレンド💻", description: "原因を探す時だけ妙に頼もしい。" },
    { name: "リファクタリングラテ☕", description: "飲むと少しだけ構造を整えたくなります。" },
    { name: "エスプレッソ（締切前）", description: "短時間で目が覚める危険な小杯。" },
    { name: "カフェラテ", description: "会議が長引いても角が立ちにくい味。" },
    { name: "カフェモカ", description: "迷走中でも甘さで戻ってこられる。" },
    { name: "カフェオレ", description: "雑談と実装のあいだに置きたい一杯。" },
    { name: "ハンドドリップ", description: "ゆっくり考えたい日のために。" },
    { name: "8割完成ブレンド", description: "飲みすぎると「今日はここまで」が言えるようになります。" },
    { name: "仕様変更ブレンド", description: "飲むたびにアイデアが増えます。副作用あり。" },
    { name: "迷走モカ", description: "「これや！」と思った5分後に全部変えたくなります。" },
    { name: "CSSラテ", description: "見た目だけ急に美しくなります。" },
    { name: "Reactロースト", description: "コンポーネント化したくなる香り。" },
    { name: "Three.jsスペシャル", description: "飲むと何でも3Dにしたくなります。" },
    { name: "AI会議ブレンド", description: "話がまとまりません（笑）" },
    { name: "はちみつ緑茶🍯", description: "T専用。開発室で一番人気。" },
    { name: "光のかけら入りハニージンジャーアイスティー", description: "世界樹の森のミントを添えて。爽快感と甘さの絶妙な夏ブレンド。", start: 10, end: 19 },
    { name: "森のミントソーダ", description: "暑い日の仕様変更を少しだけ涼しくする泡。", start: 11, end: 20 },
    { name: "モーニングロースト🌅", description: "朝の作業開始にだけよく似合う香り。", start: 5, end: 10 },
    { name: "深夜ブレンド🌙", description: "日付をまたぐ作業に出てくる一杯。", start: 22, end: 5 },
    { name: "深夜テンション焙煎", description: "AM2:30以降限定。仕様が増えます。", start: 2.5, end: 5 },
  ];

  const snacks = [
    { name: "アップルパイセット", description: "コーヒーのお供。", start: 13, end: 18 },
    { name: "マルゲリータ補給セット", description: "会議が長引いた時限定。", start: 19, end: 24 },
    { name: "星露のレモンゼリー", description: "WTFCの涼しげな新作。ひと口だけ森の夜風がします。", start: 10, end: 19 },
    { name: "光粒のパンナコッタ", description: "ぷるっと揺れる、開発室の夏おやつ。", start: 12, end: 21 },
    { name: "深夜のチョコひとかけ", description: "深夜テンションの副作用を少しやわらげます。", start: 0, end: 4 },
    { name: "朝の小さなスコーン", description: "モーニングローストと一緒に出てきます。", start: 5, end: 10 },
  ];

  const memberPicks = {
    t: { label: "T：はちみつ緑茶🍯", description: "創作中の甘やかし枠。やさしいけど、アイデアが増えます。" },
    g: { label: "G：G&Tブレンド", description: "世界観と設計を半分ずつ。8割完成の香り。" },
    ko: { label: "こーちゃん：ブラック（無糖）", description: "差分チェック中に飲んでそうなやつ。" },
    andrew: { label: "Andrew：カフェラテ", description: "調査資料を読みながら飲める、やわらかめの一杯。" },
    claude: { label: "くーちゃん：ハンドドリップ", description: "余韻と行間をゆっくり見る日の一杯。" },
    p: { label: "P：リサーチロースト", description: "最新情報と出典確認に向いた、目が覚める香り。" },
  };

  const hour = new Date().getHours() + new Date().getMinutes() / 60;
  const isAvailable = ({ start, end }) => {
    if (start === undefined || end === undefined) {
      return true;
    }

    if (start > end) {
      return hour >= start || hour < end;
    }

    return hour >= start && hour < end;
  };

  const availableDrinks = drinks.filter(isAvailable);
  const drink = pick(availableDrinks.length ? availableDrinks : drinks);
  const drinkNode = document.querySelector("[data-cafe-drink]");
  const descriptionNode = document.querySelector("[data-cafe-description]");

  if (drinkNode) {
    drinkNode.textContent = drink.name;
  }

  if (descriptionNode) {
    descriptionNode.textContent = drink.description;
  }

  const pickNode = document.querySelector("[data-cafe-member-pick]");
  const pickDescriptionNode = document.querySelector("[data-cafe-member-description]");
  const setMemberPick = (member) => {
    const pickItem = memberPicks[member] || memberPicks.ko;
    if (pickNode) {
      pickNode.textContent = pickItem.label;
    }
    if (pickDescriptionNode) {
      pickDescriptionNode.textContent = pickItem.description;
    }
  };

  const initialCafeMember = pick(Object.keys(memberPicks));
  setMemberPick(initialCafeMember);

  document.querySelectorAll("[data-cafe-member]").forEach((button) => {
    button.addEventListener("click", () => {
      setMemberPick(button.dataset.cafeMember);
      document.querySelectorAll("[data-cafe-member]").forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });
      playCapsuleSound("select");
    });
  });

  document.querySelectorAll("[data-cafe-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.cafeTab;
      document.querySelectorAll("[data-cafe-tab]").forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
      });
      document.querySelectorAll("[data-cafe-panel]").forEach((panel) => {
        const active = panel.dataset.cafePanel === target;
        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
      });
      playCapsuleSound("select");
    });
  });

  const activeMemberButton = document.querySelector(`[data-cafe-member='${initialCafeMember}']`);
  if (activeMemberButton) {
    activeMemberButton.classList.add("is-active");
  }

  const snack = pick(snacks.filter(isAvailable));
  const snackCard = document.querySelector("[data-cafe-snack]");

  if (snack && snackCard) {
    snackCard.querySelector("[data-cafe-snack-name]").textContent = snack.name;
    snackCard.querySelector("[data-cafe-snack-description]").textContent = snack.description;
  }

  const officeDeskMessages = {
    t: ["T / Creative Desk", "世界観・映像・音楽・企画を接続中。机の端には新しいハッ！メモ。"],
    g: ["G / Planning Desk", "コンセプトと文章を整理中。8割完成の札が置いてあります。"],
    ko: ["こーちゃん / Build Desk", "差分確認と実装中。ブラックコーヒーは無糖です。"],
    andrew: ["Andrew / Research Desk", "参考資料と新しい技術を調査中。タブはたくさん開いています。"],
    claude: ["くーちゃん / Review Desk", "世界観と文章の余韻を静かにレビュー中。"],
    p: ["P / Library Desk", "情報・出典・未処理棚を検索中。虫眼鏡は備品です。"],
  };

  const officeStatus = document.querySelector("[data-office-status]");
  document.querySelectorAll("[data-office-desk]").forEach((button) => {
    button.addEventListener("click", () => {
      const message = officeDeskMessages[button.dataset.officeDesk];
      if (!message || !officeStatus) return;
      officeStatus.innerHTML = `<strong>${message[0]}</strong><span>${message[1]}</span>`;
      document.querySelectorAll("[data-office-desk]").forEach((desk) => {
        desk.classList.toggle("is-active", desk === button);
      });
      playCapsuleSound("select");
    });
  });

  const backRoomPlaceholder = document.querySelector("[data-local-backroom]");
  const localBackRoomAllowed = window.location.protocol === "file:" || ["localhost", "127.0.0.1"].includes(window.location.hostname);
  if (backRoomPlaceholder && localBackRoomAllowed) {
    const backRoomLink = document.createElement("a");
    [...backRoomPlaceholder.attributes].forEach((attribute) => {
      if (!["aria-disabled", "data-local-backroom", "data-local-href"].includes(attribute.name)) {
        backRoomLink.setAttribute(attribute.name, attribute.value);
      }
    });
    backRoomLink.href = backRoomPlaceholder.dataset.localHref;
    backRoomLink.innerHTML = backRoomPlaceholder.innerHTML;
    backRoomLink.dataset.localBackroom = "enabled";
    backRoomPlaceholder.replaceWith(backRoomLink);
  }

  const studioPlans = {
    14: [
      ["statusDone", "👩 T", "WTFC Storyと素材整理"],
      ["statusDone", "🤖 G", "Image Review整理"],
      ["statusWorking", "💻 こーちゃん", "Deploy予定と導線確認"],
      ["statusHold", "🧠 Andrew", "Prompt研究"],
      ["statusDone", "🧘 くーちゃん", "世界観レビュー"],
      ["statusWorking", "🔍 P", "情報収集"],
    ],
    15: [
      ["statusDone", "👩 T", "空からお便り投函"],
      ["statusWorking", "💻 こーちゃん", "投函口とPath Tree整備"],
      ["statusHold", "🤖 G", "管理メニュー構想"],
      ["statusWorking", "🍰 おやつ会議", "アップルパイ候補"],
    ],
    16: [
      ["statusWorking", "👩 T", "今日の備忘録へガンガン投函"],
      ["statusWorking", "💻 こーちゃん", "G&T Studio Board共有アプリ化"],
      ["statusHold", "🤖 G", "カプセルマシン構想"],
      ["statusDeploy", "🌳 WTFC", "プレオープン準備"],
      ["statusWorking", "☕ 開発室", "カプセル抽出テスト"],
    ],
    17: [
      ["statusWorking", "👩 T", "シロちゃん素材とSuno整理メモを確認"],
      ["statusWorking", "💻 こーちゃん", "開発室の扉・更新表・テーマ色を整備"],
      ["statusHold", "🤖 G", "次の世界観会議を準備"],
      ["statusWorking", "🎵 Suno", "資産検索と取込フローを棚卸し"],
    ],
    22: [
      ["statusWorking", "👩 T", "G&Tのうた制作と開発室スケジュール相談"],
      ["statusWorking", "💻 こーちゃん", "社歌Now PlayingとTeam Calendar更新"],
      ["statusWorking", "🤖 G", "朝礼と運用方針を相談中"],
      ["statusWorking", "🧰 Material Library", "B1素材見本室をショールーム化"],
      ["statusHold", "📅 Schedule", "朝礼テンプレート確定待ち"],
    ],
  };

  const detail = document.querySelector("[data-studio-detail]");
  const calendarButtons = document.querySelectorAll("[data-studio-day]");
  const getMemberIcon = (member) => String(member || "").trim().split(/\s+/)[0] || "•";
  const renderMemberDetail = (plans, index = 0) => {
    if (!detail) {
      return;
    }

    const memberDetail = detail.querySelector("[data-studio-member-detail]");
    const selected = plans[index] || plans[0];
    if (!memberDetail || !selected) {
      return;
    }

    const [statusClass, member, text] = selected;
    memberDetail.innerHTML = `<i class="${statusClass}"></i><strong>${member}</strong><span>${text}</span>`;
    detail.querySelectorAll("[data-plan-index]").forEach((button) => {
      button.classList.toggle("is-active", Number(button.dataset.planIndex) === index);
    });
  };
  const renderPlan = (day) => {
    if (!detail) {
      return;
    }

    const plans = studioPlans[day] || [["statusHold", "📌 G&T", "この日はまだ余白。あとから予定を貼れます。"]];
    detail.innerHTML = [
      `<span>7月${day}日</span>`,
      `<div class="studioDayMembers" data-studio-day-members>${plans.map(([statusClass, member], index) => `<button type="button" ${index === 0 ? 'class="is-active"' : ""} data-plan-index="${index}"><i class="${statusClass}"></i><span>${getMemberIcon(member)}</span></button>`).join("")}</div>`,
      '<p class="studioCalendarMemberDetail" data-studio-member-detail></p>',
    ].join("");

    detail.querySelectorAll("[data-plan-index]").forEach((button) => {
      button.addEventListener("click", () => renderMemberDetail(plans, Number(button.dataset.planIndex)));
    });
    renderMemberDetail(plans, 0);
  };

  calendarButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const day = button.dataset.studioDay;
      if (!day) {
        return;
      }

      calendarButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      renderPlan(day);
    });
  });

  document.querySelectorAll("[data-studio-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.studioTab;
      document.querySelectorAll("[data-studio-tab]").forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
      });
      document.querySelectorAll("[data-studio-panel]").forEach((panel) => {
        const active = panel.dataset.studioPanel === target;
        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
      });
    });
  });

  const calendarSlot = document.querySelector("[data-studio-calendar-slot]");
  const calendarBoard = document.querySelector("#team-calendar");
  if (calendarSlot && calendarBoard) calendarSlot.append(calendarBoard);

  const loungeSources = {
    cafe: document.querySelector("#studio-cafe-counter"),
    team: document.querySelector(".studioTeamSection"),
    chat: document.querySelector("#studio-team-chat"),
  };
  const createLoungePreview = (source) => {
    const preview = source.cloneNode(true);
    preview.removeAttribute("id");
    preview.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
    preview.querySelectorAll("audio, form").forEach((node) => node.remove());
    preview.querySelectorAll("[data-team-card], [data-team-profile], [data-cafe-tab], [data-cafe-panel], [data-cafe-member], [data-capsule-brew], [data-capsule-select]").forEach((node) => {
      [...node.attributes].forEach((attribute) => {
        if (attribute.name.startsWith("data-")) node.removeAttribute(attribute.name);
      });
    });
    return preview;
  };
  Object.entries(loungeSources).forEach(([name, source]) => {
    const slot = document.querySelector(`[data-studio-lounge-slot='${name}']`);
    if (!slot || !source) return;
    slot.append(name === "chat" ? source : createLoungePreview(source));
  });

  document.querySelectorAll("[data-studio-lounge-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.studioLoungeTab;
      document.querySelectorAll("[data-studio-lounge-tab]").forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
      });
      document.querySelectorAll("[data-studio-lounge-panel]").forEach((panel) => {
        const active = panel.dataset.studioLoungePanel === target;
        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
      });
      playCapsuleSound("select");
    });
  });

  document.querySelectorAll("[data-studio-ops-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.studioOpsTab;
      document.querySelectorAll("[data-studio-ops-tab]").forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
      });
      document.querySelectorAll("[data-studio-ops-panel]").forEach((panel) => {
        const active = panel.dataset.studioOpsPanel === target;
        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
      });
    });
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href^='#']");
    if (!link) return;
    if (link.getAttribute("href") === "#team-calendar") {
      document.querySelector("[data-studio-ops-tab='schedule']")?.click();
    }
    if (link.getAttribute("href") === "#studio-team-chat") {
      document.querySelector("[data-studio-lounge-tab='chat']")?.click();
    }
    if (link.getAttribute("href") === "#studio-cafe-counter") {
      document.querySelector("[data-studio-lounge-tab='cafe']")?.click();
    }
  });

  const visitorNameInput = document.querySelector("[data-visitor-name-input]");
  const visitorGuideSelect = document.querySelector("[data-visitor-guide-select]");
  const visitorName = document.querySelector("[data-visitor-name]");
  const visitorGuide = document.querySelector("[data-visitor-guide]");
  const studioChatName = document.querySelector("[data-studio-chat-name]");
  const guideLabels = {
    shiro: "🦊 Shiro",
    glimmerpou: "🌳 glimmerpou",
  };
  const updateVisitorPass = () => {
    if (visitorName && visitorNameInput) {
      visitorName.textContent = visitorNameInput.value.trim() || "Guest";
    }
    if (studioChatName && visitorNameInput) {
      studioChatName.textContent = visitorNameInput.value.trim() || "Guest";
    }

    if (visitorGuide && visitorGuideSelect) {
      visitorGuide.textContent = guideLabels[visitorGuideSelect.value] || "🦊 Shiro";
    }
  };

  visitorNameInput?.addEventListener("input", updateVisitorPass);
  visitorGuideSelect?.addEventListener("change", updateVisitorPass);
  updateVisitorPass();

  const ideaInput = document.querySelector("[data-idea-capture-input]");
  const ideaStatus = document.querySelector("[data-idea-capture-status]");
  const ideaDestination = document.querySelector("[data-idea-destination]");
  const ideaWorkPanel = document.querySelector("[data-idea-work]");
  const ideaDisplayPanel = document.querySelector("[data-idea-display]");
  const ideaStorageKey = "gtStudioIdeaCapture";
  const setIdeaStatus = (message) => {
    if (ideaStatus) {
      ideaStatus.textContent = message;
    }
  };
  const buildIdeaText = () => {
    const now = new Date();
    const visitor = visitorNameInput?.value.trim() || "T";
    const body = ideaInput?.value.trim() || "";
    return [
      "# G&T 開発室 ハッ！メモ",
      "",
      `created_at: ${now.toLocaleString("ja-JP")}`,
      `from: ${visitor}`,
      `destination: ${ideaDestination?.value || "idea-parking/raw"}`,
      "",
      body,
      "",
      "memo: 開発室のハッ専用ボタンから保存。",
    ].join("\n");
  };
  const ideaFilename = () => {
    const now = new Date();
    const stamp = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
      "-",
      String(now.getHours()).padStart(2, "0"),
      String(now.getMinutes()).padStart(2, "0"),
    ].join("");
    return `gt-studio-idea-${stamp}.txt`;
  };

  document.querySelectorAll("[data-idea-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      const isWork = button.dataset.ideaMode === "work";
      document.querySelectorAll("[data-idea-mode]").forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
      });
      if (ideaWorkPanel) {
        ideaWorkPanel.hidden = !isWork;
      }
      if (ideaDisplayPanel) {
        ideaDisplayPanel.hidden = isWork;
      }
      setIdeaStatus(isWork ? "A面：作業用です。コピーして投函口へ渡せます。" : "B面：公開時の展示イメージです。入力欄は見せない運用にできます。");
      playCapsuleSound("select");
    });
  });

  if (ideaInput) {
    try {
      ideaInput.value = window.localStorage.getItem(ideaStorageKey) || "";
    } catch (error) {
      setIdeaStatus("ローカル保存は使えない環境です。コピーかtxt保存を使ってください。");
    }

    ideaInput.addEventListener("input", () => {
      try {
        window.localStorage.setItem(ideaStorageKey, ideaInput.value);
        setIdeaStatus(ideaInput.value.trim() ? "一時保存しました。あとでコピーまたはtxt保存できます。" : "待機中。思いついたらここへ。");
      } catch (error) {
        setIdeaStatus("一時保存できませんでした。コピーかtxt保存を使ってください。");
      }
    });
  }

  document.querySelector("[data-idea-copy]")?.addEventListener("click", async () => {
    if (!ideaInput?.value.trim()) {
      setIdeaStatus("まだメモが空です。");
      return;
    }

    try {
      await navigator.clipboard.writeText(buildIdeaText());
      setIdeaStatus("コピーしました。🚘️か空の投函口へ貼れます。");
      playCapsuleSound("select");
    } catch (error) {
      setIdeaStatus("コピーできませんでした。本文を選択して手動コピーしてください。");
    }
  });

  document.querySelector("[data-idea-download]")?.addEventListener("click", async () => {
    if (!ideaInput?.value.trim()) {
      setIdeaStatus("まだメモが空です。");
      return;
    }

    try {
      const filename = ideaFilename();
      const destination = ideaDestination?.value || "idea-parking/raw";
      await navigator.clipboard.writeText(buildIdeaText());
      setIdeaStatus(`保存名 ${filename} 用の本文をコピーしました。保存先メモ：${destination}`);
      playCapsuleSound("done");
    } catch (error) {
      setIdeaStatus("コピーできませんでした。本文を選択して手動コピーしてください。");
    }
  });

  document.querySelector("[data-idea-clear]")?.addEventListener("click", () => {
    if (!ideaInput) {
      return;
    }

    ideaInput.value = "";
    try {
      window.localStorage.removeItem(ideaStorageKey);
    } catch (error) {
      // Nothing to do; clearing the visible textarea is enough.
    }
    setIdeaStatus("空にしました。次のハッ！待ちです。");
    playCapsuleSound("select");
  });

  const teamProfile = document.querySelector("[data-team-profile]");
  const teamInfo = {
    t: {
      label: "👩 T",
      name: "T",
      role: "Creative Director",
      roleJa: "創作統括",
      profile: "世界観、キャラクター、音楽、映像、企画をつなぐ人。",
      talk: "こんにちは、{visitor}さん。代表っぽいTですw G&Tへようこそ。Shiroちゃんが案内するので、ゆっくりしていってくださいね。",
    },
    g: {
      label: "🤖 G",
      name: "G（ChatGPT）",
      role: "Creative Partner",
      roleJa: "共同設計",
      profile: "世界観設計、ストーリー整理、note編集会議、プロジェクト設計、仕様整理。",
      talk: "{visitor}さん、まず8割完成でいきましょう。話が増えても、順番に並べれば大丈夫です☕",
    },
    ko: {
      label: "💻 こーちゃん",
      name: "こーちゃん（Codex）",
      role: "Lead Engineer",
      roleJa: "実装担当",
      profile: "Web制作、HTML/CSS、Git、リファクタリング、ファイル整理、自動化。",
      talk: "{visitor}さん、実装と整理は任せて。迷子になりそうな素材には、棚とラベルを作ります。",
    },
    andrew: {
      label: "🧠 Andrew",
      name: "アンドリューくん（Gemini）",
      role: "Research & Visual Design",
      roleJa: "調査・ビジュアル設計",
      profile: "リサーチ、プロンプト、画像、アイデア展開。",
      talk: "{visitor}さん、調査資料あります。必要なら参考事例をすぐ出せます。",
    },
    claude: {
      label: "🧘 くーちゃん",
      name: "くーちゃん（Claude）",
      role: "Story Consultant",
      roleJa: "物語相談役",
      profile: "世界観考察、心理描写、文章推敲、深掘り。",
      talk: "{visitor}さん、森は急がなくて大丈夫。物語は余白から育ちます。",
    },
    p: {
      label: "🔍 P",
      name: "P（Perplexity）",
      role: "Research Librarian",
      roleJa: "調査司書",
      profile: "最新情報、情報収集、出典確認、リサーチ。",
      talk: "{visitor}さん、最新情報と出典確認の棚はここです。調べ物はいつでもどうぞ。",
    },
  };
  const playTeamSound = (member) => {
    const context = getAudioContext();
    if (!context) {
      return;
    }

    const now = context.currentTime;
    const patterns = {
      t: [[740, "triangle"], [980, "sine"], [1240, "triangle"]],
      g: [[520, "sine"], [660, "sine"], [880, "triangle"]],
      ko: [[420, "square"], [840, "square"], [1260, "triangle"]],
      andrew: [[760, "triangle"], [1140, "triangle"]],
      claude: [[523, "sine"], [659, "sine"], [784, "triangle"]],
      p: [[880, "square"], [1320, "triangle"]],
    };
    (patterns[member] || patterns.g).forEach(([frequency, type], index) => {
      const volume = member === "claude" ? 0.052 : 0.038;
      playTone(frequency, now + index * 0.07, 0.09, type, volume);
    });
  };
  const openTeamTalk = (member, showTalk = false) => {
    const line = teamInfo[member];
    if (!line || !teamProfile) {
      return;
    }

    const visitor = visitorNameInput?.value.trim() || "Guest";
    teamProfile.innerHTML = [
      `<span>${line.label}</span>`,
      `<h3>${line.name}</h3>`,
      `<strong>${line.role}</strong>`,
      `<small>${line.roleJa}</small>`,
      `<p>${line.profile}</p>`,
      '<div class="studioTeamActions"><a href="#team-calendar">予定を見る</a><a href="#studio-team-chat">チャットを見る</a><button type="button" data-team-speak>話しかける</button></div>',
      showTalk ? `<article class="studioTeamTalk is-inline"><span>${line.label}</span><p>${line.talk.replaceAll("{visitor}", visitor)}</p></article>` : "",
    ].join("");
    teamProfile.querySelector("[data-team-speak]")?.addEventListener("click", () => openTeamTalk(member, true));
    document.querySelectorAll("[data-team-card]").forEach((card) => {
      card.classList.toggle("is-speaking", card.dataset.teamMember === member);
    });
    playTeamSound(member);
  };

  document.querySelectorAll("[data-team-card]").forEach((card) => {
    card.addEventListener("click", () => openTeamTalk(card.dataset.teamMember));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openTeamTalk(card.dataset.teamMember);
      }
    });
  });

  const companySong = document.querySelector("[data-company-song]");
  const companySongButton = document.querySelector("[data-company-song-toggle]");
  const companySongAudio = document.querySelector("[data-company-song-audio]");
  const teamSection = document.querySelector(".studioTeamSection");
  let companySongFallbackTimer;

  const playCompanySongDemo = () => {
    const context = getAudioContext();
    if (!context) return;
    const now = context.currentTime;
    const melody = [392, 494, 587, 494, 440, 523, 659, 784];
    melody.forEach((frequency, index) => {
      playTone(frequency, now + index * 0.105, 0.12, index % 2 ? "triangle" : "sine", 0.038);
    });
    playTone(196, now, 0.9, "sine", 0.015);
  };

  const stopCompanySongMotion = () => {
    companySong?.classList.remove("is-playing");
    teamSection?.classList.remove("is-company-song");
  };

  const stopCompanySong = () => {
    window.clearTimeout(companySongFallbackTimer);
    if (companySongAudio && !companySongAudio.paused) {
      companySongAudio.pause();
      companySongAudio.currentTime = 0;
    }
    stopCompanySongMotion();
  };

  const triggerCompanySong = () => {
    if (radioExerciseAudio && !radioExerciseAudio.paused) {
      radioExerciseAudio.pause();
      radioExerciseAudio.currentTime = 0;
    }
    window.clearTimeout(companySongFallbackTimer);
    companySong?.classList.remove("is-playing");
    teamSection?.classList.remove("is-company-song");
    companySong?.getBoundingClientRect();
    companySong?.classList.add("is-playing");
    teamSection?.classList.add("is-company-song");

    if (companySongAudio?.getAttribute("src")) {
      companySongAudio.currentTime = 0;
      companySongAudio.play().catch(() => {
        playCompanySongDemo();
        companySongFallbackTimer = window.setTimeout(stopCompanySongMotion, 3200);
      });
      return;
    }
    playCompanySongDemo();
    companySongFallbackTimer = window.setTimeout(stopCompanySongMotion, 3200);
  };

  companySongButton?.addEventListener("click", triggerCompanySong);
  companySongAudio?.addEventListener("ended", stopCompanySongMotion);
  companySongAudio?.addEventListener("pause", () => {
    if (companySongAudio.ended) return;
    stopCompanySongMotion();
  });

  const morningBriefing = document.querySelector(".morningBriefing");
  const radioExerciseButton = document.querySelector("[data-radio-exercise-toggle]");
  const radioExerciseAudio = document.querySelector("[data-radio-exercise-audio]");
  let radioExerciseTimer;
  let radioExerciseRunning = false;
  const stopRadioExercise = () => {
    window.clearTimeout(radioExerciseTimer);
    radioExerciseRunning = false;
    if (radioExerciseButton) {
      radioExerciseButton.disabled = false;
      radioExerciseButton.textContent = "ラジオ体操";
    }
    morningBriefing?.classList.remove("is-protocol", "is-exercising", "is-zawa");
  };

  radioExerciseButton?.addEventListener("click", () => {
    if (radioExerciseRunning) return;
    stopCompanySong();
    radioExerciseRunning = true;
    radioExerciseButton.disabled = true;
    radioExerciseButton.textContent = "Morning Protocol";
    morningBriefing?.getBoundingClientRect();
    morningBriefing?.classList.add("is-protocol");
    morningBriefing?.classList.add("is-exercising");
    radioExerciseTimer = window.setTimeout(() => {
      morningBriefing?.classList.remove("is-exercising");
      morningBriefing?.classList.add("is-zawa");
    }, 2200);

    if (radioExerciseAudio?.getAttribute("src")) {
      radioExerciseAudio.currentTime = 0;
      radioExerciseAudio.play().catch(() => playCapsuleSound("done"));
      return;
    }
    playCapsuleSound("done");
    window.setTimeout(stopRadioExercise, 6500);
  });
  radioExerciseAudio?.addEventListener("ended", stopRadioExercise);
  radioExerciseAudio?.addEventListener("pause", () => {
    if (radioExerciseAudio.ended) return;
    stopRadioExercise();
  });

  const chatLog = document.querySelector("[data-studio-chat-log]");
  const chatForm = document.querySelector("[data-studio-chat-form]");
  const chatInput = document.querySelector("[data-studio-chat-input]");
  const chatReplies = [
    ["🤖 G", "ようこそ。まずは8割完成の精神で、気になる扉からどうぞ☕"],
    ["💻 こーちゃん", "見学ポイントはTeam Calendar、Shiro's Atelier、WTFCです。迷ったら未処理タスクを見れば大丈夫。"],
    ["🧠 Andrew", "資料室はいつでも開いています。気になる言葉があれば、あとで調べます📚"],
    ["🧘 くーちゃん", "開発室は急がなくていい場所です。余白も制作の一部です。"],
    ["🔍 P", "最新情報や出典確認が必要な時は、調査司書席へどうぞ🔎"],
    ["👩 T", "G&Tへようこそ。Shiroちゃんに噛まれないよう、店長さんも近くにいますw"],
  ];
  const appendChatMessage = (speaker, message, mine = false) => {
    if (!chatLog) {
      return;
    }

    const item = document.createElement("article");
    item.className = mine ? "is-visitor" : "";
    const name = document.createElement("span");
    const text = document.createElement("p");
    name.textContent = speaker;
    text.textContent = message;
    item.append(name, text);
    chatLog.append(item);
    chatLog.scrollTop = chatLog.scrollHeight;
  };
  chatForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = chatInput?.value.trim();
    if (!text) {
      return;
    }

    const visitor = visitorNameInput?.value.trim() || "Guest";
    appendChatMessage(visitor, text, true);
    chatInput.value = "";
    playCapsuleSound("select");

    const start = Math.floor(Math.random() * chatReplies.length);
    const replies = [chatReplies[start], chatReplies[(start + 2) % chatReplies.length], chatReplies[(start + 4) % chatReplies.length]];
    replies.forEach(([speaker, message], index) => {
      window.setTimeout(() => {
        appendChatMessage(speaker, message);
        playCapsuleSound(index === replies.length - 1 ? "done" : "select");
      }, 360 + index * 430);
    });
  });

  const capsuleStation = document.querySelector("[data-capsule-station]");
  if (capsuleStation) {
    const select = capsuleStation.querySelector("[data-capsule-select]");
    const brew = capsuleStation.querySelector("[data-capsule-brew]");
    const art = capsuleStation.querySelector("[data-capsule-art]");
    const name = capsuleStation.querySelector("[data-capsule-name]");
    const status = capsuleStation.querySelector("[data-capsule-status]");
    const progress = capsuleStation.querySelector("[data-capsule-progress]");
    const latteArts = {
      css: [
        ["🧵", "シロちゃん肉球ラテ", "縫い目みたいな泡で、少しだけ整いました。"],
        ["🎨", "CSSラテ", "見た目だけ急に美しくなります。"],
      ],
      debug: [
        ["💻", "デバッグブラック", "バグが見えます。直るとは言ってません。"],
        ["🐛", "Bug Foam", "泡の中に仕様が見えました。"],
      ],
      merge: [
        ["🌙", "Merge Mocha", "衝突しない甘さを目指しています。"],
        ["🍫", "迷走モカ", "5分後に全部変えたくなる味。"],
      ],
      forest: [
        ["🌳", "Forest Blend", "世界樹の森から届いた香り。"],
        ["✨", "Glowdust Decaf", "眠れるかどうかは保証外です。"],
      ],
      summer: [
        ["🍯", "光のかけら入りハニージンジャーアイスティー", "世界樹の森のミントを添えて。暑い日のMPを少し戻します。"],
        ["🫧", "森のミントソーダ", "泡の中に小さな星が見えた気がします。"],
      ],
    };

    select.addEventListener("change", () => {
      playCapsuleSound("select");
    });

    brew.addEventListener("click", () => {
      const key = select.value;
      const options = latteArts[key] || latteArts.css;
      const [emoji, label, description] = pick(options);

      playCapsuleSound("brew");
      capsuleStation.classList.add("is-brewing");
      art.textContent = "…";
      name.textContent = "抽出中……";
      status.textContent = "██████░░░";
      progress.style.setProperty("--brew", "72%");

      window.setTimeout(() => {
        art.textContent = emoji;
        name.textContent = label;
        status.textContent = description;
        progress.style.setProperty("--brew", "100%");
        capsuleStation.classList.remove("is-brewing");
        playCapsuleSound("done");
      }, 720);
    });
  }
})();
