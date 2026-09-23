import TaskColumn from './TaskColumn';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useProjectContext } from './ProjectContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, Users, UserPlus, Mail } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Initialize socket instance outside component to avoid reconnects on re-render
const socket = io("http://localhost:2300", {
  autoConnect: true,
});

function MainContent() {
  const { selectedProjectId } = useProjectContext();
  const [tasks, setTasks] = useState([]);

  // States for Task Creation Modal
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState('to-do');
  const [endDate, setEndDate] = useState('');
  const [assignedEmails, setAssignedEmails] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // States for Project Members Modal
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [memberError, setMemberError] = useState('');

  const fetchTasks = async () => {
    if (!selectedProjectId) return;
    
    try {
      const res = await fetch(`http://localhost:2300/tasks/${selectedProjectId}`, {
        method: "GET",
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}` 
        },
      });

      const data = await res.json();
      setTasks(data);

    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchProjectMembers = async () => {
    if (!selectedProjectId) return;

    setIsLoadingMembers(true);
    setMemberError('');
    try {
      const res = await fetch(`http://localhost:2300/projects/${selectedProjectId}/members`, {
        method: "GET",
        headers: {
          'Content-Type' : 'application/json', 
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}` 
        },
      });

      if (!res.ok) throw new Error("Failed to fetch project members");

      const data = await res.json();
      setMembers(data.members || data);

    } catch (error) {
      console.error("Error fetching project members:", error);
      setMemberError("Failed to load members.");
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const handleAddMember = async (e) => {
    if (e) e.preventDefault();
    const trimmedEmail = newMemberEmail.trim();
    if (!trimmedEmail || isAddingMember || !selectedProjectId) return;

    setIsAddingMember(true);
    setMemberError('');
    try {
      const res = await fetch(`http://localhost:2300/projects/${selectedProjectId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ email: trimmedEmail })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add member");
      }

      const addedUser = await res.json();
      setMembers(prev => [...prev, addedUser.member || addedUser]);
      setNewMemberEmail('');

    } catch (error) {
      console.error("Error adding member:", error);
      setMemberError(error.message || "Could not add user. Make sure the email exists.");
    } finally {
      setIsAddingMember(false);
    }
  };

  const resetForm = () => {
    setTaskName('');
    setTaskDescription('');
    setTaskStatus('to-do');
    setEndDate('');
    setAssignedEmails('');
  };

  const handleCreateTask = async (e) => {
    if (e) e.preventDefault();
    if (!taskName.trim() || !selectedProjectId || isCreating) return;

    const emailsArray = assignedEmails
      .split(',')
      .map(email => email.trim())
      .filter(email => email.length > 0);

    setIsCreating(true);
    try {
      const res = await fetch(`http://localhost:2300/tasks/${selectedProjectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          project_id: selectedProjectId,
          task_name: taskName.trim(),
          task_description: taskDescription.trim(),
          task_status: taskStatus,
          end_date: endDate || null,
          assigned_emails: emailsArray
        })
      });

      if (!res.ok) throw new Error("Failed to create task");

      const createdTask = await res.json();
      const finalTask = createdTask.task || createdTask;
      
      // Update local state immediately for the creator
      setTasks(prevTasks => {
        if (prevTasks.some(t => t.id === finalTask.id)) return prevTasks;
        return [...prevTasks, finalTask];
      });

      resetForm();
      setIsAddTaskOpen(false);

    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTask = (deletedTaskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== deletedTaskId));
  };

  const handleStatusChange = (updatedTask) => {
    setTasks(prevTasks =>
      prevTasks.map(task => task.id == updatedTask.id ? updatedTask : task)
    );
  };

  // 1. Initial HTTP Data Fetching
  useEffect(() => {
    fetchTasks();
  }, [selectedProjectId]);

  // 2. Real-Time WebSockets Integration
  useEffect(() => {
    if (!selectedProjectId) return;

    // Join current project room
    socket.emit("join_project", selectedProjectId);

    // Listen for real-time task additions from collaborators
    socket.on("task_created", (newTask) => {
      setTasks(prevTasks => {
        if (prevTasks.some(task => task.id === newTask.id)) return prevTasks;
        return [...prevTasks, newTask];
      });
    });

    // Listen for real-time task status / detail updates
    socket.on("task_updated", (updatedTask) => {
      setTasks(prevTasks =>
        prevTasks.map(task => 
          String(task.id) === String(updatedTask.id) ? updatedTask : task
        )
      );
    });

    // Listen for real-time task deletions
    socket.on("task_deleted", (deletedTaskId) => {
      setTasks((prevTasks) => 
        prevTasks.filter((task) => String(task.id) !== String(deletedTaskId))
      );
    });

    // Cleanup listeners and leave room when switching projects or unmounting
    return () => {
      socket.emit("leave_project", selectedProjectId);
      socket.off("task_created");
      socket.off("task_updated");
      socket.off("task_deleted");
    };
  }, [selectedProjectId]);

  const handleOpenMembersModal = () => {
    setIsMembersOpen(true);
    fetchProjectMembers();
  };

  return (
    <>
      {selectedProjectId ? (
        <div className='mx-25'>
          {/* Header section with title and CTAs */}
          <div className="main--header flex items-center justify-between mb-6">
            <h2 className='ml-8 font-semibold text-xl'>Project Tasks</h2>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                onClick={handleOpenMembersModal}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Users className="h-4 w-4" />
                Members
              </Button>

              <Button 
                onClick={() => setIsAddTaskOpen(true)} 
                className="flex items-center gap-2 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </div>
          </div>

          <div className="flex justify-around gap-6">
            <div className='w-full'>
              <h4 className='mb-8 font-semibold text-sm'>To Do</h4>
              <TaskColumn status='to-do' tasks={tasks} onStatusChange={handleStatusChange} onDeleteTask={handleDeleteTask} className='flex flex-col gap-4'/>
            </div>
            <div className='w-full'>
              <h4 className='mb-8 font-semibold text-sm'>In Progress</h4>
              <TaskColumn status='in-progress' tasks={tasks} onStatusChange={handleStatusChange} onDeleteTask={handleDeleteTask} className='flex flex-col gap-4'/>
            </div>
            <div className='w-full'>
              <h4 className='mb-8 font-semibold text-sm'>Completed</h4>
              <TaskColumn status='completed' tasks={tasks} onStatusChange={handleStatusChange} onDeleteTask={handleDeleteTask} className='flex flex-col gap-4'/>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <h2 className='text-2xl font-semibold'>Select a project to view tasks</h2>
        </div>
      )}

      {/* Add Task Modal */}
      <AlertDialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <AlertDialogContent className="sm:max-w-[480px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Create New Task</AlertDialogTitle>
            <AlertDialogDescription>
              Add a new task to your active project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <form onSubmit={handleCreateTask} className="flex flex-col gap-4 py-2">
            <div>
              <label className="text-xs font-semibold mb-1 block">Task Name *</label>
              <Input
                autoFocus
                placeholder="Enter task name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                disabled={isCreating}
              />
            </div>
            
            <div>
              <label className="text-xs font-semibold mb-1 block">Description</label>
              <Textarea
                placeholder="Enter task description (optional)"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                disabled={isCreating}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold mb-1 block">Status</label>
                <select
                  value={taskStatus}
                  onChange={(e) => setTaskStatus(e.target.value)}
                  disabled={isCreating}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="to-do">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold mb-1 block">End Date</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={isCreating}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold mb-1 block">Assign to Users (Emails)</label>
              <Input
                placeholder="e.g. user1@example.com, user2@example.com"
                value={assignedEmails}
                onChange={(e) => setAssignedEmails(e.target.value)}
                disabled={isCreating}
              />
              <span className="text-[11px] text-muted-foreground mt-1 block">
                Separate multiple emails with commas.
              </span>
            </div>

            <AlertDialogFooter className="mt-2">
              <AlertDialogCancel 
                type="button" 
                onClick={() => {
                  resetForm();
                  setIsAddTaskOpen(false);
                }}
                disabled={isCreating}
              >
                Cancel
              </AlertDialogCancel>
              
              <Button type="submit" disabled={!taskName.trim() || isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Add Task'
                )}
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      {/* Project Members Modal */}
      <AlertDialog open={isMembersOpen} onOpenChange={setIsMembersOpen}>
        <AlertDialogContent className="sm:max-w-[480px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Project Members
            </AlertDialogTitle>
            <AlertDialogDescription>
              View members or invite new team members by email.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex flex-col gap-4 py-2">
            {/* Add New Member Input */}
            <form onSubmit={handleAddMember} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter member's email address"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                disabled={isAddingMember}
                className="flex-1"
              />
              <Button type="submit" disabled={!newMemberEmail.trim() || isAddingMember}>
                {isAddingMember ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-1" />
                    Add
                  </>
                )}
              </Button>
            </form>

            {memberError && (
              <p className="text-xs text-red-500 font-medium">{memberError}</p>
            )}

            {/* Member List Container */}
            <div className="border rounded-md p-3 max-h-56 overflow-y-auto space-y-2 mt-2">
              {isLoadingMembers ? (
                <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading members...
                </div>
              ) : members.length === 0 ? (
                <p className="text-xs text-center text-muted-foreground py-4">
                  No additional members in this project.
                </p>
              ) : (
                members.map((member, index) => (
                  <div 
                    key={member.id || member.email || index} 
                    className="flex items-center justify-between p-2 rounded-md bg-muted/40 text-sm"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="flex flex-col truncate">
                        <span className="font-medium truncate">
                          {member.first_name ? `${member.first_name} ${member.last_name || ''}` : member.email}
                        </span>
                        {member.first_name && (
                          <span className="text-xs text-muted-foreground truncate">{member.email}</span>
                        )}
                      </div>
                    </div>
                    {member.role && (
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                        {member.role}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel 
              type="button" 
              onClick={() => {
                setIsMembersOpen(false);
                setMemberError('');
                setNewMemberEmail('');
              }}
            >
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default MainContent;