# 🍽️ Restaurant Website (Figma to Code)

A dark, responsive restaurant landing page built from a Figma design using **HTML5**, **CSS3** and **Vanilla JavaScript**. It has a desktop layout and a separate mobile layout, with a hamburger menu on tablets and phones.

## 🔗 Links

- **GitHub Repository:** https://github.com/tarunkaushik00/resturant-website
- **Live Demo:** https://tarunkaushik00.github.io/resturant-website/ (works after you enable GitHub Pages: *Settings → Pages → Deploy from a branch → main / root*)

## ✨ Features

- **Matches the Figma design:** dark theme, white pill buttons, 3-column menu cards on desktop and a single-column layout on mobile.
- **Filterable menu:** category tabs (Bread, Chiffon & Rolls, Donut, Pastry & Danish, Cakes, Cookies) and a *See All / Show Less* button.
- **Working cart:** the cart icon on each dish adds it to `localStorage`. The navbar counter shows the total quantity and stays in sync with the cart page.
- **Search:** type a dish name in the navbar search and press Enter to jump to it.
- **Responsive navigation:** sticky navbar, hamburger menu below 900px, smooth scrolling.
- **Interactive bits:** Read More toggle, video player with play button, animated counters, email subscribe validation, "Find The Nearest" button that uses the browser location.
- **Accessible:** keyboard-friendly buttons, ARIA labels and visible focus styles.

## 🛠️ Tech Stack

- **HTML5:** semantic `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`.
- **CSS3:** Grid, Flexbox, CSS variables and media queries (`home.css`).
- **JavaScript (ES6):** DOM events, `localStorage`, `IntersectionObserver` (`script.js`).

## 📁 Project Structure

```text
resturant-website/
├── index.html             # Home page
├── home.css               # All styles for index.html (desktop + mobile)
├── script.js              # All behaviour for index.html
├── Images/                # Logo, dishes (img1-img27), avatars, icons
├── Video/                 # Cinematic Restaurant.mp4
├── Shopping Cart/         # cart.html
├── Contact With Us/       # contact.html
├── Become a Franchisee/   # franchisee.html
├── Bemone a member/       # member.html
├── Legal Notice/          # legal.html
└── README.md
```

## 📱 Breakpoints

| Width | Layout |
| --- | --- |
| > 980px | 3-column menu and reviews, full navbar |
| ≤ 980px | 2-column menu and reviews |
| ≤ 900px | Hamburger menu, stacked About and Location sections |
| ≤ 760px | Left-aligned headings, mobile hero |
| ≤ 600px | Single-column menu, reviews and stats |

## 🚀 Run locally

Open `index.html` in a browser, or use a local server such as the VS Code *Live Server* extension.
