import { ObjectId } from 'mongodb';

/**
 * Validates a string as a MongoDB ObjectId.
 * 
 * This function checks if the provided string is a valid MongoDB ObjectId by verifying its length and hexadecimal format.
 * If the string is valid, it returns a new ObjectId instance; otherwise, it returns null.
 * 
 * @param {string} id - The string to be validated as an ObjectId.
 * @returns {ObjectId | null} A valid ObjectId instance if the string is valid, or null if the string is invalid.
 */
function validateObjectId(id: string): ObjectId | null {
    try {
        if (id.length === 24 && /^[a-fA-F0-9]+$/.test(id)) {
            return new ObjectId(id);
        }
        return null;
    } catch (error) {
        return null;
    }
}
export default validateObjectId;