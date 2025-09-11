export const hbsHelpers = {
    eq: (a, b) => a === b,
    array: function () {
        return Array.prototype.slice.call(arguments, 0, -1);
    }
};
