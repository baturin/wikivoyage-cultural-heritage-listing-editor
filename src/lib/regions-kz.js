
class RegionKz {
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

let regionsKz = [
    new RegionKz("", "не задан"),
    new RegionKz("kz-ala", "Алматы"),
    new RegionKz("kz-ast", "Астана"),
    new RegionKz("kz-alm", "Алматинская область"),
    new RegionKz("kz-akm", "Акмолинская область"),
    new RegionKz("kz-akt", "Актюбинская область"),
    new RegionKz("kz-aty", "Атырауская область"),
    new RegionKz("kz-vos", "Восточно-Казахстанская область"),
    new RegionKz("kz-zha", "Жамбылская область"),
    new RegionKz("kz-zap", "Западно-Казахстанская область"),
    new RegionKz("kz-kar", "Карагандинская область"),
    new RegionKz("kz-kus", "Костанайская область"),
    new RegionKz("kz-kzy", "Кызылординская область"),
    new RegionKz("kz-man", "Мангистауская область"),
    new RegionKz("kz-pav", "Павлодарская область"),
    new RegionKz("kz-sev", "Северо-Казахстанская область"),
    new RegionKz("kz-yuz", "Южно-Казахстанская область")
];

module.exports = regionsKz;
