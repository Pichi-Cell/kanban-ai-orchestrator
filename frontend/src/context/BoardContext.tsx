import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { BoardData } from '../types/kanban';

interface BoardContextType extends BoardData {
    moveTask: (taskId: string, sourceColId: string, destColId: string, index: number) => void;
    updateTask: (taskId: string, newContent: string) => void;
}


const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider: React.FC<{
    initialData: BoardData,
    onSave: (data: BoardData) => void,
    children: React.ReactNode
}> = ({ initialData, onSave, children }) => {
    const [data, setData] = useState<BoardData>(initialData);

    const updateTask = useCallback((taskId: string, newContent: string) => {
        // 1. Calculate the next state outside of the setter
        const nextState = {
            ...data,
            tasks: {
                ...data.tasks,
                [taskId]: { ...data.tasks[taskId], content: newContent }
            }
        };

        // 2. Commit to both local and parent
        setData(nextState);
        onSave(nextState);
    }, [data, onSave]);



    const moveTask = useCallback((taskId: string, sourceId: string, destId: string, index: number) => {

        setData(prev => {
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

            onSave(nextState);
            return nextState;
        });
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