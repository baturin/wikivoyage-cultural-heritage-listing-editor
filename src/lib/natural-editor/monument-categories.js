
class NaturalMonumentCategory {
    constructor(id, title) {
        this._id = id;
        this._title = title;
    }

    getId() {
        return this._id;
    }

    getTitle() {
        return this._title;
    }
}

let naturalMonumentCategories = [
    new NaturalMonumentCategory('', 'не задано'),
    new NaturalMonumentCategory('federal', 'федерального значения'),
    new NaturalMonumentCategory('regional', 'регионального значения'),
    new NaturalMonumentCategory('municipal', 'местного значения'),
    new NaturalMonumentCategory('new', 'выявленный памятник'),
];

module.exports = naturalMonumentCategories;