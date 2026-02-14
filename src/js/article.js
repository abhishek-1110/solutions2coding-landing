import { getArticleBySlug } from "./articles-data.js";

const BOOKMARK_STORAGE_KEY = "solutions2coding-bookmarks";
const READING_ACTIVITY_KEY = "solutions2coding-reading-activity";

const themeToggle = document.querySelector("#theme-toggle");
const year = document.querySelector("#year");
const articleContainer = document.querySelector("#article-container");
const readingProgressBar = document.querySelector("#reading-progress-bar");

let currentArticle = null;
let bookmarkedSlugs = loadBookmarks();

year.textContent = String(new Date().getFullYear());
initializeTheme();
renderArticle();
initializeReadingProgress();

function renderArticle() {
  if (!articleContainer) {
    return;
  }

  const slug = new URLSearchParams(window.location.search).get("slug");
  const article = slug ? getArticleBySlug(slug) : null;
  currentArticle = article;

  if (!article) {
    articleContainer.innerHTML = `
      <h1>Article not found</h1>
      <p class="article-paragraph">The requested article does not exist.</p>
      <a class="btn btn-secondary" href="./index.html#latest-posts">Browse all articles</a>
    `;
    return;
  }

  const dynamicReadTime = estimateReadTime(article);
  document.title = `${article.title} | Solutions2Coding`;

  articleContainer.innerHTML = `
    <header class="article-header">
      <div class="post-meta">
        <span class="post-badge">${article.category}</span>
        <span class="post-badge">${article.readTime}</span>
        <span class="post-badge">${dynamicReadTime}</span>
        <span class="post-badge">${article.date}</span>
      </div>
      <h1>${article.title}</h1>
      <p class="article-paragraph">${article.excerpt}</p>
      <div class="article-actions">
        <button id="bookmark-article-btn" class="bookmark-btn ${bookmarkedSlugs.has(article.slug) ? "is-saved" : ""}" type="button">
          ${bookmarkedSlugs.has(article.slug) ? "Saved" : "Save Article"}
        </button>
        <button id="copy-link-btn" class="btn btn-secondary" type="button">Copy Link</button>
      </div>
      <p id="article-action-message" class="muted-text article-action-message"></p>
    </header>
    <div class="article-body">
      ${article.content.map((section) => renderSection(section)).join("")}
    </div>
  `;

  markArticleAsRead(article.slug);
  highlightCodeBlocks();
  wireArticleActions();
}

function wireArticleActions() {
  const bookmarkButton = document.querySelector("#bookmark-article-btn");
  const copyLinkButton = document.querySelector("#copy-link-btn");
  const actionMessage = document.querySelector("#article-action-message");

  bookmarkButton?.addEventListener("click", () => {
    if (!currentArticle) {
      return;
    }

    toggleBookmark(currentArticle.slug);
    const isSaved = bookmarkedSlugs.has(currentArticle.slug);
    bookmarkButton.textContent = isSaved ? "Saved" : "Save Article";
    bookmarkButton.classList.toggle("is-saved", isSaved);
    if (actionMessage) {
      actionMessage.textContent = isSaved ? "Added to your reading list." : "Removed from your reading list.";
    }
  });

  copyLinkButton?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      if (actionMessage) {
        actionMessage.textContent = "Article link copied to clipboard.";
      }
    } catch {
      if (actionMessage) {
        actionMessage.textContent = "Could not copy automatically. Please copy the URL manually.";
      }
    }
  });
}

