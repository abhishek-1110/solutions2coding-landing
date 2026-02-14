import { articles } from "./articles-data.js";

const BOOKMARK_STORAGE_KEY = "solutions2coding-bookmarks";
const READING_ACTIVITY_KEY = "solutions2coding-reading-activity";

const themeToggle = document.querySelector("#theme-toggle");
const heroTitle = document.querySelector("#hero-title");
const year = document.querySelector("#year");
const searchInput = document.querySelector("#search-posts");
const categoryList = document.querySelector("#category-list");
const postsGrid = document.querySelector("#posts-grid");
const savedPostsGrid = document.querySelector("#saved-posts-grid");
const loadMoreButton = document.querySelector("#load-more");
const resultsCount = document.querySelector("#results-count");
const savedResultsCount = document.querySelector("#saved-results-count");
const randomArticleButton = document.querySelector("#random-article-btn");
const streakCurrent = document.querySelector("#streak-current");
const streakBest = document.querySelector("#streak-best");
const streakTotal = document.querySelector("#streak-total");

const heroTitles = [
  "Practical coding guides for developers who build real products.",
  "Learn software engineering with production-ready examples.",
  "Read backend, frontend, and system design articles in one place.",
  "Upgrade your coding career with clear, implementation-first tutorials."
];

const posts = articles;
const pageSize = 4;

let visibleCount = pageSize;
let activeCategory = "All";
let searchQuery = "";
let bookmarkedSlugs = loadBookmarks();

year.textContent = String(new Date().getFullYear());
initializeTheme();
startHeroTitleRotation();
renderCategories();
renderPosts();
renderSavedPosts();
renderStreakStats();

searchInput?.addEventListener("input", (event) => {
  searchQuery = String(event.target.value || "").trim().toLowerCase();
  visibleCount = pageSize;
  renderPosts();
});

loadMoreButton?.addEventListener("click", () => {
  visibleCount += pageSize;
  renderPosts();
});

randomArticleButton?.addEventListener("click", () => {
  const randomArticle = posts[Math.floor(Math.random() * posts.length)];
  if (randomArticle) {
    window.location.href = `./article.html?slug=${encodeURIComponent(randomArticle.slug)}`;
  }
});

wireGridInteractions(postsGrid);
wireGridInteractions(savedPostsGrid);

document.addEventListener("keydown", (event) => {
  const isTypingInInput =
    event.target instanceof HTMLElement &&
    (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA" || event.target.isContentEditable);

  if (event.key === "/" && !isTypingInInput) {
    event.preventDefault();
    searchInput?.focus();
    searchInput?.select();
  }

  if (event.key === "Escape" && document.activeElement === searchInput) {
    searchInput.blur();
  }
});

function startHeroTitleRotation() {
  if (!heroTitle) {
    return;
  }

  let index = 0;
  setInterval(() => {
    index = (index + 1) % heroTitles.length;
    heroTitle.classList.add("is-changing");

    setTimeout(() => {
      heroTitle.textContent = heroTitles[index];
      heroTitle.classList.remove("is-changing");
    }, 260);
  }, 3400);
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

function renderCategories() {
  if (!categoryList) {
    return;
  }

  const categories = buildCategoryItems();
  categoryList.innerHTML = categories
    .map(
      (item) => `
        <button class="category-btn ${item.name === activeCategory ? "is-active" : ""}" type="button" data-category="${item.name}">
          <span>${item.name}</span>
          <span>${item.count}</span>
        </button>
      `
    )
    .join("");

  categoryList.querySelectorAll(".category-btn").forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.getAttribute("data-category") || "All";
      visibleCount = pageSize;
      renderCategories();
      renderPosts();
    });
  });
}

function buildCategoryItems() {
  const grouped = posts.reduce((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
  }, {});

  const items = [{ name: "All", count: posts.length }];
  Object.entries(grouped)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([name, count]) => {
      items.push({ name, count });
    });
  return items;
}

function renderPosts() {
  if (!postsGrid || !loadMoreButton) {
    return;
  }

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    if (!matchesCategory) {
      return false;
    }

    if (!searchQuery) {
      return true;
    }

    const searchable = `${post.title} ${post.excerpt} ${post.category}`.toLowerCase();
    return searchable.includes(searchQuery);
  });

  const visiblePosts = filteredPosts.slice(0, visibleCount);

  postsGrid.innerHTML = visiblePosts.map((post) => renderPostCard(post)).join("");
  resultsCount.textContent = `${filteredPosts.length} article${filteredPosts.length === 1 ? "" : "s"} found`;
  loadMoreButton.style.display = visiblePosts.length < filteredPosts.length ? "inline-flex" : "none";
}

