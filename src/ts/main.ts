import { DragDropItems } from "./Components/dragDropItemTasks.mjs";
import { Form } from "./Components/form.mjs";
import { OpenUICotrolPanel } from "./Components/openPanelControl.mjs";
import { Panel } from "./Model/controlPanel.mjs";
import { Crud } from "./Model/crud.mjs";
import { TaskUIManger } from "./View-Model/CrudUIManager.mjs";
class Client {
  /**
   * main
   */
  public static main(): void {
    const styleInput = new Form();
    styleInput.styleWriteInput();
    const crud = new Crud();
    const panel = new Panel(crud);
    const dragDrop = new DragDropItems();
    const task = new TaskUIManger(crud, styleInput);
    task.addTask();
  }
}
OpenUICotrolPanel.openPanel();
Client.main();
