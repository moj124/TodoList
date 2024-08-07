import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
import tasksValidator from './validators/tasks.validator';
import projectsValidator from './validators/projects.validators';
import { PROJECTS, TASKS } from '../types/Constants';

config();

/**
 * Connects and executes a series of collection create operations on the database instance.
 * 
 * This function connects to a MongoDB database using the URL specified in the environment variable `DATABASE_URL`.
 * It then creates two collections: `tasks` and `projects`, each with their respective validators.
 * After the collections are created, the connection to the database is closed.
 * 
 * @returns {Promise<void>} The result of the asynchronous operation.
 * @throws {Error} Throws an error if the operation fails, with specific handling for MongoDB errors.
 */
const createCollections = async () => {
    try {
        const client = await MongoClient.connect(process.env.DATABASE_URL!);
        const db = client.db();

        await db.createCollection(TASKS, { validator: tasksValidator });
        await db.createCollection(PROJECTS, { validator: projectsValidator });

        console.log('Collections created');
        await client.close();
    } catch (err) {
        console.error('Error creating collections', err);
    }
};

createCollections();
