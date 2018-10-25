
export const ListingItemIcons = {
    THUMBS_URL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/',

    createComplexMainElementIcon() {
        return $('<img>').attr({
            'src': ListingItemIcons.THUMBS_URL + '8/8c/Location_dot_darkslategray.svg/10px-Location_dot_darkslategray.svg.png',
            'alt': 'главный элемент комплекса',
            'width': '10px',
            'height': '10px',
        });
    },

    createMunidIcon() {
        return $('<img>').attr({
            'src': ListingItemIcons.THUMBS_URL + 'f/ff/Wikidata-logo.svg/18px-Wikidata-logo.svg.png',
            'alt': 'район на Викиданных',
            'width': '18px',
            'height': '10px'
        });
    },

    createMapIcon() {
        return $('<img>').attr({
            'src': ListingItemIcons.THUMBS_URL + 'c/ce/Map_mag.png/17px-Map_mag.png',
            'alt': 'Расположение на карте',
            'width': '17px',
            'height': '17px'
        });
    },

    createWikipediaIcon() {
        return $('<img>').attr({
            'src': ListingItemIcons.THUMBS_URL + '8/80/Wikipedia-logo-v2.svg/19px-Wikipedia-logo-v2.svg.png',
            'alt': 'Расположение на карте',
            'width': '19px',
            'height': '17px'
        });
    },

    createCommonsIcon() {
        return $('<img>').attr({
            'src': ListingItemIcons.THUMBS_URL + '4/4a/Commons-logo.svg/17px-Commons-logo.svg.png',
            'alt': 'Расположение на карте',
            'width': '17px',
            'height': '23px'
        });
    },

    createWikidataIcon() {
        return $('<img>').attr({
            'src': ListingItemIcons.THUMBS_URL + 'f/ff/Wikidata-logo.svg/24px-Wikidata-logo.svg.png',
            'alt': 'Расположение на карте',
            'width': '24px',
            'height': '13px'
        });
    },

    MonumentType: {
        createArchitectureIcon() {
            return $('<img>').attr({
                'src': ListingItemIcons.THUMBS_URL + 'c/cc/PorticoIcon.svg/20px-PorticoIcon.svg.png',
                'alt': 'памятник архитектуры',
                'width': '20px',
                'height': '20px'
            });
        },

        createHistoryIcon() {
            return $('<img>').attr({
                'src': ListingItemIcons.THUMBS_URL + 'c/c8/HistoryIcon.svg/18px-HistoryIcon.svg.png',
                'alt': 'памятник истории',
                'width': '18px',
                'height': '18px',
            });
        },

        createArcheologyIcon() {
            return $('<img>').attr({
                'src': ListingItemIcons.THUMBS_URL + 'c/ce/ArcheologyIcon.svg/22px-ArcheologyIcon.svg.png',
                'alt': 'памятник археологии',
                'width': '22px',
                'height': '22px',
            });
        },

        createMonumentIcon() {
            return $('<img>').attr({
                'src': ListingItemIcons.THUMBS_URL + 'c/c2/MonumentIcon.svg/20px-MonumentIcon.svg.png',
                'alt': 'памятник монументального искусства',
                'width': '20px',
                'height': '20px'
            })
        }
    }
};