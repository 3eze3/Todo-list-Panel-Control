export class OpenUICotrolPanel {
    static openPanel() {
        const $button = document.getElementById("btn-panel");
        const $panel = document.querySelector(".progress");
        $button.addEventListener("click", () => {
            $button.classList.toggle("panel__close");
            $panel.classList.toggle("panel__progress--active");
        });
    }
}
