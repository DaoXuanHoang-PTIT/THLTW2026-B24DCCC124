import { useState, useEffect } from 'react';
import { Task, TaskStatus } from './types';

const STORAGE_KEY = 'th09_tasks';

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const storedTasks = localStorage.getItem(STORAGE_KEY);
        if (storedTasks) {
            try {
                setTasks(JSON.parse(storedTasks));
            } catch (error) {
                console.error('Error parsing tasks from local storage:', error);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        }
    }, [tasks, isLoaded]);

    const addTask = (newTask: Omit<Task, 'id'>) => {
        const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
        setTasks((prev) => [...prev, { ...newTask, id }]);
    };

    const updateTask = (id: string, updatedFields: Partial<Task>) => {
        setTasks((prev) =>
            prev.map((task) => (task.id === id ? { ...task, ...updatedFields } : task))
        );
    };

    const deleteTask = (id: string) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    };

    const updateTaskStatus = (id: string, newStatus: TaskStatus) => {
        setTasks((prev) =>
            prev.map((task) => (task.id === id ? { ...task, status: newStatus } : task))
        );
    };

    return { tasks, addTask, updateTask, deleteTask, updateTaskStatus };
};
