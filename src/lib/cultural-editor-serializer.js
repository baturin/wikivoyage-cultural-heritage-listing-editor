
import { ListingSerializer } from './listing-serializer';

export const CulturalEditorListingSerializer = {
    serializeListingData(listingData) {
        let serializer = new ListingSerializer('monument', listingData);
        serializer.writeListingStart();
        serializer.writeParametersLine(['type', 'status']);
        serializer.writeParametersLine(['lat', 'long', 'precise']);
        serializer.writeParameterLine('name');
        serializer.writeParametersLine(['knid', 'complex'], ['complex']);
        serializer.writeParameterLine('knid-new');
        serializer.writeParametersLine(['region', 'district']);
        serializer.writeParametersLine(['municipality', 'munid']);
        serializer.writeParameterLine('block', true);
        serializer.writeParameterLine('address');
        serializer.writeParametersLine(['year', 'author']);
        serializer.writeParameterLine('style', true);
        serializer.writeParameterLine('description');
        serializer.writeParameterLine('image');
        serializer.writeParameterLine('wdid');
        serializer.writeParameterLine('wiki');
        serializer.writeParametersLine(['commonscat', 'protection'], ['protection']);
        serializer.writeParameterLine('link');
        serializer.writeParameterLine('linkextra', true);
        serializer.writeParameterLine('document', true);
        serializer.writeParameterLine('doc', true);
        serializer.writeParameterLine('style', true);
        serializer.writeParameterLine('protection', true);
        serializer.writeParameterLine('dismissed', true);
        serializer.writeOtherNonEmptyParameters();
        serializer.writeListingEnd();
        return serializer.getSerializedListing();
    }
};
