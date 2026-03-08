export function highlight(text, query) {
    if (!query.trim() || !query) {
        return text;
    }

    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');

    return text.replace(regex, '<span class="font-bold">$1</span>');
}

export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function capitalizeWords(str) {
    return String(str).split(" ").map(capitalize).join(" ");
}