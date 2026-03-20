import { useBoard } from "../context/BoardContext";
import { Column } from "./Column";

export const KanbanBoard = () => {
    const { columns, tasks, columnOrder, moveTask } = useBoard();

    return (
        <div className="flex gap-4 p-4">
            {columnOrder.map((id) => (
                <Column
                    moveTask={moveTask}
                    key={id}
                    column={columns[id]}
                    columnTasks={columns[id].taskIds.map(tid => tasks[tid])}
                />
            ))}
        </div>
    );
};