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

  createTask() {
    const { text, id } = this.modelCrud.create();
    this.addTemplateToList(text, id);
  }

  private delete() {
    const taskId = parseInt(this.selectedListItem.dataset.id as string);
    if (taskId) {
      this.addAnimation(this.selectedListItem);
      this.removeItem(this.selectedListItem);
      this.modelCrud.delete(taskId);
    }
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

  private completed() {
    const taskId = parseInt(this.selectedListItem.dataset.id as string);
    this.addAnimation(this.selectedListItem);
    this.modelCrud.completed(taskId);
  }

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

  private getNotify() {
    document.addEventListener("finishedTasks", () => {
      while (this.$listElement.firstChild) {
        this.$listElement.removeChild(this.$listElement.firstChild);
      }
    });
  }

  private printTaks() {
    const tasksSaved = this.modelCrud.loadUncompletedTasks() as [];
    tasksSaved.forEach((tasks: ListTodo) => {
      this.addTemplateToList(tasks.text, tasks.id);
    });
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

  private getListItem($element: HTMLElement) {
    return $element.closest("li") as HTMLLIElement;
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
}
