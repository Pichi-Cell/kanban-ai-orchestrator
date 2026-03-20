import { memo } from 'react';
import { Card } from './Card';
import { Task, Column as ColumnType } from '../types/kanban';
// memo() ensures this column doesn't re-render 
// unless 'column' or 'columnTasks' changes referentially.
export const Column = memo(({ column, columnTasks, moveTask }: { column: ColumnType; columnTasks: Task[]; moveTask: (taskId: string, sourceColId: string, destColId: string, index: number) => void }) => {

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("taskId");
        const sourceColId = e.dataTransfer.getData("sourceColId")
        const cardElements = Array.from(e.currentTarget.querySelectorAll('.kanban-card'));

        // 2. Find the index of the first card whose middle is below the mouse
        const dropIndex = cardElements.findIndex(el => {
            const rect = el.getBoundingClientRect();
            const midPoint = rect.top + rect.height / 2;
            return e.clientY < midPoint;
        });

        console.log(dropIndex)
        // 3. If no cards are below, it goes to the end (-1 becomes length)
        const finalIndex = dropIndex === -1 ? columnTasks.length : dropIndex;

        moveTask(taskId, sourceColId, column.id, finalIndex);
    };

    return (
        <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="bg-gray-100 p-4 rounded-lg w-72">
            <h2 className="font-bold mb-4">{column.title}</h2>
            {columnTasks.map((task, idx) => (
                <Card index={idx} columnId={column.id} key={task.id} task={task} />
            ))}
        </div>
    );
}, (prevProps, nextProps) => {
    // Only re-render if the taskIds have actually changed length or order
    return (
        prevProps.column.taskIds === nextProps.column.taskIds &&
        prevProps.column.title === nextProps.column.title
    );
});