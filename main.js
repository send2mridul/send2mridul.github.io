(function () {
  "use strict";

  var FULL_NAME = "Mridul Singh";
  var reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var body = document.body;
  var stage = document.getElementById("terminal-stage");
  var linesEl = document.getElementById("terminal-lines");
  var mirror = document.getElementById("terminal-mirror");
  var cursor = document.getElementById("terminal-cursor");
  var inputRow = document.getElementById("terminal-input-row");
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

  function skippedIntro() {
    return body.classList.contains("is-unlocked");
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

  async function typeNameAuto() {
    var charMs = reducedMotion ? 0 : 72;
    mirror.textContent = "";
    if (cursor) cursor.style.display = "";

    if (reducedMotion) {
      mirror.textContent = FULL_NAME;
      return;
    }

    for (var i = 0; i < FULL_NAME.length; i++) {
      if (skippedIntro()) return;
      mirror.textContent += FULL_NAME.charAt(i);
      linesEl.scrollTop = linesEl.scrollHeight;
      await delay(charMs);
    }
  }

  async function finishUnlock() {
    if (skippedIntro()) return;
    if (cursor) cursor.style.display = "none";
    appendLine("[ok] identity match", "ok");
    await delay(reducedMotion ? 0 : 200);
    appendLine("[ok] loading profile bundle …", "ok");
    await delay(reducedMotion ? 0 : 350);
    appendLine("welcome, " + FULL_NAME + ".", "ok");
    await delay(reducedMotion ? 0 : 280);
    if (inputRow) inputRow.style.display = "none";
    if (stage) {
      var hint = document.querySelector(".terminal-hint");
      if (hint) hint.style.display = "none";
      if (skipIntro) skipIntro.style.display = "none";
    }
    unlockPortfolio();
  }

  async function runSequence() {
    var pace = reducedMotion ? 0 : 380;

    var bootScript = [
      { t: "init portfolio shell v2.4.0 …", c: "boot" },
      { t: "[ok] assets verified", c: "ok" },
      { t: "[ok] link secure channel", c: "ok" },
      { t: "session: visitor@mridul.dev", c: "boot" },
      { t: "resolving identity from local trust store …", c: "boot" },
    ];

    for (var i = 0; i < bootScript.length; i++) {
      if (skippedIntro()) return;
      appendLine(bootScript[i].t, bootScript[i].c);
      if (pace) await delay(pace);
    }

    if (skippedIntro()) return;
    if (pace) await delay(200);
    appendCmdLine('read -p "identity: " NAME && echo "unlocking…"');
    if (skippedIntro()) return;
    if (pace) await delay(280);
    appendLine("typing verified name …", "boot");
    if (skippedIntro()) return;
    if (pace) await delay(160);

    await typeNameAuto();
    if (skippedIntro()) return;
    if (pace) await delay(120);
    appendCmdLine('echo "' + FULL_NAME + '"');
    if (skippedIntro()) return;
    await finishUnlock();
  }

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

  runSequence();
})();
