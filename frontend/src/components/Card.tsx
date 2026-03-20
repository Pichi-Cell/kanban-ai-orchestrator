import { memo } from 'react';
import { Task } from '../types/kanban';
import { handleCardDragStart } from '../utils/boardHandlers';

export const Card = memo(({ task, index, columnId }: { task: Task, index: number, columnId: string }) => {
    return (
        <div
            draggable="true"
            onDragStart={(e) => handleCardDragStart(e, task.id, index, columnId)}
            className="bg-white p-3 mb-2 rounded shadow-sm kanban-card">
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