
class NaturalMonumentStatus {
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

let naturalMonumentStatuses = [
    new NaturalMonumentStatus('', 'актуальный'),
    new NaturalMonumentStatus('destroyed', 'утрачен'),
    new NaturalMonumentStatus('rejected', 'предложенный, не созданный'),
    new NaturalMonumentStatus('reorganized', 'реорганизованный'),
    new NaturalMonumentStatus('perspective', 'перспективный')
];

module.exports = naturalMonumentStatuses;