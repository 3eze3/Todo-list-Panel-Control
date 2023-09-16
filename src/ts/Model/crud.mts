import { ListTodo } from "./TypeList.mjs";
export class Crud {
  private $inputElement = document.getElementById("task") as HTMLInputElement;
  private savedTaskList: ListTodo[] = [];

  private notifyTasks(eventName: string, task: ListTodo[]) {
    const event = new CustomEvent(eventName, {
      detail: { information: task },
    });
    document.dispatchEvent(event);
  }

  public create() {
    const description = this.getText();
    if (description === "") throw "No puedes ingresar datos vacios a la list";
    const task = { text: description, completed: false };
    if (this.existTaks(description)) throw "La tarea ya existe..!";
    this.savedTaskList.push(task);
    this.notifyTasks("active", this.savedTaskList);
    this.updateLocalStorage();
    return task;
  }

  public delete(indexItem: number): void {
    this.savedTaskList.splice(indexItem, 1);
    this.updateLocalStorage();
    this.notifyTasks("active", this.savedTaskList);
  }

  public completed(indexItem: number, state: boolean) {
    this.savedTaskList[indexItem].completed = state;
    const completedTasks = this.getCompleted();
    this.notifyTasks("completed", completedTasks);
    this.delete(indexItem);
  }

  private getCompleted() {
    this.updateLocalStorage();
    return this.savedTaskList.filter(taks => taks.completed === true);
  }

  public update(indexItem: number, newText: string) {
    if (this.existTaks(newText)) throw "La tarea ya existe..!";
    this.savedTaskList[indexItem].text = newText;
    this.updateLocalStorage();
  }
  public deleteAllTask() {
    localStorage.clear();
  }

  public loadTasksFromLocalStorage() {
    const itemsSaved = localStorage.getItem("tasks");
    if (itemsSaved) {
      this.savedTaskList = JSON.parse(itemsSaved);
      return [...this.savedTaskList];
    }
  }

  private updateLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(this.savedTaskList));
  }

  private existTaks(description: string) {
    return this.savedTaskList.some(
      task => task.text.toLowerCase() === description.toLowerCase()
    );
  }

  private getText() {
    return this.$inputElement.value.trim();
  }
}
