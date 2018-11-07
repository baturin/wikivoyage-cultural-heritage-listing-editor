
export const ArrayUtils = {
    hasElement(array, element) {
        return array.indexOf(element) >= 0;
    },

    inArray(element, array) {
        return this.hasElement(array, element);
    },

    diff(array1, array2) {
        return array1.filter((item) => !this.inArray(item, array2))
    }
};
