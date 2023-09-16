import { ListTodo } from "./TypeList.mjs";
import { Crud } from "./crud.mjs";
export class Panel {
  private active = document.getElementById("active") as HTMLElement;
  private completedTas = document.getElementById("completed") as HTMLElement;
  private modelCrud!: Crud;

  constructor(crud: Crud) {
    this.modelCrud = crud;
    this.getNotify();
    this.loadPrintAllTask();
  }

  loadPrintAllTask() {
    const list = this.modelCrud.loadTasksFromLocalStorage() as [];
    const sizeActiveTasks = list.length;
    this.setActiveTask(sizeActiveTasks);
  }

  setCompletedTasks(countCompletedTasks: number) {
    const completedTasks = countCompletedTasks.toString();
    this.completedTas.textContent = completedTasks;
  }

  setActiveTask(countActiveTask: number) {
    const activeTask = countActiveTask.toString();
    this.active.textContent = activeTask;
  }

  getNotify() {
    document.addEventListener("active", event => {
      const notify = event as CustomEvent;
      const list = notify.detail.information;
      const sizeActiveTasks = list.length;
      this.setActiveTask(sizeActiveTasks);
    });

    document.addEventListener("completed", event => {
      const notify = event as CustomEvent;
      const list = notify.detail.information;
      console.log(list.length);
      //  setActiveTask(list.lenth);
    });
  }
}
