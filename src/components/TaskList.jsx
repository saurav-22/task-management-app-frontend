import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// Task list component
function TaskList({ token }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [assigneeEmail, setAssigneeEmail] = useState('');
  const { boardId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `http://k8s-taskapp-taskappi-929be65fa1-941636230.ap-south-1.elb.amazonaws.com/api/tasks?boardId=${boardId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTasks(response.data);
      } catch (err) {
        console.error('Failed to fetch tasks');
      }
    };
    fetchTasks();
  }, [boardId, token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://k8s-taskapp-taskappi-929be65fa1-941636230.ap-south-1.elb.amazonaws.com/api/tasks',
        { title, boardId, assigneeEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([...tasks, response.data]);
      setTitle('');
      setAssigneeEmail('');
    } catch (err) {
      console.error('Failed to create task');
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Tasks</h2>
      <form onSubmit={handleCreate} className="mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title"
          className="p-2 border rounded-md mr-2 dark:bg-gray-700 dark:text-white"
          required
        />
        <input
          type="email"
          value={assigneeEmail}
          onChange={(e) => setAssigneeEmail(e.target.value)}
          placeholder="Assignee Email"
          className="p-2 border rounded-md mr-2 dark:bg-gray-700 dark:text-white"
        />
        <button className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
          Add Task
        </button>
      </form>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => navigate(`/tasks/${task.id}/comments`)}
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{task.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">Assigned to: {task.assigneeEmail || 'Unassigned'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskList;