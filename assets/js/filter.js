// Client-side post filtering for Nova theme
(function () {
  'use strict';

  function initPostFilters() {
    const listEl = document.getElementById('post-list');
    if (!listEl) return;

    let activeYear = 'all';
    const activeTags = new Set();

    const rows = Array.from(listEl.querySelectorAll('.post-row'));
    const countEl = document.getElementById('post-count');
    const clearBtn = document.getElementById('clear-filters');
    const noResults = document.getElementById('no-results');

    function updateView() {
      let visibleCount = 0;

      rows.forEach(function (row) {
        const rowYear = row.getAttribute('data-year');
        const rowTagsAttr = row.getAttribute('data-tags') || '';
        const rowTags = rowTagsAttr ? rowTagsAttr.split(',').map(function (t) { return t.trim(); }) : [];

        const matchYear = (activeYear === 'all') || (rowYear === activeYear);
        const matchTags = activeTags.size === 0 || Array.from(activeTags).every(function (tag) {
          return rowTags.includes(tag);
        });

        if (matchYear && matchTags) {
          row.classList.remove('hidden');
          visibleCount++;
        } else {
          row.classList.add('hidden');
        }
      });

      if (countEl) {
        countEl.textContent = visibleCount + (visibleCount === 1 ? ' post' : ' posts');
      }

      if (noResults) {
        if (visibleCount === 0) {
          noResults.classList.remove('hidden');
        } else {
          noResults.classList.add('hidden');
        }
      }

      if (clearBtn) {
        const isFiltered = (activeYear !== 'all') || (activeTags.size > 0);
        if (isFiltered) {
          clearBtn.classList.remove('hidden');
        } else {
          clearBtn.classList.add('hidden');
        }
      }
    }

    // Year filters
    const yearContainer = document.getElementById('year-pills');
    if (yearContainer) {
      yearContainer.addEventListener('click', function (e) {
        const btn = e.target.closest('.filter-pill');
        if (!btn) return;
        const year = btn.getAttribute('data-year');
        if (!year) return;

        activeYear = year;
        yearContainer.querySelectorAll('.filter-pill').forEach(function (p) {
          p.classList.remove('active');
          p.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        updateView();
      });
    }

    // Tag filters
    const tagContainer = document.getElementById('tag-pills');
    if (tagContainer) {
      tagContainer.addEventListener('click', function (e) {
        const btn = e.target.closest('.filter-pill');
        if (!btn) return;
        const tag = btn.getAttribute('data-tag');
        if (!tag) return;

        if (activeTags.has(tag)) {
          activeTags.delete(tag);
          btn.classList.remove('active');
          btn.setAttribute('aria-pressed', 'false');
        } else {
          activeTags.add(tag);
          btn.classList.add('active');
          btn.setAttribute('aria-pressed', 'true');
        }
        updateView();
      });
    }

    // Clear filters
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        activeYear = 'all';
        activeTags.clear();

        if (yearContainer) {
          yearContainer.querySelectorAll('.filter-pill').forEach(function (p) {
            const isAll = p.getAttribute('data-year') === 'all';
            p.classList.toggle('active', isAll);
            p.setAttribute('aria-pressed', isAll ? 'true' : 'false');
          });
        }

        if (tagContainer) {
          tagContainer.querySelectorAll('.filter-pill').forEach(function (p) {
            p.classList.remove('active');
            p.setAttribute('aria-pressed', 'false');
          });
        }

        updateView();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', initPostFilters);
})();
