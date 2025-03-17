import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash, faCheck } from "@fortawesome/free-solid-svg-icons";
import { db, auth } from "../pages/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

export const Todo = ({ task, onUpdate }) => {
  const [editValue, setEditValue] = useState(task.task);
  const [isEditing, setIsEditing] = useState(false);
  const [user] = useAuthState(auth);

  const toggleComplete = async (id, completed) => {
    try {
      const taskRef = doc(db, "todos", id); // Ensure the correct collection name
      await updateDoc(taskRef, { completed: !completed });
      if (onUpdate) onUpdate(); // Notify parent component to refresh task list
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const deleteToDo = async (id) => {
    try {
      await deleteDoc(doc(db, "todos", id)); // Ensure the correct collection name
      if (onUpdate) onUpdate(); // Notify parent component to refresh task list
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const editTask = async (id, newText) => {
    try {
      const taskRef = doc(db, "todos", id); // Ensure the correct collection name
      await updateDoc(taskRef, { task: newText });
      setIsEditing(false);
      if (onUpdate) onUpdate(); // Notify parent component to refresh task list
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editTask(task.id, editValue);
  };

  return (
    <div className={`Todo ${task.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="edit-form">
            <input
              type="text"
              className="todo-input edit-input"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              autoFocus
              required // Ensure the input is not empty
            />
            <button type="submit" className="todo-btn update-btn">
              Update
            </button>
          </form>
        ) : (
          <div className="task-display">
            <div 
              className="checkbox-wrapper" 
              onClick={() => toggleComplete(task.id, task.completed)}
              role="button" // Accessibility
              tabIndex={0} // Accessibility
              onKeyPress={(e) => e.key === 'Enter' && toggleComplete(task.id, task.completed)} // Accessibility
            >
              <div className={`custom-checkbox ${task.completed ? 'checked' : ''}`}>
                {task.completed && <FontAwesomeIcon icon={faCheck} className="check-icon" />}
              </div>
            </div>
            <p className={task.completed ? 'completed' : ''}>{task.task}</p>
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="todo-actions">
          <button 
            className="icon-btn edit-btn" 
            onClick={() => setIsEditing(true)} 
            title="Edit task"
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          <button 
            className="icon-btn delete-btn" 
            onClick={() => deleteToDo(task.id)} 
            title="Delete task"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      )}
    </div>
  );
}