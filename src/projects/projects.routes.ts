import { Router } from "express";
import { MongoClient } from "mongodb";
import ProjectsController from "./projects.controller";

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
