
export class PaginationComponent {
    constructor(itemsCount, itemsPerPage, currentPage, setPageFunction) {
        this.itemsPerPage = itemsPerPage;
        if (this.itemsPerPage !== 0) {
            this.pagesCount = Math.ceil(itemsCount / itemsPerPage);
        }
        this.setPageFunction = setPageFunction;
        this.currentPage = currentPage;
    }

    render() {
        if (this.itemsPerPage === 0 || this.pagesCount < 2) {
            return [];
        }

        const firstPage = 0;
        const previousPage = this.currentPage > 0 ? this.currentPage - 1 : null;
        const lastPage = this.pagesCount - 1;
        const nextPage = this.currentPage < this.pagesCount - 1 ? this.currentPage + 1 : null;

        const pagesDistance = 3;

        const paginationElement = $('<div style="display: flex; flex-direction: row;">');

        paginationElement.append(this.createPaginationItemElement('<<', firstPage));
        paginationElement.append(this.createPaginationItemElement('<', previousPage));

        const startPage = Math.max(0, this.currentPage - pagesDistance);
        const endPage = Math.min(this.pagesCount - 1, this.currentPage + pagesDistance + 1);

        if (startPage !== firstPage) {
            paginationElement.append(this.createMoreItemsElement());
        }

        for (let pageNumber = startPage; pageNumber < this.currentPage; pageNumber++) {
            paginationElement.append(this.createPaginationItemElement(pageNumber, pageNumber));
        }
        paginationElement.append(this.createPaginationItemElement(this.currentPage, this.currentPage));

        for (let pageNumber = this.currentPage + 1; pageNumber < endPage + 1; pageNumber++) {
            paginationElement.append(this.createPaginationItemElement(pageNumber, pageNumber));
        }

        if (endPage !== lastPage) {
            paginationElement.append(this.createMoreItemsElement());
        }

        paginationElement.append(this.createPaginationItemElement('>', nextPage));
        paginationElement.append(this.createPaginationItemElement('>>', lastPage));

        return [
            paginationElement
        ];
    }

    createMoreItemsElement() {
        return $('<div>')
            .attr('style', 'padding-right: 3px;')
            .text('...');
    }

    createPaginationItemElement(title, pageNumber) {
        const isActive = pageNumber !== null && pageNumber !== this.currentPage;

        const paginationItemElement = (
            $('<div>')
                .text('[' + title + ']')
                .attr(
                    'style',
                    isActive ?
                        'padding-right: 3px; color: blue; cursor: pointer;' :
                        'padding-right: 3px;'
                )
        );

        if (isActive) {
            paginationItemElement.click(() => {
                this.setPageFunction(pageNumber);
            });
        }

        return paginationItemElement;
    }
}