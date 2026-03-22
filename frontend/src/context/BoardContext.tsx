import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import { BoardData, Task } from '../types/kanban';

interface BoardContextType extends BoardData {
    moveTask: (taskId: string, sourceColId: string, destColId: string, index: number) => void;
    updateTask: (updatedTask: Task) => void;
}


const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider: React.FC<{
    initialData: BoardData,
    onSave: (data: BoardData) => void,
    children: React.ReactNode
}> = ({ initialData, onSave, children }) => {
    const [data, setData] = useState<BoardData>(initialData);
    const dataRef = useRef(data);
    dataRef.current = data;

    const updateTask = useCallback((updatedTask: Task) => {
        const prev = dataRef.current;
        const nextState = {
            ...prev,
            tasks: {
                ...prev.tasks,
                [updatedTask.id]: updatedTask
            }
        };

        setData(nextState);
        onSave(nextState);

    }, [onSave]);



    const moveTask = useCallback((taskId: string, sourceId: string, destId: string, index: number) => {
        const prev = dataRef.current;
        const sourceCol = prev.columns[sourceId];
        const destCol = prev.columns[destId];

        const newTaskIdsSource = Array.from(sourceCol.taskIds);
        const taskIndex = newTaskIdsSource.indexOf(taskId);
        if (taskIndex !== -1) newTaskIdsSource.splice(taskIndex, 1);

        const newTaskIdsDest = sourceId === destId ? newTaskIdsSource : Array.from(destCol.taskIds);
        newTaskIdsDest.splice(index, 0, taskId);

        const nextState = {
            ...prev,
            columns: {
                ...prev.columns,
                [sourceId]: { ...sourceCol, taskIds: newTaskIdsSource },
                [destId]: { ...destCol, taskIds: newTaskIdsDest },
            }
        };

        setData(nextState);
        onSave(nextState);
    }, [onSave]);

    const value = useMemo(() => ({
        ...data,
        moveTask,
        updateTask
    }), [data, moveTask, updateTask]);

    return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
};

// --- Custom Hook for Simplicity ---
export const useBoard = () => {
    const context = useContext(BoardContext);
    if (!context) throw new Error('useBoard must be used within a BoardProvider');
    return context;
};