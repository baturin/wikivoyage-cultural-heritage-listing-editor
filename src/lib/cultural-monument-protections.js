
export class CulturalMonumentProtection
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

export const culturalMonumentProtections = [
    new CulturalMonumentProtection('', ''),
    new CulturalMonumentProtection('Ф', 'федеральная'),
    new CulturalMonumentProtection('Р', 'региональная'),
    new CulturalMonumentProtection('М', 'местная'),
    new CulturalMonumentProtection('В', 'выявленный объект')
];
