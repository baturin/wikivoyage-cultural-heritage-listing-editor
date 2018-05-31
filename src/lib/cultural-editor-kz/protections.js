
class Protection
{
    constructor(value, title)
    {
        this._value = value;
        this._title = title;
    }

    getTitle()
    {
        return this._title;
    }

    getValue()
    {
        return this._value;
    }
}

let protections = [
    new Protection('', ''),
    new Protection('Р', 'республиканского значения'),
    new Protection('М', 'местного значения'),
    new Protection('В', 'выявленный')
];

module.exports = protections;