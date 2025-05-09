import React, { useEffect, useState } from 'react';
import { GetTask, UpdateTask, DeleteTask } from '../server/server';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';

function Task() {
  const { txHash } = useParams();
  const navigate = useNavigate();
  // console.log('txHash:', txHash);
  

  type TaskType = {
    id?: number;
    txHash: string;
    value: string;
    createdAt?: Date;
    updatedAt?: Date;
  };

  const [task, setTask] = useState<TaskType>({
    txHash: `Task-${nanoid(6)}`,
    value: 'Add a description for your task...'
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<boolean>(false);

  useEffect(() => {
    
    const fetchTask = async () => {
      setLoading(true);
      try {
        if (!txHash) {
          setError('Invalid task identifier');
          setLoading(false);
          return;
        }
        
        const response = await GetTask(txHash as string);
        console.log('Task fetched:', response);
        if (response) {
          setTask({
            id: response.id as number,
            txHash: response.txHash || 'Untitled Task',
            value: response.value || 'Add a description for your task...'
          });
          setError('');
        } else {
          setError('Task not found');
        }
      } catch (err) {
        console.error('Error fetching task:', err);
        setError('Failed to load task. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTask();
  }, [txHash]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTask(prev => ({
      ...prev,
      [name]: value
    }));
    setIsEdited(true);
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      
        const result = await UpdateTask({
          txHash: txHash as string,
          value: task.value,
        });
        if (result) {
          setIsEdited(false);
        } else {
          setError('Failed to save task. Please try again.');
        }

    } catch (err) {
      console.error('Error saving task:', err);
      setError('Failed to save task. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
   
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        if (txHash) {
          await DeleteTask(txHash);
          navigate('/');
        }
      } catch (err) {
        console.error('Error deleting task:', err);
        setError('Failed to delete task. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen bg-neutral-950 flex flex-col items-center justify-center text-white">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button
          className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-2 rounded-lg"
          onClick={() => navigate('/')}
        >
          Back to Tasks
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-neutral-950 py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-neutral-900 rounded-2xl border border-neutral-800 shadow-xl overflow-hidden">
        <div className="flex justify-between items-center border-b border-neutral-800 p-4">
          <button
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="text-sm text-neutral-500">
              {isEdited ? 'Unsaved changes' : 'Saved'}
            </div>
            
            <button
              className={`p-2 rounded-md text-white ${
                isEdited
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-neutral-700 cursor-not-allowed'
              } transition-colors flex items-center gap-1`}
              onClick={handleSave}
              disabled={(!isEdited) || isSaving}
            >
              <Save size={16} />
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>
            
            <button
              className="p-2 rounded-md text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors"
              onClick={handleDelete}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <input
              type="text"
              name="txHash"
              value={task.txHash}
              onChange={handleInputChange}
              placeholder="Task title"
              className="w-full text-2xl font-bold bg-transparent border-none focus:outline-none text-white"
              autoFocus
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm text-neutral-500 mb-2">Description</label>
            <textarea
              name="value"
              value={task.value}
              onChange={handleInputChange}
              placeholder="Add a description for your task..."
              className="w-full h-48 p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white resize-none focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Task;