"use client";

import { tasksApi } from "../services/api";

const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout | number;
  return (...args: Parameters<any>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(func, delay, ...args)
  }
}

export default function Search({authToken}: {authToken: string}) {
  const handleChange = debounce(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value: query = ""} = e.target;
    const response = await tasksApi.searchTasks(authToken, query);
    console.log(response);
  }, 1000);
  return <input placeholder="Search" className="border" onChange={handleChange} />;
}
