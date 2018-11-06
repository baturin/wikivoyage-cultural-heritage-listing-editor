
export const ArrayUtils = {
    hasElement(array, element) {
        return array.indexOf(element) >= 0;
    },

    inArray(element, array) {
        return this.hasElement(array, element);
    }
};
