
let ObjectUtils = {
    merge(obj1, obj2)
    {
        let result = {};
        for (let prop in obj1) {
            if (obj1.hasOwnProperty(prop)) {
                result[prop] = obj1[prop];
            }
        }
        for (let prop in obj2) {
            if (obj2.hasOwnProperty(prop)) {
                result[prop] = obj2[prop];
            }
        }
        return result;
    }
};

module.exports = ObjectUtils;