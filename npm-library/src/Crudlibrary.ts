import axios from "axios";
import { TaskData } from "./interfaces";

class CrudLibrary {
  private apiUrl: string;
  private apiKey: string;

  constructor(url?: string, key?: string) {
    const isNode = typeof window === "undefined";
  
    let envUrl: string | undefined;
    let envKey: string | undefined;
  
    if (isNode) {
      try {
        const dotenv = eval('require')("dotenv");
        dotenv.config();
        envUrl = process.env.CRUD_API_URL;
        envKey = process.env.CRUD_API_KEY;
      } catch (err) {
        console.warn("dotenv not available or failed to load.");
      }
    }
  
    this.apiUrl = url || envUrl || "";
    this.apiKey = key || envKey || "";
  
    if (!this.apiUrl || !this.apiKey) {
      throw new Error("Missing API URL or API Key. Provide them via .env or constructor.");
    }
  }
  

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  async create(data: TaskData): Promise<{ txHash: string; value: string }> {
    const res = await axios.post(`${this.apiUrl}/tasks`, data, {
      headers: this.getHeaders(),
    });
    // console.log(res.data);
    return res.data;
  }

  
  async get(txHash: string): Promise<TaskData> {
    const res = await axios.get(`${this.apiUrl}/tasks/${txHash}`, {
      headers: this.getHeaders(),
    });
    return res.data;
  }

  async update(txHash: string, value: string): Promise<TaskData> {
    const res = await axios.put(`${this.apiUrl}/tasks/${txHash}`, {value:value}, {
      headers: this.getHeaders(),
    });
    return res.data;
  }

  async delete(txHash: string): Promise<{ status: string }> {
    const res = await axios.delete(`${this.apiUrl}/tasks/${txHash}`, {
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

export { CrudLibrary };
