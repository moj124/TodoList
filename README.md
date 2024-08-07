# TodoList

### Description
A MERN backend service to serve a Todo List set of functionalities.

### Key Features
- db: stores the validator schemas, aggregations, initialization of database collection and handles read/write operations involving the database.
- projects: houses the controllers and routes specifc to 'projects' collection operations.
- tasks: houses the controllers and routes specifc to 'tasks' collection operations.
- main.ts: is the entrypoint file, and the first file to be run. Handles database connection and generic setup configurations.

## Validation Schemas

### Projects 
- name: a required string
- tasks: a required array of Tasks, can be empty array
- createdAt: a required date object
- deadlineAt: a required data object, can be null

#### Example
```json
{
    "_id": {
        "$oid": "66b2aa69176c97fc9f4ce286"
    },
    "name": "project4",
    "createdAt": {
        "$date": "2024-08-06T22:57:45.060Z"
    },
    "deadlineAt": {
        "$date": "2024-08-07T07:09:11.884Z"
    },
    "tasks": [
        {
            "_id": "66b2a926176c97fc9f4ce284",
            "name": "task3",
            "completedAt": {
                "$date": "1970-01-01T00:00:00.000Z"
            },
            "deadlineAt": {
                "$date": "1970-01-01T00:00:00.000Z"
            },
            "status": "todo",
            "createdAt": {
                "$date": "2024-08-06T22:52:22.968Z"
            }
        }
    ]
}
```
### Tasks
- name: a required string
- status: a required string, I've enforce functionally enum value of ['todo', 'done'].
- createdAt: a required date object
- completedAt: a required data object, can be null
- deadlineAt: a required data object, can be null

#### Example
```json
{
    "_id": {
        "$oid": "66b2a926176c97fc9f4ce284"
    },
    "name": "task3",
    "completedAt": null,
    "deadlineAt": null,
    "status": "todo",
    "createdAt": {
        "$date": "2024-08-06T22:52:22.968Z"
    }
}
```

## Instructions

To install the package dependencies.
```bash
npm install
```

Copy '.env.example' to a new file '.env' and replace the environment variable with your own database and port mappings.


Important to create the 'projects' and 'tasks' collection with your database. 

NOTE: please delete your collections of 'projects' and 'tasks' before running this command, it will automatically create the collections required under 'todoList' database name.
```bash
npm run setupDatabase
```

To run the server.
```bash
npm run serve
```

Alternatively to watch for code changes in development mode and run the server.
```bash
npm run serve:watch
```

### Aggregates

To execute the mongodb aggregration of all projects with tasks due 'today'.
```bash
npm run runProjectsAggregate
```

(TODO, work in progress)To execute the mongodb aggregration of all tasks with a project due 'today'.
```bash
npm run runTasksAggregate
```

### Prerequisites
- [Node](https://nodejs.org/en)


