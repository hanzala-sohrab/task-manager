"use client";

import { useState } from "react";
import { tasksApi } from "../services/api";
import { Task } from "../types/task";

const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout | number;
  return (...args: Parameters<any>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(func, delay, ...args);
  };
};

export default function Search({
  authToken,
  handleSearch,
}: {
  authToken: string;
  handleSearch: (tasks: Task[]) => void;
}) {
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState("");

  const handleChange = debounce(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setQuery(value);
      
      if (value.trim() === "") {
        // If search is cleared, fetch all tasks
        setIsSearching(true);
        try {
          const allTasks = await tasksApi.getTasks(authToken);
          handleSearch(allTasks);
        } catch (error) {
          console.error("Error fetching all tasks:", error);
        } finally {
          setIsSearching(false);
        }
        return;
      }

      setIsSearching(true);
      try {
        const response = await tasksApi.searchTasks(authToken, value);
        handleSearch(response);
      } catch (error) {
        console.error("Error searching tasks:", error);
      } finally {
        setIsSearching(false);
      }
    },
    500
  );

  const clearSearch = () => {
    setQuery("");
    // Trigger fetch of all tasks when search is cleared
    const event = {
      target: { value: "" }
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(event);
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className={`w-5 h-5 ${isSearching ? 'text-blue-500' : 'text-gray-400'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      
      <input
        type="text"
        placeholder="Search tasks..."
        // value={query}
        onChange={handleChange}
        className="w-80 pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
      />
      
      {query && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
      
      {isSearching && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <svg
            className="animate-spin w-5 h-5 text-blue-500"
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
        </div>
      )}
    </div>
  );
}
