import { memo } from 'react';
import { Card } from './Card';
import { Task, Column as ColumnType } from '../types/kanban';
import { handleColumnDrop } from '../utils/boardHandlers';

export const Column = memo(({ column, columnTasks, moveTask }: { column: ColumnType; columnTasks: Task[]; moveTask: (taskId: string, sourceColId: string, destColId: string, index: number) => void }) => {

    return (
        <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleColumnDrop(e, column.id, columnTasks.length, moveTask)}
            className="bg-gray-100 p-4 rounded-lg w-72">
            <h2 className="font-bold mb-4">{column.title}</h2>
            {columnTasks.map((task, idx) => (
                <Card index={idx} columnId={column.id} key={task.id} task={task} />
            ))}
        </div>
    );
}, (prevProps, nextProps) => {
    // Only re-render if the taskIds have actually changed
    return (
        prevProps.column.taskIds === nextProps.column.taskIds &&
        prevProps.column.title === nextProps.column.title
    );
});