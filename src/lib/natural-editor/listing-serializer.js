
let ListingSerializer = require('../listing-serializer');

class NaturalEditorListingSerializer {
    serializeListingData(listingData) {
        let listingSerializer = new ListingSerializer('natural monument', listingData);
        listingSerializer.writeListingStart();
        listingSerializer.writeParametersLine(["type", "status"]);
        listingSerializer.writeParametersLine(["lat", "long", "precise"]);
        listingSerializer.writeParameterLine("name");
        listingSerializer.writeParameterLine("category", true);
        listingSerializer.writeParameterLine("knid");
        listingSerializer.writeParameterLine("complex", true);
        listingSerializer.writeParameterLine("uid", true);
        listingSerializer.writeParametersLine(["region", "district"]);
        listingSerializer.writeParametersLine(["municipality", "munid"]);
        listingSerializer.writeParameterLine("block", true);
        listingSerializer.writeParameterLine("address");
        listingSerializer.writeParameterLine("year", true);
        listingSerializer.writeParameterLine("author", true);
        listingSerializer.writeParameterLine("area", true);
        listingSerializer.writeParameterLine("description");
        listingSerializer.writeParameterLine("image");
        listingSerializer.writeParameterLine("wdid");
        listingSerializer.writeParameterLine("wiki");
        listingSerializer.writeParameterLine("commonscat");
        listingSerializer.writeParameterLine("link");
        listingSerializer.writeParameterLine("linkextra", true);
        listingSerializer.writeParameterLine("document", true);
        listingSerializer.writeOtherNonEmptyParameters();
        listingSerializer.writeListingEnd();
        return listingSerializer.getSerializedListing();
    }
}