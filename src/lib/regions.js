
class Region {
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

let regions = [
    new Region("", "не задан"),
    new Region("ru-ad", "Адыгея"),
    new Region("ru-ba", "Башкортостан"),
    new Region("ru-bu", "Бурятия"),
    new Region("ru-al", "Алтай"),
    new Region("ru-da", "Дагестан"),
    new Region("ru-in", "Ингушетия"),
    new Region("ru-kb", "Кабардино-Балкария"),
    new Region("ru-kl", "Калмыкия"),
    new Region("ru-kc", "Карачаево-Черкесия"),
    new Region("ru-krl", "Карелия"),
    new Region("ru-ko", "республика Коми"),
    new Region("ru-me", "Марий Эл"),
    new Region("ru-mo", "Мордовия"),
    new Region("ru-sa", "Якутия (Саха)"),
    new Region("ru-se", "Северная Осетия"),
    new Region("ru-ta", "Татарстан"),
    new Region("ru-ty", "Тува"),
    new Region("ru-ud", "Удмуртия"),
    new Region("ru-kk", "Хакасия"),
    new Region("ru-ce", "Чеченская республика"),
    new Region("ru-chv", "Чувашия"),
    new Region("ru-alt", "Алтайский край"),
    new Region("ru-kda", "Краснодарский край"),
    new Region("ru-kya", "Красноярский край"),
    new Region("ru-pri", "Приморский край"),
    new Region("ru-sta", "Ставропольский край"),
    new Region("ru-kha", "Хабаровский край"),
    new Region("ru-amu", "Амурская область"),
    new Region("ru-ark", "Архангельская область"),
    new Region("ru-ast", "Астраханская область"),
    new Region("ru-bel", "Белгородская область"),
    new Region("ru-bry", "Брянская область"),
    new Region("ru-vla", "Владимирская область"),
    new Region("ru-vgg", "Волгоградская область"),
    new Region("ru-vol", "Вологодская область"),
    new Region("ru-vor", "Воронежская область"),
    new Region("ru-iva", "Ивановская область"),
    new Region("ru-irk", "Иркутская область"),
    new Region("ru-kal", "Калининградская область"),
    new Region("ru-klu", "Калужская область"),
    new Region("ru-kam", "Камчатский край"),
    new Region("ru-kem", "Кемеровская область"),
    new Region("ru-kir", "Кировская область"),
    new Region("ru-kos", "Костромская область"),
    new Region("ru-kgn", "Курганская область"),
    new Region("ru-krs", "Курская область"),
    new Region("ru-len", "Ленинградская область"),
    new Region("ru-lip", "Липецкая область"),
    new Region("ru-mag", "Магаданская область"),
    new Region("ru-mos", "Московская область"),
    new Region("ru-mur", "Мурманская область"),
    new Region("ru-niz", "Нижегородская область"),
    new Region("ru-ngr", "Новгородская область"),
    new Region("ru-nvs", "Новосибирская область"),
    new Region("ru-oms", "Омская область"),
    new Region("ru-ore", "Оренбургская область"),
    new Region("ru-orl", "Орловская область"),
    new Region("ru-pnz", "Пензенская область"),
    new Region("ru-per", "Пермский край"),
    new Region("ru-psk", "Псковская область"),
    new Region("ru-ros", "Ростовская область"),
    new Region("ru-rya", "Рязанская область"),
    new Region("ru-sam", "Самарская область"),
    new Region("ru-sar", "Саратовская область"),
    new Region("ru-sak", "Сахалинская область"),
    new Region("ru-sve", "Свердловская область"),
    new Region("ru-smo", "Смоленская область"),
    new Region("ru-tam", "Тамбовская область"),
    new Region("ru-tve", "Тверская область"),
    new Region("ru-tom", "Томская область"),
    new Region("ru-tul", "Тульская область"),
    new Region("ru-tyu", "Тюменская область"),
    new Region("ru-uly", "Ульяновская область"),
    new Region("ru-che", "Челябинская область"),
    new Region("ru-zab", "Забайкальский край"),
    new Region("ru-yar", "Ярославская область"),
    new Region("ru-mow", "Москва"),
    new Region("ru-spb", "Санкт-Петербург"),
    new Region("ru-jew", "Еврейская автономная область"),
    new Region("ru-km", "Крым"),
    new Region("ru-nen", "Ненецкий автономный округ"),
    new Region("ru-khm", "Ханты-Мансийский автономный округ"),
    new Region("ru-chu", "Чукотский автономный округ"),
    new Region("ru-yam", "Ямало-Ненецкий автономный округ"),
    new Region("ru-sev", "Севастополь")
];

module.exports = regions;
