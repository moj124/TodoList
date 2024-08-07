import { MongoClient } from "mongodb";

/**
 * Checks the connection to the MongoDB database.
 * 
 * This function sends a ping command to the MongoDB server to check if the connection is successfully established.
 * 
 * @param {MongoClient} client - The MongoDB client instance.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the connection is successful, `false` otherwise.
 * @throws {Error} Logs an error if the connection check fails.
 */
async function checkConnection(client: MongoClient): Promise<boolean> {
    try {
        await client.db().command({ ping: 1 });
        return true;
    } catch (err) {
        console.error('Connection check failed:', err);
        return false;
    }
}
export default checkConnection;