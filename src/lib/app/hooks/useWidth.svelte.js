import { browser } from '$app/environment';

export function useWidth() {
    let width = $state(browser ? window.innerWidth : 0);

    if (browser) {
        function onResize() {
            width = window.innerWidth;
        }

        window.addEventListener("resize", onResize);
    }

    return {
        get width() {
            return width;
        },
        get isMobile() {
            return width < 768;
        }
    };
}