function renderSavedPosts() {
  if (!savedPostsGrid || !savedResultsCount) {
    return;
  }

  const savedPosts = posts.filter((post) => bookmarkedSlugs.has(post.slug));
  savedPostsGrid.innerHTML = savedPosts.map((post) => renderPostCard(post)).join("");
  savedResultsCount.textContent = savedPosts.length
    ? `${savedPosts.length} saved article${savedPosts.length === 1 ? "" : "s"}`
    : "No saved articles yet. Click Save on any post.";
}

function renderPostCard(post) {
  const isSaved = bookmarkedSlugs.has(post.slug);
  return `
    <article
      class="post-card reveal clickable-card"
      data-article-slug="${post.slug}"
      role="link"
      tabindex="0"
      aria-label="Open article ${post.title}"
    >
      <div class="post-meta">
        <span class="post-badge">${post.category}</span>
        <span class="post-badge">${post.readTime}</span>
        <span class="post-badge">${post.date}</span>
      </div>
      <h3>${post.title}</h3>
      <p class="post-excerpt">${post.excerpt}</p>
      <div class="post-actions">
        <a class="post-read" href="./article.html?slug=${encodeURIComponent(post.slug)}">Read article</a>
        <button class="bookmark-btn ${isSaved ? "is-saved" : ""}" type="button" data-bookmark-slug="${post.slug}">
          ${isSaved ? "Saved" : "Save"}
        </button>
      </div>
    </article>
  `;
}

function wireGridInteractions(gridElement) {
  gridElement?.addEventListener("click", (event) => {
    const bookmarkButton = event.target.closest(".bookmark-btn");
    if (bookmarkButton) {
      const slug = bookmarkButton.getAttribute("data-bookmark-slug");
      if (!slug) {
        return;
      }

      toggleBookmark(slug);
      renderPosts();
      renderSavedPosts();
      return;
    }

    const card = event.target.closest(".post-card");
    const slug = card?.getAttribute("data-article-slug");
    if (slug) {
      openArticle(slug);
    }
  });

  gridElement?.addEventListener("keydown", (event) => {
    const card = event.target.closest(".post-card");
    if (!card) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const slug = card.getAttribute("data-article-slug");
      if (slug) {
        openArticle(slug);
      }
    }
  });
}

function openArticle(slug) {
  window.location.href = `./article.html?slug=${encodeURIComponent(slug)}`;
}

function toggleBookmark(slug) {
  if (bookmarkedSlugs.has(slug)) {
    bookmarkedSlugs.delete(slug);
  } else {
    bookmarkedSlugs.add(slug);
  }
  localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(Array.from(bookmarkedSlugs)));
}

function loadBookmarks() {
  try {
    const raw = localStorage.getItem(BOOKMARK_STORAGE_KEY);
    if (!raw) {
      return new Set();
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return new Set();
    }

    return new Set(parsed.map((item) => String(item)));
  } catch {
    return new Set();
  }
}

function renderStreakStats() {
  const { currentStreak, bestStreak, totalCompleted } = getReadingStats();

  if (streakCurrent) {
    streakCurrent.textContent = String(currentStreak);
  }

  if (streakBest) {
    streakBest.textContent = String(bestStreak);
  }

  if (streakTotal) {
    streakTotal.textContent = String(totalCompleted);
  }
}

function getReadingStats() {
  try {
    const raw = localStorage.getItem(READING_ACTIVITY_KEY);
    if (!raw) {
      return { currentStreak: 0, bestStreak: 0, totalCompleted: 0 };
    }

    const parsed = JSON.parse(raw);
    const dateMap = parsed?.readByDate;
    const completed = Array.isArray(parsed?.completedSlugs) ? parsed.completedSlugs.length : 0;
    if (!dateMap || typeof dateMap !== "object") {
      return { currentStreak: 0, bestStreak: 0, totalCompleted: completed };
    }

    const dates = Object.keys(dateMap).sort();
    if (!dates.length) {
      return { currentStreak: 0, bestStreak: 0, totalCompleted: completed };
    }

    let best = 1;
    let run = 1;
    for (let index = 1; index < dates.length; index += 1) {
      const previous = new Date(`${dates[index - 1]}T00:00:00Z`);
      const current = new Date(`${dates[index]}T00:00:00Z`);
      const diffDays = Math.round((current - previous) / 86400000);
      if (diffDays === 1) {
        run += 1;
      } else {
        run = 1;
      }
      if (run > best) {
        best = run;
      }
    }

    let currentStreak = 0;
    let cursor = new Date();
    cursor.setUTCHours(0, 0, 0, 0);
    while (true) {
      const key = cursor.toISOString().slice(0, 10);
      if (!dateMap[key]) {
        break;
      }
      currentStreak += 1;
      cursor = new Date(cursor.getTime() - 86400000);
    }

    return { currentStreak, bestStreak: best, totalCompleted: completed };
  } catch {
    return { currentStreak: 0, bestStreak: 0, totalCompleted: 0 };
  }
}
