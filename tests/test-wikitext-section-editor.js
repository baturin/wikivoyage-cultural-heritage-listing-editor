let assert = require('assert');
let WikitextSectionEditor = require('../src/lib/wikitext-section-editor');

describe('WikitextSectionEditor', function() {
    it("get listing data", function() {
        let wikitext = (
            "some text with {{mylisting | param1=val1 | param2=val2}} " +
            "{{mylisting | param1=val3 | param2=val4}} " +
            "{{mylisting | param1=val5 | param2=val6}}"
        );
        let expectedData = {"param1": "val3", "param2": "val4"};
        let sectionEditor = new WikitextSectionEditor(wikitext, "mylisting");
        let actualData = sectionEditor.getListingData(1);
        assert.deepEqual(actualData, expectedData);
    });

    it("get listing data with comments", function() {
        let wikitext = (
            "some text with {{mylisting | param1=val1 | param2=val2}} " +
            "{{mylisting | param1=val<!--{{mylisting}} comment 1-->3 | param2=val4}} " +
            "{{mylisting | param1=val5 | param2=val6}}"
        );
        let expectedData = {"param1": "val<!--{{mylisting}} comment 1-->3", "param2": "val4"};
        let sectionEditor = new WikitextSectionEditor(wikitext, "mylisting");
        let actualData = sectionEditor.getListingData(1);
        assert.deepEqual(actualData, expectedData);
    });

    it("replace listing data", function() {
        let originalWikitext = (
            "some text with {{mylisting | param1=val1 | param2=val2}} " +
            "{{mylisting | param1=val3 | param2=val4}} " +
            "{{mylisting | param1=val5 | param2=val6}}"
        );
        let expectedWikitext = (
            "some text with {{mylisting | param1=val1 | param2=val2}} " +
            "AAA " +
            "{{mylisting | param1=val5 | param2=val6}}"
        );
        let sectionEditor = new WikitextSectionEditor(originalWikitext, "mylisting");
        let newWikitext = sectionEditor.getSectionTextWithReplacedListing(1, "AAA");
        assert.equal(newWikitext, expectedWikitext);
    });

    it("replace listing data when there are comments", function() {
        let originalWikitext = (
            "some text with {{mylisting | param1=<!--{{mylisting}} comment 1-->val1 | param2=val2}} " +
            "{{mylisting | param1=val3 | param2=val4}} " +
            "<!--{{mylisting}} comment 2-->" +
            "{{mylisting <!--{{mylisting}} comment 3--> | param1=val5 | param2=val6}}"
        );
        let expectedWikitext = (
            "some text with {{mylisting | param1=<!--{{mylisting}} comment 1-->val1 | param2=val2}} " +
            "AAA " +
            "<!--{{mylisting}} comment 2-->" +
            "{{mylisting <!--{{mylisting}} comment 3--> | param1=val5 | param2=val6}}"
        );
        let sectionEditor = new WikitextSectionEditor(originalWikitext, "mylisting");
        let newWikitext = sectionEditor.getSectionTextWithReplacedListing(1, "AAA");
        assert.equal(newWikitext, expectedWikitext);
    });

    it("add listing", function() {
        let originalWikitext = (
            "some text with {{mylisting | param1=val1 | param2=val2}} " +
            "{{mylisting | param1=val3 | param2=val4}} " +
            "{{mylisting | param1=val5 | param2=val6}}"
        );
        let expectedWikitext = (
            "some text with {{mylisting | param1=val1 | param2=val2}} " +
            "{{mylisting | param1=val3 | param2=val4}} " +
            "{{mylisting | param1=val5 | param2=val6}}\n" +
            "AAA"
        );
        let sectionEditor = new WikitextSectionEditor(originalWikitext, "mylisting");
        let newWikitext = sectionEditor.getSectionTextWithAddedListing("AAA");
        assert.equal(newWikitext, expectedWikitext);
    });

    it("add listing when there are comments", function() {
        let originalWikitext = (
            "some text with {{mylisting | param1=val1 | param2=val2}} " +
            "{{mylisting | param1=<!--{{mylisting}} comment 1--> | param2=val4}} " +
            "{{mylisting | param1=val5 | param2=val6}}"
        );
        let expectedWikitext = (
            "some text with {{mylisting | param1=val1 | param2=val2}} " +
            "{{mylisting | param1=<!--{{mylisting}} comment 1--> | param2=val4}} " +
            "{{mylisting | param1=val5 | param2=val6}}\n" +
            "AAA"
        );
        let sectionEditor = new WikitextSectionEditor(originalWikitext, "mylisting");
        let newWikitext = sectionEditor.getSectionTextWithAddedListing("AAA");
        assert.equal(newWikitext, expectedWikitext);
    });

    it("add listing when there is footer", function() {
        let originalWikitext = (
            "some text with {{mylisting | param1=val1 | param2=val2}} " +
            "{{mylisting | param1=val3 | param2=val4}} " +
            "{{mylisting | param1=val5 | param2=val6}}" +
            "{{footer | param1=val1}}"
        );
        let expectedWikitext = (
            "some text with {{mylisting | param1=val1 | param2=val2}} " +
            "{{mylisting | param1=val3 | param2=val4}} " +
            "{{mylisting | param1=val5 | param2=val6}}\n" +
            "AAA\n" +
            "{{footer | param1=val1}}"
        );
        let sectionEditor = new WikitextSectionEditor(originalWikitext, "mylisting");
        let newWikitext = sectionEditor.getSectionTextWithAddedListing("AAA");
        assert.equal(newWikitext, expectedWikitext);
    });
});