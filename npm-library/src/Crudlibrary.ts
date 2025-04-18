import axios from "axios";
import { TaskData } from "./interfaces";
  
  function getEnvValue(suffix: string): string | undefined {
    return Object.entries(process.env).find(([key]) => key.endsWith(suffix))?.[1];
  }
  
  export class CrudLibrary {
    private apiUrl: string;
    private apiKey: string;
  
    constructor() {
      const url = getEnvValue("CRUD_API_URL");
      const key = getEnvValue("CRUD_API_KEY");
  
      if (!url || !key) {
        throw new Error("Missing API URL or API Key in environment variables.");
      }
  
      this.apiUrl = url;
      this.apiKey = key;
    }
  
    private getHeaders() {
      return {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
    }
  
    async create(data: TaskData): Promise<{ id: string; status: string }> {
      const res = await axios.post(`${this.apiUrl}/tasks`, data, {
        headers: this.getHeaders(),
      });
      console.log(res.data);
      return res.data;
    }
  
    async get(id: string): Promise<TaskData> {
      const res = await axios.get(`${this.apiUrl}/tasks/${id}`, {
        headers: this.getHeaders(),
      });
      return res.data;
    }
  
    async update(id: string, data: TaskData): Promise<{ status: string }> {
      const res = await axios.put(`${this.apiUrl}/tasks/${id}`, data, {
        headers: this.getHeaders(),
      });
      return res.data;
    }
  
    async delete(id: string): Promise<{ status: string }> {
      const res = await axios.delete(`${this.apiUrl}/tasks/${id}`, {
        headers: this.getHeaders(),
      });
      return res.data;
    }
  
    async getAll(): Promise<TaskData[]> {
      const res = await axios.get(`${this.apiUrl}/tasks`, {
        headers: this.getHeaders(),
      });
      return res.data;
    }
  }
  