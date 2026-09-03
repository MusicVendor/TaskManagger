import React, { useState } from "react";
//import Card from "./Card.jsx";
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function TaskColumn({status, tasks, onStatusChange}) {

  const handleMoveTask = async(taskId, newStatus) => {

    try {
      const res = await fetch(`http://localhost:2300/status/tasks/${taskId}`, {
        method: "PATCH",
        headers: { 
          "Content-Type" : 'application/json',
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}` },
        body: JSON.stringify({ task_status: newStatus })
      });

      if(!res.ok){
        throw new Error({message: 'Failed to fetch data'});
      }
      const data = await res.json();
      onStatusChange(data);

    } catch (error) {
      console.error("Error updating task status:", error);
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
      {tasks.filter(task => task.task_status === status).map(task =>(
        <Card key = {task.id} className="w-full mb-6">
          <CardHeader>
            <CardTitle>{task.task_name}</CardTitle>
            <CardDescription>{task.task_description}</CardDescription>
          </CardHeader>
          <CardContent>
          </CardContent>
          <CardFooter className="flex flex-col justify-start items-start text-xs font-medium">
            <p>Last Updated: {task.updated_at.split('T')[0]}</p>
            <p>Deadline: {task.end_date ? task.end_date.split('T')[0] : 'No deadline'}</p>
            {status !=='completed' ? <Button className='mt-4' onClick={() =>handleMoveTask(task.id, nextStatus(task.task_status))}>Move to {status === 'to-do' ? 'In Progress' :  'Completed'}</Button>: <Button className='mt-4' disabled>Completed</Button>}
          </CardFooter>
        </Card>
    ))}
  </>
  );
}

export default TaskColumn;