import { BoardProvider } from '../context/BoardContext';
import { KanbanBoard } from '../components/KanbanBoard';

export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-6 bg-white border-b">
        <h1 className="text-2xl font-bold">Project Management</h1>
      </header>

      <main className="p-8">
        <BoardProvider>
          <KanbanBoard />
        </BoardProvider>
      </main>
    </div>
  );
};