function renderSection(section) {
  return `
    <section class="article-section">
      <h2>${escapeHtml(section.heading)}</h2>
      ${(section.paragraphs || [])
        .map((paragraph) => `<p class="article-paragraph">${escapeHtml(paragraph)}</p>`)
        .join("")}
      ${
        section.keyPoints?.length
          ? `
            <ul class="article-list">
              ${section.keyPoints.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
            </ul>
          `
          : ""
      }
      ${(section.codeSamples || []).length ? renderCodeTabs(section.codeSamples) : ""}
    </section>
  `;
}

function renderCodeTabs(samples) {
  return `
    <div class="code-tabs">
      <div class="code-tab-list" role="tablist" aria-label="Code language selector">
        ${samples
          .map(
            (sample, index) => `
              <button
                type="button"
                class="code-tab-btn ${index === 0 ? "is-active" : ""}"
                data-tab-index="${index}"
                role="tab"
                aria-selected="${index === 0 ? "true" : "false"}"
              >
                ${escapeHtml(sample.language || sample.title || `Code ${index + 1}`)}
              </button>
            `
          )
          .join("")}
      </div>
      <div class="code-tab-panels">
        ${samples.map((sample, index) => renderCodePanel(sample, index)).join("")}
      </div>
    </div>
  `;
}

function renderCodePanel(sample, index) {
  const language = String(sample.language || "text").toLowerCase();
  const prismLanguage = mapPrismLanguage(language);
  return `
    <figure class="code-block ${index === 0 ? "is-active" : ""}" data-panel-index="${index}" role="tabpanel">
      <figcaption>${escapeHtml(sample.title || "Code snippet")}</figcaption>
      <pre class="line-numbers"><code class="language-${escapeHtml(prismLanguage)}">${escapeHtml(sample.code || "")}</code></pre>
    </figure>
  `;
}

function mapPrismLanguage(language) {
  if (language === "csharp") return "csharp";
  if (language === "java") return "java";
  if (language === "javascript") return "javascript";
  if (language === "jsx") return "jsx";
  if (language === "sql") return "sql";
  if (language === "yaml") return "yaml";
  if (language === "http") return "http";
  return "none";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function estimateReadTime(article) {
  const words = article.content
    .flatMap((section) => [...(section.paragraphs || []), ...(section.keyPoints || [])])
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} min (dynamic)`;
}

function initializeTheme() {
  const storedTheme = localStorage.getItem("solutions2coding-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
  applyTheme(initialTheme);

  themeToggle?.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem("solutions2coding-theme", nextTheme);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  if (themeToggle) {
    themeToggle.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
  }
}

function highlightCodeBlocks() {
  const prism = window.Prism;
  if (prism?.highlightAllUnder) {
    prism.highlightAllUnder(document);
    return;
  }

  window.addEventListener(
    "load",
    () => {
      window.Prism?.highlightAllUnder?.(document);
    },
    { once: true }
  );
}

function initializeReadingProgress() {
  if (!readingProgressBar) {
    return;
  }

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100)) : 0;
    readingProgressBar.style.width = `${progress}%`;
  };

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
}

function loadBookmarks() {
  try {
    const raw = localStorage.getItem(BOOKMARK_STORAGE_KEY);
    if (!raw) {
      return new Set();
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed.map((item) => String(item))) : new Set();
  } catch {
    return new Set();
  }
}

function toggleBookmark(slug) {
  if (bookmarkedSlugs.has(slug)) {
    bookmarkedSlugs.delete(slug);
  } else {
    bookmarkedSlugs.add(slug);
  }
  localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(Array.from(bookmarkedSlugs)));
}

function markArticleAsRead(slug) {
  try {
    const raw = localStorage.getItem(READING_ACTIVITY_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const readByDate = parsed?.readByDate && typeof parsed.readByDate === "object" ? parsed.readByDate : {};
    const completedSlugs = Array.isArray(parsed?.completedSlugs) ? parsed.completedSlugs : [];

    const today = new Date().toISOString().slice(0, 10);
    if (!Array.isArray(readByDate[today])) {
      readByDate[today] = [];
    }

    if (!readByDate[today].includes(slug)) {
      readByDate[today].push(slug);
    }

    if (!completedSlugs.includes(slug)) {
      completedSlugs.push(slug);
    }

    const nextState = {
      readByDate,
      completedSlugs
    };

    localStorage.setItem(READING_ACTIVITY_KEY, JSON.stringify(nextState));
  } catch {
    // Ignore storage failures.
  }
}

document.addEventListener("click", (event) => {
  const button = event.target.closest(".code-tab-btn");
  if (!button) {
    return;
  }

  const tabs = button.closest(".code-tabs");
  if (!tabs) {
    return;
  }

  const selectedIndex = button.getAttribute("data-tab-index");
  tabs.querySelectorAll(".code-tab-btn").forEach((tabButton) => {
    const isActive = tabButton.getAttribute("data-tab-index") === selectedIndex;
    tabButton.classList.toggle("is-active", isActive);
    tabButton.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  tabs.querySelectorAll(".code-block").forEach((panel) => {
    const isActive = panel.getAttribute("data-panel-index") === selectedIndex;
    panel.classList.toggle("is-active", isActive);
  });
});
