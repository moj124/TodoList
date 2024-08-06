import { ClientSession, MongoClient, MongoError } from "mongodb";

export default class DatabaseHandler {
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