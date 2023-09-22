import { Crud } from "./crud.mjs";
import { ListTodo } from "./TypeList.mjs";
export class Panel {
  private activeTasks = document.getElementById("active") as HTMLElement;
  private completedTasks = document.getElementById("completed") as HTMLElement;
  private status = document.querySelector(".storage__status") as HTMLElement;
  private percentText = document.querySelector(
    ".storage__tasks--completed"
  ) as HTMLElement;

  private percentLeftText = document.querySelector(
    ".storage__tasks--less"
  ) as HTMLElement;

  private boxFinished = document.querySelector(".finished");
  private roket = document.querySelector(".finished__logo");

  private modelCrud!: Crud;

  constructor(crud: Crud) {
    this.modelCrud = crud;
    this.getNotify();
    this.loadCountActiveTasks();
    this.loadCountCompletedTasks();
    this.loadPercentFinished();
    this.loadPercentLeft();
  }

  getNotify() {
    document.addEventListener("active", event => {
      const notify = event as CustomEvent;
      const list = notify.detail.information;
      const uncomplteTasks = list.filter((tasks: ListTodo) => !tasks.completed);
      const sizeActiveTasks = uncomplteTasks.length.toString();
      this.setActiveTask(sizeActiveTasks);
      this.setPercentFinished();
      this.setPercentLeft();
      this.boxFinished?.classList.remove("finished--active");
      this.roket?.classList.remove("finished__logo--active");
    });

    document.addEventListener("completed", event => {
      const notify = event as CustomEvent;
      const list = notify.detail.information;
      const sizeCompletedTasks = list.length.toString();
      this.setCompletedTasks(sizeCompletedTasks);
      this.setPercentFinished();
      this.setPercentLeft();
    });

    document.addEventListener("finishedTasks", event => {
      const notify = event as CustomEvent;
      const list = notify.detail.information;
      const sizeAllTask = list.length.toString();
      this.handleAllCompleted(sizeAllTask);
    });
  }

  handleAllCompleted(size: string) {
    this.setActiveTask(size);
    this.setCompletedTasks(size);
    this.percentText.textContent = `${0}%`;
    this.percentLeftText.textContent = `${100}%`;
    this.status.style.width = `${0}%`;
    this.modelCrud.deleteAllTaks();
    setTimeout(() => {
      this.boxFinished?.classList.add("finished--active");
      this.roket?.classList.add("finished__logo--active");
    }, 500);
  }

  loadCountActiveTasks() {
    const tasksSaved = this.modelCrud.loadUncompletedTasks() as [];
    const sizeActiveTasks = tasksSaved.length.toString();
    this.setActiveTask(sizeActiveTasks);
  }

  loadCountCompletedTasks() {
    const tasksSaved = this.modelCrud.loadCompletedTasks() as [];
    const sizeCompletedTasks = tasksSaved.length.toString();
    this.setCompletedTasks(sizeCompletedTasks);
  }

  loadPercentFinished() {
    const percentFinished = localStorage.getItem("percentFinished");
    if (percentFinished) {
      this.percentText.textContent = `${percentFinished}%`;
      this.status.style.width = `${percentFinished}%`;
    }
  }

  loadPercentLeft() {
    const percentLeft = localStorage.getItem("percentLeft");
    if (percentLeft) {
      this.percentLeftText.textContent = `${percentLeft}%`;
    }
  }
  setCompletedTasks(countCompletedTasks: string) {
    this.completedTasks.textContent = countCompletedTasks;
  }

  setActiveTask(countActiveTask: string) {
    this.activeTasks.textContent = countActiveTask;
  }

  setPercentFinished() {
    const activeTaks = this.modelCrud.getSavedTasksList().length;
    let completedTasks = parseInt(this.completedTasks.textContent as string);
    let percentFinished = (completedTasks * 100) / activeTaks;
    this.percentText.textContent = `${percentFinished}%`;
    this.status.style.width = `${percentFinished}%`;
    localStorage.setItem("percentFinished", percentFinished.toString());
  }

  setPercentLeft() {
    let percentCompleted = parseInt(this.percentText.textContent as string);
    let percentLeft = 100 - percentCompleted;
    this.percentLeftText.textContent = `${percentLeft}%`;
    localStorage.setItem("percentLeft", percentLeft.toString());
  }
}
