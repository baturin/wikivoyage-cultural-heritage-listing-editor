
class CulturalMonumentStyle
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

let culturalMonumentStyles = [
    new CulturalMonumentStyle('', ''),
    new CulturalMonumentStyle('конструктивизм', 'конструктивизм'),
    new CulturalMonumentStyle('модерн', 'модерн')
];

module.exports = culturalMonumentStyles;