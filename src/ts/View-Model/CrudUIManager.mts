import { Form } from "../Components/form.mjs";
import { ListTodo } from "../Model/TypeList.mjs";
import { Crud } from "../Model/crud.mjs";
export class TaskUIManger {
  private $listElement = document.querySelector("ul") as HTMLUListElement;
  private $addButtonElement = document.getElementById("add-task");
  private $form = document.querySelector(".update") as HTMLElement;
  private selectedListItem!: HTMLLIElement;
  private modelCrud!: Crud;
  private styleInput!: Form;

  constructor(crud: Crud, componentInput: Form) {
    this.modelCrud = crud;
    this.styleInput = componentInput;
    this.getNotify();
    this.printTaks();
  }

  public addTask = () => {
    this.$addButtonElement?.addEventListener("click", event => {
      event.preventDefault();
      this.createTask();
      this.styleInput.clearInput();
    });
  };

  private addHandlerButtons = () => {
    this.$listElement?.addEventListener("click", event => {
      const targetEvent = event.target as HTMLButtonElement;
      this.selectedListItem = this.getListItem(targetEvent);
      if (targetEvent.classList.contains("task__options--delete"))
        this.delete();
      if (targetEvent.classList.contains("task__options--update"))
        this.update();
      if (targetEvent.classList.contains("task__check")) {
        this.completed();
      }
    });
  };

  createTask() {
    const { text, id } = this.modelCrud.create();
    this.addTemplateToList(text, id);
  }

  private update() {
    this.$form.classList.add("update--active");
    const $btnConfirm = this.$form.querySelector(
      ".update__button"
    ) as HTMLElement;
    const $currentSpan = this.getCurrentDesription(this.selectedListItem);
    this.setInputUpdate($currentSpan.textContent || "");
    $btnConfirm.addEventListener("click", this.handleOKButtonClick);
  }

  private completed() {
    const taskId = parseInt(this.selectedListItem.dataset.id as string);
    this.addAnimation(this.selectedListItem);
    this.modelCrud.completed(taskId);
  }

  private delete() {
    const taskId = parseInt(this.selectedListItem.dataset.id as string);
    if (taskId) {
      this.addAnimation(this.selectedListItem);
      this.removeItem(this.selectedListItem);
      this.modelCrud.delete(taskId);
    }
  }

  private handleOKButtonClick = (event: Event) => {
    event.preventDefault();
    const $updateText = this.getUpdateDescription();
    const $currentSpan = this.getCurrentDesription(this.selectedListItem);
    if (this.isEmpy($updateText)) {
      this.$form.classList.remove("update--active");
      throw "No se admiten valores vacíos";
    }
    if ($updateText === $currentSpan.textContent) {
      this.$form.classList.remove("update--active");
      return;
    }

    this.setUpdateText($updateText);
    this.$form.classList.remove("update--active");
  };

  private getCurrentDesription($element: HTMLLIElement) {
    return $element.querySelector(".task__description") as HTMLElement;
  }

  private setUpdateText($updateText: string) {
    const taskId = parseInt(this.selectedListItem.dataset.id as string);
    const $currentSpan = this.getCurrentDesription(this.selectedListItem);
    const updateSpan = this.createElementSpan($updateText);
    this.modelCrud.update(taskId, $updateText);
    $currentSpan.replaceWith(updateSpan);
  }

  private printTaks() {
    const tasksSaved = this.modelCrud.loadUncompletedTasks() as [];
    tasksSaved.forEach((tasks: ListTodo) => {
      this.addTemplateToList(tasks.text, tasks.id);
    });
    this.addHandlerButtons();
  }

  private createTemplateTask(descriptionTask: string, id: number) {
    return `
         <li class="task__item" data-id="${id}" aria-label="Item tasks">
            <div class="task__wrapper">
              <input type="checkbox" class="task__check" aria-label="Check your tasks" />
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

  private addTemplateToList(descriptionTask: string, id: number): void {
    const templateItemTask = this.createTemplateTask(descriptionTask, id);
    this.$listElement?.insertAdjacentHTML("beforeend", templateItemTask);
  }

  private createElementSpan(text: string) {
    const span = document.createElement("span");
    span.className = "task__description";
    span.textContent = text;
    return span;
  }

  private setInputUpdate($currentSpan: string) {
    const $input = this.$form.querySelector(
      ".update__input"
    ) as HTMLInputElement;
    $input.value = $currentSpan;
  }

  private getUpdateDescription() {
    const $input = this.$form.querySelector(
      ".update__input"
    ) as HTMLInputElement;
    return $input.value.trim();
  }

  private getListItem($element: HTMLElement) {
    return $element.closest("li") as HTMLLIElement;
  }

  private getNotify() {
    document.addEventListener("finishedTasks", () => {
      while (this.$listElement.firstChild) {
        this.$listElement.removeChild(this.$listElement.firstChild);
      }
    });
  }

  isEmpy($element: string) {
    return $element === "";
  }

  private addAnimation($element: HTMLElement) {
    $element.classList.add("task__item--active");
  }

  private removeItem($element: HTMLLIElement) {
    try {
      $element.addEventListener("animationend", () =>
        this.$listElement.removeChild($element)
      );
    } catch (error) {
      console.log(error);
    }
  }
}
