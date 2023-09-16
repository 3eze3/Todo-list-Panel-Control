export class Crud {
    constructor() {
        this.$inputElement = document.getElementById("task");
        this.savedTaskList = [];
    }
    notifyTasks(eventName, task) {
        const event = new CustomEvent(eventName, {
            detail: { information: task },
        });
        document.dispatchEvent(event);
    }
    create() {
        const description = this.getText();
        if (description === "")
            throw "No puedes ingresar datos vacios a la list";
        const task = { text: description, completed: false };
        if (this.existTaks(description))
            throw "La tarea ya existe..!";
        this.savedTaskList.push(task);
        this.notifyTasks("active", this.savedTaskList);
        this.updateLocalStorage();
        return task;
    }
    delete(indexItem) {
        this.savedTaskList.splice(indexItem, 1);
        this.updateLocalStorage();
        this.notifyTasks("active", this.savedTaskList);
    }
    completed(indexItem, state) {
        this.savedTaskList[indexItem].completed = state;
        const completedTasks = this.getCompleted();
        this.notifyTasks("completed", completedTasks);
        this.delete(indexItem);
    }
    getCompleted() {
        this.updateLocalStorage();
        return this.savedTaskList.filter(taks => taks.completed === true);
    }
    update(indexItem, newText) {
        if (this.existTaks(newText))
            throw "La tarea ya existe..!";
        this.savedTaskList[indexItem].text = newText;
        this.updateLocalStorage();
    }
    deleteAllTask() {
        localStorage.clear();
    }
    loadTasksFromLocalStorage() {
        const itemsSaved = localStorage.getItem("tasks");
        if (itemsSaved) {
            this.savedTaskList = JSON.parse(itemsSaved);
            return [...this.savedTaskList];
        }
    }
    updateLocalStorage() {
        localStorage.setItem("tasks", JSON.stringify(this.savedTaskList));
    }
    existTaks(description) {
        return this.savedTaskList.some(task => task.text.toLowerCase() === description.toLowerCase());
    }
    getText() {
        return this.$inputElement.value.trim();
    }
}
