import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Comment list component
function CommentList({ token }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const { taskId } = useParams();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `https://de0e47pv5ccby.cloudfront.net/api/comments?taskId=${taskId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setComments(response.data);
      } catch (err) {
        console.error('Failed to fetch comments');
      }
    };
    fetchComments();
  }, [taskId, token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://de0e47pv5ccby.cloudfront.net/api/comments',
        { content, taskId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([...comments, response.data]);
      setContent('');
    } catch (err) {
      console.error('Failed to create comment');
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Comments</h2>
      <form onSubmit={handleCreate} className="mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment"
          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
          required
        />
        <button className="mt-2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
          Add Comment
        </button>
      </form>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
          >
            <p className="text-gray-800 dark:text-white">{comment.content}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">By: {comment.userEmail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentList;