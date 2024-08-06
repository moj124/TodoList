import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
import tasksValidator from './validators/tasks.validator';
import projectsValidator from './validators/projects.validators';

config();

const createCollections = async () => {
    try {
        const client = await MongoClient.connect(process.env.DATABASE_URL!);
        const db = client.db();

        await db.createCollection('tasks', { validator: tasksValidator });
        await db.createCollection('projects', { validator: projectsValidator });

        console.log('Collections created');
        await client.close();
    } catch (err) {
        console.error('Error creating collections', err);
    }
};

createCollections();
