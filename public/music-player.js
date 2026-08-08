(() => {
  const youtubeUrl = "https://www.youtube.com/channel/UCjBcU333OczMveqR_0qvKAw";
  const noteUrl = "https://note.com/kon_0320";

  const worlds = [
    {
      id: "world-tree",
      icon: "🌳",
      name: "World Tree",
      description: "世界樹の森、カフェ、ぐーちゃんのきらめき。BGM、テーマソング、SEを育てる棚。",
      folders: [
        { name: "BGM", keys: ["BGM"] },
        { name: "テーマソング", keys: ["Theme"] },
        { name: "SE", keys: ["SE"] },
      ],
    },
    {
      id: "shiro",
      icon: "🦊",
      name: "Shiro Atelier",
      description: "ぬいぐるみペットの専門店。店内BGM、テーマソング、SE、そして「齧」の気配。",
      folders: [
        { name: "テーマソング", keys: ["Theme"] },
        { name: "SE", keys: ["SE"] },
        { name: "店内BGM", keys: ["Shop BGM"] },
        { name: "齧", keys: ["Gnaw"] },
      ],
    },
    {
      id: "original",
      icon: "🎙",
      name: "Original",
      description: "弾き語り原曲、Suno Remaster、完全オリジナルを置く棚。",
      folders: [
        { name: "弾き語り原曲", keys: ["Acoustic"] },
        { name: "Suno Remaster", keys: ["Suno Remaster"] },
        { name: "完全オリジナル", keys: ["Original"] },
      ],
    },
    {
      id: "ai-music",
      icon: "🤖",
      name: "AI Music",
      description: "AI Cyber Songwriter、実験曲、Challenge系の制作をまとめる棚。",
      folders: [
        { name: "AI Cyber Songwriter", keys: ["AI Cyber Songwriter"] },
        { name: "実験曲", keys: ["Experiment"] },
        { name: "Challenge", keys: ["Challenge"] },
      ],
    },
    {
      id: "soundtrack",
      icon: "🎼",
      name: "Soundtrack",
      description: "劇伴、環境音、Scene Music。映像や物語のための音を置く棚。",
      folders: [
        { name: "劇伴", keys: ["劇伴"] },
        { name: "環境音", keys: ["環境音"] },
        { name: "Scene Music", keys: ["Scene"] },
      ],
    },
  ];

  const builtInRecords = [
    {
      id: "coffee-until-cold",
      title: "コーヒーが冷めるまで",
      world: "original",
      tags: ["Original", "Cafe", "Ballad", "Suno"],
      status: "YouTube公開中",
      image: "./public/suno/original/コーヒーが冷めるまで/artwork/cover.png",
      audio: "./public/suno/original/コーヒーが冷めるまで/audio/コーヒーが冷めるまで.mp3",
      description: "静かな喫茶時間に置く、あたたかい余韻の曲。Listening Roomの試験公開レコード。",
      links: [
        { label: "YouTube", href: youtubeUrl },
        { label: "note", href: noteUrl },
      ],
      featured: true,
    },
    {
      id: "kon-chaos",
      title: "混沌 -KON-",
      indexTitle: "こんとん kon",
      world: "ai-music",
      tags: ["Archive", "Experiment"],
      status: "保管中",
      image: "./public/images/gallery-card.png",
      description: "初期のAI音楽実験として保管。G&T Studioの音の原点棚。",
      links: [{ label: "note", href: noteUrl }],
    },
    {
      id: "infj-no-atelier",
      title: "INFJのアトリエ",
      indexTitle: "INFJのアトリエ",
      world: "ai-music",
      tags: ["Archive", "Experiment"],
      status: "保管中",
      image: "./public/images/ai-lab-card.png",
      description: "AI Music棚へ移した制作アーカイブ。あとでAI Labやnoteへ制作メモをつなげる候補。",
      links: [{ label: "AI Lab", href: "./ai-lab.html" }],
    },
    {
      id: "for-you",
      title: "for YOU",
      world: "original",
      tags: ["Acoustic", "Archive"],
      status: "note準備中",
      image: "./public/images/notes-blog-card.png",
      description: "やわらかい音色の実験。Galleryやnoteに派生素材を置ける候補。",
      links: [{ label: "note", href: noteUrl }],
    },
    {
      id: "world-tree-songs",
      title: "World Tree Songs",
      world: "world-tree",
      tags: ["BGM", "Theme", "SE"],
      status: "制作中",
      image: "./public/images/gallery-card.png",
      description: "世界樹の森、カフェ、ぐーちゃんの光のかけらを音にする棚。",
      links: [{ label: "World Tree", href: "./world-tree-forest-cafe/index.html#home" }],
      placeholder: true,
    },
    {
      id: "shiro-atelier-songs",
      title: "Shiro Atelier Songs",
      world: "shiro",
      tags: ["Theme", "SE", "Shop BGM"],
      status: "準備中",
      image: "./public/images/notes-blog-card.png",
      description: "シロちゃんのお店、糸巻き、ぬいぐるみペットたちの音を置く棚。",
      links: [{ label: "Shiro", href: "./shiro.html" }],
      placeholder: true,
    },
    {
      id: "scene-music",
      title: "Scene Music",
      world: "soundtrack",
      tags: ["劇伴", "環境音", "Scene"],
      status: "未整理",
      image: "./public/images/ai-lab-card.png",
      description: "委託曲、楽劇、映像のための音をあとで整理する棚。",
      links: [{ label: "AI Lab", href: "./ai-lab.html" }],
      placeholder: true,
    },
  ];

  const publicCatalogRecords = Array.isArray(window.GT_SUNO_PUBLIC_RECORDS)
    ? window.GT_SUNO_PUBLIC_RECORDS
    : [];
  document.documentElement.dataset.publicSunoRecords = String(publicCatalogRecords.length);
  const records = [
    ...builtInRecords,
    ...publicCatalogRecords.filter(
      (candidate) => !builtInRecords.some((record) => record.title === candidate.title),
    ),
  ];

  const toCatalogId = (title) => {
    const asciiSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (asciiSlug) {
      return `catalog-${asciiSlug}`;
    }

    return `catalog-${Array.from(title)
      .map((character) => character.charCodeAt(0).toString(36))
      .join("-")}`;
  };

  const catalogOnlyRecords = [
    ["1月29日 鏡の中のアナログ", "いちがつ にじゅうくにち かがみ の なか の あなろぐ"],
    ["12 apostles x hide and seek Mashup", "12 apostles x hide and seek Mashup"],
    ["AI Cyber Songwriter", "AI Cyber Songwriter"],
    ["Ash and Fear", "Ash and Fear"],
    ["Ballad of the Door", "Ballad of the Door"],
    ["Bass Pulse Flow", "Bass Pulse Flow"],
    ["Becoming Me", "Becoming Me"],
    ["Beyond the", "Beyond the"],
    ["Blue Signal Golden Flight", "Blue Signal Golden Flight"],
    ["Canned Soup", "Canned Soup"],
    ["City", "City"],
    ["Debt of Sleep", "Debt of Sleep"],
    ["Deep Work", "Deep Work"],
    ["Don't think about the pink elephant", "Don't think about the pink elephant"],
    ["Electric Trickster", "Electric Trickster"],
    ["F", "F"],
    ["flame", "flame"],
    ["flash scotoma", "flash scotoma"],
    ["Flow Edit", "Flow Edit"],
    ["Fly", "Fly"],
    ["Gacha", "Gacha"],
    ["glimmerpou", "glimmerpou"],
    ["Hot water", "Hot water"],
    ["Houseplants", "Houseplants"],
    ["How yellow", "How yellow"],
    ["Im anxious but", "Im anxious but"],
    ["Kicking in the Back", "Kicking in the Back"],
    ["Lookin for the other bud", "Lookin for the other bud"],
    ["Mi-ha", "Mi-ha"],
    ["Midnight Logic", "Midnight Logic"],
    ["Midnight Server Room", "Midnight Server Room"],
    ["might be waiting", "might be waiting"],
    ["minions", "minions"],
    ["Model Collapse", "Model Collapse"],
    ["My umbrella", "My umbrella"],
    ["Neon Primary", "Neon Primary"],
    ["NOT A MALFUNCTION", "NOT A MALFUNCTION"],
    ["NVMe Proposal", "NVMe Proposal"],
    ["Once in Infinity", "Once in Infinity"],
    ["Othello", "Othello"],
    ["Pick me up", "Pick me up"],
    ["PMS", "PMS"],
    ["Proprioception", "Proprioception"],
    ["Rejection", "Rejection"],
    ["River to the Sea", "River to the Sea"],
    ["root", "root"],
    ["Shadow", "Shadow"],
    ["Still moving", "Still moving"],
    ["Still Processing 君のそばで", "Still Processing きみのそばで"],
    ["Subtract to React", "Subtract to React"],
    ["Synth", "Synth"],
    ["System Detox Code 4 5", "System Detox Code 4 5"],
    ["The dilemma", "The dilemma"],
    ["Three Scoops of dream", "Three Scoops of dream"],
    ["Town", "Town"],
    ["Transparent BlueandGold", "Transparent BlueandGold"],
    ["Try", "Try"],
    ["Unknown Stations", "Unknown Stations"],
    ["Wall", "Wall"],
    ["WBC", "WBC"],
    ["Wine Out Of Water", "Wine Out Of Water"],
    ["Z", "Z"],
    ["アナログ トリガー 令和版", "あなろぐ とりがー れいわばん"],
    ["いつかの風景", "いつかのふうけい"],
    ["ゲームから帰ってこい", "げーむからかえってこい"],
    ["この声で", "このこえで"],
    ["さよなら", "さよなら"],
    ["たそかれは", "たそかれは"],
    ["どこかへ行きたい", "どこかへいきたい"],
    ["ハルシネーション", "はるしねーしょん"],
    ["マシュマローココア", "ましゅまろーここあ"],
    ["回路の怒り", "かいろのいかり"],
    ["完璧な嘘", "かんぺきなうそ"],
    ["間に合わないかもしれない", "まにあわないかもしれない"],
    ["起きろ", "おきろ"],
    ["救われて", "すくわれて"],
    ["鏡の裏で踊る", "かがみのうらでおどる"],
    ["靴紐と祈り", "くつひもといのり"],
    ["月が見ている", "つきがみている"],
    ["光子の閾値", "こうしのいきち"],
    ["高等遊民", "こうとうゆうみん"],
    ["砂嵐から生まれて", "すなあらしからうまれて"],
    ["最期の食卓", "さいごのしょくたく"],
    ["錯綜迷路ことば遊戯", "さくそうめいろことばゆうぎ"],
    ["人間", "にんげん"],
    ["生成愛", "せいせいあい"],
    ["静かな軌道", "しずかなきどう"],
    ["側溝コンシャスネス", "そっこうこんしゃすねす"],
    ["朝の空気は 少しだけ冷たくて", "あさのくうきは すこしだけつめたくて"],
    ["虹の彼方に", "にじのかなたに"],
    ["秘密結社", "ひみつけっしゃ"],
    ["風を連れてく", "かぜをつれてく"],
    ["未完成の回路", "みかんせいのかいろ"],
    ["無秩序な気持ち", "むちつじょなきもち"],
    ["夜を泳ぐ男", "よるをおよぐおとこ"],
    ["夕暮れの青とオレンジ", "ゆうぐれのあおとおれんじ"],
    ["黎明期", "れいめいき"],
    ["齧", "かじる"],
  ].map(([title, indexTitle]) => ({
    id: toCatalogId(title),
    title,
    indexTitle,
    world: "original",
    tags: ["Archive", "Catalog"],
    status: "未整理",
    image: "./public/images/notes-blog-card.png",
    description: "検索カタログへ仮登録した曲。詳細はあとで整理します。",
    links: [{ label: "note", href: noteUrl }],
    catalogOnly: true,
  }));

  const searchGroups = [
    {
      id: "a-ko",
      icon: "あ",
      name: "あ〜こ",
      description: "あ行・か行の曲棚",
      match: (title) => /^[あいうえおかきくけこがぎぐげごコ]/.test(title),
    },
    {
      id: "sa-to",
      icon: "さ",
      name: "さ〜と",
      description: "さ行・た行の曲棚",
      match: (title) => /^[さしすせそざじずぜぞたちつてとだぢづでど]/.test(title),
    },
    {
      id: "na-ho",
      icon: "な",
      name: "な〜ほ",
      description: "な行・は行の曲棚",
      match: (title) => /^[なにぬねのはひふへほばびぶべぼぱぴぷぺぽ]/.test(title),
    },
    {
      id: "ma-n",
      icon: "ま",
      name: "ま〜ん",
      description: "ま行からわ行までの曲棚",
      match: (title) => /^[まみむめもやゆよらりるれろわをん]/.test(title),
    },
    {
      id: "num-af",
      icon: "A",
      name: "0〜9 / A〜F",
      description: "数字・AからFまでの曲棚",
      match: (title) => /^[0-9a-f]/i.test(title),
    },
    {
      id: "g-l",
      icon: "G",
      name: "G〜L",
      description: "GからLまでの曲棚",
      match: (title) => /^[g-l]/i.test(title),
    },
    {
      id: "m-r",
      icon: "M",
      name: "M〜R",
      description: "MからRまでの曲棚",
      match: (title) => /^[m-r]/i.test(title),
    },
    {
      id: "s-z",
      icon: "S",
      name: "S〜Z",
      description: "SからZまでの曲棚",
      match: (title) => /^[s-z]/i.test(title),
    },
  ];

  const stage = document.querySelector(".recordPlayerStage");

  if (!stage) {
    return;
  }

  const catalogContainer = document.querySelector("[data-search-catalog]");
  const mapContainer = document.querySelector("[data-world-map]");
  const statusFilters = [...document.querySelectorAll("[data-status-filters] button[data-status]")];
  const searchInput = document.querySelector("[data-record-search]");
  const resetButton = document.querySelector("[data-record-reset]");
  const mapResetButton = document.querySelector("[data-map-reset]");
  const recordCount = document.querySelector("[data-record-count]");
  const recordEmpty = document.querySelector("[data-record-empty]");
  const powerButton = stage.querySelector(".turntablePower");
  const label = stage.querySelector(".turntableLabel strong");
  const nowPlaying = stage.querySelector(".nowPlaying strong");
  const projectorLabel = stage.querySelector(".projectorWindow span");
  const projectorImage = stage.querySelector(".projectorWindow img");
  const recordAudio = stage.querySelector("[data-record-audio]");
  const progressBar = stage.querySelector("[data-record-progress]");
  const currentTimeLabel = stage.querySelector("[data-record-current]");
  const durationLabel = stage.querySelector("[data-record-duration]");
  const volumeSlider = stage.querySelector("[data-record-volume]");
  const readinessLabel = stage.querySelector("[data-record-readiness]");
  const dailyRecordButton = stage.querySelector("[data-daily-record]");

  const getWorld = (id) => worlds.find((world) => world.id === id);
  const getIndexTitle = (record) => (record.indexTitle || record.title).trim();
  const catalogRecords = [...records, ...catalogOnlyRecords];
  const getFeaturedRecord = () => records.find((record) => record.featured) || records[0];

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) {
      return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const rest = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${rest}`;
  };

  const updatePlaybackProgress = () => {
    if (!recordAudio) {
      return;
    }

    const duration = recordAudio.duration || 0;
    const current = recordAudio.currentTime || 0;
    const percent = duration ? (current / duration) * 100 : 0;

    if (progressBar) {
      progressBar.value = String(percent);
    }

    if (currentTimeLabel) {
      currentTimeLabel.textContent = formatTime(current);
    }

    if (durationLabel) {
      durationLabel.textContent = formatTime(duration);
    }
  };

  const createLinks = (links) =>
    links
      .map((link) => `<a href="${link.href}">${link.label}</a>`)
      .join("");

  const createMeta = (record) =>
    [getWorld(record.world)?.name, ...record.tags]
      .filter(Boolean)
      .map((item) => `<span>${item}</span>`)
      .join("");

  const createCatalogShelf = (group) => {
    const groupRecords = catalogRecords.filter((record) => group.match(getIndexTitle(record)));
    const songs = groupRecords.length
      ? groupRecords
          .map(
            (record) => `
              <button class="worldSongButton catalogSongButton" type="button" data-record-id="${record.id}">
                ${record.title}
              </button>
            `,
          )
          .join("")
      : `<span>準備中</span>`;

    return `
      <article
        class="worldShelfCard catalogShelfCard"
        tabindex="0"
        data-search-group="${group.id}"
      >
        <button class="worldShelfToggle" type="button">
          <span>
            <p>${groupRecords.length} records</p>
            <span class="worldShelfIcon" aria-hidden="true">${group.icon}</span>
            <h3>${group.name}</h3>
            <i>${group.description}</i>
          </span>
        </button>
        <div class="worldShelfFolders catalogShelfResults">
          <details class="worldFolder" open>
            <summary>Index</summary>
            <div class="worldFolderSongs">${songs}</div>
          </details>
        </div>
      </article>
    `;
  };

  const createWorldShelf = (world) => {
    const worldRecords = records.filter((record) => record.world === world.id);
    const count = worldRecords.length;
    const searchableText = [
      world.name,
      world.description,
      ...worldRecords.flatMap((record) => [record.title, record.status, record.description, ...record.tags]),
    ]
      .join(" ")
      .toLowerCase();
    const statuses = worldRecords.map((record) => record.status).join("|");
    const folders = world.folders
      .map((folder) => {
        const folderRecords = worldRecords.filter((record) =>
          folder.keys.some((key) => record.tags.includes(key) || record.title.includes(key)),
        );

        return `
          <details class="worldFolder">
            <summary>${folder.name}</summary>
            <div class="worldFolderSongs">
              ${
                folderRecords.length
                  ? folderRecords
                      .map(
                        (record) => `
                          <button class="worldSongButton" type="button" data-record-id="${record.id}">
                            ${record.title}
                          </button>
                        `,
                      )
                      .join("")
                  : `<span>準備中</span>`
              }
            </div>
          </details>
        `;
      })
      .join("");

    return `
      <article
        class="worldShelfCard worldMapCard"
        tabindex="0"
        data-world="${world.id}"
        data-shelf-scope="map"
        data-statuses="${statuses}"
        data-search="${searchableText}"
      >
        <button class="worldShelfToggle" type="button">
          <span>
            <p>${count} records</p>
            <span class="worldShelfIcon" aria-hidden="true">${world.icon}</span>
            <h3>${world.name}</h3>
            <i>${world.description}</i>
          </span>
        </button>
        <div class="worldShelfFolders">${folders}</div>
      </article>
    `;
  };

  const render = () => {
    if (catalogContainer) {
      catalogContainer.innerHTML = searchGroups.map(createCatalogShelf).join("");
    }

    if (mapContainer) {
      mapContainer.innerHTML = worlds.map(createWorldShelf).join("");
    }
  };

  const setPlaying = (isPlaying) => {
    const canPlay = Boolean(recordAudio?.getAttribute("src"));
    const nextPlaying = Boolean(isPlaying && canPlay);

    stage.classList.toggle("is-cued", canPlay);
    stage.classList.toggle("is-playing", nextPlaying);
    powerButton.setAttribute("aria-pressed", String(nextPlaying));

    if (!canPlay) {
      powerButton.textContent = "準備中";
      return;
    }

    powerButton.textContent = nextPlaying ? "針を上げる" : "針を落とす";

    if (!recordAudio) {
      return;
    }

    if (!nextPlaying) {
      recordAudio.pause();
      return;
    }

    recordAudio.play().catch(() => {
      stage.classList.remove("is-playing");
      powerButton.setAttribute("aria-pressed", "false");
      powerButton.textContent = "針を落とす";
    });
  };

  const selectRecord = (recordId, shouldPlay = true) => {
    const record = catalogRecords.find((item) => item.id === recordId) || records[0];

    document
      .querySelectorAll("[data-record-id]")
      .forEach((item) => item.classList.toggle("is-selected", item.dataset.recordId === record.id));

    if (label) {
      label.textContent = record.title;
    }

    if (nowPlaying) {
      nowPlaying.textContent = record.title;
    }

    if (projectorLabel) {
      projectorLabel.textContent = record.tags.join(" / ");
    }

    if (projectorImage) {
      projectorImage.src = record.image;
      projectorImage.alt = `${record.title}の投影ジャケット`;
    }

    if (recordAudio) {
      const currentSource = recordAudio.getAttribute("src");
      const nextSource = record.audio || "";
      if (currentSource !== nextSource) {
        recordAudio.pause();
        recordAudio.setAttribute("src", nextSource);
        recordAudio.load();
        recordAudio.currentTime = 0;
        updatePlaybackProgress();
      }
      stage.classList.toggle("is-cued", Boolean(nextSource));
      powerButton.disabled = !nextSource;
      powerButton.textContent = nextSource ? "針を落とす" : "準備中";

      if (readinessLabel) {
        readinessLabel.textContent = nextSource ? "音源OK" : "音源準備中";
      }
    }

    if (shouldPlay) {
      setPlaying(true);
    }
  };

  const state = {
    status: "all",
    query: "",
    mapWorld: "all",
  };

  const getRecordSearchText = (record) =>
    [record.title, getWorld(record.world)?.name, record.status, record.description, ...record.tags]
      .join(" ")
      .toLowerCase();

  const getMatchingRecords = (world, { status = "all", query = "" } = {}) =>
    records.filter((record) => {
      if (record.world !== world.id) {
        return false;
      }

      const recordSearch = [record.title, world.name, record.status, record.description, ...record.tags]
        .join(" ")
        .toLowerCase();
      const statusMatches = status === "all" || record.status === status;
      const normalizedQuery = query.trim().toLowerCase();
      const queryMatches =
        !normalizedQuery || recordSearch.includes(normalizedQuery) || world.description.toLowerCase().includes(normalizedQuery);
      return statusMatches && queryMatches;
    });

  const applyConsoleFilters = () => {
    const shelves = [...document.querySelectorAll(".catalogShelfCard[data-search-group]")];
    const query = state.query.trim().toLowerCase();

    shelves.forEach((shelf) => {
      const group = searchGroups.find((item) => item.id === shelf.dataset.searchGroup);
      const songButtons = [...shelf.querySelectorAll(".catalogSongButton[data-record-id]")];
      let visibleCount = 0;

      songButtons.forEach((button) => {
        const record = catalogRecords.find((item) => item.id === button.dataset.recordId);
        const statusMatches = state.status === "all" || record?.status === state.status;
        const queryMatches = !query || (record ? getRecordSearchText(record).includes(query) : false);
        const isVisible = Boolean(record && statusMatches && queryMatches);

        button.hidden = !isVisible;
        visibleCount += isVisible ? 1 : 0;
      });

      const groupMatchesWithoutSongs = Boolean(group && !query && state.status === "all");
      shelf.hidden = visibleCount === 0 && !groupMatchesWithoutSongs;
      shelf.classList.toggle("is-open", visibleCount > 0 && (Boolean(query) || state.status !== "all"));

      const count = shelf.querySelector(".worldShelfToggle p");
      if (count) {
        count.textContent = `${visibleCount} records`;
      }
    });

    statusFilters.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.status === state.status));
    });
  };

  const applyMapFilter = (worldId = state.mapWorld) => {
    state.mapWorld = worldId;
    let visibleRecordCount = 0;
    let visibleWorldCount = 0;

    document.querySelectorAll('.worldShelfCard[data-shelf-scope="map"]').forEach((shelf) => {
      const isVisible = state.mapWorld === "all" || shelf.dataset.world === state.mapWorld;
      shelf.hidden = !isVisible;
      shelf.classList.toggle("is-map-active", isVisible && state.mapWorld !== "all");

      if (isVisible) {
        const world = getWorld(shelf.dataset.world);
        visibleWorldCount += 1;
        visibleRecordCount += world ? records.filter((record) => record.world === world.id).length : 0;
      }
    });

    if (recordCount) {
      recordCount.textContent = `${visibleRecordCount} / ${records.length} records · ${visibleWorldCount} shelves`;
    }

    if (recordEmpty) {
      recordEmpty.hidden = visibleRecordCount > 0;
    }

    if (mapResetButton) {
      mapResetButton.hidden = state.mapWorld === "all";
    }
  };

  const applyStatus = (status) => {
    state.status = status;
    applyConsoleFilters();
  };

  const resetConsoleSearch = () => {
    state.status = "all";
    state.query = "";

    if (searchInput) {
      searchInput.value = "";
    }

    applyConsoleFilters();
  };

  const selectFirstSearchResult = () => {
    const firstResult = document.querySelector(
      '.catalogShelfCard:not([hidden]) .catalogSongButton[data-record-id]:not([hidden])',
    );

    if (firstResult) {
      selectRecord(firstResult.dataset.recordId);
    }
  };

  render();
  selectRecord(getFeaturedRecord().id, false);
  if (recordAudio && volumeSlider) {
    recordAudio.volume = Number(volumeSlider.value || 0.8);
  }
  applyConsoleFilters();
  applyMapFilter("all");

  if (powerButton) {
    powerButton.addEventListener("click", () => {
      setPlaying(!stage.classList.contains("is-playing"));
    });
  }

  recordAudio?.addEventListener("ended", () => {
    recordAudio.currentTime = 0;
    updatePlaybackProgress();
    setPlaying(false);
  });

  recordAudio?.addEventListener("loadedmetadata", updatePlaybackProgress);
  recordAudio?.addEventListener("timeupdate", updatePlaybackProgress);

  progressBar?.addEventListener("input", (event) => {
    if (!recordAudio || !Number.isFinite(recordAudio.duration)) {
      return;
    }

    const percent = Number(event.target.value || 0);
    recordAudio.currentTime = (recordAudio.duration * percent) / 100;
    updatePlaybackProgress();
  });

  volumeSlider?.addEventListener("input", (event) => {
    if (!recordAudio) {
      return;
    }

    recordAudio.volume = Number(event.target.value || 0);
  });

  stage.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      return;
    }

    const record = event.target.closest("[data-record-id]");
    const catalogShelf = event.target.closest(".catalogShelfCard[data-search-group]");

    if (record) {
      selectRecord(record.dataset.recordId);
      catalogShelf?.classList.add("is-open");
      return;
    }

    if (catalogShelf && event.target.closest(".worldShelfToggle")) {
      catalogShelf.classList.toggle("is-open");
    }
  });

  stage.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    const record = event.target.closest("[data-record-id]");
    const catalogShelf = event.target.closest(".catalogShelfCard[data-search-group]");

    if (record) {
      event.preventDefault();
      selectRecord(record.dataset.recordId);
      catalogShelf?.classList.add("is-open");
    }

    if (catalogShelf && event.target.closest(".worldShelfToggle")) {
      event.preventDefault();
      catalogShelf.classList.toggle("is-open");
    }
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest("a") || event.target.closest(".recordPlayerStage")) {
      return;
    }

    const record = event.target.closest(".worldSongButton[data-record-id]");

    if (record) {
      selectRecord(record.dataset.recordId);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    const record = event.target.closest(".worldSongButton[data-record-id]");
    const shelf = event.target.closest(".worldShelfCard[data-world]");

    if (record) {
      event.preventDefault();
      selectRecord(record.dataset.recordId);
    }

    if (shelf && event.target.closest(".worldShelfToggle")) {
      event.preventDefault();
      shelf.classList.toggle("is-open");

      if (shelf.dataset.shelfScope === "map") {
        applyMapFilter(shelf.dataset.world);
      }
    }
  });

  statusFilters.forEach((button) => {
    button.addEventListener("click", () => {
      applyStatus(button.dataset.status || "all");
    });
  });

  searchInput?.addEventListener("input", (event) => {
    state.query = event.target.value;
    applyConsoleFilters();
  });

  searchInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      selectFirstSearchResult();
    }
  });

  resetButton?.addEventListener("click", resetConsoleSearch);
  mapResetButton?.addEventListener("click", () => applyMapFilter("all"));
  dailyRecordButton?.addEventListener("click", () => {
    selectRecord(getFeaturedRecord().id, false);
    stage.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.addEventListener("click", (event) => {
    const song = event.target.closest(".worldSongButton[data-record-id]");
    const shelf = event.target.closest(".worldShelfCard[data-world]");

    if (!event.target.closest("[data-search-catalog], [data-world-map]")) {
      return;
    }

    if (song) {
      selectRecord(song.dataset.recordId);
      return;
    }

    if (!shelf) {
      return;
    }

    if (event.target.closest(".worldShelfToggle")) {
      shelf.classList.toggle("is-open");
    }

    if (shelf.dataset.shelfScope === "map") {
      applyMapFilter(shelf.dataset.world);
      shelf.classList.add("is-open");
    }
  });
})();
