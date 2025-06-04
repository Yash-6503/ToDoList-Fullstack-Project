import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoApp = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    const API_URL = import.meta.env.VITE_APP_API_URL;
    
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await axios.get(API_URL);
            setTasks(res.data);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        }
    };

    const handleAddTask = async () => {
        if (!newTask.trim()) return;
        try {
            const res = await axios.post(API_URL, { title: newTask, completed: false });
            setNewTask('');
            fetchTasks(); // You can use setTasks([...tasks, res.data]); if you want instant update
        } catch (error) {
            console.error("Failed to add task:", error);
        }
    };

    const handleToggle = async (id) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;
        try {
            await axios.put(`${API_URL}/${id}`, { ...task, completed: !task.completed });
            fetchTasks();
        } catch (error) {
            console.error("Failed to toggle task:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchTasks(); // or use setTasks(tasks.filter(t => t.id !== id));
        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    };

    const handleEdit = async (id, newTitle) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;
        try {
            await axios.put(`${API_URL}/${id}`, { ...task, title: newTitle });
            fetchTasks();
        } catch (error) {
            console.error("Failed to edit task:", error);
        }
    };
      

    const completedCount = tasks.filter(t => t.completed).length;
    const uncompletedCount = tasks.length - completedCount;

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-6 bg-gradient-to-br from-slate-600 to-slate-900">
            <div className="bg-neutral-900 text-white w-full max-w-md sm:max-w-lg p-4 sm:p-6 rounded-xl shadow-lg border border-blue-500">
                <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">📝 To Do List</h1>

                {/* Input */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-5">
                    <input
                        type="text"
                        className="flex-1 p-2 sm:p-3 rounded-md text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                        placeholder="Add a task..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                    />
                    <button
                        onClick={handleAddTask}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2 rounded-md text-sm sm:text-base font-medium cursor-pointer"
                    >
                        Add
                    </button>
                </div>

                {/* Task List */}
                <h2 className="text-xl font-semibold mb-3 text-center">Tasks</h2>
                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                    {tasks.map(task => (
                        <div
                            key={task.id}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between border rounded-lg p-3 bg-neutral-800 space-y-2 sm:space-y-0"
                        >
                            <div className="flex items-start sm:items-center gap-2 flex-wrap">
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => handleToggle(task.id)}
                                    className="w-5 h-5 accent-blue-500 cursor-pointer mt-1"
                                />
                                <span className={`text-sm sm:text-base break-words ${task.completed ? 'line-through text-gray-400' : ''}`}>
                                    {task.title}
                                </span>
                            </div>
                            <div className="flex gap-3 text-sm sm:text-base">
                                <button
                                    onClick={() => handleDelete(task.id)}
                                    className="text-red-500 hover:underline cursor-pointer"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => {
                                        const newTitle = prompt('Edit task:', task.title);
                                        if (newTitle !== null) handleEdit(task.id, newTitle);
                                    }}
                                    className="text-yellow-400 hover:underline cursor-pointer"
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats */}
                <div className="border-t mt-5 pt-3 text-center text-sm sm:text-base">
                    <span>
                        ✅ Completed: <strong>{completedCount}</strong> | ⏳ Uncompleted: <strong>{uncompletedCount}</strong>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TodoApp;
