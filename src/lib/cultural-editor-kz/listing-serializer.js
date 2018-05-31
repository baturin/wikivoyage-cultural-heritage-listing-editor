
let ListingSerializer = require('../listing-serializer');

class CulturalEditorKZListingSerializer {
    serializeListingData(listingData) {
        let listingSerializer = new ListingSerializer('monument kz', listingData);
        listingSerializer.writeListingStart();
        listingSerializer.writeParametersLine(["type", "status"]);
        listingSerializer.writeParametersLine(["lat", "long", "precise"]);
        listingSerializer.writeParameterLine("name");
        listingSerializer.writeParameterLine("knid");
        listingSerializer.writeParameterLine("complex", true);
        listingSerializer.writeParametersLine(["region", "district"]);
        listingSerializer.writeParametersLine(["municipality", "munid"]);
        listingSerializer.writeParameterLine("block", true);
        listingSerializer.writeParameterLine("address");
        listingSerializer.writeParametersLine(["year", "author"]);
        listingSerializer.writeParameterLine("style", true);
        listingSerializer.writeParameterLine("description");
        listingSerializer.writeParameterLine("image");
        listingSerializer.writeParameterLine("wdid");
        listingSerializer.writeParameterLine("wiki");
        listingSerializer.writeParameterLine("commonscat");
        listingSerializer.writeParameterLine("link");
        listingSerializer.writeParameterLine("linkextra", true);
        listingSerializer.writeParameterLine("document", true);
        listingSerializer.writeParameterLine("doc", true);
        listingSerializer.writeParameterLine("style", true);
        listingSerializer.writeParameterLine("protection", true);
        listingSerializer.writeParameterLine("dismissed", true);
        listingSerializer.writeOtherNonEmptyParameters();
        listingSerializer.writeListingEnd();
        return listingSerializer.getSerializedListing();
    }
}

module.exports = CulturalEditorKZListingSerializer;