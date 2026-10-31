// Main JavaScript for Nova theme
(function () {
  'use strict';

  // 1. Reading Progress Indicator (The Signal Bar)
  function initSignalIndicator() {
    const indicator = document.getElementById('signal-indicator');
    const bar = document.getElementById('signal-bar');
    if (!indicator || !bar) return;

    function handleScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (docHeight > 0) {
        const progress = Math.min(Math.max(scrollTop / docHeight, 0), 1);
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
    const codeBlocks = document.querySelectorAll('pre, .highlight pre');
    codeBlocks.forEach(function (pre) {
      if (pre.closest('.no-copy')) return;

      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const copyBtn = document.createElement('button');
      copyBtn.className = 'code-copy-btn';
      copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
      copyBtn.textContent = 'Copy';

      copyBtn.addEventListener('click', function () {
        const code = pre.querySelector('code') || pre;
        const text = code.innerText;

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

  document.addEventListener('DOMContentLoaded', function () {
    initSignalIndicator();
    initCodeCopy();
  });
})();
