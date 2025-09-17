/**
 * Used to capitalize the first letter of a string.
 * @param {*} val 
 * @param {*} lowerTheRest - whether to force the rest to be lowered
 * @returns 
 */
export function capitalizeFirstLetter(val, lowerTheRest = false) {
    if (lowerTheRest) val = val.toLowerCase();
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

/**
 * Capitalizes the first letter of every word in the string.
 * @param {*} str 
 * @param {*} lowerTheRest - whether to force the rest to be lowered
 * @returns 
 */
export function capitalizeWords(str, lowerTheRest = false) {
    if (lowerTheRest) str = str.toLowerCase();
    return String(str)
        .split(" ")
        .map(word => capitalizeFirstLetter(word))
        .join(" ");
}

