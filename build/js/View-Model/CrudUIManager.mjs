export class TaskUIManger {
    constructor(crud, componentInput) {
        this.$listElement = document.querySelector("ul");
        this.$addButtonElement = document.getElementById("add-task");
        this.$form = document.querySelector(".update");
        this.addTask = () => {
            var _a;
            (_a = this.$addButtonElement) === null || _a === void 0 ? void 0 : _a.addEventListener("click", event => {
                event.preventDefault();
                this.createTask();
                this.styleInput.clearInput();
            });
        };
        this.addHandlerButtons = () => {
            var _a;
            (_a = this.$listElement) === null || _a === void 0 ? void 0 : _a.addEventListener("click", event => {
                const targetEvent = event.target;
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
        this.handleOKButtonClick = (event) => {
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
        this.modelCrud = crud;
        this.styleInput = componentInput;
        this.getNotify();
        this.printTaks();
    }
    createTask() {
        const { text, id } = this.modelCrud.create();
        this.addTemplateToList(text, id);
    }
    update() {
        this.$form.classList.add("update--active");
        const $btnConfirm = this.$form.querySelector(".update__button");
        const $currentSpan = this.getCurrentDesription(this.selectedListItem);
        this.setInputUpdate($currentSpan.textContent || "");
        $btnConfirm.addEventListener("click", this.handleOKButtonClick);
    }
    completed() {
        const taskId = parseInt(this.selectedListItem.dataset.id);
        this.addAnimation(this.selectedListItem);
        this.modelCrud.completed(taskId);
    }
    delete() {
        const taskId = parseInt(this.selectedListItem.dataset.id);
        if (taskId) {
            this.addAnimation(this.selectedListItem);
            this.removeItem(this.selectedListItem);
            this.modelCrud.delete(taskId);
        }
    }
    getCurrentDesription($element) {
        return $element.querySelector(".task__description");
    }
    setUpdateText($updateText) {
        const taskId = parseInt(this.selectedListItem.dataset.id);
        const $currentSpan = this.getCurrentDesription(this.selectedListItem);
        const updateSpan = this.createElementSpan($updateText);
        this.modelCrud.update(taskId, $updateText);
        $currentSpan.replaceWith(updateSpan);
    }
    printTaks() {
        const tasksSaved = this.modelCrud.loadUncompletedTasks();
        tasksSaved.forEach((tasks) => {
            this.addTemplateToList(tasks.text, tasks.id);
        });
        this.addHandlerButtons();
    }
    createTemplateTask(descriptionTask, id) {
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
    addTemplateToList(descriptionTask, id) {
        var _a;
        const templateItemTask = this.createTemplateTask(descriptionTask, id);
        (_a = this.$listElement) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML("beforeend", templateItemTask);
    }
    createElementSpan(text) {
        const span = document.createElement("span");
        span.className = "task__description";
        span.textContent = text;
        return span;
    }
    setInputUpdate($currentSpan) {
        const $input = this.$form.querySelector(".update__input");
        $input.value = $currentSpan;
    }
    getUpdateDescription() {
        const $input = this.$form.querySelector(".update__input");
        return $input.value.trim();
    }
    getListItem($element) {
        return $element.closest("li");
    }
    getNotify() {
        document.addEventListener("finishedTasks", () => {
            while (this.$listElement.firstChild) {
                this.$listElement.removeChild(this.$listElement.firstChild);
            }
        });
    }
    isEmpy($element) {
        return $element === "";
    }
    addAnimation($element) {
        $element.classList.add("task__item--active");
    }
    removeItem($element) {
        try {
            $element.addEventListener("animationend", () => this.$listElement.removeChild($element));
        }
        catch (error) {
            console.log(error);
        }
    }
}
