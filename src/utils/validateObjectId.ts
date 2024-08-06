import { ObjectId } from 'mongodb';

function validateObjectId(id: string): ObjectId | null {
    try {
        console.log(id, id.length === 24)
        if (id.length === 24 && /^[a-fA-F0-9]+$/.test(id)) {
            return new ObjectId(id);
        }
        return null;
    } catch (error) {
        return null;
    }
}
export default validateObjectId;