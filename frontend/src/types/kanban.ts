
export interface Task {
    id: string;
    content: string;         // The high-level title/summary

    // --- The Agent Context Block ---
    objective: string;       // The "Definition of Done". What is the specific output?
    context: {
        background: string;    // Why is this being done? (Prevents "XY Problems")
        dependencies: string[]; // IDs of other tasks that must be finished first
        constraints: string[];  // "Do not use X," "Must be under 200 words," etc.
    };

    // --- The Technical Payload ---
    data?: {
        inputSchema?: object;  // JSON schema of the data the agent receives
        outputFormat: 'json' | 'markdown' | 'code' | 'text';
        referenceUrls?: string[];
    };

    // --- The Execution Metadata ---
    metadata: {
        priority: 'low' | 'medium' | 'high' | 'critical';
        estimatedTokens?: number;
        assignedAgentId?: string; // Which specialist is handling this?
        status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
    };
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

