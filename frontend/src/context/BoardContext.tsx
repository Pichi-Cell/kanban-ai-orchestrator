import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { BoardData } from '../types/kanban';

interface BoardContextType extends BoardData {
    moveTask: (taskId: string, sourceColId: string, destColId: string, index: number) => void;
    updateTask: (taskId: string, newContent: string) => void;
}


const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [data, setData] = useState<BoardData>({
        tasks: {
            'task-1': { id: 'task-1', content: 'Design Glassmorphism UI' },
            'task-2': { id: 'task-2', content: 'Setup Vite + Tailw213123123ind' },
            'task-3': { id: 'task-3', content: 'Setup Vite + Tailwind' },
        },
        columns: {
            'col-1': { id: 'col-1', title: 'Backlog', taskIds: ['task-1', 'task-2', 'task-3'] },
            'col-2': { id: 'col-2', title: 'To Do', taskIds: [] },
            'col-3': { id: 'col-3', title: 'In progress', taskIds: [] },
            'col-4': { id: 'col-4', title: 'Awaiting Review', taskIds: [] },
            'col-5': { id: 'col-5', title: 'Done', taskIds: [] },
        },
        columnOrder: ['col-1', 'col-2', 'col-3', 'col-4', 'col-5'],
    });

    const updateTask = useCallback((taskId: string, newContent: string) => {
        setData(prev => ({
            ...prev,
            tasks: {
                ...prev.tasks,
                [taskId]: { ...prev.tasks[taskId], content: newContent }
            }
        }));
    }, []);

    // 2. Move Task (Handles Reordering & Column Switching)
    const moveTask = useCallback((taskId: string, sourceId: string, destId: string, index: number) => {
        setData(prev => {
            const sourceCol = prev.columns[sourceId];
            const destCol = prev.columns[destId];

            // Remove from source
            const newTaskIdsSource = Array.from(sourceCol.taskIds);
            newTaskIdsSource.splice(newTaskIdsSource.indexOf(taskId), 1);

            // Add to destination
            const newTaskIdsDest = sourceId === destId ? newTaskIdsSource : Array.from(destCol.taskIds);
            newTaskIdsDest.splice(index, 0, taskId);

            return {
                ...prev,
                columns: {
                    ...prev.columns,
                    [sourceId]: { ...sourceCol, taskIds: newTaskIdsSource },
                    [destId]: { ...destCol, taskIds: newTaskIdsDest },
                }
            };
        });
    }, []);

    // --- Memoize Value ---
    // This prevents the Provider from triggering re-renders 
    // unless the underlying 'data' actually changes.
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