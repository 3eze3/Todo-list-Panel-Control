import { ListTodo } from "./TypeList.mjs";
export class Crud {
  private $inputElement = document.getElementById("task") as HTMLInputElement;
  private savedTaskList: ListTodo[] = [];
  private id = 1;

  public create() {
    const description = this.getText();
    if (description === "") throw "No puedes ingresar datos vacios a la list";
    const tasksId = this.getUniqueSecuenciaId();
    const task = { id: tasksId, text: description, completed: false };
    if (this.isActiveTasks(description)) throw "La tarea ya existe..!";
    this.savedTaskList.push(task);
    this.updateTasksFromLocalStorage();
    this.notifyTasks("active", this.savedTaskList);
    return task;
  }

  public delete(taksId: number): void {
    const indexToDelete = this.savedTaskList.findIndex(
      tasks => tasks.id == taksId
    );
    if (indexToDelete !== -1) {
      this.savedTaskList.splice(indexToDelete, 1);
      this.updateTasksFromLocalStorage();
      this.notifyTasks("active", this.savedTaskList);
      if (this.isNotExistTasksActive()) {
        this.notifyTasks("finishedTasks", []);
      }
    }
  }

  public completed(tasksId: number) {
    const indexToComplted = this.savedTaskList.findIndex(
      tasks => tasks.id == tasksId
    );
    if (indexToComplted !== -1) {
      this.savedTaskList[indexToComplted].completed = true;
      this.updateTasksFromLocalStorage();
      const completedTasks = this.getCompletedTasks();
      this.notifyTasks("completed", completedTasks);
      this.notifyTasks("active", this.savedTaskList);
      if (this.isNotExistTasksActive()) {
        this.notifyTasks("finishedTasks", []);
      }
    }
  }

  public update(tasksId: number, newText: string) {
    const indexToUpdate = this.savedTaskList.findIndex(
      tasks => tasks.id == tasksId
    );
    if (indexToUpdate !== -1) {
      if (this.isActiveTasks(newText)) throw "La tarea ya existe..!";
      this.savedTaskList[indexToUpdate].text = newText;
      this.updateTasksFromLocalStorage();
    }
  }

  public deleteAllTaks() {
    localStorage.clear();
    this.savedTaskList.splice(0, this.savedTaskList.length);
  }

  private notifyTasks(eventName: string, task: ListTodo[]) {
    const event = new CustomEvent(eventName, {
      detail: { information: task },
    });
    document.dispatchEvent(event);
  }

  getSavedTasksList() {
    return this.savedTaskList;
  }

  private getText() {
    return this.$inputElement.value.trim();
  }

  setText(value: string) {
    this.$inputElement.value = value;
  }

  private getCompletedTasks() {
    return this.savedTaskList.filter(tasks => tasks.completed);
  }

  private getUniqueSecuenciaId() {
    return this.id++;
  }

  private isActiveTasks(description: string): Boolean {
    return this.savedTaskList.some(
      tasks =>
        tasks.text.toLowerCase() === description.toLowerCase() &&
        !tasks.completed
    );
  }

  public isNotExistTasksActive() {
    return this.savedTaskList.every(task => task.completed);
  }

  private loadTasks() {
    const itemsSaved = localStorage.getItem("tasks");
    if (itemsSaved) {
      this.savedTaskList = JSON.parse(itemsSaved);
    }
  }

  public loadUncompletedTasks() {
    this.loadTasks();
    return this.savedTaskList.filter(tasks => !tasks.completed);
  }

  public loadCompletedTasks() {
    this.loadTasks();
    return this.savedTaskList.filter(tasks => tasks.completed);
  }

  private updateTasksFromLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(this.savedTaskList));
  }
}
