/* ============================================================
   Deployku — language switcher (shared)
   Captures the English content rendered in the page, then swaps
   in translations supplied via window.DK_TRANSLATIONS when the
   user picks a language from the top-right pill. Selection is
   remembered in localStorage.
   ============================================================ */
(function () {
  "use strict";

  // Supported languages: [code, native label, short label]
  var LANGS = [
    ["en", "English", "EN"],
    ["ms", "Bahasa Melayu", "MS"],
    ["id", "Bahasa Indonesia", "ID"],
    ["vi", "Tiếng Việt", "VI"],
    ["th", "ภาษาไทย", "TH"],
    ["tl", "Taglish", "TGL"]
  ];
  var STORAGE_KEY = "dk_lang";

  function labelFor(code) {
    for (var i = 0; i < LANGS.length; i++) {
      if (LANGS[i][0] === code) return LANGS[i][1];
    }
    return "English";
  }
  function shortFor(code) {
    for (var i = 0; i < LANGS.length; i++) {
      if (LANGS[i][0] === code) return LANGS[i][2];
    }
    return "EN";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var translations = window.DK_TRANSLATIONS || {};

    // 1. Snapshot the English content already in the DOM.
    var en = {};
    var nodes = document.querySelectorAll("[data-t]");
    for (var i = 0; i < nodes.length; i++) {
      en[nodes[i].getAttribute("data-t")] = nodes[i].innerHTML;
    }
    en._title = document.title;
    en._lang = "en";
    translations.en = en;

    // 2. Build the language pill (button + dropdown menu).
    var pill = document.getElementById("lang-switcher");
    if (!pill) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lang-btn";
    btn.setAttribute("aria-haspopup", "listbox");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Choose language");
    btn.innerHTML =
      '<svg class="lang-globe" viewBox="0 0 24 24" aria-hidden="true" width="17" height="17">' +
      '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
      '<path d="M3 12h18M12 3c2.6 2.4 2.6 15.6 0 18M12 3c-2.6 2.4-2.6 15.6 0 18" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
      '</svg><span class="lang-label">English</span>' +
      '<svg class="lang-chev" viewBox="0 0 24 24" aria-hidden="true" width="14" height="14">' +
      '<path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    var menu = document.createElement("div");
    menu.className = "lang-menu";
    menu.setAttribute("role", "listbox");
    menu.setAttribute("aria-label", "Language");

    var optionEls = {};
    LANGS.forEach(function (l) {
      var o = document.createElement("button");
      o.type = "button";
      o.setAttribute("role", "option");
      o.setAttribute("data-lang", l[0]);
      o.innerHTML =
        '<span class="lang-short">' + l[2] + '</span>' +
        '<span class="lang-name">' + l[1] + '</span>' +
        '<svg class="lang-check" viewBox="0 0 24 24" aria-hidden="true" width="15" height="15">' +
        '<path d="M5 12l5 5L19 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      o.addEventListener("click", function () {
        apply(l[0]);
        closeMenu();
        btn.focus();
      });
      optionEls[l[0]] = o;
      menu.appendChild(o);
    });

    pill.appendChild(btn);
    pill.appendChild(menu);

    var label = btn.querySelector(".lang-label");

    function openMenu() {
      menu.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
    }
    function closeMenu() {
      menu.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    }
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (menu.classList.contains("open")) closeMenu();
      else openMenu();
    });
    document.addEventListener("click", function (e) {
      if (!pill.contains(e.target)) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    // 3. Apply a language to the page.
    function apply(code) {
      if (!translations[code]) code = "en";
      var dict = {};
      var k;
      for (k in en) dict[k] = en[k];
      var t = translations[code] || {};
      for (k in t) dict[k] = t[k];

      for (var j = 0; j < nodes.length; j++) {
        var key = nodes[j].getAttribute("data-t");
        if (dict[key] != null) nodes[j].innerHTML = dict[key];
      }
      document.title = dict._title || en._title;
      document.documentElement.setAttribute("lang", dict._lang || code);
      document.documentElement.setAttribute("dir", "ltr");

      label.textContent = labelFor(code);
      for (var c in optionEls) {
        var sel = c === code;
        optionEls[c].setAttribute("aria-selected", sel ? "true" : "false");
      }
      try { localStorage.setItem(STORAGE_KEY, code); } catch (err) {}
    }

    // 4. Restore the saved language (default English).
    var saved = "en";
    try { saved = localStorage.getItem(STORAGE_KEY) || "en"; } catch (err) {}
    apply(saved);
  });
})();
