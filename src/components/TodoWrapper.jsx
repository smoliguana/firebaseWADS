import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Todo } from './Todo.jsx';
import { TodoForm } from './TodoForm.jsx';
import { v4 as uuidv4 } from 'uuid';
import { EditTodoForm } from './EditToDoForm.jsx';
import { db } from '../pages/firebase.js'; 
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

export const TodoWrapper = () => {
    const [toDos, setToDos] = useState([]);
    const [showCompleted, setShowCompleted] = useState(false);
    const navigate = useNavigate();

    // Fetch todos from Firestore on component mount
    useEffect(() => {
        const fetchTodos = async () => {
            const todosCollection = collection(db, 'todos');
            const todosSnapshot = await getDocs(todosCollection);
            const todosList = todosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setToDos(todosList);
        };

        fetchTodos();
    }, []);

    const addToDo = async (toDo) => {
        const newTodo = {
            task: toDo,
            completed: false,
            isEditing: false
        };

        // Add todo to Firestore
        const docRef = await addDoc(collection(db, 'todos'), newTodo);
        setToDos([...toDos, { id: docRef.id, ...newTodo }]); // Include the new document ID
    };

    const toggleComplete = async (id) => {
        const todoToUpdate = toDos.find(todo => todo.id === id);
        const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };

        // Update todo in Firestore
        const todoDoc = doc(db, 'todos', id);
        await updateDoc(todoDoc, updatedTodo);

        setToDos(toDos.map(todo => (todo.id === id ? updatedTodo : todo)));
    };

    const deleteToDo = async (id) => {
        // Delete todo from Firestore
        const todoDoc = doc(db, 'todos', id);
        await deleteDoc(todoDoc);

        setToDos(toDos.filter(todo => todo.id !== id));
    };

    const editToDo = (id, updatedTask) => {
        setToDos(toDos.map(todo =>
            todo.id === id ? { ...todo, task: updatedTask, isEditing: true } : todo
        ));
    };

    const editTask = async (id, updatedTask) => {
        const todoToUpdate = toDos.find(todo => todo.id === id);
        const updatedTodo = { ...todoToUpdate, task: updatedTask, isEditing: false };

        // Update todo in Firestore
        const todoDoc = doc(db, 'todos', id);
        await updateDoc(todoDoc, updatedTodo);

        setToDos(toDos.map(todo =>
            todo.id === id ? updatedTodo : todo
        ));
    };

    const toggleCompletedFilter = () => {
        setShowCompleted(!showCompleted);
    };

    const filteredTasks = showCompleted
        ? toDos.filter((todo) => todo.completed)
        : toDos;

    return (
        <div className="TodoWrapper">
            <button onClick={toggleCompletedFilter}>
                {showCompleted ? 'Show All' : 'Show Completed'}
            </button>

            <TodoForm addToDo={addToDo} />
            {filteredTasks.map((todo) => (
                todo.isEditing ? (
                    <EditTodoForm
                        key={todo.id}
                        editToDo={editTask}
                        task={todo}
                    />
                ) : (
                    <Todo
                        key={todo.id} // Ensure each Todo has a unique key
                        task={todo}
                        toggleComplete={toggleComplete}
                        deleteToDo={deleteToDo}
                        editToDo={editToDo}
                    />
                )
            ))}
        </div>
        );
    };