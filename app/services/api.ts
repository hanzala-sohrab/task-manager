import type { Task } from "../types/task";

// API service for all backend calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Types for API responses
export interface LoginResponse {
  access_token: string;
  token_type: string;
  user?: {
    name?: string;
    email: string;
  };
}

export interface User {
  name?: string;
  email: string;
}

// Authentication API calls
export const authApi = {
  // Validate token and get current user
  validateToken: async (token: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Token validation failed: ${response.status}`);
    }

    return await response.json();
  },

  // Register new user
  register: async (email: string, password: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: email,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create account");
    }
  },

  // Login user
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "password",
        username: email,
        password: password,
        scope: "",
        client_id: "string",
        client_secret: "",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Invalid email or password");
    }

    return await response.json();
  },
};

// Tasks API calls
export const tasksApi = {
  // Get all tasks
  getTasks: async (token: string): Promise<Task[]> => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.status}`);
    }

    const tasksData = await response.json();
    return Array.isArray(tasksData) ? tasksData : [];
  },

  // Create new task
  createTask: async (token: string, task: Partial<Task>): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error(`Failed to create task: ${response.status}`);
    }

    return await response.json();
  },

  // Update existing task
  updateTask: async (
    token: string,
    taskId: number,
    task: Partial<Task>
  ): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error(`Failed to update task: ${response.status}`);
    }

    return await response.json();
  },

  // Search for tasks
  searchTasks: async (token: string, query: string): Promise<Task[]> => {
    const response = await fetch(
      `${API_BASE_URL}/tasks/search/?query=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to search tasks: ${response.status}`);
    }

    return await response.json();
  },
};
