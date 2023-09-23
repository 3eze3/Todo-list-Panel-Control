export class DragDropItems {
    constructor() {
        this.$items = [];
        this.addedElements = {};
        this.$listUl = document.querySelector("ul");
        this.dragStart = (event) => {
            const itemLI = event.target;
            setTimeout(() => {
                itemLI.classList.add("dragging");
            }, 0);
        };
        this.dragEnd = (event) => {
            const itemLI = event.target;
            itemLI.classList.remove("dragging");
        };
        this.initSortableLis = (event) => {
            var _a, _b, _c;
            event.preventDefault();
            const itemDragging = (_a = this.$listUl) === null || _a === void 0 ? void 0 : _a.querySelector(".dragging");
            const itemsNotDragging = (_b = this.$listUl) === null || _b === void 0 ? void 0 : _b.querySelectorAll("li:not(.dragging)");
            if (itemsNotDragging) {
                const children = [...itemsNotDragging];
                let nexSibling = children.find(sibling => event.clientY <= sibling.offsetTop + sibling.offsetHeight / 2);
                if (nexSibling)
                    (_c = this.$listUl) === null || _c === void 0 ? void 0 : _c.insertBefore(itemDragging, nexSibling);
            }
        };
        this.getNotify();
    }
    setDragDrop() {
        this.$items.forEach(itemList => {
            itemList.addEventListener("dragstart", this.dragStart);
            itemList.addEventListener("dragend", this.dragEnd);
        });
    }
    setToListDragOver() {
        var _a, _b;
        (_a = this.$listUl) === null || _a === void 0 ? void 0 : _a.addEventListener("dragover", this.initSortableLis);
        (_b = this.$listUl) === null || _b === void 0 ? void 0 : _b.addEventListener("dragenter", (event) => event.preventDefault());
    }
    getNotify() {
        document.addEventListener("add", event => {
            const eventCus = event;
            const newList = eventCus.detail.information;
            newList.forEach(item => {
                const itemId = item.dataset.id;
                if (!this.addedElements[itemId]) {
                    this.$items.push(item);
                    this.addedElements[itemId] = true;
                }
            });
            this.setDragDrop();
            this.setToListDragOver();
        });
    }
}
