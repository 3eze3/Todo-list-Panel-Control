export class Panel {
    constructor(crud) {
        this.activeTasks = document.getElementById("active");
        this.completedTasks = document.getElementById("completed");
        this.status = document.querySelector(".storage__status");
        this.percentText = document.querySelector(".storage__tasks--completed");
        this.percentLeftText = document.querySelector(".storage__tasks--less");
        this.modelCrud = crud;
        this.getNotify();
        this.loadCountActiveTasks();
        this.loadCountCompletedTasks();
        this.loadPercentFinished();
        this.loadPercentLeft();
    }
    getNotify() {
        document.addEventListener("active", event => {
            const notify = event;
            const list = notify.detail.information;
            const uncomplteTasks = list.filter((tasks) => !tasks.completed);
            const sizeActiveTasks = uncomplteTasks.length.toString();
            this.setActiveTask(sizeActiveTasks);
        });
        document.addEventListener("completed", event => {
            const notify = event;
            const list = notify.detail.information;
            const sizeCompletedTasks = list.length.toString();
            this.setCompletedTasks(sizeCompletedTasks);
            this.setPercentFinished();
            this.setPercentLeft();
        });
        document.addEventListener("finishedTasks", event => {
            const notify = event;
            const list = notify.detail.information;
            const sizeAllTask = list.length.toString();
            this.handleAllCompleted(sizeAllTask);
        });
    }
    handleAllCompleted(size) {
        this.setActiveTask(size);
        this.setCompletedTasks(size);
        this.percentText.textContent = `${0}%`;
        this.percentLeftText.textContent = `${100}%`;
        this.status.style.width = `${0}%`;
        this.modelCrud.deleteAllTaks();
        alert("Haz acabado todas tus tareas!, proximamente caja con estilo.");
    }
    loadCountActiveTasks() {
        const tasksSaved = this.modelCrud.loadUncompletedTasks();
        const sizeActiveTasks = tasksSaved.length.toString();
        this.setActiveTask(sizeActiveTasks);
    }
    loadCountCompletedTasks() {
        const tasksSaved = this.modelCrud.loadCompletedTasks();
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
    setCompletedTasks(countCompletedTasks) {
        this.completedTasks.textContent = countCompletedTasks;
    }
    setActiveTask(countActiveTask) {
        this.activeTasks.textContent = countActiveTask;
    }
    setPercentFinished() {
        const activeTaks = this.modelCrud.getSavedTasksList().length;
        let completedTasks = parseInt(this.completedTasks.textContent);
        let percentFinished = (completedTasks * 100) / activeTaks;
        this.percentText.textContent = `${percentFinished}%`;
        this.status.style.width = `${percentFinished}%`;
        localStorage.setItem("percentFinished", percentFinished.toString());
    }
    setPercentLeft() {
        let percentCompleted = parseInt(this.percentText.textContent);
        let percentLeft = 100 - percentCompleted;
        this.percentLeftText.textContent = `${percentLeft}%`;
        localStorage.setItem("percentLeft", percentLeft.toString());
    }
}
