import { Form } from "./Components/form.mjs";
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
    const task = new TaskUIManger(crud);
    // const panel = new Panel(crud);
    task.addTask();
  }
}
Client.main();
