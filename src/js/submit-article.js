const themeToggle = document.querySelector("#theme-toggle");
const year = document.querySelector("#year");
const form = document.querySelector("#submit-article-form");
const submitMessage = document.querySelector("#submit-message");

year.textContent = String(new Date().getFullYear());
initializeTheme();

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const payload = {
    authorName: String(formData.get("authorName") || "").trim(),
    authorEmail: String(formData.get("authorEmail") || "").trim(),
    articleTitle: String(formData.get("articleTitle") || "").trim(),
    articleCategory: String(formData.get("articleCategory") || "").trim(),
    articleTags: String(formData.get("articleTags") || "").trim(),
    articleSummary: String(formData.get("articleSummary") || "").trim(),
    articleContent: String(formData.get("articleContent") || "").trim()
  };

  if (!payload.authorName || !payload.authorEmail || !payload.articleTitle || !payload.articleCategory || !payload.articleSummary || !payload.articleContent) {
    showMessage("Please complete all required fields.", true);
    return;
  }

  if (payload.articleContent.length < 300) {
    showMessage("Article content is too short. Please provide a detailed write-up.", true);
    return;
  }

  try {
    // Placeholder for future API integration:
    // await fetch("/api/article-submissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    await simulateSubmit();
    showMessage("Your article has been submitted successfully. We'll review and contact you.", false);
    form.reset();
  } catch (error) {
    showMessage("Submission failed. Please try again.", true);
  }
});

function showMessage(message, isError) {
  if (!submitMessage) {
    return;
  }

  submitMessage.textContent = message;
  submitMessage.style.color = isError ? "#b91c1c" : "#0f766e";
}

function simulateSubmit() {
  return new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
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
