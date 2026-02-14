# Solutions2Coding Landing

Static multi-page frontend for the Solutions2Coding blogging website.

## Pages

- `index.html` - homepage (latest posts, search, categories, bookmarks, streaks)
- `article.html` - dynamic article detail page by `slug` query param
- `submit-article.html` - article submission form page
- `founder.html` - founder profile page

## Folder Structure

- `src/styles.css` - global styles
- `src/js/main.js` - homepage logic
- `src/js/article.js` - article page logic
- `src/js/articles-data.js` - article content dataset
- `src/js/submit-article.js` - submit page logic
- `src/js/founder.js` - founder page logic
- `assets/` - static assets (founder image, etc.)

## Current Features

- Dark mode with persistent preference (`localStorage`)
- Search + category filtering
- Random article button ("Surprise Me")
- Bookmark/reading list
- Reading streak tracker (current/best/total completed)
- Dynamic article rendering by slug
- Language tab switcher for code blocks
- Prism syntax highlighting + line numbers
- Article share (copy link) and reading progress bar

## Run Locally

Open `index.html` in browser, or serve via a static server:

```bash
npx serve .
```

Then open the local URL shown in terminal.

## Deployment

This project can be deployed to static hosting providers like:

- Vercel
- Netlify
- GitHub Pages

For Vercel preview deploy:

```bash
npx vercel deploy . -y
```
