import { CrudLibrary } from 'neeraj-iitj-crud';


const crudLibrary = new CrudLibrary(
  import.meta.env.VITE_CRUD_API_URL as string,
  import.meta.env.VITE_CRUD_API_KEY as string
);

export interface Task {
  id?: string | number;
  txHash: string;
  value?: string;
}


const GetAllTasks = async () => {
  try {
    const response = await crudLibrary.getAll();
    // console.log("Tasks fetched successfully:", response);
    return response;
  } catch (error) {
    console.error("Error in GetAllTasks:", error);
    return [];
  }
};

const CreateTask = async (task: any): Promise<Task | null> => {
  try {
    const response = await crudLibrary.create(task);
    // console.log("Task created successfully:", response);
    return response as any;
  } catch (error) {
    console.error("Error in CreateTask:", error);
    return null;
  }
}

const DeleteTask = async (taskId: string): Promise<boolean> => {
  try {
   const response = await crudLibrary.delete(taskId);
    // console.log("Task deleted successfully:", response);
    return true;
  } catch (error) {
    console.error("Error in DeleteTask:", error);
    return false;
  }
};

const UpdateTask = async (task: Task): Promise<Task | null> => {
  try {
    const response = await crudLibrary.update(task.txHash as string, task.value as string);
    // console.log("Task updated successfully:", response);
    return response;
  } catch (error) {
    console.error("Error in UpdateTask:", error);
    return null;
  }
};

const GetTask = async (txHash: string): Promise<Task | null> => {
  try {
    // console.log("Fetching task with txHash:", txHash);
    const response = await crudLibrary.get(txHash);
    // console.log("Task fetched successfully:", response);
    return response;
  } catch (error) {
    console.error("Error in GetTaskById:", error);
    return null;
  }
};



export {
  GetAllTasks,
  CreateTask,
  DeleteTask,
  UpdateTask,
  GetTask,
};
