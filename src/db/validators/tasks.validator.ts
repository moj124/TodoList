export const tasksSchema = {
    bsonType: 'object',
    required: ['name', 'status', 'createdAt', 'completedAt', 'deadlineAt'],
    properties: {
        name: {
            bsonType: 'string',
            description: 'must be a string and is required',
        },
        status: {
            bsonType: 'string',
            description: 'must be a string and is required',
        },
        createdAt: {
            bsonType: 'date',
            description: 'must be a valid date and is required',
        },
        completedAt: {
            bsonType: ['date', 'null'],
            description: 'must be a valid date or null and is required',
        },
        deadlineAt: {
            bsonType: ['date', 'null'],
            description: 'must be a valid date or null and is required',
        }
    },
};

const tasksValidator = {
    $jsonSchema: tasksSchema,
};

export default tasksValidator;