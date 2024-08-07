import { Request, Response } from 'express';
import { Db, MongoClient, ObjectId } from 'mongodb';
import DatabaseHandler from '../db/DatabaseHandler';
import validateObjectId from '../utils/validateObjectId';
import { PROJECTS } from '../types/Constants';
import Task from '../types/Task';

/**
 * Class for handling CRUD operations for projects collection with optional transaction support and error handling.
 * 
 * @param {MongoClient} client - The mongodb MongoClient object.
 */
export default class ProjectsController {
    client: MongoClient;
    db: Db;

    constructor (client: MongoClient) {
        this.client = client;
        this.db = client.db();
    }

    /**
     * Retrieves all projects from the database.
     * 
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     */
    public async getAllProjects(req: Request, res: Response): Promise<void> {
        const operation =  async () => {
            return this.db.collection(PROJECTS).find().toArray();
        }

        try {
            const projects = await DatabaseHandler.handleAsyncOperation(
                this.client, 
                operation,
            )
            res.status(200).json(projects);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    /**
     * Searches for projects by name in the database.
     * 
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     */
    public async searchProjectsByName(req: Request, res: Response): Promise<void> {
        const { name } = req.params;

        if (!name) {
            res.status(400).json({ message: 'Invalid status params parameter' });
            return;
        }
        
        const operation =  async () => {
            return this.db.collection(PROJECTS).find({ name }).toArray();
        }

        try {
            const projects = await DatabaseHandler.handleAsyncOperation(
                this.client, 
                operation,
            )
            res.status(200).json(projects);
        } catch (error) {
            console.error('Error fetching projects by status:', error);
            res.status(500).json({ message: 'Failed to fetch projects by status' });
        }
    }

    /**
     * Sorts projects by date fields in the database.
     * 
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     */
    public async sortProjectsByDate(req: Request, res: Response): Promise<void> {
        const sortObject: { [key: string]: 1 } = {
            createdAt: 1,
            deadlineAt: 1,
            doneAt: 1
        };

        const operation =  async () => {
            return this.db.collection(PROJECTS)
                .find()
                .sort(sortObject)
                .toArray();
        }

        try {
            const projects = await DatabaseHandler.handleAsyncOperation(
                this.client, 
                operation,
            )
            
            res.status(200).json(projects);
        } catch (error) {
            console.error('Error fetching projects by date:', error);
            res.status(500).json({ message: 'Failed to fetch projects by date' });
        }
    }

    /**
     * Creates a new project in the database.
     * 
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     */
    public async createProject(req: Request, res: Response): Promise<void> {
        const data = {
            name: req.body.name,
            createdAt: new Date(),
            deadlineAt: null,
            tasks: [],
        };

        const operation = async () => {
            return this.db.collection(PROJECTS).insertOne(data);
        };
        try {
            await DatabaseHandler.handleAsyncOperation(
                this.client, 
                operation,
                true,
            );
            
            res.status(201).json(data);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    /**
     * Updates an existing project in the database.
     * 
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     */
    public async updateProject(req: Request, res: Response): Promise<void> {
        const objId = new ObjectId(req.params.id);
        const objectId = validateObjectId(req.params.id);

        if (!objectId) {
            res.status(400).json({ message: 'Invalid ID format' });
            return;
        }

        const {name, deadlineAt} = req.body;
        try {
            const existingProject = await this.db.collection(PROJECTS).findOne({ _id: objId});

            if (!existingProject) {
                res.status(404).json({ message: 'Project not found' });
                return;
            }

            const dataToUpdate = {
                ...existingProject,
                name,
                deadlineAt: deadlineAt ? new Date(deadlineAt) : null,
            };

            const operation = async () => {
                return this.db.collection(PROJECTS).updateOne(
                    { _id: objId },
                    { $set: dataToUpdate }
                );
            };

            const result = await DatabaseHandler.handleAsyncOperation(
                this.client,
                operation,
                true
            );

            if (result.matchedCount > 0) {
                if (result.modifiedCount > 0) {
                    res.status(200).json({ message: 'Project updated successfully' });
                } else {
                    res.status(304).json({ message: 'No changes made to the project' });
                }
            } else {
                res.status(404).json({ message: 'Project not found' });
            }
        } catch (error) {
            console.error('Error updating project:', error);
            res.status(500).json({ message: 'Failed to update project' });
        }
    }

    /**
     * Updates an existing project's tasks property in the database.
     * 
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     */
    public async assignTasksToProject(req: Request, res: Response): Promise<void> {
        const objId = new ObjectId(req.params.id);
        const objectId = validateObjectId(req.params.id);

        if (!objectId) {
            res.status(400).json({ message: 'Invalid ID format' });
            return;
        }

        const tasks = req.body.tasks;

        const formattedTasks = tasks.map((elem: Task) => ({
            ...elem,
            completedAt: elem?.completedAt ? new Date(elem?.completedAt) : null,
            deadlineAt: elem?.deadlineAt ? new Date(elem?.deadlineAt) : null,
            createdAt: new Date(elem.createdAt),
        }));

        if (!Array.isArray(formattedTasks) || !formattedTasks.every(task => typeof task === 'object' && task !== null)) {
            res.status(400).json({ message: 'Invalid tasks format' });
            return;
        }

        try {
            const existingProject = await this.db.collection(PROJECTS).findOne({ _id: objId});

            if (!existingProject) {
                res.status(404).json({ message: 'Project not found' });
                return;
            }

            const operation = async () => {
                return this.db.collection(PROJECTS).updateOne(
                    { _id: objId },
                    { $push: { tasks: { $each: formattedTasks }} } as any
                );
            };

            const result = await DatabaseHandler.handleAsyncOperation(
                this.client,
                operation,
                true
            );

            if (result.matchedCount > 0) {
                if (result.modifiedCount > 0) {
                    res.status(200).json({ message: 'Project updated successfully' });
                } else {
                    res.status(304).json({ message: 'No changes made to the project' });
                }
            } else {
                res.status(404).json({ message: 'Project not found' });
            }
        } catch (error) {
            console.error('Error updating project:', error);
            res.status(500).json({ message: 'Failed to update project' });
        }
    }

    /**
     * Deletes a project from the database.
     * 
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     */
    public async deleteProject(req: Request, res: Response): Promise<void> {
        const objId = new ObjectId(req.params.id);
        const objectId = validateObjectId(req.params.id);

        if (!objectId) {
            res.status(400).json({ message: 'Invalid ID format' });
            return;
        }

        const operation =  async () => {
            return this.db.collection(PROJECTS).deleteOne({_id: objId});
        }

        try {
            const result = await DatabaseHandler.handleAsyncOperation(
                this.client, 
                operation,
                true,
            )
            
            if (result.deletedCount > 0) {
                res.status(200).json({ message: 'Project deleted' });
            } else {
                res.status(404).json({ message: 'Project not found' });
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            res.status(500).json({ message: 'Failed to delete project' });
        }
    }
}

