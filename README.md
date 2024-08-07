# TodoList

## Description
A MERN backend service to serve a Todo List set of functionalities.

### Key Features
- db: stores the validator schemas, initialization of database collection and handles read/write operations involving the database.
- projects: houses the controllers and routes specifc to 'projects' collection operations.
- tasks: houses the controllers and routes specifc to 'tasks' collection operations.
- main.ts: is the entrypoint file, is the first file to be run. Handles database connection and generic setup configurations.

### Issues to fix
- Sorting of tasks and projects by date 'searchProjectsByName' & 'searchTasksByName' is not complete and will throw an error.

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

### Prerequisites
    - Install [Node](https://nodejs.org/en)


