import { memo } from 'react';
import { Card } from './Card';
import { Task, Column as ColumnType } from '../types/kanban';
import { handleColumnDrop } from '../utils/boardHandlers';

export const Column = memo(({ column, columnTasks, moveTask, updateTask }: { column: ColumnType; columnTasks: Task[]; moveTask: (taskId: string, sourceColId: string, destColId: string, index: number) => void; updateTask: (updatedTask: Task) => void }) => {

    return (
        <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleColumnDrop(e, column.id, columnTasks.length, moveTask)}
            className="bg-gray-100 p-4 rounded-lg w-72">
            <h2 className="font-bold mb-4">{column.title}</h2>
            {columnTasks.map((task, idx) => (
                <Card index={idx} columnId={column.id} key={task.id} task={task} updateTask={updateTask} />
            ))}
        </div>
    );
}, (prevProps, nextProps) => {
    if (
        prevProps.column.taskIds !== nextProps.column.taskIds ||
        prevProps.column.title !== nextProps.column.title ||
        prevProps.columnTasks.length !== nextProps.columnTasks.length
    ) {
        return false; // re-render needed
    }

    // Shallow comparison of array items (Task references)
    for (let i = 0; i < prevProps.columnTasks.length; i++) {
        if (prevProps.columnTasks[i] !== nextProps.columnTasks[i]) {
            return false; // task object ref changed, re-render needed
        }
    }

    return true; // no changes, bailout render safely
});