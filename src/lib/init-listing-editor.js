import ListingEditorButtons from "./listing-editor-buttons";
import ListingEditorDialog from "./listing-editor-dialog";
import MediaWikiPageWikitext from "./mediawiki-page-wikitext";
import WikitextSectionEditor from "./wikitext-section-editor";
import SavingForm from "./saving-form";
import ListingEditorUtils from "./listing-editor-utils";
import MediaWikiPage from "./mediawiki-page";
import StringUtils from "./string-utils";

function initListingEditor(
    {
        listingPageNamespace,
        formClass,
        listingSerializerClass,
        listingTemplateName,
        helpPageUrl
    }
) {
    function isListingPage() {
        return StringUtils.contains(MediaWikiPage.getPageName(), listingPageNamespace);
    }

    if (!ListingEditorUtils.isEditablePage() || !isListingPage()) {
        return;
    }

    function showHelp() {
        window.open(helpPageUrl);
    }

    function showListingEditorDialogAdd(sectionIndex, sectionWikitext) {
        let sectionEditor = new WikitextSectionEditor(sectionWikitext, listingTemplateName);
        let form = new formClass();
        ListingEditorDialog.showDialog(
            form.getForm().formElement,
            "Add",
            /*onSubmit=*/() => {
                let listingSerializer = new listingSerializerClass();
                let newListingText = listingSerializer.serializeListingData(form.getData());
                let updatedWikitext = sectionEditor.getSectionTextWithAddedListing(
                    newListingText
                );
                let savingForm = new SavingForm();
                MediaWikiPageWikitext.saveSectionWikitext(
                    sectionIndex,
                    updatedWikitext,
                    /*changesSummary=*/"",
                    /*changesIsMinor=*/"",
                    /*captchaId=*/null,
                    /*captchaAnswer=*/null,
                    /*onSuccess=*/ () => {
                        window.location.reload()
                    },
                    /*onFailure*/ () => {
                        savingForm.destroy();
                        alert('failure')
                    },
                    /*onCaptcha*/ () => {
                        savingForm.destroy();
                        alert('captcha')
                    }
                );
            },
            /*onCancel=*/() => {
                form.getForm().formElement.dialog('destroy').remove();
            },
            /*onHelp=*/showHelp
        );
    }

    function showListingEditorDialogEdit(sectionIndex, listingIndex, sectionWikitext) {
        let sectionEditor = new WikitextSectionEditor(sectionWikitext, listingTemplateName);
        let listingData = sectionEditor.getListingData(listingIndex);
        let form = new formClass();
        form.setData(listingData);
        ListingEditorDialog.showDialog(
            form.getForm().formElement, "Edit",
            /*onSubmit=*/() => {
                let listingSerializer = new listingSerializerClass();
                let newListingText = listingSerializer.serializeListingData(form.getData());
                let updatedWikitext = sectionEditor.getSectionTextWithReplacedListing(
                    listingIndex, newListingText
                );
                let savingForm = new SavingForm();
                MediaWikiPageWikitext.saveSectionWikitext(
                    sectionIndex,
                    updatedWikitext,
                    /*changesSummary=*/"",
                    /*changesIsMinor=*/"",
                    /*captchaId=*/null,
                    /*captchaAnswer=*/null,
                    /*onSuccess=*/ () => {
                        window.location.reload()
                    },
                    /*onFailure*/ () => {
                        savingForm.destroy();
                        alert('failure')
                    },
                    /*onCaptcha*/ () => {
                        savingForm.destroy();
                        alert('captcha')
                    }
                );
            },
            /*onCancel=*/() => {
                form.getForm().formElement.dialog('destroy').remove();
            },
            /*onHelp=*/showHelp
        );
    }

    function onAddNewListing(sectionIndex) {
        MediaWikiPageWikitext.loadSectionWikitext(
            sectionIndex,
            (wikitext) => showListingEditorDialogAdd(sectionIndex, wikitext)
        );
    }

    function onEditListing(sectionIndex, listingIndex) {
        MediaWikiPageWikitext.loadSectionWikitext(
            sectionIndex,
            (wikitext) => showListingEditorDialogEdit(sectionIndex, listingIndex, wikitext)
        );
    }

    let listingPageElements = ListingEditorUtils.getListingPageElements();

    let sections = listingPageElements.getSections();
    for (let i = 0; i < sections.length; i++) {
        let addButton = ListingEditorButtons.createListingAddButton(sections[i]);
        addButton.click((section) => {
            onAddNewListing(section.getSectionIndex())
        });
    }

    let listingTables = listingPageElements.getListingTables();
    for (let i = 0; i < listingTables.length; i++) {
        let editButton = ListingEditorButtons.createListingEditButton(listingTables[i]);
        editButton.click((listingTable) => {
            onEditListing(listingTable.getSectionIndex(), listingTable.getListingIndex())
        });
    }
}

module.exports = initListingEditor();