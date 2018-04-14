
class NaturalMonumentType {
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

let naturalMonumentTypes = [
    new NaturalMonumentType('', 'не задано'),
    new NaturalMonumentType('sanctuary', 'заказник'),
    new NaturalMonumentType('reserve', 'заповедник'),
    new NaturalMonumentType('park', 'природный/национальный парк'),
    new NaturalMonumentType('arboretum', 'ботанический сад'),
    new NaturalMonumentType('garden', 'памятник садово-паркового искусства'),
    new NaturalMonumentType('nature', 'памятник природы')
];

module.exports = naturalMonumentTypes;