"use strict";

/*
 * Restaurant website: all home page behaviour in one file.
 * Every block checks that its elements exist, so the file is
 * safe to include on other pages too.
 */
document.addEventListener("DOMContentLoaded", function () {
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- Toast ---------- */
    let toastTimer;
    function showToast(message) {
        let toast = $("#toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "toast";
            toast.setAttribute("role", "status");
            toast.setAttribute("aria-live", "polite");
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
    }

    /* ---------- Footer year ---------- */
    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();

    /* ---------- Mobile navigation ---------- */
    const navbar = $("#navbar");
    const burger = $("#hamburger");

    function setNav(open) {
        if (!navbar || !burger) return;
        navbar.classList.toggle("mobile-open", open);
        document.body.classList.toggle("nav-locked", open);
        burger.setAttribute("aria-expanded", String(open));
        burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }

    if (burger && navbar) {
        burger.addEventListener("click", () => setNav(!navbar.classList.contains("mobile-open")));
        $$("#navLinks a").forEach(link => link.addEventListener("click", () => setNav(false)));
        window.matchMedia("(min-width: 901px)").addEventListener("change", e => {
            if (e.matches) setNav(false);
        });
    }

    /* ---------- Menu: category filter + See All ---------- */
    const tabs = $$("#menuTabs .btn");
    const items = $$("#menuGrid .item-box");
    const seeAllBtn = $("#seeAllBtn");
    const INITIAL_COUNT = 6;
    let category = "all";
    let expanded = false;

    function renderMenu() {
        let count = 0;
        items.forEach(item => {
            const cats = (item.dataset.category || "").split(/\s+/);
            const match = category === "all" || cats.includes(category);
            let show = false;
            if (match) {
                count += 1;
                show = category !== "all" || expanded || count <= INITIAL_COUNT;
            }
            item.hidden = !show;
        });
        if (seeAllBtn) {
            seeAllBtn.hidden = category !== "all";
            seeAllBtn.textContent = expanded ? "Show Less" : "See All";
        }
    }

    function setCategory(next) {
        category = next;
        tabs.forEach(tab => {
            const active = tab.dataset.category === next;
            tab.classList.toggle("active", active);
            tab.setAttribute("aria-pressed", String(active));
        });
        renderMenu();
    }

    tabs.forEach(tab => tab.addEventListener("click", () => setCategory(tab.dataset.category)));
    if (seeAllBtn) {
        seeAllBtn.addEventListener("click", () => {
            expanded = !expanded;
            renderMenu();
            if (!expanded) {
                const menu = $("#menu");
                if (menu) menu.scrollIntoView();
            }
        });
    }
    renderMenu();

    /* ---------- Search ---------- */
    const searchBox = $("#searchBox");
    const searchIcon = $("#searchIcon");
    const searchInput = $("#searchInput");
    const searchClear = $("#searchClear");

    function setSearch(open) {
        if (!searchBox) return;
        searchBox.classList.toggle("active", open);
        if (searchIcon) searchIcon.setAttribute("aria-expanded", String(open));
        if (open && searchInput) searchInput.focus();
    }

    function clearHits() {
        $$(".item-box.search-hit").forEach(el => el.classList.remove("search-hit"));
    }

    function runSearch(query) {
        clearHits();
        const needle = query.trim().toLowerCase();
        if (!needle) return;

        const matches = items.filter(item => {
            const title = item.querySelector("h3");
            return title && title.textContent.toLowerCase().includes(needle);
        });

        if (!matches.length) {
            showToast('No dish found for "' + query.trim() + '"');
            return;
        }

        category = "all";
        expanded = true;
        setCategory("all");
        matches.forEach(item => item.classList.add("search-hit"));
        matches[0].scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        setTimeout(clearHits, 4000);
        setSearch(false);
    }

    if (searchIcon) {
        searchIcon.addEventListener("click", () => {
            setSearch(!searchBox.classList.contains("active"));
        });
    }
    if (searchInput) {
        searchInput.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                e.preventDefault();
                runSearch(searchInput.value);
            }
        });
        searchInput.addEventListener("input", () => {
            if (!searchInput.value) clearHits();
        });
    }
    if (searchClear && searchInput) {
        searchClear.addEventListener("click", () => {
            searchInput.value = "";
            clearHits();
            searchInput.focus();
        });
    }
    document.addEventListener("click", e => {
        if (searchBox && searchBox.classList.contains("active") && !searchBox.contains(e.target)) {
            setSearch(false);
        }
    });
    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            setSearch(false);
            setNav(false);
        }
    });

    /* ---------- Cart ---------- */
    const CART_KEY = "cart";
    const cartCounter = $(".cart-counter");
    let cart = [];

    function loadCart() {
        try {
            const data = JSON.parse(localStorage.getItem(CART_KEY));
            cart = Array.isArray(data) ? data : [];
        } catch (err) {
            cart = [];
        }
        updateCartCounter();
    }

    function saveCart() {
        try {
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
        } catch (err) {
            showToast("Could not save your cart. Please enable browser storage.");
        }
    }

    function updateCartCounter() {
        if (!cartCounter) return;
        const total = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
        cartCounter.textContent = total;
        cartCounter.dataset.count = String(total);
    }

    document.addEventListener("click", e => {
        const button = e.target.closest(".add-cart");
        if (!button) return;
        const box = button.closest(".item-box");
        if (!box) return;

        const nameEl = box.querySelector("h3");
        const priceEl = box.querySelector(".priceCart span");
        const imgEl = box.querySelector("img");
        const name = nameEl ? nameEl.textContent.trim() : "";
        const price = priceEl ? parseFloat(priceEl.textContent.replace(/[^\d.]/g, "")) : NaN;
        if (!name || Number.isNaN(price)) return;

        loadCart(); // pick up changes made on the cart page or another tab
        const existing = cart.find(item => item.name === name);
        if (existing) {
            existing.quantity = (Number(existing.quantity) || 1) + 1;
        } else {
            cart.push({ name: name, price: price, image: imgEl ? imgEl.src : "", quantity: 1 });
        }
        saveCart();
        updateCartCounter();
        showToast(name + " added to cart");
    });

    window.addEventListener("pageshow", loadCart); // back button from the cart page
    window.addEventListener("storage", e => { if (e.key === CART_KEY) loadCart(); });
    loadCart();

    /* ---------- About: Read More ---------- */
    const aboutBlock = $("#aboutBlock");
    const readMoreBtn = $("#readMoreBtn");
    if (aboutBlock && readMoreBtn) {
        readMoreBtn.addEventListener("click", () => {
            const open = aboutBlock.classList.toggle("expanded");
            readMoreBtn.textContent = open ? "Read Less" : "Read More";
            readMoreBtn.setAttribute("aria-expanded", String(open));
        });
    }

    /* ---------- About: video ---------- */
    const videoBox = $("#videoBox");
    const video = $("#videoPlayer");
    function playVideo() {
        if (!videoBox || !video) return;
        videoBox.classList.add("playing");
        const attempt = video.play();
        if (attempt && attempt.catch) attempt.catch(() => {});
    }
    if (videoBox && video) {
        const thumb = $("#videoThumbnail");
        const playBtn = $("#playButton");
        if (thumb) thumb.addEventListener("click", playVideo);
        if (playBtn) playBtn.addEventListener("click", playVideo);
        video.addEventListener("ended", () => {
            videoBox.classList.remove("playing");
            video.currentTime = 0;
        });
    }

    /* ---------- Stats count-up ----------
     * Numbers stay at 0 until the stats section scrolls into view, then
     * count up. When the section leaves the screen they reset, so the
     * count plays again every time the visitor comes back to it. */
    const statsSection = $(".stats-sec");
    const counters = $$(".stat-item h3[data-target]");
    const frames = new WeakMap();

    function renderCount(el, value) {
        el.textContent = value + (el.dataset.suffix || "");
    }
    function stopCount(el) {
        const id = frames.get(el);
        if (id) cancelAnimationFrame(id);
        frames.delete(el);
    }
    function resetCount(el) {
        stopCount(el);
        renderCount(el, 0);
    }
    function animateCount(el) {
        stopCount(el);
        const target = Number(el.dataset.target) || 0;
        const duration = 1800;
        const start = performance.now();
        function frame(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            renderCount(el, Math.round(target * eased));
            if (progress < 1) {
                frames.set(el, requestAnimationFrame(frame));
            } else {
                frames.delete(el);
            }
        }
        frames.set(el, requestAnimationFrame(frame));
    }

    if (statsSection && counters.length && "IntersectionObserver" in window) {
        counters.forEach(resetCount);
        const statsObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    counters.forEach(animateCount);
                } else {
                    counters.forEach(resetCount);
                }
            });
        }, { threshold: 0.35 });
        statsObserver.observe(statsSection);
    }

    /* ---------- Subscribe form (front-end only) ---------- */
    const subscribeForm = $("#subscribeForm");
    const emailInput = $("#emailInput");
    if (subscribeForm && emailInput) {
        const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        subscribeForm.addEventListener("submit", e => {
            e.preventDefault();
            const value = emailInput.value.trim();
            if (!emailPattern.test(value)) {
                emailInput.classList.add("invalid");
                emailInput.focus();
                showToast("Please enter a valid email address");
                return;
            }
            emailInput.classList.remove("invalid");
            emailInput.value = "";
            showToast("Thanks for subscribing!");
        });
        emailInput.addEventListener("input", () => emailInput.classList.remove("invalid"));
    }

    /* ---------- Find the nearest restaurant ---------- */
    const findBtn = $("#button4");
    const mapFrame = $("#map");
    if (findBtn && mapFrame) {
        findBtn.addEventListener("click", () => {
            if (!navigator.geolocation) {
                showToast("Location is not supported on this device");
                return;
            }
            showToast("Finding restaurants near you…");
            navigator.geolocation.getCurrentPosition(
                pos => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    mapFrame.src = "https://maps.google.com/maps?q=restaurants%20near%20" +
                        lat + "," + lng + "&z=14&output=embed";
                },
                () => showToast("Location permission was denied"),
                { timeout: 10000 }
            );
        });
    }
});
