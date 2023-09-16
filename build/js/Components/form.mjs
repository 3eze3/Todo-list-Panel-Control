export class Form {
    constructor() {
        this.$input = document.getElementById("task");
        this.$label = document.querySelector(".form__label");
    }
    isEmpy() {
        return this.$input.value !== "";
    }
    ajustLabel() {
        var _a;
        (_a = this.$label) === null || _a === void 0 ? void 0 : _a.classList.toggle("form__label--active", this.isEmpy());
    }
    styleWriteInput() {
        this.$input.addEventListener("input", () => this.ajustLabel());
    }
}
