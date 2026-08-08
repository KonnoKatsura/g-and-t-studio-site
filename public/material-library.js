(() => {
  const writeClipboard = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch (_error) {
      const input = document.createElement("textarea");
      input.value = value;
      document.body.append(input);
      input.select();
      document.execCommand("copy");
      input.remove();
      return false;
    }
  };

  const themeColorCards = document.querySelectorAll("[data-theme-color-copy]");
  const themeColorStatus = document.querySelector("[data-theme-color-status]");
  if (themeColorCards.length) {
    themeColorCards.forEach((button) => {
      button.addEventListener("click", async () => {
        const value = button.dataset.themeColorCopy || "";
        try {
          await navigator.clipboard.writeText(value);
          if (themeColorStatus) themeColorStatus.textContent = `コピーしました：${button.querySelector("strong")?.textContent || "Theme Color"}`;
        } catch (_error) {
          const input = document.createElement("textarea");
          input.value = value;
          document.body.append(input);
          input.select();
          document.execCommand("copy");
          input.remove();
          if (themeColorStatus) themeColorStatus.textContent = `コピーしました：${button.querySelector("strong")?.textContent || "Theme Color"}`;
        }
        themeColorCards.forEach((card) => card.classList.toggle("is-active", card === button));
      });
    });
  }

  const themeAtelier = document.querySelector("[data-theme-atelier]");
  if (themeAtelier) {
    const themePresets = {
      forest: {
        label: "WTFC Theme",
        title: "森林書斎",
        body: "森の朝露のような透明感。自然系UI、素材管理、ガラスカードに向いた落ち着いた配色です。",
        vars: "theme-forest",
        memo: "Forest Quartz。WTFC、素材管理、森、透明感、静かな案内板向け。",
        usage: ["WTFC", "素材工房", "自然系UI", "ガラスカード"],
        colors: {
          base: "#4F7F52",
          accent: "#D7A73A",
          text: "#163940",
          glow: "#9EE6CA"
        }
      },
      honey: {
        label: "Reception Theme",
        title: "夕暮れ工房",
        body: "木とランプの温度がある受付テーマ。相談、案内、カフェ系カードに向いています。",
        vars: "theme-honey",
        memo: "Honey Amber。受付、相談室、カフェ、木、ランプ、温かい導線向け。",
        usage: ["Reception", "相談室", "カフェ", "木とランプ"],
        colors: {
          base: "#D7A73A",
          accent: "#6F8C54",
          text: "#3A2A14",
          glow: "#FFE2A3"
        }
      },
      shiro: {
        label: "Shiro Theme",
        title: "古紙とインク",
        body: "羊毛と紙のやわらかさを持つテーマ。手仕事、ぬいぐるみ、読書カードに合います。",
        vars: "theme-shiro",
        memo: "Shiro Rose。Shiro Atelier、手仕事、布、紙、やさしいカードUI向け。",
        usage: ["Shiro Atelier", "手仕事", "ぬいぐるみ", "紙もの"],
        colors: {
          base: "#E9A9C8",
          accent: "#D7A73A",
          text: "#3E2F35",
          glow: "#FFE4F0"
        }
      },
      midnight: {
        label: "AI Lab Theme",
        title: "夜の温室",
        body: "夜空と回路のような濃色テーマ。AI Lab、音楽、夜景、サイバー表現に向いています。",
        vars: "theme-midnight",
        memo: "Midnight Sapphire。AI Lab、Listening Room、夜景、サイバー、濃色展示向け。",
        usage: ["AI Lab", "Listening Room", "夜景", "サイバーUI"],
        colors: {
          base: "#14253F",
          accent: "#4FC3D8",
          text: "#F4FAFB",
          glow: "#7DEBFF"
        }
      },
      glowdust: {
        label: "Glowdust Theme",
        title: "鉱石標本室",
        body: "青白く光る発光テーマ。映像、ホログラム、光の軌跡、動きのあるUIに向いています。",
        vars: "theme-glowdust",
        memo: "Glowdust Crystal。発光UI、映像ツール、ホログラム、光の軌跡、AI表現向け。",
        usage: ["Glowdust", "映像ツール", "ホログラム", "AI表現"],
        colors: {
          base: "#4FC3D8",
          accent: "#FFD979",
          text: "#12343D",
          glow: "#BDF7FF"
        }
      },
      studioSky: {
        label: "Studio Log Theme",
        title: "霧の湖",
        body: "薄い水色の開発室テーマ。作業机、バックルーム、運用メモに向いた明るい配色です。",
        vars: "theme-studio-sky",
        memo: "Studio Sky。G&T開発室、Back Room、作業机、明るい業務UI向け。",
        usage: ["Studio Log", "Back Room", "作業机", "業務UI"],
        colors: {
          base: "#D9F3F7",
          accent: "#E8B946",
          text: "#174954",
          glow: "#FFFFFF"
        }
      }
    };
    const atelierButtons = [...themeAtelier.querySelectorAll("[data-theme-preset]")];
    const preview = themeAtelier.querySelector("[data-theme-preview]");
    const label = themeAtelier.querySelector("[data-theme-preview-label]");
    const title = themeAtelier.querySelector("[data-theme-preview-title]");
    const body = themeAtelier.querySelector("[data-theme-preview-body]");
    const canvaOutput = themeAtelier.querySelector('[data-theme-output="canva"]');
    const cssOutput = themeAtelier.querySelector('[data-theme-output="css"]');
    const jsonOutput = themeAtelier.querySelector('[data-theme-output="json"]');
    const status = themeAtelier.querySelector("[data-theme-status]");
    const storageKey = "gt-theme-atelier-selected";
    const uiStorageKey = "gt-theme-atelier-ui-mode";
    const uiCatalog = {
      sparkle: {
        label: "きらめき",
        title: "光の標本カード",
        body: "ガラス面に小さな反射と光粒を足し、展示物らしい視線誘導を作ります。",
        chip: "Sparkle / glow / highlight"
      },
      card: {
        label: "カード",
        title: "展示カード",
        body: "枠、余白、ラベルを強めて、選んだ素材を1枚の標本カードとして見せます。",
        chip: "Specimen card / frame"
      },
      button: {
        label: "ボタン",
        title: "入口ボタン",
        body: "操作の入口を大きく見せます。相談室、作品入口、保存ボタンの検討向けです。",
        chip: "Door button / action"
      },
      relation: {
        label: "相関図",
        title: "関係を見るカード",
        body: "点と線で、部屋・素材・導線の関係を確認します。フロアマップやEyeBook向けです。",
        chip: "Nodes / route / diagram"
      },
      motion: {
        label: "モーション",
        title: "動きの試着",
        body: "ふわっ、にょろ、ぽよんなどの動きが入った時の印象を確認します。",
        chip: "Motion / transition"
      },
      presentation: {
        label: "見せ方",
        title: "表示モード切替",
        body: "本風、展示風、会話風など、同じ情報を違う見せ方へ切り替えるための棚です。",
        chip: "Book / exhibit / chat"
      }
    };
    let activeUiMode = localStorage.getItem(uiStorageKey) || "sparkle";
    const hexToRgb = (hex) => {
      const normalized = hex.replace("#", "");
      const value = Number.parseInt(normalized.length === 3 ? normalized.split("").map((char) => char + char).join("") : normalized, 16);
      return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
    };
    const luminance = (hex) => {
      const [r, g, b] = hexToRgb(hex).map((channel) => {
        const value = channel / 255;
        return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const contrastRatio = (colorA, colorB) => {
      const light = Math.max(luminance(colorA), luminance(colorB));
      const dark = Math.min(luminance(colorA), luminance(colorB));
      return (light + 0.05) / (dark + 0.05);
    };

    const renderTheme = (key, save = false) => {
      const theme = themePresets[key] || themePresets.forest;
      const contrast = contrastRatio(theme.colors.text, theme.colors.base);
      const contrastLabel = contrast >= 4.5 ? "Contrast OK" : contrast >= 3 ? "Contrast Caution" : "Contrast Low";
      atelierButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.themePreset === key));
      if (preview) {
        preview.dataset.theme = key;
        preview.dataset.uiMode = activeUiMode;
        Object.entries(theme.colors).forEach(([role, value]) => {
          preview.style.setProperty(`--theme-${role}`, value);
        });
      }
      if (label) label.textContent = theme.label;
      if (title) title.textContent = theme.title;
      if (body) body.textContent = theme.body;
      themeAtelier.querySelectorAll("[data-theme-token]").forEach((node) => {
        const role = node.dataset.themeToken;
        node.textContent = theme.colors[role] || "";
      });
      if (canvaOutput) {
        canvaOutput.value = [
          `G&T Theme: ${theme.title}`,
          theme.memo,
          `UI Catalog: ${uiCatalog[activeUiMode]?.label || activeUiMode}`,
          "",
          `Base: ${theme.colors.base}`,
          `Accent: ${theme.colors.accent}`,
          `Text: ${theme.colors.text}`,
          `Glow: ${theme.colors.glow}`
        ].join("\n");
      }
      if (cssOutput) {
        cssOutput.value = [
          `--gt-${theme.vars}-base: ${theme.colors.base};`,
          `--gt-${theme.vars}-accent: ${theme.colors.accent};`,
          `--gt-${theme.vars}-text: ${theme.colors.text};`,
          `--gt-${theme.vars}-glow: ${theme.colors.glow};`
        ].join("\n");
      }
      if (jsonOutput) {
        jsonOutput.value = JSON.stringify({
          schema: 1,
          kind: "gt-theme-recipe",
          theme_id: key,
          title: theme.title,
          label: theme.label,
          memo: theme.memo,
          usage: theme.usage,
          ui_catalog: {
            mode: activeUiMode,
            label: uiCatalog[activeUiMode]?.label || activeUiMode,
            memo: uiCatalog[activeUiMode]?.body || ""
          },
          colors: theme.colors,
          exports: {
            css_prefix: `--gt-${theme.vars}`,
            canva_brand_kit_ready: true
          },
          checks: {
            contrast_ratio_text_on_base: Number(contrast.toFixed(2)),
            contrast_status: contrastLabel,
            reduced_motion_friendly: true
          }
        }, null, 2);
      }
      const contrastNode = themeAtelier.querySelector('[data-theme-check="contrast"]');
      if (contrastNode) {
        contrastNode.textContent = `${contrastLabel} ${contrast.toFixed(1)}:1`;
        contrastNode.dataset.status = contrast >= 4.5 ? "ok" : contrast >= 3 ? "caution" : "low";
      }
      if (status) status.textContent = `${theme.title}を表示中。`;
      if (save) {
        localStorage.setItem(storageKey, key);
        localStorage.setItem(uiStorageKey, activeUiMode);
        if (status) status.textContent = `${theme.title}を保存しました。`;
      }
    };

    const renderUiCatalog = (mode) => {
      activeUiMode = uiCatalog[mode] ? mode : "sparkle";
      const ui = uiCatalog[activeUiMode];
      themeAtelier.querySelectorAll("[data-ui-catalog]").forEach((button) => {
        button.classList.toggle("is-active", button.dataset.uiCatalog === activeUiMode);
      });
      if (preview) {
        preview.dataset.uiMode = activeUiMode;
        const previewLabel = preview.querySelector(".themePreviewCard span");
        const previewTitle = preview.querySelector(".themePreviewCard strong");
        const previewBody = preview.querySelector(".themePreviewCard p");
        if (previewLabel) previewLabel.textContent = ui.chip;
        if (previewTitle) previewTitle.textContent = ui.title;
        if (previewBody) previewBody.textContent = ui.body;
        preview.classList.remove("is-ui-motion");
        preview.getBoundingClientRect();
        if (activeUiMode === "motion") preview.classList.add("is-ui-motion");
      }
      const activeTheme = themeAtelier.querySelector("[data-theme-preset].is-active")?.dataset.themePreset || localStorage.getItem(storageKey) || "forest";
      renderTheme(activeTheme);
      if (status) status.textContent = `${ui.label}をLive Previewへ反映しました。`;
    };

    atelierButtons.forEach((button) => {
      button.addEventListener("click", () => renderTheme(button.dataset.themePreset));
    });
    themeAtelier.querySelectorAll("[data-ui-catalog]").forEach((button) => {
      button.addEventListener("click", () => renderUiCatalog(button.dataset.uiCatalog));
    });
    themeAtelier.querySelectorAll("[data-theme-copy]").forEach((button) => {
      button.addEventListener("click", async () => {
        const output = button.dataset.themeCopy === "css" ? cssOutput : button.dataset.themeCopy === "json" ? jsonOutput : canvaOutput;
        if (!output) return;
        await writeClipboard(output.value);
        if (status) {
          status.textContent =
            button.dataset.themeCopy === "css" ? "CSS変数をコピーしました。" :
            button.dataset.themeCopy === "json" ? "Theme Recipe JSONをコピーしました。" :
            "Canva用メモをコピーしました。";
        }
      });
    });
    themeAtelier.querySelector("[data-theme-save]")?.addEventListener("click", () => {
      const active = themeAtelier.querySelector("[data-theme-preset].is-active")?.dataset.themePreset || "forest";
      renderTheme(active, true);
    });
    renderUiCatalog(activeUiMode);
    renderTheme(localStorage.getItem(storageKey) || "forest");
  }

  const library = document.querySelector("[data-material-library]");
  if (!library) return;
  const liveThemePreview = document.querySelector("[data-theme-preview]");

  const labels = {
    color: {
      forest: "Forest Quartz",
      honey: "Honey Amber",
      shiro: "Shiro Rose Quartz",
      midnight: "Midnight Sapphire",
      cyan: "Glowdust Crystal"
    },
    surface: {
      glass: "硝子",
      wood: "木",
      felt: "羊毛",
      paper: "紙",
      pixel: "ピクセル"
    },
    motion: {
      soft: "ふわっ",
      line: "にょろ〜",
      spark: "きらっ",
      flip: "ぱらぱら",
      bounce: "ぽよん"
    },
    hardware: {
      round: "丸角 20",
      tab: "タブ",
      frame: "額縁",
      switch: "スイッチ",
      dialog: "会話箱"
    },
    icon: {
      tree: "Tree",
      thread: "Thread",
      book: "Book",
      music: "Music",
      spark: "Spark",
      coffee: "Coffee",
      shiro: "Shiro"
    },
    font: {
      book: "Book",
      pixel: "Pixel",
      fantasy: "Fantasy",
      modern: "Modern"
    },
    lighting: {
      day: "昼",
      evening: "夕方",
      night: "夜",
      lantern: "ランタン"
    },
    sound: {
      click: "カラン♪",
      pop: "ポン♪",
      shine: "シャラ〜"
    }
  };
  const icons = {
    tree: "🌳",
    thread: "🧵",
    book: "📚",
    music: "🎵",
    spark: "✨",
    coffee: "☕",
    shiro: "🦊"
  };
  const specimens = {
    forest: {
      number: "Specimen No. GT-CR-001",
      category: "鉱物と光の標本 / Crystal Collection",
      description: "森の朝露のような、透明感のある緑。静かな自然系UIやガラス表現に向いています。",
      usage: "Used in: World Tree Forest Cafe / 自然系UI / ガラスカード / 静かな展示画面"
    },
    honey: {
      number: "Specimen No. GT-CR-002",
      category: "琥珀と灯りの標本 / Crystal Collection",
      description: "蜂蜜色の温かい琥珀。カフェ、木製家具、ランプ、柔らかい相談画面に向いています。",
      usage: "Used in: Cafe Counter / Shiro Atelier / ランプ / 応接室"
    },
    shiro: {
      number: "Specimen No. GT-CR-003",
      category: "布と小さな手仕事の標本 / Crystal Collection",
      description: "羊毛や小さなぬいぐるみを思わせる淡い桃色。手仕事、紙、柔らかいカードUIに向いています。",
      usage: "Used in: Shiro Atelier / ぬいぐるみペット / 布 / 紙"
    },
    midnight: {
      number: "Specimen No. GT-CR-004",
      category: "夜空と回路の標本 / Crystal Collection",
      description: "夜空のような深い青。AI Lab、夜景、音楽ページ、サイバーUIに向いています。",
      usage: "Used in: AI Lab / Listening Room / 夜景 / サイバーUI"
    },
    cyan: {
      number: "Specimen No. GT-CR-005",
      category: "発光結晶の標本 / Crystal Collection",
      description: "青白く光る、発光系の結晶。AI表現、ホログラム、光の軌跡、モーション演出に向いています。",
      usage: "Used in: Glowdust / AI表現 / ホログラム / 光の軌跡"
    }
  };
  const palettes = {
    forest: {
      title: "Forest Quartz Set",
      memo: "WTFC、自然系UI、ガラスカード、落ち着いた案内板向け。",
      vars: "forest",
      colors: {
        base: { name: "Forest Quartz", hex: "#4F7F52", use: "主役の背景・部屋テーマ" },
        accent: { name: "Honey Amber", hex: "#D7A73A", use: "ボタン・見出し・誘導" },
        text: { name: "Deep Ink", hex: "#163940", use: "本文・説明・UIラベル" },
        glow: { name: "Soft Mint Glow", hex: "#9EE6CA", use: "光・ふち・ホバー" }
      }
    },
    honey: {
      title: "Honey Amber Set",
      memo: "Reception、相談室、カフェ、木とランプの温かい画面向け。",
      vars: "honey",
      colors: {
        base: { name: "Honey Amber", hex: "#D7A73A", use: "受付・ボタン・案内サイン" },
        accent: { name: "Forest Brass", hex: "#6F8C54", use: "植物・補助見出し" },
        text: { name: "Roasted Ink", hex: "#3A2A14", use: "本文・注意書き" },
        glow: { name: "Lamp Glow", hex: "#FFE2A3", use: "照明・背景のにじみ" }
      }
    },
    shiro: {
      title: "Shiro Rose Quartz Set",
      memo: "Shiro Atelier、手仕事、布、紙、やわらかいカード向け。",
      vars: "shiro",
      colors: {
        base: { name: "Shiro Rose Quartz", hex: "#E9A9C8", use: "主役の面・やわらかい棚" },
        accent: { name: "Honey Stitch", hex: "#D7A73A", use: "糸・小ボタン・注目点" },
        text: { name: "Warm Charcoal", hex: "#3E2F35", use: "本文・ラベル" },
        glow: { name: "Wool Glow", hex: "#FFE4F0", use: "余白・淡い発光" }
      }
    },
    midnight: {
      title: "Midnight Sapphire Set",
      memo: "AI Lab、Listening Room、夜景、サイバー寄りの展示向け。",
      vars: "midnight",
      colors: {
        base: { name: "Midnight Sapphire", hex: "#14253F", use: "濃色背景・夜の部屋" },
        accent: { name: "Glowdust Cyan", hex: "#4FC3D8", use: "リンク・発光ライン" },
        text: { name: "Snow Text", hex: "#F4FAFB", use: "濃色上の本文" },
        glow: { name: "Neon Mist", hex: "#7DEBFF", use: "ホログラム・光跡" }
      }
    },
    cyan: {
      title: "Glowdust Crystal Set",
      memo: "AI表現、ホログラム、動画ツール、明るい発光系UI向け。",
      vars: "glowdust",
      colors: {
        base: { name: "Glowdust Crystal", hex: "#4FC3D8", use: "発光面・アクセント背景" },
        accent: { name: "Showroom Gold", hex: "#FFD979", use: "ボタン・選択中表示" },
        text: { name: "Deep Teal Ink", hex: "#12343D", use: "本文・ツール説明" },
        glow: { name: "Glass Glow", hex: "#BDF7FF", use: "ガラス反射・ホバー" }
      }
    }
  };
  const state = {
    color: "forest",
    surface: "glass",
    motion: "soft",
    hardware: "round",
    icon: "tree",
    font: "book",
    lighting: "day",
    sound: "click"
  };
  const preview = library.querySelector("[data-material-preview]");
  const subtitle = library.querySelector("[data-material-subtitle]");
  const specimenNumber = library.querySelector("[data-material-number]");
  const specimenCategory = library.querySelector("[data-material-category]");
  const specimenName = library.querySelector("[data-material-name]");
  const specimenDescription = library.querySelector("[data-material-description]");
  const specimenUsage = library.querySelector("[data-material-usage]");
  const icon = library.querySelector("[data-material-icon]");
  const paletteCanvaOutput = library.querySelector('[data-palette-output="canva"]');
  const paletteCssOutput = library.querySelector('[data-palette-output="css"]');
  const paletteStatus = library.querySelector("[data-palette-status]");
  let materialAudioContext;

  const playMaterialSound = (sound) => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    materialAudioContext = materialAudioContext || new AudioContext();
    if (materialAudioContext.state === "suspended") {
      materialAudioContext.resume();
    }
    const now = materialAudioContext.currentTime;
    const gain = materialAudioContext.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.06, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
    gain.connect(materialAudioContext.destination);

    const sequence = {
      click: [660, 880],
      pop: [420, 520],
      shine: [880, 1320, 1760]
    }[sound] || [660];

    sequence.forEach((frequency, index) => {
      const osc = materialAudioContext.createOscillator();
      osc.type = sound === "shine" ? "sine" : "triangle";
      osc.frequency.setValueAtTime(frequency, now + index * 0.07);
      osc.connect(gain);
      osc.start(now + index * 0.07);
      osc.stop(now + index * 0.07 + 0.16);
    });
  };

  const applyMaterial = () => {
    library.dataset.color = state.color;
    library.dataset.surface = state.surface;
    library.dataset.motion = state.motion;
    library.dataset.hardware = state.hardware;
    library.dataset.font = state.font;
    library.dataset.lighting = state.lighting;
    if (liveThemePreview) {
      liveThemePreview.dataset.surface = state.surface;
      liveThemePreview.dataset.motion = state.motion;
      liveThemePreview.dataset.hardware = state.hardware;
      liveThemePreview.dataset.font = state.font;
      liveThemePreview.dataset.lighting = state.lighting;
    }
    library.querySelectorAll("[data-material-selected]").forEach((node) => {
      const kind = node.dataset.materialSelected;
      node.textContent = labels[kind][state[kind]];
    });
    const specimen = specimens[state.color];
    specimenNumber.textContent = specimen.number;
    specimenCategory.textContent = specimen.category;
    specimenName.textContent = labels.color[state.color];
    specimenDescription.textContent = specimen.description;
    specimenUsage.textContent = specimen.usage;
    subtitle.textContent = `${labels.surface[state.surface]} / ${labels.color[state.color]} / ${labels.hardware[state.hardware]} / ${labels.motion[state.motion]} / ${labels.font[state.font]}`;
    icon.textContent = icons[state.icon] || "✨";
    preview.classList.remove("is-soft", "is-line", "is-spark", "is-flip", "is-bounce");
    preview.getBoundingClientRect();
    preview.classList.add(`is-${state.motion}`);
    applyPalette();
  };

  const applyPalette = () => {
    const palette = palettes[state.color] || palettes.forest;
    const roles = ["base", "accent", "text", "glow"];
    roles.forEach((role) => {
      const color = palette.colors[role];
      const swatch = library.querySelector(`[data-palette-role="${role}"]`);
      library.querySelector(`[data-palette-color="${role}"]`)?.style.setProperty("--palette-color", color.hex);
      const name = library.querySelector(`[data-palette-name="${role}"]`);
      const hex = library.querySelector(`[data-palette-hex="${role}"]`);
      const use = library.querySelector(`[data-palette-use="${role}"]`);
      if (swatch) swatch.style.setProperty("--palette-color", color.hex);
      if (name) name.textContent = color.name;
      if (hex) hex.textContent = color.hex;
      if (use) use.textContent = color.use;
    });
    if (paletteCanvaOutput) {
      paletteCanvaOutput.value = [
        `G&T Palette: ${palette.title}`,
        palette.memo,
        "",
        ...roles.map((role) => {
          const color = palette.colors[role];
          return `${role.toUpperCase()}: ${color.name} ${color.hex} - ${color.use}`;
        })
      ].join("\n");
    }
    if (paletteCssOutput) {
      paletteCssOutput.value = [
        `--gt-${palette.vars}-base: ${palette.colors.base.hex};`,
        `--gt-${palette.vars}-accent: ${palette.colors.accent.hex};`,
        `--gt-${palette.vars}-text: ${palette.colors.text.hex};`,
        `--gt-${palette.vars}-glow: ${palette.colors.glow.hex};`
      ].join("\n");
    }
  };

  library.querySelectorAll("[data-material-drawer-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      button.closest("[data-material-drawer]")?.classList.toggle("is-open");
    });
  });

  library.querySelectorAll("[data-material-kind]").forEach((button) => {
    button.addEventListener("click", () => {
      const kind = button.dataset.materialKind;
      const value = button.dataset.materialValue;
      state[kind] = value;
      library.querySelectorAll(`[data-material-kind="${kind}"]`).forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });
      applyMaterial();
      playMaterialSound(kind === "sound" ? value : state.sound);
    });
  });

  library.querySelectorAll("[data-palette-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const type = button.dataset.paletteCopy;
      const output = type === "css" ? paletteCssOutput : paletteCanvaOutput;
      if (!output) return;
      await writeClipboard(output.value);
      if (paletteStatus) {
        paletteStatus.textContent = type === "css" ? "CSS変数をコピーしました。" : "Canva用メモをコピーしました。";
      }
    });
  });

  applyMaterial();
})();
