import Task from "./Task";

type Project = {
    _id?: string;
    name: string;
    tasks: Task[];
    createdAt: string;
    deadlineAt: string | null;
}
export default Project;