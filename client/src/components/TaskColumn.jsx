import React, { useState } from "react";
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, Loader2 } from "lucide-react";

function TaskColumn({ status, tasks, onStatusChange, onDeleteTask }) {
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleMoveTask = async (taskId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:2300/status/tasks/${taskId}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": 'application/json',
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ task_status: newStatus })
      });

      if (!res.ok) {
        throw new Error('Failed to update task status');
      }
      const data = await res.json();
      onStatusChange(data);

    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!taskId || isDeleting) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`http://localhost:2300/delete/task/${taskId}`, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}` 
        }
      });

      if (!res.ok) {
        throw new Error('Failed to delete task');
      }

      // Notify parent component to update state
      if (onDeleteTask) {
        onDeleteTask(taskId);
      }

      setDeletingTaskId(null);

    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task.");
    } finally {
      setIsDeleting(false);
    }
  };

  const nextStatus = (currStatus) => {
    switch (currStatus) {
      case 'to-do':
        return 'in-progress';
      case 'in-progress':
        return 'completed';
      default:
        return null;
    }
  };

  return (
    <>
      {tasks.filter(task => task.task_status === status).map(task => (
        <Card key={task.id} className="w-full mb-6 relative group">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{task.task_name}</CardTitle>
                <CardDescription className="mt-1">{task.task_description}</CardDescription>
              </div>

              {/* Delete Icon Trigger */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 cursor-pointer"
                onClick={() => setDeletingTaskId(task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent />

          <CardFooter className="flex flex-col justify-start items-start text-xs font-medium">
            <p>Last Updated: {task.updated_at ? task.updated_at.split('T')[0] : 'N/A'}</p>
            <p>Deadline: {task.end_date ? task.end_date.split('T')[0] : 'No deadline'}</p>
            
            <div className="flex gap-2 w-full mt-4">
              {status !== 'completed' ? (
                <Button 
                  className="w-full cursor-pointer" 
                  onClick={() => handleMoveTask(task.id, nextStatus(task.task_status))}
                >
                  Move to {status === 'to-do' ? 'In Progress' : 'Completed'}
                </Button>
              ) : (
                <Button className="w-full" disabled>
                  Completed
                </Button>
              )}
            </div>
          </CardFooter>

          {/* Delete Confirmation Modal */}
          <AlertDialog 
            open={deletingTaskId === task.id} 
            onOpenChange={(isOpen) => {
              if (!isOpen && !isDeleting) setDeletingTaskId(null);
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Task?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{task.task_name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting} onClick={() => setDeletingTaskId(null)}>
                  Cancel
                </AlertDialogCancel>
                <Button 
                  variant="destructive"
                  disabled={isDeleting}
                  onClick={() => handleDeleteTask(task.id)}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Task'
                  )}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Card>
      ))}
    </>
  );
}

export default TaskColumn;