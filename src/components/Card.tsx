import { memo } from 'react';
import { Task } from '../types/kanban';

export const Card = memo(({ task, index, columnId }: { task: Task, index: number, columnId: string }) => {
    const handleDragStart = (e: React.DragEvent) => {
        // Store the ID and the Source index in the dataTransfer object
        e.dataTransfer.setData("taskId", task.id);
        e.dataTransfer.setData("sourceIndex", index.toString());
        e.dataTransfer.setData("sourceColId", columnId);
        e.dataTransfer.effectAllowed = "move";
    };


    return (
        <div
            draggable="true"
            onDragStart={handleDragStart}
            className="bg-white p-3 mb-2 rounded shadow-sm">
            {task.content}
        </div>
    );
}, (prevProps, nextProps) => {
    // Only re-render if the taskIds have actually changed length or order
    return (
        prevProps.task === nextProps.task &&
        prevProps.index === nextProps.index &&
        prevProps.columnId === nextProps.columnId
    );
});