import { BoardProvider } from '../context/BoardContext';
import { KanbanBoard } from '../components/KanbanBoard';
import { useState, useCallback } from 'react';
import { BoardData } from '../types/kanban';


export const Dashboard = () => {
  const initialData: BoardData[] = [
    {
      boardId: 0,
      boardName: "AI Agent Orchestrator",
      tasks: {
        'task-1': {
          id: 'task-1',
          content: '📐 Glassmorphism System Prompt',
          objective: 'Generate a system prompt that enforces Frutiger Aero and Glassmorphism design principles for UI agents.',
          context: {
            background: 'We need a consistent visual language for all AI-generated frontend components.',
            dependencies: [],
            constraints: ['Focus on transparency, background-blur, and high-gloss gradients', 'Avoid flat design']
          },
          metadata: {
            priority: 'critical',
            status: 'todo',
            assignedAgentId: 'design-specialist-01'
          }
        },
        'task-2': {
          id: 'task-2',
          content: '🚀 API Integration Layer',
          objective: 'Create a Node.js middleware to bridge the Kanban state with the OpenAI Assistants API.',
          context: {
            background: 'The board needs to "push" task data to agents whenever a card moves to "In Progress".',
            dependencies: ['task-1'],
            constraints: ['Use TypeScript', 'Implement error handling for rate limits', 'No external state libraries']
          },
          metadata: {
            priority: 'high',
            status: 'backlog',
            assignedAgentId: 'backend-agent-04'
          }
        },
        'task-3': {
          id: 'task-3',
          content: '🧪 Validation Suite',
          objective: 'Write a Vitest suite to verify that the handleMoveTask function maintains referential integrity.',
          context: {
            background: 'Prevent regressions in the normalized state management logic.',
            dependencies: [],
            constraints: ['Must achieve 100% branch coverage for move logic']
          },
          metadata: {
            priority: 'medium',
            status: 'done',
            assignedAgentId: 'qa-agent-09'
          }
        }
      },
      columns: {
        'col-1': { id: 'col-1', title: 'Backlog', taskIds: ['task-2'] },
        'col-2': { id: 'col-2', title: 'To Do', taskIds: ['task-1'] },
        'col-3': { id: 'col-3', title: 'In Progress', taskIds: [] },
        'col-4': { id: 'col-4', title: 'Done', taskIds: ['task-3'] },
      },
      columnOrder: ['col-1', 'col-2', 'col-3', 'col-4'],
    }
  ];

  const [allBoards, setAllBoards] = useState<BoardData[]>(initialData);
  const [activeId, setActiveId] = useState(0);

  const activeBoard = allBoards.find(b => b.boardId === activeId)!;

  // This is the bridge. It updates the global list 
  // but is scoped to the active board's logic.
  const handleBoardUpdate = useCallback((updatedBoard: BoardData) => {
    setAllBoards(prev => prev.map(b =>
      b.boardId === updatedBoard.boardId ? updatedBoard : b
    ));
  }, []);

  return (
    <div>
      <nav>
        {allBoards.map(b => (
          <button key={b.boardId} onClick={() => setActiveId(b.boardId)}>{b.boardName}</button>
        ))}
      </nav>

      <BoardProvider
        key={activeId}
        initialData={activeBoard}
        onSave={handleBoardUpdate}
      >
        <KanbanBoard />
      </BoardProvider>
    </div>
  );
};