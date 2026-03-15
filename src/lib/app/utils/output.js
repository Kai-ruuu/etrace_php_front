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

export function highlightMatch(rowValue, profileValue) {
    if (!rowValue || !profileValue) return rowValue ?? "";

    const profileWords = String(profileValue).toLowerCase().split(" ").filter(Boolean);
    const rowWords = String(rowValue).split(" ").filter(Boolean);

    return rowWords.map(word => {
        const isMatch = profileWords.includes(word.toLowerCase());
        return isMatch ? `<span class="text-green-500">${word}</span>` : word;
    }).join(" ");
}