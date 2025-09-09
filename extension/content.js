(function () {
  // Configure where to open the viewer. You can switch this to your Vercel URL later.
  // Open the live viewer app with pasted preview
  const VIEWER_BASE = 'https://viewer-azure-five.vercel.app/view/pasted';
  const isThreadUrl = () => /\/status\/\d+/.test(location.pathname);

  const state = {
    originalArticle: null,
    initializedArticles: new WeakSet(),
    selectedArticles: new Set(),
    exportButton: null,
  };

  function ensureExportButton() {
    if (state.exportButton) return state.exportButton;
    const btn = document.createElement('button');
    btn.className = 'tc-fab';
    btn.type = 'button';
    btn.textContent = 'Export Selection';
    btn.style.display = 'none';
    btn.addEventListener('click', async () => {
      const payload = buildExportPayload();
      try {
        console.log('TweetCurator export JSON:');
        console.log(JSON.stringify(payload, null, 2));
      } catch (e) {
        console.log('TweetCurator export JSON (stringify failed):', payload);
      }
      // Build viewer JSON (preserve handles and emojis)
      const viewData = {
        curator: payload.curator || '@Unknown',
        original: payload.original ? {
          author: payload.original.author || 'Unknown',
          handle: (payload.original.author && payload.original.author.handle) ? ('@' + payload.original.author.handle) : payload.original.handle,
          content: payload.original.text || '',
          media: payload.original.media || null
        } : null,
        replies: payload.replies.map(r => ({
          author: r.author || 'Anon',
          handle: (r.author && r.author.handle) ? ('@' + r.author.handle) : (r.handle || ''),
          content: r.text || '',
          text: r.text || ''
        })),
        url: payload.url || location.href
      };

      // Copy for manual paste (nice fallback)
      try {
        await navigator.clipboard.writeText(JSON.stringify(viewData, null, 2));
        btn.textContent = 'Opening viewer + copied ✅';
      } catch {}

      // Auto-open viewer tab with ?data=
      try {
        const url = VIEWER_BASE + '?data=' + encodeURIComponent(JSON.stringify(viewData));
        window.open(url, '_blank', 'noopener');
      } finally {
        setTimeout(() => updateExportButton(), 1500);
      }
    });
    document.documentElement.appendChild(btn);
    state.exportButton = btn;
    return btn;
  }

  function updateExportButton() {
    const count = state.selectedArticles.size;
    const btn = ensureExportButton();
    if (count > 0) {
      btn.style.display = 'inline-flex';
      btn.textContent = `Export Selection (${count})`;
    } else {
      btn.style.display = 'none';
    }
  }

  function getAllArticles() {
    return Array.from(document.querySelectorAll('article[data-testid="tweet"]'));
  }

  function markOriginalIfNeeded() {
    if (state.originalArticle && document.contains(state.originalArticle)) return;
    const articles = getAllArticles();
    if (articles.length === 0) return;
    // Heuristic: first article on a single-thread page is the original
    const first = articles[0];
    state.originalArticle = first;
    first.setAttribute('data-tc-original', 'true');
  }

  function initArticle(article) {
    if (!(article instanceof HTMLElement)) return;
    if (state.initializedArticles.has(article)) return;
    state.initializedArticles.add(article);

    if (!state.originalArticle) markOriginalIfNeeded();
    const isOriginal = article === state.originalArticle;

    article.setAttribute('data-tc-annotated', 'true');
    article.setAttribute('data-tc-role', isOriginal ? 'original' : 'reply');

    if (isOriginal) return; // no checkbox on original

    // Inject checkbox
    const wrapper = document.createElement('label');
    wrapper.className = 'tc-checkbox-wrapper';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'tc-checkbox';
    checkbox.title = 'Select reply for TweetCurator export';
    wrapper.appendChild(checkbox);
    article.appendChild(wrapper);

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        state.selectedArticles.add(article);
      } else {
        state.selectedArticles.delete(article);
      }
      updateExportButton();
    });
  }

  function initExisting() {
    if (!isThreadUrl()) return;
    markOriginalIfNeeded();
    getAllArticles().forEach(initArticle);
    ensureExportButton();
    updateExportButton();
  }

  function observe() {
    const obs = new MutationObserver((mutations) => {
      let touched = false;
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.matches && node.matches('article[data-testid="tweet"]')) {
            touched = true;
            initArticle(node);
          } else if (node.querySelectorAll) {
            const found = node.querySelectorAll('article[data-testid="tweet"]');
            if (found.length) {
              touched = true;
              found.forEach(initArticle);
            }
          }
        }
      }
      if (touched && !state.originalArticle) markOriginalIfNeeded();
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  function collectText(el) {
    const textEl = el.querySelector('div[data-testid="tweetText"]');
    if (!textEl) return '';
    function walk(node) {
      let out = '';
      node.childNodes.forEach((n) => {
        if (n.nodeType === Node.TEXT_NODE) {
          out += n.nodeValue || '';
        } else if (n.nodeType === Node.ELEMENT_NODE) {
          const el2 = n;
          if (el2.tagName === 'IMG') {
            out += el2.getAttribute('alt') || '';
          } else if (el2.getAttribute && el2.getAttribute('aria-label') && el2.getAttribute('role') === 'img') {
            out += el2.getAttribute('aria-label') || '';
          } else {
            out += walk(el2);
          }
        }
      });
      return out;
    }
    return walk(textEl).replace(/\s+/g, ' ').trim();
  }

  function collectAuthor(el) {
    const userName = el.querySelector('div[data-testid="User-Name"]');
    let name = '';
    let handle = '';
    if (userName) {
      const spans = Array.from(userName.querySelectorAll('span'));
      for (const s of spans) {
        const t = (s.textContent || '').trim();
        if (t.startsWith('@')) {
          handle = t.replace(/^@/, '');
          break;
        }
      }
      for (const s of spans) {
        const t = (s.textContent || '').trim();
        if (t && !t.startsWith('@')) {
          name = t;
          break;
        }
      }
    }
    return { name, handle };
  }

  function collectTimestamp(el) {
    const time = el.querySelector('time');
    return time && time.dateTime ? time.dateTime : null;
  }

  function findStatusUrl(el) {
    const a = el.querySelector('a[href*="/status/"]');
    if (!a) return null;
    try {
      return new URL(a.getAttribute('href'), location.origin).href;
    } catch {
      return null;
    }
  }

  function extractIdFromUrl(url) {
    try {
      const u = new URL(url);
      const parts = u.pathname.split('/');
      const idx = parts.indexOf('status');
      if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
    } catch {}
    return null;
  }

  function buildExportPayload() {
    const pageUrl = location.href;
    const threadId = extractIdFromUrl(pageUrl);
    // Prefer the article whose status URL matches the page thread id
    const all = getAllArticles();
    let main = all.find(a => {
      const u = findStatusUrl(a);
      return u && threadId && u.includes(threadId);
    }) || state.originalArticle || all[0] || null;
    const original = main
      ? {
          id: (function () {
            const u = findStatusUrl(main);
            return u ? extractIdFromUrl(u) : null;
          })(),
          author: collectAuthor(main),
          text: collectText(main),
          timestamp: collectTimestamp(main),
          media: collectMedia(main)
        }
      : null;

    const replies = Array.from(state.selectedArticles).map((el) => ({
      id: (function () {
        const u = findStatusUrl(el);
        return u ? extractIdFromUrl(u) : null;
      })(),
      author: collectAuthor(el),
      text: collectText(el),
      timestamp: collectTimestamp(el),
    }));

    return {
      id: threadId,
      url: pageUrl,
      original,
      replies,
      curator: null,
      createdAt: new Date().toISOString(),
      viewMode: 'thread',
    };
  }

  function collectMedia(article) {
    try {
      // Prefer images within the tweet photo container; robust fallbacks
      const photoImg = article.querySelector('div[data-testid="tweetPhoto"] img');
      const linkImg = article.querySelector('a[href*="/photo/"] img');
      const pbsImg = article.querySelector('img[src*="pbs.twimg.com/media/"]');
      const img = photoImg || linkImg || pbsImg;
      if (img && img.src) {
        let src = img.src;
        // Prefer larger twitter image if param exists
        try {
          if (src.includes('pbs.twimg.com/media/')){
            const u = new URL(src, location.origin);
            if (u.searchParams.has('name')) u.searchParams.set('name','large');
            src = u.toString();
          }
        } catch {}
        const w = Number(img.naturalWidth || img.width || 0) || undefined;
        const h = Number(img.naturalHeight || img.height || 0) || undefined;
        const ar = (w && h) ? `${Math.round((w/Math.max(1,h))*100)/100}:1` : undefined;
        return {
          type: 'image',
          provider: 'twitter',
          sourceUrl: src,
          url: src, // viewer may rehost on save
          width: w,
          height: h,
          aspectRatio: ar,
          alt: img.alt || ''
        };
      }
    } catch {}
    return null;
  }

  // Initialize on eligible pages
  if (isThreadUrl()) {
    initExisting();
    observe();
  }

  // Handle SPA navigation changes
  let lastPath = location.pathname;
  setInterval(() => {
    if (location.pathname !== lastPath) {
      const wasThread = /\/status\/\d+/.test(lastPath);
      lastPath = location.pathname;
      const isThreadNow = isThreadUrl();

      if (isThreadNow) {
        // reset minimal state for new thread
        state.selectedArticles.clear();
        updateExportButton();
        state.originalArticle = null;
        setTimeout(() => {
          initExisting();
        }, 400);
      } else if (wasThread && state.exportButton) {
        state.exportButton.style.display = 'none';
      }
    }
  }, 600);
})();
