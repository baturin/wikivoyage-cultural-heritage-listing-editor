
export class ExportPanel {
    constructor(onExportJson, onExportGpx) {
        this._onExportJson = onExportJson;
        this._onExportGpx = onExportGpx;
    }

    render() {
        const exportPanel = $('<div style="float: right;">');

        const exportJsonLink = $("<a>").text('[JSON]');
        exportPanel.append(exportJsonLink);
        exportJsonLink.click(() => this._onExportJson());
        exportPanel.append('&nbsp;');

        const exportGpxLink = $("<a>").text('[GPX]');
        exportPanel.append(exportGpxLink);
        exportGpxLink.click(() => this._onExportGpx());

        return exportPanel;
    }
}