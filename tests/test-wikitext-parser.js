let assert = require('assert');

import { WikitextParser } from '../src/lib/wikitext-parser';

describe('WikitextParser', function() {
    it("find the first listing text", function() {
        let wikitext = "some text with {{mylisting | param1=val1 | param2=val2}}";
        let expectedListing = "{{mylisting | param1=val1 | param2=val2}}";
        let actualListing = WikitextParser.getListingWikitextBraces(wikitext, "mylisting", 0);
        assert.equal(actualListing, expectedListing);
    });

    it("find the second listing text", function() {
        let wikitext = (
            "some text with {{mylisting | param1=val1 | param2=val2}} {{mylisting | param1=val3 | param2=val4}}"
        );
        let expectedListing = "{{mylisting | param1=val3 | param2=val4}}";
        let actualListing = WikitextParser.getListingWikitextBraces(wikitext, "mylisting", 1);
        assert.equal(actualListing, expectedListing);
    });

    it("find the multiline listing text in multiline wikitext", function() {
        let wikitext = (
            "some text with \n{{mylisting | param1=val1 | \nparam2=val2}} " +
            "{{mylisting \n| param1=val3\n | param2=val4}} " +
            "{{mylisting |\n param1=val5 | param2=val6}}"
        );
        let expectedListing = "{{mylisting \n| param1=val3\n | param2=val4}}";
        let actualListing = WikitextParser.getListingWikitextBraces(wikitext, "mylisting", 1);
        assert.equal(actualListing, expectedListing);
    });

    it("find listing which does not close properly - no braces", function() {
        let wikitext = "some text with {{mylisting | param1=val1 | param2=val2}} {{mylisting | param1=val3 | param2=val4";
        let expectedListing = "{{mylisting | param1=val3 | param2=val4";
        let actualListing = WikitextParser.getListingWikitextBraces(wikitext, "mylisting", 1);
        assert.equal(actualListing, expectedListing);
    });

    it("find listing which does not close properly - one brace", function() {
        let wikitext = (
            "some text with {{mylisting | param1=val1 | param2=val2}} {{mylisting | param1=val3 | param2=val4}"
        );
        let expectedListing = "{{mylisting | param1=val3 | param2=val4}";
        let actualListing = WikitextParser.getListingWikitextBraces(wikitext, "mylisting", 1);
        assert.equal(actualListing, expectedListing);
    });

    it("find listing with inner listings", function() {
        let wikitext = (
            "some text with {{mylisting | param1=val1 | param2=val2}} " +
            "{{mylisting | param1={{another | inner-param=val-inner1}} | param2=val4}} " +
            "{{mylisting | param1=val6 | param2=val6}"
        );
        let expectedListing = "{{mylisting | param1={{another | inner-param=val-inner1}} | param2=val4}}";
        let actualListing = WikitextParser.getListingWikitextBraces(wikitext, "mylisting", 1);
        assert.equal(actualListing, expectedListing);
    });

    it("parse simple listing", function() {
        let wikitext = "{{mylisting | param1=val1 | param2=val2 | param3=val3}}";
        let expectedData = {'param1': 'val1', 'param2': 'val2', 'param3': 'val3'};
        let actualData = WikitextParser.wikiTextToListing(wikitext);
        assert.deepEqual(actualData, expectedData);
    });

    it("parse empty listing", function() {
        let wikitext = "{{mylisting}}";
        let expectedData = {};
        let actualData = WikitextParser.wikiTextToListing(wikitext);
        assert.deepEqual(actualData, expectedData);
    });

    it("parse listing which does not close properly - no braces", function() {
        let wikitext = "{{mylisting | param1=val1 | param2=val2 | param3=val3";
        let expectedData = {'param1': 'val1', 'param2': 'val2', 'param3': 'val3'};
        let actualData = WikitextParser.wikiTextToListing(wikitext);
        assert.deepEqual(actualData, expectedData);
    });

    it("parse listing which does not close properly - one brace", function() {
        let wikitext = "{{mylisting | param1=val1 | param2=val2 | param3=val3}";
        let expectedData = {'param1': 'val1', 'param2': 'val2', 'param3': 'val3'};
        let actualData = WikitextParser.wikiTextToListing(wikitext);
        assert.deepEqual(actualData, expectedData);
    });

    it("parse multiline listing", function() {
        let wikitext = "{{mylisting | \n param1=val1 \n | param2=val2 | \n param3=val3}}";
        let expectedData = {'param1': 'val1', 'param2': 'val2', 'param3': 'val3'};
        let actualData = WikitextParser.wikiTextToListing(wikitext);
        assert.deepEqual(actualData, expectedData);
    });

    it("parse listing with trailing spaces", function() {
        let wikitext = "{{mylisting | param1=   val1    | param2 = \tval2 | param3  \t  =  \t  val3 \t}}";
        let expectedData = {'param1': 'val1', 'param2': 'val2', 'param3': 'val3'};
        let actualData = WikitextParser.wikiTextToListing(wikitext);
        assert.deepEqual(actualData, expectedData);
    });
});