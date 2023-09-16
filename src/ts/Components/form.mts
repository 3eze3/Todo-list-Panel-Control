export class Form {
  private $input = document.getElementById("task") as HTMLInputElement;
  private $label = document.querySelector(".form__label");

  private isEmpy() {
    return this.$input.value !== "";
  }

  private ajustLabel(): void {
    this.$label?.classList.toggle("form__label--active", this.isEmpy());
  }

  styleWriteInput(): void {
    this.$input.addEventListener("input", () => this.ajustLabel());
  }
}
