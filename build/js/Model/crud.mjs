export class Crud {
    constructor() {
        this.$inputElement = document.getElementById("task");
        this.savedTaskList = [];
        this.id = 1;
    }
    create() {
        const description = this.getText();
        if (description === "")
            throw "No puedes ingresar datos vacios a la list";
        const tasksId = this.getUniqueSecuenciaId();
        const task = { id: tasksId, text: description, completed: false };
        if (this.isActiveTasks(description))
            throw "La tarea ya existe..!";
        this.savedTaskList.push(task);
        this.updateTasksFromLocalStorage();
        this.notifyTasks("active", this.savedTaskList);
        return task;
    }
    delete(taksId) {
        const indexToDelete = this.savedTaskList.findIndex(tasks => tasks.id == taksId);
        if (indexToDelete !== -1) {
            this.savedTaskList.splice(indexToDelete, 1);
            this.updateTasksFromLocalStorage();
            this.notifyTasks("active", this.savedTaskList);
            if (this.isNotExistTasksActive()) {
                this.notifyTasks("finishedTasks", []);
            }
        }
    }
    completed(tasksId) {
        const indexToComplted = this.savedTaskList.findIndex(tasks => tasks.id == tasksId);
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
    update(tasksId, newText) {
        const indexToUpdate = this.savedTaskList.findIndex(tasks => tasks.id == tasksId);
        if (indexToUpdate !== -1) {
            if (this.isActiveTasks(newText))
                throw "La tarea ya existe..!";
            this.savedTaskList[indexToUpdate].text = newText;
            this.updateTasksFromLocalStorage();
        }
    }
    deleteAllTaks() {
        localStorage.clear();
        this.savedTaskList.splice(0, this.savedTaskList.length);
    }
    notifyTasks(eventName, task) {
        const event = new CustomEvent(eventName, {
            detail: { information: task },
        });
        document.dispatchEvent(event);
    }
    getSavedTasksList() {
        return this.savedTaskList;
    }
    getText() {
        return this.$inputElement.value.trim();
    }
    getCompletedTasks() {
        return this.savedTaskList.filter(tasks => tasks.completed);
    }
    getUniqueSecuenciaId() {
        return this.id++;
    }
    isActiveTasks(description) {
        return this.savedTaskList.some(tasks => tasks.text.toLowerCase() === description.toLowerCase() &&
            !tasks.completed);
    }
    isNotExistTasksActive() {
        return this.savedTaskList.every(task => task.completed);
    }
    loadTasks() {
        const itemsSaved = localStorage.getItem("tasks");
        if (itemsSaved) {
            this.savedTaskList = JSON.parse(itemsSaved);
        }
    }
    loadUncompletedTasks() {
        this.loadTasks();
        return this.savedTaskList.filter(tasks => !tasks.completed);
    }
    loadCompletedTasks() {
        this.loadTasks();
        return this.savedTaskList.filter(tasks => tasks.completed);
    }
    updateTasksFromLocalStorage() {
        localStorage.setItem("tasks", JSON.stringify(this.savedTaskList));
    }
}
