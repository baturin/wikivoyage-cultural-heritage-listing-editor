let assert = require('assert');

import { ListingSerializer } from "../src/lib/listing-serializer";

describe('ListingSerializer', () => {
    it('serialize listing', () => {
        const listingData = {
            param1: 'val1',
            param2: 'val2',
            param3: 'val3',
            otherparam1: 'otherval1',
            otherparam2: 'otherval2'
        };
        const expectedListingText = (
            '{{mylisting\n' +
            '|param1= val1\n' +
            '|param2= val2 |param3= val3\n' +
            '|otherparam1= otherval1\n' +
            '|otherparam2= otherval2\n' +
            '}}'
        );
        const listingSerializer = new ListingSerializer('mylisting', listingData);
        listingSerializer.writeListingStart(true);
        listingSerializer.writeParameterLine('param1');
        listingSerializer.writeParametersLine(['param2', 'param3']);
        listingSerializer.writeOtherNonEmptyParameters();
        listingSerializer.writeListingEnd();
        const listingText = listingSerializer.getSerializedListing();
        assert.equal(listingText, expectedListingText);
    });

    it('serialize optional list', () => {
        const listingData = {
            param1: 'val1',
            param2: 'val2',
            optparam1: 'val3',
            optparam2: '',
            optparam3: 'val4'
        };
        const expectedListingText = (
            "{{mylisting\n" +
            "|param1= val1 |param2= val2 |optparam1= val3 |optparam3= val4\n" +
            "}}"
        );
        const listingSerializer = new ListingSerializer('mylisting', listingData);
        listingSerializer.writeListingStart(true);
        listingSerializer.writeParametersLine(
            ['param1', 'param2', 'optparam1', 'optparam2', 'optparam3'],
            ['optparam1', 'optparam2', 'optparam3']
        );
        listingSerializer.writeListingEnd();
        const listingText = listingSerializer.getSerializedListing();
        assert.equal(listingText, expectedListingText);
    });

    it('serialize optional list when all are absent', () => {
        const listingData = {
            optparam1: '',
            optparam2: '',
            optparam3: ''
        };
        const expectedListingText = (
            "{{mylisting\n" +
            "}}"
        );
        const listingSerializer = new ListingSerializer('mylisting', listingData);
        listingSerializer.writeListingStart(true);
        listingSerializer.writeParametersLine(
            ['optparam1', 'optparam2', 'optparam3'],
            ['optparam1', 'optparam2', 'optparam3']
        );
        listingSerializer.writeListingEnd();
        const listingText = listingSerializer.getSerializedListing();
        assert.equal(listingText, expectedListingText);
    });

    it('serialize null', () => {
        const listingData = {
            param1: null,
        };
        const expectedListingText = (
            '{{mylisting\n' +
            '|param1= \n' +
            '}}'
        );
        const listingSerializer = new ListingSerializer('mylisting', listingData);
        listingSerializer.writeListingStart(true);
        listingSerializer.writeParameterLine('param1');
        listingSerializer.writeListingEnd();
        const listingText = listingSerializer.getSerializedListing();
        assert.equal(listingText, expectedListingText);
    });

    it('serialize undefined', () => {
        const listingData = {
            param1: undefined,
        };
        const expectedListingText = (
            '{{mylisting\n' +
            '|param1= \n' +
            '}}'
        );
        const listingSerializer = new ListingSerializer('mylisting', listingData);
        listingSerializer.writeListingStart(true);
        listingSerializer.writeParameterLine('param1');
        listingSerializer.writeListingEnd();
        const listingText = listingSerializer.getSerializedListing();
        assert.equal(listingText, expectedListingText);
    });
});
