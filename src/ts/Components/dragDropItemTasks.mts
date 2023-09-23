export class DragDropItems {
  private $items: HTMLLIElement[] = [];
  private addedElements: Record<string, boolean> = {};
  private $listUl = document.querySelector("ul");
  constructor() {
    this.getNotify();
  }

  private setDragDrop() {
    this.$items.forEach(itemList => {
      itemList.addEventListener("dragstart", this.dragStart);
      itemList.addEventListener("dragend", this.dragEnd);
    });
  }

  private dragStart = (event: Event) => {
    const itemLI = event.target as HTMLLIElement;
    setTimeout(() => {
      itemLI.classList.add("dragging");
    }, 0);
  };

  private dragEnd = (event: Event) => {
    const itemLI = event.target as HTMLLIElement;
    itemLI.classList.remove("dragging");
  };

  private setToListDragOver() {
    this.$listUl?.addEventListener("dragover", this.initSortableLis);
    this.$listUl?.addEventListener("dragenter", (event: MouseEvent) =>
      event.preventDefault()
    );
  }

  private initSortableLis = (event: MouseEvent) => {
    event.preventDefault();
    const itemDragging = this.$listUl?.querySelector(
      ".dragging"
    ) as HTMLLIElement;
    const itemsNotDragging =
      this.$listUl?.querySelectorAll("li:not(.dragging)");
    if (itemsNotDragging) {
      const children = [...itemsNotDragging] as HTMLLIElement[];
      let nexSibling = children.find(
        sibling => event.clientY <= sibling.offsetTop + sibling.offsetHeight / 2
      );
      if (nexSibling) this.$listUl?.insertBefore(itemDragging, nexSibling);
    }
  };

  private getNotify() {
    document.addEventListener("add", event => {
      const eventCus = event as CustomEvent;
      const newList = eventCus.detail.information as HTMLLIElement[];
      newList.forEach(item => {
        const itemId = item.dataset.id as string;
        // Verifica si el elemento no ha sido agregado previamen
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
