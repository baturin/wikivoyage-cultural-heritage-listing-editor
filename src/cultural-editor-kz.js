import CulturalEditorKZListingSerializer from './lib/cultural-editor-kz/listing-serializer';
import CulturalHeritageKZEditorForm from './lib/cultural-editor-kz/editor-form';
import initListingEditor from './lib/init-listing-editor';

function culturalHeritageKZEditorMain() {
    let helpPageUrl = "https://ru.wikivoyage.org/wiki/%D0%9E%D0%B1%D1%81%D1%83%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5:%D0%9A%D1%83%D0%BB%D1%8C%D1%82%D1%83%D1%80%D0%BD%D0%BE%D0%B5_%D0%BD%D0%B0%D1%81%D0%BB%D0%B5%D0%B4%D0%B8%D0%B5_%D0%9A%D0%B0%D0%B7%D0%B0%D1%85%D1%81%D1%82%D0%B0%D0%BD%D0%B0";

    initListingEditor({
        listingPageNamespace: 'Культурное_наследие_Казахстана',
        formClass: CulturalHeritageKZEditorForm,
        listingSerializerClass: CulturalEditorKZListingSerializer,
        listingTemplateName: "monument kz",
        helpPageUrl: helpPageUrl
    })
}

culturalHeritageKZEditorMain();

