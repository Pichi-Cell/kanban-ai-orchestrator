🛸 Project: Glassmorphism Kanban Engine

A high-performance, dependency-light Kanban system built with React, TypeScript, and Tailwind CSS. Designed for the "Frutiger Aero" aesthetic and optimized for 60fps interactions via manual DOM calculations and memoized leaf nodes.
🏗️ 1. Architecture: The "Orchestrator" Pattern

The project is split into three distinct layers of responsibility:
Layer 1: The Orchestrator (Dashboard.tsx)

    Role: Global State Owner.

    Responsibility: Manages the array of all boards (BoardData[]) and the activeBoardId.

    Flow: Passes the active board data and a stable onSave callback to the Provider.

Layer 2: The Scoped Provider (BoardContext.tsx)

    Role: Feature Logic Controller.

    Responsibility: Manages the active board's tasks and columns. It implements the moveTask and updateTask handlers.

    Flow: Updates local state for instant UI feedback and triggers onSave to persist changes to the Orchestrator.

Layer 3: The Leaf Nodes (Column.tsx, Card.tsx)

    Role: Pure View.

    Responsibility: Rendering and capturing user intent (Drag/Drop/Edit).

    Optimization: Wrapped in React.memo with strict referential equality checks.

📊 2. Data Structure (Normalized)

We avoid nesting to ensure O(1) lookup and predictable re-renders.
TypeScript

{
  boardId: number,
  boardName: string,
  tasks: { [id: string]: Task },      // Source of Truth for task content
  columns: { [id: string]: Column },  // Source of Truth for task order
  columnOrder: string[]               // Order of columns on the screen
}

🛠️ 3. Core Logic: The "Middle-Line" Drop

To avoid heavy libraries like dnd-kit, we use native HTML5 Drag and Drop with a geometric calculation:

    Start: Card tags itself with taskId and sourceIndex via e.dataTransfer.

    Hover: Column allows dropping via onDragOver.

    Drop: Column queries its children (.kanban-card) and finds the first element whose vertical midpoint is below the mouse cursor.

    Result: This yields the precise finalIndex for the moveTask operation.

📜 4. The "Tech Lead" Constitution

When contributing to this project, follow these non-negotiable rules:

    No useEffect for Sync: Never use an effect to sync state between components. Use event-driven updaters.

    Native Over Libraries: Use Browser APIs (DragAndDrop, WebStorage) before reaching for an NPM package.

    Stability First: All handlers (moveTask, updateTask) must be wrapped in useCallback.

    Zero-Leak Memoization: Card components must not re-render if a sibling is moved. Use React.memo and check props carefully.

    Logic Purity: Keep array manipulation logic pure. Do not mutate the prev state in setters; return a new object.

📂 5. Folder Structure
Plaintext

src/
├── features/
│   └── kanban/
│       ├── components/      # UI: Board, Column, Card
│       ├── context/         # BoardProvider, useBoard
│       ├── hooks/           # useColumnDrop (Drag Logic)
│       ├── types/           # kanban.d.ts
│       └── data/            # initialData.ts
├── styles/
│   └── main.css            # Glassmorphism utilities
└── pages/
    └── Dashboard.tsx       # The Orchestrator

🚀 6. Next Steps for Development

    Persistence: Connect the onSave handler in Dashboard.tsx to localStorage or a backend API.

    Animations: Implement framer-motion for the "Layout Transitions" when cards swap positions.

    Glassmorphism UI: Apply backdrop-blur-md and bg-white/10 to the cards to match the Xbox 360 aesthetic.

    Column Management: Implement the ability to add/delete/rename columns within the BoardProvider.