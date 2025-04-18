import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateTask, DeleteTask, GetAllTasks } from '../server/server';
import { Plus, CheckCircle, Edit, Trash2 } from 'lucide-react';


function Home() {

  type ITask = {
    ID?: string;
    title: string;
    description?: string;
    status?: string;
  }


  const [tasks, setTasks] = useState(Array<any>);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await GetAllTasks();

      setTasks(response);
      setError('');
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create a new task
  const handleTaskCreation = async () => {
    try {
      const task: ITask = {
        title: 'New Task',
        description: 'Add a description for your task...',
        status: 'pending'
      };
      const result = await CreateTask(task);
      console.log('Task created:', result);
      if (result && result?.ID) {
        navigate('/task/' + result.ID);
        await fetchTasks(); // Refresh task list
      }
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleDeleteTask = async (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent task selection

    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await DeleteTask(id);
        await fetchTasks(); // Refresh task list
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-neutral-950 text-neutral-200 py-10 px-6 md:px-20 lg:px-40">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your Tasks</h1>
          <p className="text-neutral-400">Organize your thoughts and tasks in one place</p>
        </header>

        <div className="w-full h-full border border-neutral-800 rounded-xl bg-neutral-900/50 backdrop-blur-sm shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="w-full md:grid-cols-2 gap-4 mb-8">
              <div
                className="bg-neutral-800 hover:bg-neutral-700 transition-colors duration-200 rounded-lg shadow-md group cursor-pointer"
                onClick={handleTaskCreation}
              >
                <div className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div className='w-full'>
                    <h3 className="font-semibold text-lg text-white group-hover:text-indigo-300 transition-colors">Add New Task</h3>
                    <p className="text-neutral-400 text-sm">Create a new task or note</p>
                  </div>
                </div>
              </div>
            </div>


            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <h2 className="text-xl font-semibold text-white">Your Tasks</h2>

              <span>{tasks.length}</span>
            </div>

            <div className="mb-6 max-h-96 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>

              ) : error ? (
                <div className="text-center text-red-500 py-10">
                  {error}
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center text-neutral-400 py-10">
                  No tasks available.
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task, index) => (
                    <div
                      key={index}
                      className="group bg-neutral-800 hover:bg-neutral-750 rounded-lg shadow-md cursor-pointer overflow-hidden"
                      onClick={() => {
                        if (task?.ID) {
                          navigate(`/task/${task.ID}`);
                        }
                      }}
                    >
                      <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3 flex-grow overflow-hidden">
                          <div
                            className={`w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center cursor-pointer
                  ${task.status === 'completed'
                                ? 'bg-green-500/20 border border-green-500'
                                : task.status === 'pending'
                                  ? 'bg-yellow-500/20 border border-yellow-500'
                                  : 'bg-indigo-500/20 border border-indigo-500'
                              }`}
                          >
                            {task.status === 'completed' && <CheckCircle className="w-3 h-3 text-green-500" />}
                          </div>
                          <div className="overflow-hidden">
                            <span className={`text-lg block truncate ${task.status === 'completed' ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                              {task.title || 'Untitled Task'}
                            </span>
                            {task.description && (
                              <span className="text-sm text-neutral-500 block truncate">
                                {task.description}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 ml-2 flex-shrink-0">
                          <button
                            className="p-2 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
                            onClick={(e) => { e.stopPropagation(); navigate('/task/' + task.ID); }}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 rounded-md text-neutral-400 hover:text-red-400 hover:bg-neutral-700 transition-colors"
                            onClick={(e) => handleDeleteTask(task.ID, e)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Home