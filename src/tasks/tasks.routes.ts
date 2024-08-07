import { Router } from "express";
import TasksController from "./tasks.controller";
import { MongoClient } from "mongodb";

/**
 * Creates a router for task-related API endpoints.
 * 
 * This function sets up various routes for handling task-related operations such as creating, retrieving, updating,
 * and deleting tasks. It also includes routes for filtering tasks by status, searching by name, and sorting by date.
 * The routes are connected to methods in the `TasksController` class, which interacts with the MongoDB database
 * using the provided client.
 * 
 * @param {MongoClient} client - The MongoDB client instance used to interact with the database.
 * @returns {Router} An Express router configured with task-related API endpoints.
 */
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
