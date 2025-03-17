import React, { useState } from "react";
import { db } from "../pages/firebase";
import { doc, updateDoc } from "firebase/firestore";

export const EditTodoForm = ({ task, onUpdate }) => {
    const [value, setValue] = useState(task.task);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Ensure the correct collection name is used
            const taskRef = doc(db, "todos", task.id); // Changed from "tasks" to "todos"
            await updateDoc(taskRef, { task: value });

            onUpdate(); // Refresh the list
        } catch (err) {
            console.error("Error updating task:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="TodoForm">
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="todo-input"
                placeholder="Update task"
                required // Ensure the input is not empty
            />
            <button type="submit" className="todo-btn">Update Task</button>
        </form>
    );
};