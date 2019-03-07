
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
    new NaturalMonumentType('reserve', 'заповедник'),
    new NaturalMonumentType('sanctuary', 'заказник'),
    new NaturalMonumentType('resource reserve', 'ресурсный резерват'),
    new NaturalMonumentType('arboretum', 'ботанический сад / дендрарий'),
    new NaturalMonumentType('national park', 'национальный парк'),
    new NaturalMonumentType('nature park', 'природный парк'),
    new NaturalMonumentType('city park', 'городской парк'),
    new NaturalMonumentType('garden', 'памятник садово-паркового искусства'),
    new NaturalMonumentType('traditional', 'территории традиционного природопользования'),
    new NaturalMonumentType('resort', 'рекреационная местность / курорт'),
    new NaturalMonumentType('nature', 'памятник природы'),
    new NaturalMonumentType('general', 'другое'),
];

module.exports = naturalMonumentTypes;