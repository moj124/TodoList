import { ClientSession, MongoClient, MongoError } from "mongodb";

/**
 * Class for handling database operations with optional transaction support.
 */
export default class DatabaseHandler {

    /**
     * Executes a provided asynchronous operation with optional transaction support.
     * 
     * @template T The return type of the asynchronous operation.
     * @param {MongoClient} client - The MongoDB client instance.
     * @param {() => Promise<T>} operation - The asynchronous operation to be executed.
     * @param {boolean} [useTransaction=false] - Flag to determine if the operation should be executed within a transaction.
     * @returns {Promise<T>} The result of the asynchronous operation.
     * @throws {Error} Throws an error if the operation fails, with specific handling for MongoDB errors.
     */
    public static async handleAsyncOperation<T>(
        client: MongoClient,
        operation: () => Promise<T>,
        useTransaction: boolean = false
    ): Promise<T> {
        let session: ClientSession | undefined;
        try {
            if (useTransaction) {
                session = client.startSession();
                session.startTransaction();
            }
            
            const result = await operation();
            
            if(useTransaction) await session?.commitTransaction();
            return result;
        } catch (error) {
            if (useTransaction && session) {
                await session.abortTransaction();
            }
            if(error instanceof MongoError) {
                throw new Error(`DatabaseHandle:handleAsyncOperation Database error: ${error.message}`);
            } else {
                throw new Error(`DatabaseHandle:handleAsyncOperation Unknown error: ${error}`);
            }
        } finally {
            if (session) {
                session.endSession();
            }
        }
    }
}