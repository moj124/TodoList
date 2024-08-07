import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
import express from 'express';
import cors from 'cors';

import createTasksRouter from './tasks/tasks.routes';
import checkConnection from './utils/checkConnection';
import createProjectsRouter from './projects/projects.routes';

config();

const app = express();
app.use(cors());
app.use(express.json());

/**
 * Sets up the database connection and starts the Express server.
 * 
 * This function attempts to connect to the MongoDB database using the URL specified in the environment variable `DATABASE_URL`.
 * If the connection is successful, it sets up the routes for `tasks` and `projects` APIs using the provided MongoClient instance.
 * The server is then started on the port specified in the environment variable `PORT`.
 * 
 * @returns {Promise<void>} The result of the asynchronous operation.
 * @throws {Error} Throws an error if the database connection fails, causing the process to exit with a status code of 1.
 */
const setupDBConnection = async () => {
    try {
        const client = await MongoClient.connect(process.env.DATABASE_URL!);

        const isConnected = await checkConnection(client);
        if (isConnected) {
            console.log('MongoDB is connected');

            app.use('/api/tasks', createTasksRouter(client));
            app.use('/api/projects', createProjectsRouter(client));

            app.listen(process.env.PORT, () => {
                console.log(`Server running on port ${process.env.PORT}`);
            });
        } else {
            console.error('MongoDB connection is not established');
        }
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

setupDBConnection();
