import { Router } from "express";
import { MongoClient } from "mongodb";
import ProjectsController from "./projects.controller";

/**
 * Creates a router for task-related API endpoints.
 * 
 * This function sets up various routes for handling task-related operations such as creating, retrieving, updating,
 * and deleting projects. It also includes routes for filtering tasks by status, searching by name, and sorting by date.
 * The routes are connected to methods in the `ProjectsController` class, which interacts with the MongoDB database
 * using the provided client.
 * 
 * @param {MongoClient} client - The MongoDB client instance used to interact with the database.
 * @returns {Router} An Express router configured with task-related API endpoints.
 */
const createProjectsRouter = (client: MongoClient) => {
    const projectRouter = Router();
    const projectController = new ProjectsController(client);

    projectRouter.put('/', projectController.createProject.bind(projectController));
    projectRouter.get('/', projectController.getAllProjects.bind(projectController));
    projectRouter.patch('/:id', projectController.updateProject.bind(projectController));
    projectRouter.patch('/assign/:id', projectController.assignTasksToProject.bind(projectController));
    projectRouter.delete('/:id', projectController.deleteProject.bind(projectController));
    projectRouter.get('/name/:name', projectController.searchProjectsByName.bind(projectController));
    projectRouter.get('/sort', projectController.sortProjectsByDate.bind(projectController));

    return projectRouter;
}

export default createProjectsRouter;
