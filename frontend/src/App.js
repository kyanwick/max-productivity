import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]); // Tasks list
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: '' });
  const [editingTask, setEditingTask] = useState(null); // For editing tasks

  // Fetch tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios.get('http://localhost:5000/tasks').then((res) => {
      // Sort tasks by priority (ascending: 1 is highest)
      const sortedTasks = res.data.sort((a, b) => a.priority - b.priority);
      setTasks(sortedTasks);
    });
  };

  // Add task
  const addTask = () => {
    axios.post('http://localhost:5000/tasks', newTask).then(() => {
      setNewTask({ title: '', description: '', priority: '' });
      fetchTasks();
    });
  };

  // Delete task
  const deleteTask = (id) => {
    axios.delete(`http://localhost:5000/tasks/${id}`).then(() => fetchTasks());
  };

  // Start editing a task
  const startEditing = (task) => {
    setEditingTask(task);
  };

  // Update task
  const updateTask = () => {
    axios.put(`http://localhost:5000/tasks/${editingTask.id}`, editingTask).then(() => {
      setEditingTask(null);
      fetchTasks();
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>TaskFlow Pro - Priority Queue</h1>

      {/* Add Task Section */}
      <div>
        <input
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Priority (1 is highest)"
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Edit Task Section */}
      {editingTask && (
        <div>
          <h3>Edit Task</h3>
          <input
            placeholder="Task Title"
            value={editingTask.title}
            onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
          />
          <input
            placeholder="Description"
            value={editingTask.description}
            onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
          />
          <input
            type="number"
            placeholder="Priority (1 is highest)"
            value={editingTask.priority}
            onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
          />
          <button onClick={updateTask}>Update Task</button>
          <button onClick={() => setEditingTask(null)}>Cancel</button>
        </div>
      )}

      {/* Task List */}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <b>{task.title}</b> 
            <button className="edit" onClick={() => startEditing(task)}>
              Edit
            </button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
