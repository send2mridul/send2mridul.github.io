(function () {
  "use strict";

  var ACCEPT = "mridul singh";
  var reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var body = document.body;
  var stage = document.getElementById("terminal-stage");
  var linesEl = document.getElementById("terminal-lines");
  var input = document.getElementById("terminal-input");
  var mirror = document.getElementById("terminal-mirror");
  var cursor = document.getElementById("terminal-cursor");
  var inputRow = document.getElementById("terminal-input-row");
  var terminalBox = document.querySelector(".window-shake-target");
  var portfolioWrap = document.getElementById("portfolio-wrap");
  var skipIntro = document.getElementById("skip-intro");
  var skipLink = document.querySelector('.skip[href="#main"]');

  function delay(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function appendLine(text, className) {
    var row = document.createElement("div");
    row.className = "terminal-line-out" + (className ? " " + className : "");
    row.textContent = text;
    linesEl.appendChild(row);
    linesEl.scrollTop = linesEl.scrollHeight;
  }

  function appendCmdLine(text) {
    var row = document.createElement("div");
    row.className = "terminal-line-out cmd";
    row.textContent = "$ " + text;
    linesEl.appendChild(row);
    linesEl.scrollTop = linesEl.scrollHeight;
  }

  function normalizeName(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function setInputEnabled(on) {
    input.disabled = !on;
    if (on) {
      input.focus();
    }
  }

  function syncMirror() {
    mirror.textContent = input.value;
  }

  function shake() {
    if (!terminalBox) return;
    terminalBox.classList.remove("is-shake");
    void terminalBox.offsetWidth;
    terminalBox.classList.add("is-shake");
    setTimeout(function () {
      terminalBox.classList.remove("is-shake");
    }, 500);
  }

  function unlockPortfolio() {
    if (body.classList.contains("is-unlocked")) return;
    body.classList.add("is-unlocked");
    portfolioWrap.hidden = false;
    portfolioWrap.removeAttribute("inert");
    var main = document.getElementById("main");
    if (main) {
      main.focus({ preventScroll: true });
    }
  }

  async function runBoot() {
    setInputEnabled(false);
    var pace = reducedMotion ? 0 : 380;

    var bootScript = [
      { t: "init portfolio shell v2.4.0 …", c: "boot" },
      { t: "[ok] assets verified", c: "ok" },
      { t: "[ok] link secure channel", c: "ok" },
      { t: "session: visitor@mridul.dev", c: "boot" },
      { t: "hint: export NAME=\"<your full name>\"", c: "boot" },
    ];

    for (var i = 0; i < bootScript.length; i++) {
      appendLine(bootScript[i].t, bootScript[i].c);
      if (pace) await delay(pace);
    }

    if (pace) await delay(200);
    appendCmdLine('read -p "identity: " NAME && echo "unlocking…"');
    if (pace) await delay(280);
    appendLine("identity required. Type your full name and press Enter.", "boot");

    setInputEnabled(true);
    syncMirror();
  }

  async function onSubmit() {
    var raw = input.value;
    var n = normalizeName(raw);
    appendCmdLine('echo "' + raw.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"');

    if (n === ACCEPT) {
      setInputEnabled(false);
      appendLine("[ok] identity match", "ok");
      await delay(reducedMotion ? 0 : 200);
      appendLine("[ok] loading profile bundle …", "ok");
      await delay(reducedMotion ? 0 : 350);
      appendLine("welcome, Mridul Singh.", "ok");
      await delay(reducedMotion ? 0 : 280);
      inputRow.style.display = "none";
      if (cursor) cursor.style.display = "none";
      if (stage) {
        var hint = document.querySelector(".terminal-hint");
        if (hint) hint.style.display = "none";
        if (skipIntro) skipIntro.style.display = "none";
      }
      unlockPortfolio();
    } else {
      appendLine("unknown identity. Expected the owner full name.", "err");
      shake();
      input.value = "";
      syncMirror();
    }
  }

  input.addEventListener("input", syncMirror);

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit();
    }
  });

  if (skipIntro) {
    skipIntro.addEventListener("click", function () {
      unlockPortfolio();
    });
  }

  if (skipLink) {
    skipLink.addEventListener("click", function (e) {
      e.preventDefault();
      unlockPortfolio();
    });
  }

  var y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (!id || id.length < 2 || !id.startsWith("#")) return;
      var el = document.querySelector(id);
      if (el && !portfolioWrap.hidden) {
        e.preventDefault();
        el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
        if (el.tabIndex === -1) el.focus({ preventScroll: true });
      }
    });
  });

  var screen = document.querySelector(".terminal-screen");
  if (screen) {
    screen.addEventListener("click", function () {
      if (input && !input.disabled) input.focus();
    });
  }

  runBoot();
})();
