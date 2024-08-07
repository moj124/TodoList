import { MongoClient } from "mongodb";
import { config } from 'dotenv';
import { PROJECTS } from "../types/Constants";
import taskswithProjectsDueTodayAggregate from "./aggregations/tasks.aggregate";

config();

/**
 * Connects and returns a project due today aggregate on the database instance.
 * 
 * This function connects to a MongoDB database using the URL specified in the environment variable `DATABASE_URL`.
 * After the aggregation is executed, the connection to the database is closed.
 * 
 * @returns {Promise<Document[]>} The result of the asynchronous operation.
 * @throws {Error} Throws an error if the operation fails, with specific handling for MongoDB errors.
 */
const runTasksAggregate = async () => {
    try {
        const client = await MongoClient.connect(process.env.DATABASE_URL!);
        const db = client.db();

        const projects = await db.collection(PROJECTS)
            .aggregate(taskswithProjectsDueTodayAggregate)
            .toArray();
        
        await client.close();

        // output both formats, not sure on the requirements of running the aggregate
        console.log(projects);
        return projects;
    } catch (err) {
        console.error('Error executing aggregate', err);
    } finally {}
}
export default runTasksAggregate;

runTasksAggregate()
