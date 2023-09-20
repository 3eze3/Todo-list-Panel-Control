export class Form {
  private $input = document.getElementById("task") as HTMLInputElement;
  private $label = document.querySelector(".form__label");
  private $addButtonElement = document.getElementById("add-task");

  private isEmpy() {
    return this.$input.value !== "";
  }

  private ajustLabel(): void {
    this.$label?.classList.toggle("form__label--active", this.isEmpy());
  }

  public clearInput(): void {
    this.$input.value = "";
    this.$label?.classList.remove("form__label--active");
    this.$input.blur();
  }

  public styleWriteInput(): void {
    this.$input.addEventListener("input", () => this.ajustLabel());
  }
}
