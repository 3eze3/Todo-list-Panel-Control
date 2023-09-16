export class TaskUIManger {
    constructor(crud) {
        this.$listElement = document.querySelector("ul");
        this.$addButtonElement = document.getElementById("add-task");
        this.$form = document.querySelector(".update");
        this.addTask = () => {
            var _a;
            (_a = this.$addButtonElement) === null || _a === void 0 ? void 0 : _a.addEventListener("click", event => {
                event.preventDefault();
                this.createTask();
            });
        };
        this.handleOKButtonClick = (event) => {
            event.preventDefault();
            const $updateText = this.getUpdateDescription();
            if (this.isEmpy($updateText)) {
                this.$form.classList.remove("update--active");
                throw "No se admiten valores vacíos";
            }
            this.setUpdateText($updateText);
            this.$form.classList.remove("update--active");
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
                if (targetEvent.classList.contains("task__check"))
                    this.completed();
            });
        };
        this.modelCrud = crud;
        this.printTaks();
    }
    createTask() {
        const { text } = this.modelCrud.create();
        this.addTemplateToList(text);
    }
    delete() {
        const $indexListItem = this.getIndexOfListItem(this.selectedListItem);
        this.modelCrud.delete($indexListItem);
        this.animationRemoveElement(this.selectedListItem);
    }
    getCurrentDesription($element) {
        return $element.querySelector(".task__description");
    }
    update() {
        this.$form.classList.add("update--active");
        const $btnConfirm = this.$form.querySelector(".update__button");
        $btnConfirm.addEventListener("click", this.handleOKButtonClick);
    }
    setUpdateText($updateText) {
        const indexListItem = this.getIndexOfListItem(this.selectedListItem);
        const $currentSpan = this.getCurrentDesription(this.selectedListItem);
        const updateSpan = this.createElementSpan($updateText);
        this.modelCrud.update(indexListItem, $updateText);
        $currentSpan.replaceWith(updateSpan);
    }
    completed() {
        const indexListItem = this.getIndexOfListItem(this.selectedListItem);
        this.modelCrud.completed(indexListItem, true);
        this.animationRemoveElement(this.selectedListItem);
    }
    printTaks() {
        const tasksSaved = this.modelCrud.loadTasksFromLocalStorage();
        if (tasksSaved) {
            tasksSaved.forEach(tasks => {
                this.addTemplateToList(tasks.text);
            });
        }
        this.addHandlerButtons();
    }
    createElementSpan(text) {
        const span = document.createElement("span");
        span.className = "task__description";
        span.textContent = text;
        return span;
    }
    getUpdateDescription() {
        const $input = this.$form.querySelector(".update__input");
        return $input.value.trim();
    }
    isEmpy($element) {
        return $element === "";
    }
    getIndexOfListItem($listItem) {
        var _a;
        const $childrenOfList = Array.from(((_a = this.$listElement) === null || _a === void 0 ? void 0 : _a.children) || []);
        return $childrenOfList.indexOf($listItem);
    }
    getListItem($element) {
        return $element.closest("li");
    }
    animationRemoveElement($element) {
        try {
            $element.classList.add("task__item--remove");
            $element.addEventListener("animationend", () => { var _a; return (_a = this.$listElement) === null || _a === void 0 ? void 0 : _a.removeChild($element); });
        }
        catch (error) {
            console.log("El erro es ", error);
        }
    }
    createTemplateTask(descriptionTask) {
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
    addTemplateToList(descriptionTask) {
        var _a;
        const templateItemTask = this.createTemplateTask(descriptionTask);
        (_a = this.$listElement) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML("beforeend", templateItemTask);
    }
}
