export interface Task {
    id: string;
    content: string;
    priority?: 'Low' | 'Medium' | 'High';
}

export interface Column {
    id: string;
    title: string;
    taskIds: string[];
}

export interface BoardData {
    tasks: Record<string, Task>;
    columns: Record<string, Column>;
    columnOrder: string[];
    boardId: number;
    boardName: string;
}

