export class Form {
    constructor() {
        this.$input = document.getElementById("task");
        this.$label = document.querySelector(".form__label");
        this.$addButtonElement = document.getElementById("add-task");
    }
    isEmpy() {
        return this.$input.value !== "";
    }
    ajustLabel() {
        var _a;
        (_a = this.$label) === null || _a === void 0 ? void 0 : _a.classList.toggle("form__label--active", this.isEmpy());
    }
    clearInput() {
        var _a;
        this.$input.value = "";
        (_a = this.$label) === null || _a === void 0 ? void 0 : _a.classList.remove("form__label--active");
        this.$input.blur();
    }
    styleWriteInput() {
        this.$input.addEventListener("input", () => this.ajustLabel());
    }
}
