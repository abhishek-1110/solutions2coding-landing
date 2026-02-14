const themeToggle = document.querySelector("#theme-toggle");
const year = document.querySelector("#year");

year.textContent = String(new Date().getFullYear());
initializeTheme();

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
