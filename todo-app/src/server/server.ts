import axios from "axios";
// import {CrudLibrary} from '../../../npm-library/src/index';
import {CrudLibrary} from 'neeraj-iitj-crud';


const crudLibrary = new CrudLibrary(
  import.meta.env.VITE_CRUD_API_URL as string,
  import.meta.env.VITE_CRUD_API_KEY as string
);

export interface Task {
  ID?: string;
  title: string;
  description?: string;
  status?: string;
}

const backend_url = import.meta.env.VITE_BACKEND_URL as string;

const GetAllTasks = async () => {
  // try {
  //   const response = await axios.get<{ Tasks: Task[]; message: string }>(
  //     `${backend_url}/api/tasks`
  //   );
  //   const tasks = response.data.Tasks;
  //   console.log("Tasks fetched successfully:", response.data.message);
  //   return tasks;
  // } catch (error) {
  //   console.error("Error in GetAllTasks:", error);
  //   return [];
  // }

  const response = await crudLibrary.getAll();
  console.log("Tasks fetched successfully:", response);
  return response;
  
};

const CreateTask = async (task: Task): Promise<Task | null> => {
  try {
    const response = await axios.post<{ Task: Task; message: string }>(
      `${backend_url}/api/tasks`,
      task
    );
    const createdTask = response.data.Task;
    console.log("Task created successfully:", response.data.Task);
    // console.log("Task created successfully:", response.data.message);
    return createdTask;
  } catch (error) {
    console.error("Error in CreateTask:", error);
    return null;
  }
}

const DeleteTask = async (taskId: string): Promise<boolean> => {
  try {
    const response = await axios.delete<{ message: string }>(
      `${backend_url}/api/tasks/${taskId}`
    );
    console.log("Task deleted successfully:", response.data.message);
    return true;
  } catch (error) {
    console.error("Error in DeleteTask:", error);
    return false;
  }
};

const UpdateTask = async (task: Task): Promise<Task | null> => {
  try {
    const response = await axios.patch<{ Task: Task; message: string }>(
      `${backend_url}/api/tasks/${task.ID}`,
      task
    );
    const updatedTask = response.data.Task;
    console.log("Task updated successfully:", response.data.message);
    return updatedTask;
  } catch (error) {
    console.error("Error in UpdateTask:", error);
    return null;
  }
};

const GetTaskById = async (taskId: string): Promise<Task | null> => {
  try {
    const response = await axios.get<{ Task: Task; message: string }>(
      `${backend_url}/api/tasks/${taskId}`
    );  
    const task = response.data.Task;
    console.log("Task fetched successfully:", response.data.message);
    return task;
  } catch (error) {
    console.error("Error in GetTaskById:", error);
    return null;
  }
};

const AgentCall = async (message: string): Promise<string> => {
  try {
    const response = await axios.post<{ message: string }>(
      `${backend_url}/api/agent`,
      { message }
    );
    const result = response.data.message;
    console.log("Agent response:", result);
    return result;
  } catch (error) {
    console.error("Error in AgentCall:", error);
    return "Sorry, I couldn't process your request.";
  }
};

export {
    GetAllTasks,
    CreateTask,
    DeleteTask,
    UpdateTask,
    GetTaskById,
    AgentCall
};
