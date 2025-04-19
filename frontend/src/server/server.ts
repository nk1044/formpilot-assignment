import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL as string;


const login = async (token: string) => {
  try {
    const response = await axios.post(`${backendUrl}/api/auth/login`, {
      token,
    });
    console.log("Login response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}
const register = async (token: string) => {
  try {
    const response = await axios.post(`${backendUrl}/api/auth/register`, {
      token,
    });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

const getUser = async (token: string = '') => {
  try {
    const response = await axios.get(`${backendUrl}/api/auth/get-current-user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Get user error:", error);
    throw error;
  }
}


export {
    login,
    register,
    getUser
};