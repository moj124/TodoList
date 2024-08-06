import { Router } from "express";
import TasksController from "./tasks.controller";
import { MongoClient } from "mongodb";

const createTasksRouter = (client: MongoClient) => {
    const taskRouter = Router();
    const taskController = new TasksController(client);

    taskRouter.put('/', taskController.createTask.bind(taskController));
    taskRouter.get('/', taskController.getAllTasks.bind(taskController));
    taskRouter.patch('/:id', taskController.updateTask.bind(taskController));
    taskRouter.delete('/:id', taskController.deleteTask.bind(taskController));
    taskRouter.get('/status/:status', taskController.getTasksByStatus.bind(taskController));
    taskRouter.get('/name/:name', taskController.searchTasksByName.bind(taskController));
    taskRouter.get('/sort', taskController.sortTasksByDate.bind(taskController));

    return taskRouter;
}

export default createTasksRouter;
