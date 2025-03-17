import React, { useState } from "react";
import { db, auth } from "../pages/firebase";
import { addDoc, collection } from "firebase/firestore";

export const TodoForm = ({ onUpdate }) => {
    const [value, setValue] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!value.trim()) return;

        try {
            await addDoc(collection(db, "tasks"), {
                task: value,
                completed: false,
                userId: auth.currentUser?.uid, // Associate with logged-in user
                createdAt: new Date(),
            });

            setValue(""); // Reset input field
            onUpdate(); // Refresh the task list
        } catch (err) {
            console.error("Error adding task:", err);
        }
    };

    return (
        <form className="TodoForm" onSubmit={handleSubmit}>
            <input
                type="text"
                className="todo-input"
                value={value}
                placeholder="Enter task"
                onChange={(e) => setValue(e.target.value)}
            />
            <button type="submit" className="todo-btn">Add Task</button>
        </form>
    );
};
