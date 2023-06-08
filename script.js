// Loading and page transitions
const logoElements = document.querySelectorAll(".sf-logo-u-animation");
const loadingContainers = document.querySelectorAll(".loading");
const loadOutDuration = 1500;

function slideEffect(element, durationMS, slideType) {
    let initialMaxHeight = slideType === 'in' ? '0vh' : '300vh';
    let finalMaxHeight = slideType === 'in' ? '300vh' : '0vh';

    element.style.maxHeight = initialMaxHeight;
    element.style.transition = `max-height ${durationMS}ms ease-in-out`;
    element.style.maxHeight = finalMaxHeight;
}

function fadeEffect(element, durationMS, action) {
    // Use CSS transitions
    element.style.transition = `opacity ${durationMS}ms ease-in-out`;
    if (action === 'in') {
        element.style.opacity = '1';
    } else if (action === 'out') {
        element.style.opacity = '0';
    }
}

function callCalendly(event) {
    event.preventDefault();
    Calendly.initPopupWidget({ url: 'https://calendly.com/sflach/call?background_color=f3f4f5&text_color=252525&primary_color=b14c37' });
    return false;
}

// Fade Out Loading on Page Load
if (loadingContainers.length > 0) {
    let loadingOverlay = loadingContainers[0].querySelector(".loading-overlay");
    let loadingAnimation = loadingContainers[0].querySelector(".loading-animation");

    if (loadingOverlay && loadingAnimation) {
        setTimeout(() => {
            fadeEffect(loadingAnimation, 300, 'out');
            slideEffect(loadingOverlay, 500, 'out');
        }, loadOutDuration - 500);

        setTimeout(() => {
            loadingContainers[0].style.display = 'none'; // Hide container after sliding out and fading out children
        }, loadOutDuration);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Dynamic copyright year
    const thisYear = new Date().getFullYear();
    document.querySelector('.copyright-year').textContent = thisYear;

    // Close menu on link click
    const menuLink = document.querySelectorAll(".menu__link");
    const hamburguerMenu = document.querySelector(".hamburguer");
    menuLink.forEach(link => link.addEventListener('click', () => hamburguerMenu.click()));

    // Call Calendly
    const calendlyLinks = document.querySelectorAll(".calendly-link");
    calendlyLinks.forEach(link => link.addEventListener('click', callCalendly));

    // Fade In Loading on Page Transition
    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", function (e) {
            let isPageTransition = this.hostname === window.location.host &&
                this.getAttribute("href").indexOf("#") === -1 &&
                this.getAttribute("href").indexOf("_page=") === -1 &&
                this.getAttribute("target") !== "_blank" &&
                loadingContainers.length > 0;

            if (isPageTransition) {
                e.preventDefault();
                const transitionURL = this.getAttribute("href");

                if (loadingContainers[0]) {
                    let loadingOverlay = loadingContainers[0].querySelector(".loading-overlay");
                    let loadingAnimation = loadingContainers[0].querySelector(".loading-animation");

                    if (loadingOverlay && loadingAnimation) {
                        for (let i = 0; i < logoElements.length; i++) {
                            logoElements[i].style.animationPlayState = 'paused';
                        }

                        loadingContainers[0].style.display = 'block'; // Show container before sliding in and fading in children
                        setTimeout(() => {
                            slideEffect(loadingOverlay, 600, 'in');
                        }, 100);
                        setTimeout(() => {
                            fadeEffect(loadingAnimation, 400, 'in');
                        }, 600);

                        setTimeout(() => {
                            window.location = transitionURL;
                        }, loadOutDuration);
                    }
                }
            }
        });
    });

    // Reload Page on Back Button Tap
    window.addEventListener("pageshow", function (event) {
        if (event.persisted) {
            window.location.reload();
        }
    });

    // Fade Out Loading on Windows Resize
    setTimeout(() => {
        window.addEventListener("resize", () => {
            fadeEffect(loadingContainers[0], 500, 'out');
        });
    }, loadOutDuration);
});