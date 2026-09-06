/* =========================================================
   滨城烽火 · 红色大连 — 交互脚本
   导航滚动状态 / 移动端菜单 / 锚点偏移修复 / 今昔对比滑块 / 献花花瓣特效
   ========================================================= */
(function () {
  "use strict";

  var nav = document.getElementById("siteNav");
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  // 导航栏滚动后变实底
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 40) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }

  // 移动端菜单开关
  function closeMenu() {
    if (!links || !toggle) return;
    links.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // 点击链接后收起菜单
  if (links) {
    links.addEventListener("click", function (e) {
      if (e.target && e.target.tagName === "A") closeMenu();
    });
  }

  // 点击侧栏以外区域 / 按 Esc 关闭
  document.addEventListener("click", function (e) {
    if (links && links.classList.contains("open")) {
      if (!links.contains(e.target) && toggle && !toggle.contains(e.target)) closeMenu();
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  // ---- 全局锚点跳转偏移修复 ----
  // 拦截所有 a[href^="#"]，以目标元素顶部为基准额外减去 80px（适配固定导航栏高度）
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var hash = a.getAttribute("href");
      if (!hash || hash === "#" || hash.length < 2) return;
      var target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      var top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - 80);
      window.scrollTo({ top: top, behavior: "smooth" });
      if (history.replaceState) history.replaceState(null, "", hash);
      closeMenu();
    });
  });

  // ---- 今昔对比滑块（触摸 / 鼠标 / 键盘均可操作） ----
  function initCompareSliders() {
    document.querySelectorAll("[data-compare]").forEach(function (box) {
      var handle = box.querySelector(".compare-handle");

      function setP(pct) {
        pct = Math.max(6, Math.min(94, pct));
        box.style.setProperty("--p", pct + "%");
        if (handle) handle.setAttribute("aria-valuenow", Math.round(pct));
      }
      function posFromEvent(e) {
        var r = box.getBoundingClientRect();
        return ((e.clientX - r.left) / r.width) * 100;
      }
      function onDown(e) {
        box.classList.add("dragging");
        try { box.setPointerCapture(e.pointerId); } catch (err) {}
        setP(posFromEvent(e));
        e.preventDefault();
      }
      function onMove(e) {
        if (!box.classList.contains("dragging")) return;
        setP(posFromEvent(e));
      }
      function onUp(e) {
        if (!box.classList.contains("dragging")) return;
        box.classList.remove("dragging");
        try { box.releasePointerCapture(e.pointerId); } catch (err) {}
      }
      box.addEventListener("pointerdown", onDown);
      box.addEventListener("pointermove", onMove);
      box.addEventListener("pointerup", onUp);
      box.addEventListener("pointercancel", onUp);

      // 键盘无障碍：左右方向键微调
      if (handle) {
        handle.addEventListener("keydown", function (e) {
          var cur = parseFloat(box.style.getPropertyValue("--p")) || 50;
          if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); setP(cur - 5); }
          if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); setP(cur + 5); }
        });
      }

      setP(50);
    });
  }

  // ---- 献花花瓣特效（3-5 片粉色落英；性能或动效受限时自动降级） ----
  function spawnPetalBurst(originEl) {
    if (!originEl) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var rect = originEl.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    var count = 3 + Math.floor(Math.random() * 3); // 3–5 片
    for (var i = 0; i < count; i++) {
      var p = document.createElement("span");
      p.className = "petal";
      var size = 9 + Math.random() * 7;
      p.style.width = size + "px";
      p.style.height = (size * 0.85).toFixed(1) + "px";
      p.style.left = (cx + (Math.random() - 0.5) * 36) + "px";
      p.style.top = cy + "px";
      p.style.setProperty("--drift", ((Math.random() - 0.5) * 90).toFixed(0) + "px");
      p.style.setProperty("--fall", (90 + Math.random() * 80).toFixed(0) + "px");
      p.style.setProperty("--spin", (180 + Math.random() * 360).toFixed(0) + "deg");
      p.style.setProperty("--dur", (1.3 + Math.random() * 0.9).toFixed(2) + "s");
      document.body.appendChild(p);
      (function (el) {
        setTimeout(function () {
          if (el.parentNode) el.parentNode.removeChild(el);
        }, 2600);
      })(p);
    }
  }
  window.spawnPetalBurst = spawnPetalBurst;

  // 页脚年份
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  initCompareSliders();
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
