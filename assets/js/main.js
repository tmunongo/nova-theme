// Main JavaScript for Nova theme
(function () {
  'use strict';

  // 1. Reading Progress Indicator (The Signal Bar)
  function initSignalIndicator() {
    var indicator = document.getElementById('signal-indicator');
    var bar = document.getElementById('signal-bar');
    if (!indicator || !bar) return;

    function handleScroll() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (docHeight > 0) {
        var progress = Math.min(Math.max(scrollTop / docHeight, 0), 1);
        bar.style.width = (progress * 100) + '%';

        if (progress > 0.01) {
          indicator.style.opacity = '1';
        } else {
          indicator.style.opacity = '0';
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Add copy button to code blocks
  function initCodeCopy() {
    var codeBlocks = document.querySelectorAll('pre, .highlight pre');
    codeBlocks.forEach(function (pre) {
      if (pre.closest('.no-copy')) return;

      var wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      var copyBtn = document.createElement('button');
      copyBtn.className = 'code-copy-btn';
      copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
      copyBtn.textContent = 'Copy';

      copyBtn.addEventListener('click', function () {
        var code = pre.querySelector('code') || pre;
        var text = code.innerText;

        navigator.clipboard.writeText(text).then(function () {
          copyBtn.textContent = 'Copied!';
          setTimeout(function () {
            copyBtn.textContent = 'Copy';
          }, 2000);
        }).catch(function () {
          copyBtn.textContent = 'Failed';
        });
      });

      wrapper.appendChild(copyBtn);
    });
  }

  // 3. Theme Toggle & Persistence
  function initThemeToggle() {
    var toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', function () {
      var currentTheme = document.documentElement.getAttribute('data-theme');
      if (!currentTheme) {
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        currentTheme = prefersDark ? 'dark' : 'light';
      }

      var nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      try {
        localStorage.setItem('nova-theme', nextTheme);
      } catch (e) {
        // Storage unavailable (e.g. private browsing quota exceeded); theme change still applies
      }
      // Dispatch event so diagrams / canvas can re-render if needed
      window.dispatchEvent(new CustomEvent('nova:theme-change', { detail: { theme: nextTheme } }));
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initSignalIndicator();
    initCodeCopy();
    initThemeToggle();
  });
})();
