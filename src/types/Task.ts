type Task = {
    _id?: string;
    name: string;
    completedAt: string | null;
    deadlineAt: string | null;
    createdAt: string;
    status: string;
}

export default Task;