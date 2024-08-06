import { Request, Response } from 'express';
import { Db, MongoClient, ObjectId } from 'mongodb';
import DatabaseHandler from '../db/DatabaseHandler';
import validateObjectId from '../utils/validateObjectId';
import { Status } from '../types/Status';

const TASKS = 'tasks';

export default class TasksController {
    client: MongoClient;
    db: Db;

    constructor (client: MongoClient) {
        this.client = client;
        this.db = client.db();
    }

    public async getAllTasks(req: Request, res: Response): Promise<void> {
        console.log('hi')
        const operation =  async () => {
            return this.db.collection(TASKS).find().toArray();
        }
        console.log('hi2')

        try {
            const tasks = await DatabaseHandler.handleAsyncOperation(
                this.client, 
                operation,
            )
        console.log('hi')

            res.status(200).json(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            res.status(500).json({ message: 'Failed to fetch tasks' });
        }
    }

    public async getTasksByStatus(req: Request, res: Response): Promise<void> {
        const { status } = req.params;

        if (!Object.values(Status).includes(status as Status)) {
            res.status(400).json({ message: 'Invalid status params parameter' });
            return;
        }
        
        const operation =  async () => {
            return this.db.collection(TASKS).find({ status }).toArray();
        }

        try {
            const tasks = await DatabaseHandler.handleAsyncOperation(
                this.client, 
                operation,
            )
            res.status(200).json(tasks);
        } catch (error) {
            console.error('Error fetching tasks by status:', error);
            res.status(500).json({ message: 'Failed to fetch tasks by status' });
        }
    }

    public async searchTasksByName(req: Request, res: Response): Promise<void> {
        const { name } = req.params;

        if (!name) {
            res.status(400).json({ message: 'Invalid status params parameter' });
            return;
        }
        
        const operation =  async () => {
            return this.db.collection(TASKS).find({ name }).toArray();
        }

        try {
            const tasks = await DatabaseHandler.handleAsyncOperation(
                this.client, 
                operation,
            )
            res.status(200).json(tasks);
        } catch (error) {
            console.error('Error fetching tasks by status:', error);
            res.status(500).json({ message: 'Failed to fetch tasks by status' });
        }
    }

    public async sortTasksByDate(req: Request, res: Response): Promise<void> {
        const sortObject: { [key: string]: 1 } = {
            createdAt: 1,
            deadlineAt: 1,
            doneAt: 1
        };

        const operation =  async () => {
            console.log('here')
            return this.db.collection(TASKS)
                .find()
                .sort(sortObject)
                .toArray();
        }

        try {
            const tasks = await DatabaseHandler.handleAsyncOperation(
                this.client, 
                operation,
            )
            
            res.status(200).json(tasks);
        } catch (error) {
            console.error('Error fetching tasks by date:', error);
            res.status(500).json({ message: 'Failed to fetch tasks by date' });
        }
    }

    public async createTask(req: Request, res: Response): Promise<void> {
        const data = {
            ...req.body,
            status: Status.TODO,
            createdAt: new Date()
        };

        const operation = async () => {

            return this.db.collection(TASKS).insertOne(data);
        };
        try {
            const result = await DatabaseHandler.handleAsyncOperation(
                this.client, 
                operation,
                true,
            );

            const dataUpdated = {
                ...data,
                _id: result.insertedId,
            };
            res.status(201).json(dataUpdated);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async updateTask(req: Request, res: Response): Promise<void> {
        const objId = new ObjectId(req.params.id);
        const objectId = validateObjectId(req.params.id);

        if (!objectId) {
            res.status(400).json({ message: 'Invalid ID format' });
            return;
        }

        const {name, status, deadlineAt, completedAt} = req.body;
        try {
            const existingTask = await this.db.collection(TASKS).findOne({ _id: objId});

            if (!existingTask) {
                res.status(404).json({ message: 'Task not found' });
                return;
            }

            const dataToUpdate = {
                ...existingTask,
                name,
                status: status === Status.TODO ? Status.TODO : Status.DONE,
                completedAt: completedAt ? new Date(completedAt) : null,
                deadlineAt: completedAt ? new Date(deadlineAt) : null,
            };

            const operation = async () => {
                return this.db.collection(TASKS).updateOne(
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
                    res.status(200).json({ message: 'Task updated successfully' });
                } else {
                    res.status(304).json({ message: 'No changes made to the task' });
                }
            } else {
                res.status(404).json({ message: 'Task not found' });
            }
        } catch (error) {
            console.error('Error updating task:', error);
            res.status(500).json({ message: 'Failed to update task' });
        }
    }

    public async deleteTask(req: Request, res: Response): Promise<void> {
        const objId = new ObjectId(req.params.id);
        const objectId = validateObjectId(req.params.id);

        if (!objectId) {
            res.status(400).json({ message: 'Invalid ID format' });
            return;
        }

        const operation =  async () => {
            return this.db.collection(TASKS).deleteOne({_id: objId});
        }

        try {
            const result = await DatabaseHandler.handleAsyncOperation(
                this.client, 
                operation,
                true,
            )
            
            if (result.deletedCount > 0) {
                res.status(200).json({ message: 'Task deleted' });
            } else {
                res.status(404).json({ message: 'Task not found' });
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            res.status(500).json({ message: 'Failed to delete task' });
        }
    }
}

