(() => {
  "use strict";

  const script = document.currentScript;
  const measurementId = script?.dataset.measurementId || "";
  const privacyUrl = script?.dataset.privacyUrl || "./privacy.html";
  const storageKey = "gt_analytics_consent_v1";
  const productionHosts = new Set(["konnokatsura.github.io"]);
  const isProduction = productionHosts.has(window.location.hostname);
  const isPreview = new URLSearchParams(window.location.search).has("analytics-preview");

  if (!measurementId || (!isProduction && !isPreview)) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500,
  });

  function loadAnalytics() {
    if (document.querySelector(`script[data-gt-ga4="${measurementId}"]`)) return;

    window.gtag("consent", "update", { analytics_storage: "granted" });
    if (!isProduction) {
      document.documentElement.dataset.gtAnalyticsPreview = "granted";
      return;
    }
    const googleTag = document.createElement("script");
    googleTag.async = true;
    googleTag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    googleTag.dataset.gtGa4 = measurementId;
    document.head.appendChild(googleTag);
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
  }

  function setConsent(value) {
    try {
      window.localStorage.setItem(storageKey, value);
    } catch {
      // Browsing can continue when storage is unavailable.
    }
    document.querySelector("[data-gt-consent-panel]")?.remove();
    if (value === "granted") {
      loadAnalytics();
    } else {
      window.gtag("consent", "update", { analytics_storage: "denied" });
      delete document.documentElement.dataset.gtAnalyticsPreview;
    }
  }

  function getConsent() {
    try {
      return window.localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  }

  function addStyles() {
    if (document.querySelector("#gt-consent-style")) return;
    const style = document.createElement("style");
    style.id = "gt-consent-style";
    style.textContent = `
      .gt-consent-panel { position: fixed; z-index: 2147483646; right: 18px; bottom: 18px; width: min(390px, calc(100vw - 28px)); padding: 18px; border: 1px solid rgba(22,57,64,.22); border-radius: 8px; background: rgba(250,252,249,.97); box-shadow: 0 14px 42px rgba(22,57,64,.2); color: #163940; font: 400 14px/1.7 system-ui, -apple-system, BlinkMacSystemFont, "Hiragino Sans", sans-serif; letter-spacing: 0; }
      .gt-consent-panel strong { display: block; margin-bottom: 5px; font-size: 16px; font-weight: 600; }
      .gt-consent-panel p { margin: 0 0 12px; }
      .gt-consent-panel a { color: #315f52; text-underline-offset: 3px; }
      .gt-consent-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 14px; }
      .gt-consent-actions button { min-height: 40px; padding: 8px 15px; border: 1px solid #4f7f52; border-radius: 6px; background: #fff; color: #244a3b; cursor: pointer; font: inherit; font-weight: 600; }
      .gt-consent-actions [data-gt-consent="granted"] { background: #4f7f52; color: #fff; }
      .gt-consent-settings { position: fixed; z-index: 2147483645; left: 12px; bottom: 12px; width: 38px; height: 38px; border: 1px solid rgba(22,57,64,.25); border-radius: 50%; background: rgba(250,252,249,.9); box-shadow: 0 6px 18px rgba(22,57,64,.16); color: #163940; cursor: pointer; font-size: 17px; }
      @media (max-width: 520px) { .gt-consent-panel { right: 14px; bottom: 14px; } .gt-consent-actions { align-items: stretch; flex-direction: column-reverse; } }
    `;
    document.head.appendChild(style);
  }

  function showPanel() {
    addStyles();
    document.querySelector("[data-gt-consent-panel]")?.remove();
    const panel = document.createElement("section");
    panel.className = "gt-consent-panel";
    panel.dataset.gtConsentPanel = "";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "アクセス解析の設定");
    panel.innerHTML = `
      <strong>アクセス解析について</strong>
      <p>より見やすい展示室づくりのため、Google Analyticsで匿名の利用状況を確認します。許可するまで解析用Cookieは使用しません。</p>
      <a href="${privacyUrl}">計測方針を確認する</a>
      <div class="gt-consent-actions">
        <button type="button" data-gt-consent="denied">今回は許可しない</button>
        <button type="button" data-gt-consent="granted">アクセス解析を許可</button>
      </div>
    `;
    panel.addEventListener("click", (event) => {
      const button = event.target.closest("[data-gt-consent]");
      if (button) setConsent(button.dataset.gtConsent);
    });
    document.body.appendChild(panel);
    panel.querySelector("[data-gt-consent='granted']")?.focus({ preventScroll: true });
  }

  function addSettingsButton() {
    addStyles();
    if (document.querySelector("[data-gt-consent-settings]")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gt-consent-settings";
    button.dataset.gtConsentSettings = "";
    button.setAttribute("aria-label", "アクセス解析の設定を開く");
    button.title = "アクセス解析の設定";
    button.textContent = "⚙";
    button.addEventListener("click", showPanel);
    document.body.appendChild(button);
  }

  function start() {
    const consent = getConsent();
    if (consent === "granted") loadAnalytics();
    if (!consent) showPanel();
    addSettingsButton();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
