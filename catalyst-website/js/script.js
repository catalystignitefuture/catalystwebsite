
// ============================================================
// CATALYST — SHARED WEBSITE JAVASCRIPT
// File: js/script.js
//
// Used across the CATALYST homepage and all five service pages.
//
// FEATURES
// 1. Responsive mobile navigation
// 2. Sticky navbar and active section highlighting
// 3. Scroll progress bar and back-to-top button
// 4. Scroll-reveal animations
// 5. Animated statistics counters
// 6. Hero typing effect
// 7. Image gallery and lightbox
// 8. Smooth internal page transitions
// 9. Optional desktop cursor glow
// 10. Button ripple effects
// 11. Contact form to WhatsApp
//
// IMPORTANT:
// The contact form below uses WhatsApp to send inquiries.
// No backend server is included.
// Update WHATSAPP_NUMBER with your real number before launch.
// Use country code and digits only, without +, spaces or dashes.
// Example format for a UAE mobile number: 9715XXXXXXXX
// ============================================================

(() => {
    "use strict";

    // --------------------------------------------------------
    // 1. SETTINGS YOU CAN CHANGE
    // --------------------------------------------------------

    const WHATSAPP_NUMBER = "971585738839";

    // Set to false if you do not want page fade transitions.
    const ENABLE_PAGE_TRANSITIONS = true;

    // Set to false if you do not want the optional desktop glow.
    const ENABLE_CURSOR_GLOW = true;

    // Do not run decorative animations when reduced motion is
    // enabled in the visitor's device accessibility settings.
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // Check whether this is a desktop-like device with a mouse.
    const hasFinePointer = window.matchMedia(
        "(min-width: 1024px) and (pointer: fine)"
    ).matches;


    // --------------------------------------------------------
    // 2. START WHEN THE HTML DOCUMENT IS READY
    // --------------------------------------------------------

    function initializeCatalyst() {
        initializeMobileNavigation();
        initializeHeaderAndScroll();
        initializeScrollReveal();
        initializeCounters();
        initializeTypingEffect();
        initializeGallery();
        initializeContactForm();
        initializeWhatsAppLinks();
        initializePageTransitions();
        initializeCursorGlow();
        initializeButtonRipples();
        initializeExternalLinks();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeCatalyst,
            { once: true }
        );
    } else {
        initializeCatalyst();
    }


    // --------------------------------------------------------
    // 3. MOBILE NAVIGATION
    //
    // HTML elements expected:
    // .menu-toggle
    // .nav-links
    //
    // The button's aria-expanded attribute communicates the
    // menu state to assistive technologies.
    // --------------------------------------------------------

    function initializeMobileNavigation() {
        const menuToggle = document.querySelector(".menu-toggle");
        const navLinks = document.querySelector(".nav-links");

        if (!menuToggle || !navLinks) {
            return;
        }

        function openMenu() {
            navLinks.classList.add("is-open");
            menuToggle.setAttribute("aria-expanded", "true");
            document.body.classList.add("menu-open");
        }

        function closeMenu() {
            navLinks.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
            document.body.classList.remove("menu-open");
        }

        menuToggle.addEventListener("click", () => {
            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close the mobile menu when a visitor selects a link.
        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        // Close the menu when a visitor clicks outside it.
        document.addEventListener("click", (event) => {
            const clickedInsideMenu = navLinks.contains(event.target);
            const clickedToggle = menuToggle.contains(event.target);

            if (!clickedInsideMenu && !clickedToggle) {
                closeMenu();
            }
        });

        // Escape key closes the menu.
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        // Return the menu to its normal state if the browser
        // changes from mobile width to desktop width.
        window.addEventListener("resize", () => {
            if (window.innerWidth > 820) {
                closeMenu();
            }
        });
    }


    // --------------------------------------------------------
    // 4. STICKY HEADER, SCROLL PROGRESS AND BACK TO TOP
    //
    // HTML elements expected:
    // .site-header
    // .scroll-progress
    // .back-to-top
    //
    // Optional navigation links can use href="#services",
    // href="#work", href="#contact", and similar section IDs.
    // --------------------------------------------------------

    function initializeHeaderAndScroll() {
        const header = document.querySelector(".site-header");
        const progressBar = document.querySelector(".scroll-progress");
        const backToTop = document.querySelector(".back-to-top");

        const sectionLinks = Array.from(
            document.querySelectorAll('.nav-links a[href^="#"]')
        );

        let activeSectionObserver = null;

        function updateScrollElements() {
            const scrollTop =
                window.scrollY || document.documentElement.scrollTop;

            const scrollableHeight =
                document.documentElement.scrollHeight -
                window.innerHeight;

            // Update the top progress bar.
            if (progressBar) {
                const progress = scrollableHeight > 0
                    ? (scrollTop / scrollableHeight) * 100
                    : 0;

                progressBar.style.width = `${progress}%`;
                progressBar.setAttribute("aria-valuenow", String(
                    Math.round(progress)
                ));
            }

            // Add a background shadow to the sticky header.
            if (header) {
                header.classList.toggle(
                    "is-scrolled",
                    scrollTop > 20
                );
            }

            // Show the back-to-top button after scrolling down.
            if (backToTop) {
                backToTop.classList.toggle(
                    "is-visible",
                    scrollTop > 450
                );
            }
        }

        // Use a single scroll listener for scroll-based effects.
        window.addEventListener(
            "scroll",
            updateScrollElements,
            { passive: true }
        );

        window.addEventListener(
            "resize",
            updateScrollElements,
            { passive: true }
        );

        updateScrollElements();

        // Back-to-top action.
        if (backToTop) {
            backToTop.addEventListener("click", () => {
                window.scrollTo({
                    top: 0,
                    behavior: prefersReducedMotion ? "auto" : "smooth"
                });
            });
        }

        // Highlight the navbar link for the visible section.
        if (
            sectionLinks.length > 0 &&
            "IntersectionObserver" in window
        ) {
            const sectionMap = new Map();

            sectionLinks.forEach((link) => {
                const href = link.getAttribute("href");

                if (!href || href === "#") {
                    return;
                }

                const sectionId = href.slice(1);
                const section = document.getElementById(sectionId);

                if (section) {
                    sectionMap.set(section, link);
                }
            });

            activeSectionObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) {
                            return;
                        }

                        const activeLink = sectionMap.get(entry.target);

                        if (!activeLink) {
                            return;
                        }

                        sectionLinks.forEach((link) => {
                            link.classList.toggle(
                                "active",
                                link === activeLink
                            );

                            if (link === activeLink) {
                                link.setAttribute("aria-current", "location");
                            } else {
                                link.removeAttribute("aria-current");
                            }
                        });
                    });
                },
                {
                    rootMargin: "-25% 0px -65% 0px",
                    threshold: 0
                }
            );

            sectionMap.forEach((link, section) => {
                activeSectionObserver.observe(section);
            });
        }

        // Keep the observer referenced within this function.
        // The browser manages its lifecycle with the page.
        void activeSectionObserver;
    }


    // --------------------------------------------------------
    // 5. SCROLL-REVEAL ANIMATIONS
    //
    // Add class "reveal", "reveal-left", or "reveal-right"
    // to an HTML element to animate it into view.
    //
    // Optional delay classes:
    // .delay-1, .delay-2, .delay-3, .delay-4
    // --------------------------------------------------------

    function initializeScrollReveal() {
        const revealElements = document.querySelectorAll(
            ".reveal, .reveal-left, .reveal-right"
        );

        if (revealElements.length === 0) {
            return;
        }

        // Reduced-motion visitors should not have to wait
        // for reveal transitions to see any content.
        if (prefersReducedMotion) {
            revealElements.forEach((element) => {
                element.classList.add("is-visible");
            });

            return;
        }

        // Fallback for older browsers.
        if (!("IntersectionObserver" in window)) {
            revealElements.forEach((element) => {
                element.classList.add("is-visible");
            });

            return;
        }

        const observer = new IntersectionObserver(
            (entries, currentObserver) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("is-visible");

                    // Reveal each element only once.
                    currentObserver.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealElements.forEach((element) => {
            observer.observe(element);
        });
    }


    // --------------------------------------------------------
    // 6. ANIMATED STATISTICS COUNTERS
    //
    // Example HTML:
    // <span class="stat-number" data-count="100"
    //       data-suffix="+">0+</span>
    //
    // Or:
    // <span data-counter="50" data-suffix="+">0+</span>
    //
    // data-prefix and data-suffix are optional.
    // Only use verified business statistics on your website.
    // --------------------------------------------------------

    function initializeCounters() {
        const counters = document.querySelectorAll(
            "[data-count], [data-counter]"
        );

        if (counters.length === 0) {
            return;
        }

        function animateCounter(element) {
            if (element.dataset.counterStarted === "true") {
                return;
            }

            element.dataset.counterStarted = "true";

            const rawTarget =
                element.dataset.count ??
                element.dataset.counter;

            const target = Number(rawTarget);

            if (!Number.isFinite(target) || target < 0) {
                return;
            }

            const prefix = element.dataset.prefix || "";

            // Respect a suffix that is explicitly supplied.
            // Otherwise, preserve a simple suffix such as "+".
            const existingText = element.textContent.trim();
            const detectedSuffix =
                existingText.match(/[+%]+$/)?.[0] || "";

            const suffix =
                element.dataset.suffix ?? detectedSuffix;

            const decimalPlaces = Number.isInteger(target) ? 0 : 1;
            const duration = 1600;
            const startTime = performance.now();

            element.textContent = `${prefix}0${suffix}`;

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out for a natural finish.
                const easedProgress = 1 - Math.pow(1 - progress, 3);
                const currentValue = target * easedProgress;

                const formattedValue = currentValue.toLocaleString(
                    undefined,
                    {
                        minimumFractionDigits: decimalPlaces,
                        maximumFractionDigits: decimalPlaces
                    }
                );

                element.textContent =
                    `${prefix}${formattedValue}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    const finalValue = target.toLocaleString(
                        undefined,
                        {
                            minimumFractionDigits: decimalPlaces,
                            maximumFractionDigits: decimalPlaces
                        }
                    );

                    element.textContent =
                        `${prefix}${finalValue}${suffix}`;
                }
            }

            if (prefersReducedMotion) {
                const formattedTarget = target.toLocaleString();

                element.textContent =
                    `${prefix}${formattedTarget}${suffix}`;

                return;
            }

            requestAnimationFrame(updateCounter);
        }

        if (!("IntersectionObserver" in window)) {
            counters.forEach(animateCounter);
            return;
        }

        const observer = new IntersectionObserver(
            (entries, currentObserver) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    animateCounter(entry.target);
                    currentObserver.unobserve(entry.target);
                });
            },
            { threshold: 0.5 }
        );

        counters.forEach((counter) => {
            observer.observe(counter);
        });
    }


    // --------------------------------------------------------
    // 7. HERO TYPING EFFECT
    //
    // Example:
    // <span class="typing-text"
    //       data-typing-words="Ignite growth|Build what's next">
    // </span>
    //
    // Separate phrases with the | character.
    // --------------------------------------------------------

    function initializeTypingEffect() {
        const typingElements = document.querySelectorAll(
            "[data-typing-words]"
        );

        typingElements.forEach((element) => {
            const words = element.dataset.typingWords
                .split("|")
                .map((word) => word.trim())
                .filter(Boolean);

            if (words.length === 0) {
                return;
            }

            if (prefersReducedMotion) {
                element.textContent = words[0];
                return;
            }

            let wordIndex = 0;
            let characterIndex = 0;
            let isDeleting = false;
            let timeoutId = null;

            const typeSpeed = Number(element.dataset.typeSpeed) || 90;
            const deleteSpeed =
                Number(element.dataset.deleteSpeed) || 45;
            const pauseAfterWord =
                Number(element.dataset.wordPause) || 1200;
            const pauseBetweenWords = 350;

            function typeNextCharacter() {
                // Stop scheduling new work when the element disappears
                // from the document.
                if (!element.isConnected) {
                    window.clearTimeout(timeoutId);
                    return;
                }

                const currentWord = words[wordIndex];

                if (!isDeleting) {
                    characterIndex += 1;

                    element.textContent = currentWord.slice(
                        0,
                        characterIndex
                    );

                    if (characterIndex >= currentWord.length) {
                        isDeleting = true;

                        timeoutId = window.setTimeout(
                            typeNextCharacter,
                            pauseAfterWord
                        );

                        return;
                    }
                } else {
                    characterIndex -= 1;

                    element.textContent = currentWord.slice(
                        0,
                        characterIndex
                    );

                    if (characterIndex <= 0) {
                        isDeleting = false;
                        wordIndex = (wordIndex + 1) % words.length;

                        timeoutId = window.setTimeout(
                            typeNextCharacter,
                            pauseBetweenWords
                        );

                        return;
                    }
                }

                const speed = isDeleting ? deleteSpeed : typeSpeed;

                timeoutId = window.setTimeout(
                    typeNextCharacter,
                    speed
                );
            }

            timeoutId = window.setTimeout(
                typeNextCharacter,
                500
            );
        });
    }


    // --------------------------------------------------------
    // 8. IMAGE GALLERY AND LIGHTBOX
    //
    // Gallery cards should use the class .gallery-card.
    // Each card can contain an image and a .gallery-title.
    //
    // Optional:
    // data-image="assets/demo1.jpg"
    // data-title="Website Demo"
    //
    // The lightbox is generated automatically if the HTML
    // does not already contain a .lightbox element.
    // --------------------------------------------------------

    function initializeGallery() {
        const galleryCards = document.querySelectorAll(".gallery-card");

        if (galleryCards.length === 0) {
            return;
        }

        const lightbox = getOrCreateLightbox();

        const lightboxImage = lightbox.querySelector(".lightbox-image");
        const lightboxCaption = lightbox.querySelector(".lightbox-caption");
        const lightboxClose = lightbox.querySelector(".lightbox-close");

        let previousBodyOverflow = "";

        function openLightbox(imageSource, title, altText) {
            if (!imageSource) {
                return;
            }

            lightboxImage.src = imageSource;
            lightboxImage.alt = altText || title || "Gallery image";
            lightboxCaption.textContent = title || "";

            lightbox.classList.add("is-open");
            lightbox.setAttribute("aria-hidden", "false");

            previousBodyOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";

            if (lightboxClose) {
                lightboxClose.focus();
            }
        }

        function closeLightbox() {
            lightbox.classList.remove("is-open");
            lightbox.setAttribute("aria-hidden", "true");

            document.body.style.overflow = previousBodyOverflow;

            // Clear the source after the closing transition.
            window.setTimeout(() => {
                if (!lightbox.classList.contains("is-open")) {
                    lightboxImage.removeAttribute("src");
                }
            }, prefersReducedMotion ? 0 : 300);
        }

        galleryCards.forEach((card) => {
            card.addEventListener("click", (event) => {
                const embeddedImage = card.querySelector("img");

                const imageSource =
                    card.dataset.image ||
                    embeddedImage?.currentSrc ||
                    embeddedImage?.getAttribute("src") ||
                    "";

                const title =
                    card.dataset.title ||
                    card.querySelector(".gallery-title")?.textContent.trim() ||
                    embeddedImage?.alt ||
                    "CATALYST project";

                const altText =
                    card.dataset.alt ||
                    embeddedImage?.alt ||
                    title;

                if (!imageSource) {
                    return;
                }

                // If a gallery card is an anchor, stop it opening
                // the image file as a new page.
                event.preventDefault();

                openLightbox(imageSource, title, altText);
            });
        });

        if (lightboxClose) {
            lightboxClose.addEventListener("click", closeLightbox);
        }

        // Close only when the dark backdrop itself is clicked.
        lightbox.addEventListener("click", (event) => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (
                event.key === "Escape" &&
                lightbox.classList.contains("is-open")
            ) {
                closeLightbox();
            }
        });
    }


    // Create a usable lightbox if the HTML has not supplied one.
    function getOrCreateLightbox() {
        let lightbox = document.querySelector(".lightbox");

        if (lightbox) {
            // If an existing lightbox is missing required pieces,
            // leave it untouched rather than creating duplicates.
            const hasRequiredContent =
                lightbox.querySelector(".lightbox-image") &&
                lightbox.querySelector(".lightbox-caption");

            if (hasRequiredContent) {
                return lightbox;
            }
        }

        lightbox = document.createElement("div");
        lightbox.className = "lightbox";
        lightbox.setAttribute("aria-hidden", "true");

        const content = document.createElement("div");
        content.className = "lightbox-content";
        content.setAttribute("role", "dialog");
        content.setAttribute("aria-modal", "true");
        content.setAttribute("aria-label", "Project image preview");

        const closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.className = "lightbox-close";
        closeButton.setAttribute("aria-label", "Close image preview");
        closeButton.textContent = "×";

        const image = document.createElement("img");
        image.className = "lightbox-image";
        image.alt = "";

        const caption = document.createElement("p");
        caption.className = "lightbox-caption";

        content.append(closeButton, image, caption);
        lightbox.append(content);
        document.body.append(lightbox);

        return lightbox;
    }


    // --------------------------------------------------------
    // 9. CONTACT FORM TO WHATSAPP
    //
    // The HTML form should have:
    // id="contact-form"
    //
    // Input name attributes:
    // name="name"
    // name="email"
    // name="service"
    // name="message"
    //
    // Optional status element:
    // <p class="form-status" data-form-status></p>
    //
    // The form does not send data to a server. It opens a
    // pre-filled WhatsApp message for the visitor to send.
    // --------------------------------------------------------

    function initializeContactForm() {
        const form = document.querySelector(
            "#contact-form, [data-contact-form]"
        );

        if (!form) {
            return;
        }

        function showFormStatus(message, isError = false) {
            let status = form.querySelector(
                "[data-form-status], .form-status"
            );

            if (!status) {
                status = document.createElement("p");
                status.className = "form-status";
                status.setAttribute("data-form-status", "");
                form.append(status);
            }

            status.textContent = message;
            status.setAttribute(
                "role",
                isError ? "alert" : "status"
            );
        }

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            // Browser-native required-field and email validation
            // should run before this submit handler is triggered.
            const formData = new FormData(form);

            const name = String(formData.get("name") || "").trim();
            const email = String(formData.get("email") || "").trim();
            const service = String(formData.get("service") || "").trim();
            const message = String(formData.get("message") || "").trim();

            if (!name || !email || !message) {
                showFormStatus(
                    "Please complete your name, email and message.",
                    true
                );

                return;
            }

            if (!/^\d{8,15}$/.test(WHATSAPP_NUMBER)) {
                showFormStatus(
                    "The contact form is almost ready. The website owner must replace WHATSAPP_NUMBER in js/script.js with a real WhatsApp number, including the country code and digits only.",
                    true
                );

                return;
            }

            const inquiryLines = [
                "Hello CATALYST! I'd like to make an inquiry.",
                "",
                `Name: ${name}`,
                `Email: ${email}`,
                `Service: ${service || "Not specified"}`,
                "",
                "Message:",
                message
            ];

            const encodedMessage = encodeURIComponent(
                inquiryLines.join("\n")
            );

            const whatsappURL =
                `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

            showFormStatus(
                "Opening WhatsApp with your inquiry. Please review the message and press Send in WhatsApp."
            );

            // Open only as a direct result of the visitor's submit.
            // The visitor must still press Send in WhatsApp.
            const whatsappWindow = window.open(
                whatsappURL,
                "_blank",
                "noopener,noreferrer"
            );

            // If the browser blocks pop-ups, display a clear fallback.
            if (!whatsappWindow) {
                showFormStatus(
                    "Your browser blocked the WhatsApp window. Please allow pop-ups for this page or use the WhatsApp contact button.",
                    true
                );
            }
        });
    }


    // --------------------------------------------------------
    // 10. WHATSAPP CONTACT LINKS
    //
    // Add data-whatsapp-link to a link that should open WhatsApp.
    // Add data-whatsapp-message="Your message" for prefilled text.
    //
    // The real number is configured at the top of this file.
    // --------------------------------------------------------

    function initializeWhatsAppLinks() {
        const whatsappLinks = document.querySelectorAll(
            "[data-whatsapp-link], .whatsapp-link"
        );

        whatsappLinks.forEach((link) => {
            if (!/^\d{8,15}$/.test(WHATSAPP_NUMBER)) {
                // Do not silently create a broken WhatsApp URL.
                return;
            }

            const customMessage =
                link.dataset.whatsappMessage ||
                "Hello CATALYST! I'd like to know more about your services.";

            link.href =
                `https://wa.me/${WHATSAPP_NUMBER}?text=` +
                encodeURIComponent(customMessage);

            link.target = "_blank";
            link.rel = "noopener noreferrer";
        });
    }


    // --------------------------------------------------------
    // 11. SMOOTH PAGE TRANSITIONS
    //
    // Applies to links between local .html pages.
    // Does not intercept external websites or links containing
    // only an on-page section anchor.
    // --------------------------------------------------------

    function initializePageTransitions() {
        if (!ENABLE_PAGE_TRANSITIONS || prefersReducedMotion) {
            return;
        }

        const transitionOverlay = document.createElement("div");
        transitionOverlay.className = "page-transition-overlay";
        transitionOverlay.setAttribute("aria-hidden", "true");

        document.body.append(transitionOverlay);

        document.addEventListener("click", (event) => {
            if (
                event.defaultPrevented ||
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
            ) {
                return;
            }

            const link = event.target.closest("a[href]");

            if (!link) {
                return;
            }

            if (
                link.target === "_blank" ||
                link.hasAttribute("download") ||
                link.dataset.noTransition !== undefined
            ) {
                return;
            }

            const rawHref = link.getAttribute("href");

            if (
                !rawHref ||
                rawHref.startsWith("#") ||
                rawHref.startsWith("mailto:") ||
                rawHref.startsWith("tel:") ||
                rawHref.startsWith("javascript:")
            ) {
                return;
            }

            let destination;

            try {
                destination = new URL(rawHref, window.location.href);
            } catch {
                return;
            }

            if (destination.origin !== window.location.origin) {
                return;
            }

            // Only animate actual page navigation, not a different
            // anchor on the same page.
            if (
                destination.pathname === window.location.pathname &&
                destination.search === window.location.search
            ) {
                return;
            }

            event.preventDefault();

            transitionOverlay.classList.add("is-active");

            window.setTimeout(() => {
                window.location.href = destination.href;
            }, 220);
        });
    }


    // --------------------------------------------------------
    // 12. OPTIONAL DESKTOP CURSOR GLOW
    //
    // This is decorative only. It is disabled on touch devices
    // and when reduced motion is enabled.
    // --------------------------------------------------------

    function initializeCursorGlow() {
        if (
            !ENABLE_CURSOR_GLOW ||
            !hasFinePointer ||
            prefersReducedMotion
        ) {
            return;
        }

        const cursorGlow = document.createElement("div");
        cursorGlow.className = "cursor-glow";
        cursorGlow.setAttribute("aria-hidden", "true");

        document.body.append(cursorGlow);

        cursorGlow.style.opacity = "0";
        cursorGlow.style.transition = "opacity 200ms ease";

        document.addEventListener("pointermove", (event) => {
            cursorGlow.style.transform =
                `translate(${event.clientX}px, ${event.clientY}px) ` +
                "translate(-50%, -50%)";

            cursorGlow.style.opacity = "1";
        }, { passive: true });

        document.addEventListener("pointerleave", () => {
            cursorGlow.style.opacity = "0";
        });
    }


    // --------------------------------------------------------
    // 13. BUTTON RIPPLE EFFECT
    //
    // Adds a brief ripple when a visitor clicks a button or a
    // link styled as a button (.btn).
    // --------------------------------------------------------

    function initializeButtonRipples() {
        const buttons = document.querySelectorAll(
            ".btn, button.btn, .nav-cta"
        );

        if (buttons.length === 0 || prefersReducedMotion) {
            return;
        }

        // Add the ripple rules once.
        if (!document.getElementById("catalyst-ripple-styles")) {
            const style = document.createElement("style");
            style.id = "catalyst-ripple-styles";

            style.textContent = `
                .catalyst-ripple {
                    position: absolute;
                    z-index: 0;
                    width: 16px;
                    height: 16px;
                    margin: -8px 0 0 -8px;
                    border-radius: 50%;
                    pointer-events: none;
                    background: rgba(255, 255, 255, 0.38);
                    transform: scale(0);
                    animation: catalyst-ripple-animation 550ms ease-out forwards;
                }

                @keyframes catalyst-ripple-animation {
                    to {
                        transform: scale(18);
                        opacity: 0;
                    }
                }

                .btn > *,
                .nav-cta > * {
                    position: relative;
                    z-index: 1;
                }
            `;

            document.head.append(style);
        }

        buttons.forEach((button) => {
            // The CSS button style already uses overflow:hidden.
            // Make that requirement explicit for the ripple.
            if (getComputedStyle(button).position === "static") {
                button.style.position = "relative";
            }

            if (getComputedStyle(button).overflow === "visible") {
                button.style.overflow = "hidden";
            }

            button.addEventListener("click", (event) => {
                const rect = button.getBoundingClientRect();
                const ripple = document.createElement("span");

                ripple.className = "catalyst-ripple";
                ripple.setAttribute("aria-hidden", "true");

                ripple.style.left = `${event.clientX - rect.left}px`;
                ripple.style.top = `${event.clientY - rect.top}px`;

                button.append(ripple);

                ripple.addEventListener("animationend", () => {
                    ripple.remove();
                }, { once: true });

                // Safety cleanup if the animation event does not fire.
                window.setTimeout(() => {
                    ripple.remove();
                }, 750);
            });
        });
    }


    // --------------------------------------------------------
    // 14. EXTERNAL LINK SAFETY
    //
    // External links that open in a new tab should not have
    // access to the originating page through window.opener.
    // --------------------------------------------------------

    function initializeExternalLinks() {
        document.querySelectorAll('a[target="_blank"]').forEach((link) => {
            const relTokens = new Set(
                (link.getAttribute("rel") || "")
                    .split(/\s+/)
                    .filter(Boolean)
            );

            relTokens.add("noopener");
            relTokens.add("noreferrer");

            link.setAttribute(
                "rel",
                Array.from(relTokens).join(" ")
            );
        });
    }

})();
