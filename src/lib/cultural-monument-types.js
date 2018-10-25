
export class CulturalMonumentType
{
    constructor(value, title)
    {
        this._value = value;
        this._title = title;
    }

    getValue()
    {
        return this._value;
    }

    getTitle()
    {
        return this._title;
    }
}

export const culturalMonumentTypes = [
    new CulturalMonumentType('', ''),
    new CulturalMonumentType('architecture', 'памятник архитектуры'),
    new CulturalMonumentType('history', 'памятник истории'),
    new CulturalMonumentType('monument', 'памятник монументального искусства'),
    new CulturalMonumentType('archeology', 'памятник археологии')
];
