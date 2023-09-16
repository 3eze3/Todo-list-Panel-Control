export class OpenUICotrolPanel {
  static openPanel() {
    const $button = document.getElementById("btn-panel") as HTMLButtonElement;
    const $panel = document.querySelector(".progress") as HTMLButtonElement;
    $button.addEventListener("click", () => {
      $button.classList.toggle("panel__close");
      $panel.classList.toggle("panel__progress--active");
    });
  }
}
