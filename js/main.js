/* =========================================================
   滨城烽火 · 红色大连 — 交互脚本
   仅导航栏滚动状态 + 移动端菜单开关，无复杂功能
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

  // 页脚年份
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();