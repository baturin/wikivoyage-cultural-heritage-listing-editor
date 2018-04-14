let assert = require('assert');
let ListingSerializer = require('../src/lib/listing-serializer');

describe('ListingSerializer', function() {
    it('serialize listing', function() {
        let listingData = {
            param1: 'val1',
            param2: 'val2',
            param3: 'val3',
            otherparam1: 'otherval1',
            otherparam2: 'otherval2'
        };
        let expectedListingText = (
            "{{mylisting\n" +
            "|param1=val1\n" +
            "|param2=val2 |param3=val3\n" +
            "|otherparam1=otherval1\n" +
            "|otherparam2=otherval2\n" +
            "}}"
        );
        let listingSerializer = new ListingSerializer('mylisting', listingData);
        listingSerializer.writeListingStart(true);
        listingSerializer.writeParameterLine("param1");
        listingSerializer.writeParametersLine(["param2", "param3"]);
        listingSerializer.writeOtherNonEmptyParameters();
        listingSerializer.writeListingEnd();
        let listingText = listingSerializer.getSerializedListing();
        assert.equal(listingText, expectedListingText);
    });
});
