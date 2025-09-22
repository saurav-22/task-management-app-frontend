import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Board list component
function BoardList({ token }) {
  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get('http://k8s-taskapp-taskappi-929be65fa1-1617985190.ap-south-1.elb.amazonaws.com/api/boards', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBoards(response.data);
      } catch (err) {
        console.error('Failed to fetch boards');
      }
    };
    fetchBoards();
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://k8s-taskapp-taskappi-929be65fa1-1617985190.ap-south-1.elb.amazonaws.com/api/boards',
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBoards([...boards, response.data]);
      setTitle('');
    } catch (err) {
      console.error('Failed to create board');
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Boards</h2>
      <form onSubmit={handleCreate} className="mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Board Title"
          className="p-2 border rounded-md mr-2 dark:bg-gray-700 dark:text-white"
          required
        />
        <button className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
          Create Board
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {boards.map((board) => (
          <div
            key={board.id}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => navigate(`/boards/${board.id}/tasks`)}
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{board.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BoardList;
