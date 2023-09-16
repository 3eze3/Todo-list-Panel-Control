import { Form } from "./Components/form.mjs";
import { Crud } from "./Model/crud.mjs";
import { TaskUIManger } from "./View-Model/CrudUIManager.mjs";
class Client {
  static main() {
    const styleInput = new Form();
    styleInput.styleWriteInput();
    const crud = new Crud();
    const task = new TaskUIManger(crud);
    task.addTask();
  }
}
Client.main();
