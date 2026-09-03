import TaskColumn from './TaskColumn';
import { useEffect, useContext, useState } from 'react';
import { useProjectContext } from './ProjectContext';

function MainContent() {
  const { selectedProjectId } = useProjectContext();
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    if (!selectedProjectId) return;
    
    try {
      const res = await fetch(`http://localhost:2300/tasks/${selectedProjectId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });

      const data = await res.json();
      setTasks(data);

    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  const handleStatusChange = (updatedTask)=> {
    setTasks(prevTasks =>
        prevTasks.map(task => task.id == updatedTask.id ? updatedTask : task)
    );
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedProjectId]);

  return (
    <>
      {selectedProjectId ? (
      <div className='mx-25'>
        <div className="main--header">
          <h2 className='ml-8 mb-4 font-semibold'>Project Tasks</h2>
        </div>
        <div className="flex justify-around gap-6">
          <div className='w-full'>
            <h4 className='mb-8 font-semibold text-sm'>To Do</h4>
            <TaskColumn status='to-do' tasks={tasks} onStatusChange ={handleStatusChange} className='flex flex-col gap-4'/>
            </div>
          <div className='w-full'>
            <h4 className='mb-8 font-semibold text-sm'>In Progress</h4>
            <TaskColumn status='in-progress' tasks={tasks} onStatusChange ={handleStatusChange} className='flex flex-col gap-4'/>
          </div>
          <div className='w-full'>
            <h4 className='mb-8 font-semibold text-sm'>Completed</h4>
            <TaskColumn status='completed' tasks={tasks} onStatusChange ={handleStatusChange} className='flex flex-col gap-4'/>
          </div>
        </div>
      </div>) : (
        <div className="flex justify-center items-center h-full">
          <h2 className='text-2xl font-semibold'>Select a project to view tasks</h2>
        </div>
      )
      }
    </>
  );
}

export default MainContent;
