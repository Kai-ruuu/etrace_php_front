import { writable } from "svelte/store";

export const settings = writable({
    open: false,
    tab: "settings"
});