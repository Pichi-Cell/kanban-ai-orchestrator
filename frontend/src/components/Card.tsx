import { memo } from 'react';
import { Task } from '../types/kanban';
import { handleCardDragStart } from '../utils/boardHandlers';
import { useState } from 'react';
import TaskMenu from './TaskMenu';

export const Card = memo(({ task, index, columnId, updateTask }: { task: Task, index: number, columnId: string, updateTask: (updatedTask: Task) => void }) => {
    const [editingTask, setEditingTask] = useState<Boolean>(false);

    return (
        <div
            draggable="true"
            onDragStart={(e) => handleCardDragStart(e, task.id, index, columnId)}
            className="bg-white p-3 mb-2 rounded shadow-sm kanban-card"
            onClick={() => setEditingTask(true)}
        >
            {task.content}
            {editingTask && <TaskMenu task={task} onClose={() => setEditingTask(false)} onUpdateTask={updateTask} />}
        </div>
    );
}, (prevProps, nextProps) => {
    // Only re-render if the taskIds have actually changed 
    return (
        prevProps.task === nextProps.task &&
        prevProps.index === nextProps.index &&
        prevProps.columnId === nextProps.columnId
    );
});