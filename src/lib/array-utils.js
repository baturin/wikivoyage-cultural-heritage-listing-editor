
export const ArrayUtils = {
    hasElement(array, element) {
        return array.indexOf(element) >= 0;
    },

    inArray(element, array) {
        return this.hasElement(array, element);
    },

    diff(array1, array2) {
        return array1.filter((item) => !this.inArray(item, array2))
    },

    consistsOnlyOf(array, items) {
        const arrayUnique = this.unique(array);
        const itemsUnique = this.unique(items);
        arrayUnique.sort();
        itemsUnique.sort();
        for (let i = 0; i < arrayUnique.length; i++) {
            if (!this.inArray(arrayUnique[i], itemsUnique[i])) {
                return false;
            }
        }
        return true;
    },

    unique(array) {
        return array.filter((value, index) => array.indexOf(value) === index)
    }
};
