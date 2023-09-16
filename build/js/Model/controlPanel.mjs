export class Panel {
    constructor(crud) {
        this.active = document.getElementById("active");
        this.completedTas = document.getElementById("completed");
        this.modelCrud = crud;
        this.getNotify();
        this.loadPrintAllTask();
    }
    loadPrintAllTask() {
        const list = this.modelCrud.loadTasksFromLocalStorage();
        const sizeActiveTasks = list.length;
        this.setActiveTask(sizeActiveTasks);
    }
    setCompletedTasks(countCompletedTasks) {
        const completedTasks = countCompletedTasks.toString();
        this.completedTas.textContent = completedTasks;
    }
    setActiveTask(countActiveTask) {
        const activeTask = countActiveTask.toString();
        this.active.textContent = activeTask;
    }
    getNotify() {
        document.addEventListener("active", event => {
            const notify = event;
            const list = notify.detail.information;
            const sizeActiveTasks = list.length;
            this.setActiveTask(sizeActiveTasks);
        });
        document.addEventListener("completed", event => {
            const notify = event;
            const list = notify.detail.information;
            console.log(list.length);
        });
    }
}
