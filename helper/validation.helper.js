/**
 * A method to easily check for valid numbers
 * @param {*} amount 
 * @param {*} min 
 * @param {*} max 
 * @returns `boolean` if it is outside of the scope or an invalid number
 */
export function invalidNumber(amount, min, max) {
    if (!(!isNaN(amount) && !isNaN(parseFloat(amount)))) {
        return true
    }
    if (amount > max) {
        return true
    }
    if (amount < min) {
        return true;
    }
    return false;
}