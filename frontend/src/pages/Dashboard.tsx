import { BoardProvider } from '../context/BoardContext';
import { KanbanBoard } from '../components/KanbanBoard';
import { useState, useCallback } from 'react';
import { BoardData } from '../types/kanban';


export const Dashboard = () => {
  const initialData: BoardData[] = [];

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
          <button onClick={() => setActiveId(b.boardId)}>{b.boardName}</button>
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