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
