import { tasksSchema } from "./tasks.validator";

const projectsValidator = {
    $jsonSchema: {
        bsonType: 'object',
        required: ['name', 'tasks', 'createdAt', 'deadlineAt'],
        properties: {
            name: {
                bsonType: 'string',
                description: 'must be a string and is required',
            },
            tasks: {
                bsonType: 'array',
                items: tasksSchema,
                description: 'must be a array of task objects and is required',
            },
            createdAt: {
                bsonType: 'date',
                description: 'must be a valid date and is required',
            },
            deadlineAt: {
                bsonType: ['date', 'null'],
                description: 'must be a valid date or null and is required',
            },
        },
    },
};

export default projectsValidator;