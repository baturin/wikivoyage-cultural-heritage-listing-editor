import NaturalEditorListingSerializer from './lib/natural-editor/listing-serializer';
import NaturalHeritageEditorForm from './lib/natural-editor/editor-form';
import initListingEditor from './lib/init-listing-editor';

function naturalHeritageEditorMain() {
    let helpPageUrl = "https://ru.wikivoyage.org/wiki/%D0%9F%D1%80%D0%B8%D1%80%D0%BE%D0%B4%D0%BD%D1%8B%D0%B5_%D0%BF%D0%B0%D0%BC%D1%8F%D1%82%D0%BD%D0%B8%D0%BA%D0%B8_%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B8";

    initListingEditor({
        listingPageNamespace: 'Природные_памятники_России',
        formClass: NaturalHeritageEditorForm,
        listingSerializerClass: NaturalEditorListingSerializer,
        listingTemplateName: "natural monument",
        helpPageUrl: helpPageUrl
    })
}

naturalHeritageEditorMain();

