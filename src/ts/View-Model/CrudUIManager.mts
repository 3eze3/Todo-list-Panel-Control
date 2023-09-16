import { Crud } from "../Model/crud.mjs";
export class TaskUIManger {
  private $listElement = document.querySelector("ul") as HTMLUListElement;
  private $addButtonElement = document.getElementById("add-task");
  private $form = document.querySelector(".update") as HTMLElement;
  private selectedListItem!: HTMLLIElement;
  private modelCrud!: Crud;

  constructor(crud: Crud) {
    this.modelCrud = crud;
    this.printTaks();
  }

  public addTask = () => {
    this.$addButtonElement?.addEventListener("click", event => {
      event.preventDefault();
      this.createTask();
    });
  };

  createTask() {
    const { text } = this.modelCrud.create();
    this.addTemplateToList(text);
  }

  private delete() {
    const $indexListItem = this.getIndexOfListItem(this.selectedListItem);
    this.modelCrud.delete($indexListItem);
    this.animationRemoveElement(this.selectedListItem);
  }

  private getCurrentDesription($element: HTMLLIElement) {
    return $element.querySelector(".task__description") as HTMLElement;
  }

  private update() {
    this.$form.classList.add("update--active");
    const $btnConfirm = this.$form.querySelector(
      ".update__button"
    ) as HTMLElement;

    $btnConfirm.addEventListener("click", this.handleOKButtonClick);
  }

  private handleOKButtonClick = (event: Event) => {
    event.preventDefault();
    const $updateText = this.getUpdateDescription();
    if (this.isEmpy($updateText)) {
      this.$form.classList.remove("update--active");
      throw "No se admiten valores vacíos";
    }
    this.setUpdateText($updateText);
    this.$form.classList.remove("update--active");
  };

  private setUpdateText($updateText: string) {
    const indexListItem = this.getIndexOfListItem(this.selectedListItem);
    const $currentSpan = this.getCurrentDesription(this.selectedListItem);
    const updateSpan = this.createElementSpan($updateText);
    this.modelCrud.update(indexListItem, $updateText);
    $currentSpan.replaceWith(updateSpan);
  }

  private addHandlerButtons = () => {
    this.$listElement?.addEventListener("click", event => {
      const targetEvent = event.target as HTMLButtonElement;
      this.selectedListItem = this.getListItem(targetEvent);
      if (targetEvent.classList.contains("task__options--delete"))
        this.delete();
      if (targetEvent.classList.contains("task__options--update"))
        this.update();
      if (targetEvent.classList.contains("task__check")) this.completed();
    });
  };

  private completed() {
    const indexListItem = this.getIndexOfListItem(this.selectedListItem);
    this.modelCrud.completed(indexListItem, true);
    this.animationRemoveElement(this.selectedListItem);
  }

  private printTaks() {
    const tasksSaved = this.modelCrud.loadTasksFromLocalStorage();
    if (tasksSaved) {
      tasksSaved.forEach(tasks => {
        this.addTemplateToList(tasks.text);
      });
    }
    this.addHandlerButtons();
  }

  private createElementSpan(text: string) {
    const span = document.createElement("span");
    span.className = "task__description";
    span.textContent = text;
    return span;
  }

  private getUpdateDescription() {
    const $input = this.$form.querySelector(
      ".update__input"
    ) as HTMLInputElement;
    return $input.value.trim();
  }

  isEmpy($element: string) {
    return $element === "";
  }

  private getIndexOfListItem($listItem: HTMLElement) {
    const $childrenOfList = Array.from(this.$listElement?.children || []);
    return $childrenOfList.indexOf($listItem);
  }

  private getListItem($element: HTMLElement) {
    return $element.closest("li") as HTMLLIElement;
  }

  private animationRemoveElement($element: HTMLLIElement) {
    try {
      $element.classList.add("task__item--remove");
      $element.addEventListener("animationend", () =>
        this.$listElement?.removeChild($element)
      );
    } catch (error) {
      console.log("El erro es ", error);
    }
  }

  private createTemplateTask(descriptionTask: string) {
    return `
         <li class="task__item">
            <div class="task__wrapper">
              <input type="checkbox" class="task__check" />
              <div class="task__content">
                <span class="task__description">${descriptionTask}</span>
              </div>
            </div>
            <div class="task__wrapper task__wrapper--options">
              <button class="task__options task__options--update" arial-label='edit your tasks button'>️
                  <img src='./asessts/images/edit-log.svg' aria-hidden="true" class="task__options--logo">
              </button>
              <button class="task__options task__options--delete" arial-label='remove your tasks button'>
                  <img src='./asessts/images/remove-log.svg' aria-hidden="true" class="task__options--logo">
              ️</button>
            </div>
          </li>`;
  }

  private addTemplateToList(descriptionTask: string): void {
    const templateItemTask = this.createTemplateTask(descriptionTask);
    this.$listElement?.insertAdjacentHTML("beforeend", templateItemTask);
  }
}
