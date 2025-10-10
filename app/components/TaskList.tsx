"use client";

import { useState, useEffect } from "react";
import { Task } from "../types/task";
import { tasksApi } from "../services/api";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal"; // Import TaskModal component
import TaskForm from "./TaskForm"; // Import TaskForm component
import Search from "./Search";

interface TaskListProps {
  authToken: string;
}

export default function TaskList({ authToken }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // Add state for selected task
  const [isModalOpen, setIsModalOpen] = useState(false); // Add state for modal open
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false); // Add state for task form modal open
  const [isCreatingTask, setIsCreatingTask] = useState(false); // Add state for creating task

  useEffect(() => {
    fetchTasks();
  }, [authToken]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const tasksData = await tasksApi.getTasks(authToken);
      setTasks(tasksData);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status.toLowerCase() === filter.toLowerCase();
  });

  const getStatusCounts = () => {
    const counts = {
      all: tasks.length,
      pending: 0,
      in_progress: 0,
      completed: 0,
      overdue: 0,
    };

    tasks.forEach((task) => {
      const status = task.status.toLowerCase().replace(" ", "_");
      if (status in counts) {
        counts[status as keyof typeof counts]++;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  const handleTaskClick = (task: Task) => {
    // Add handleTaskClick function
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    // Add handleCloseModal function
    setIsModalOpen(false);
  };

  const handleCreateTask = async (task: Partial<Task>) => {
    // Add handleCreateTask function
    setIsCreatingTask(true);
    try {
      const taskData = await tasksApi.createTask(authToken, task);
      setTasks([...tasks, taskData]);
    } catch (err) {
      console.error("Error creating task:", err);
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setIsCreatingTask(false);
      setIsTaskFormOpen(false);
    }
  };

  const handleCloseTaskForm = () => {
    // Add handleCloseTaskForm function
    setIsTaskFormOpen(false);
  };

  const handleUpdateTask = async (task: Partial<Task>) => {
    // Add handleUpdateTask function
    try {
      delete task.username;
      const taskData = await tasksApi.updateTask(authToken, task.id!, task);
      setTasks(tasks.map((t) => (t.id === taskData.id ? taskData : t)));
    } catch (err) {
      console.error("Error updating task:", err);
      setError(err instanceof Error ? err.message : "Failed to update task");
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleSearch = (results: Task[]) => {
    setTasks(results);
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value ?? "");
    setFromDate(date);
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value ?? "");
    setToDate(date);
  };

  const handleDateFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromDate && toDate) {
      const filteredByDate = tasks.filter((task) => {
        const taskDate = new Date(task.end_date);
        return taskDate >= fromDate && taskDate <= toDate;
      });
      setTasks(filteredByDate);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <svg
                className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-gray-600 dark:text-gray-400">
                Loading tasks...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
              <svg
                className="w-12 h-12 text-red-500 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h3 className="text-lg font-medium text-red-900 mb-2">
                Error Loading Tasks
              </h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={fetchTasks}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Search authToken={authToken} handleSearch={handleSearch} />
              <button
                onClick={fetchTasks}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Refresh
              </button>
              <button
                onClick={() => setIsTaskFormOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Create Task
              </button>
            </div>
            <form
              className="flex items-center gap-4 ml-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3"
              onSubmit={handleDateFormSubmit}
            >
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  From
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  aria-label="from-date"
                  onChange={handleFromDateChange}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  To
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  aria-label="to-date"
                  onChange={handleToDateChange}
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2 cursor-pointer self-end"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  ></path>
                </svg>
                Filter
              </button>
            </form>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { key: "all", label: "All Tasks", count: statusCounts.all },
              { key: "pending", label: "Pending", count: statusCounts.pending },
              {
                key: "in_progress",
                label: "In Progress",
                count: statusCounts.in_progress,
              },
              {
                key: "completed",
                label: "Completed",
                count: statusCounts.completed,
              },
              {
                key: "overdue",
                label: "Overdue",
                count: statusCounts.overdue,
              },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer ${
                  filter === key
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Tasks Grid */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              ></path>
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {filter === "all"
                ? "No tasks found"
                : `No ${filter.replace("_", " ")} tasks`}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {filter === "all"
                ? "Get started by creating your first task."
                : `There are no tasks with ${filter.replace("_", " ")} status.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} onClick={handleTaskClick} />
            ))}
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdateTask={handleUpdateTask}
      />

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={handleCloseTaskForm}
        onSubmit={handleCreateTask}
        userId={1} // TODO: Get actual user ID from auth context
        isLoading={isCreatingTask}
      />
    </div>
  );
}
