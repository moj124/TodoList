import { MongoClient } from "mongodb";

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