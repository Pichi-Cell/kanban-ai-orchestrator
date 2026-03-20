The React Development Constitution

Core Philosophy: Performance through Purity. Simplicity through Native APIs.
1. State Management & Data Architecture

    Normalized State: Avoid nested arrays. Store data in "Flat Maps" (Objects/Records indexed by ID). This ensures O(1) lookup and prevents unnecessary re-renders of the entire tree when a single leaf node updates.

    The "Store-less" Rule: Prioritize useSyncExternalStore or Context + State over external libraries (Redux, Zustand) unless global complexity mandates it.

    Immutability: Always use functional updates set((prev) => ...) and never mutate original references. Ensure only the specific "slice" of state being updated changes its memory reference.

2. Component Performance (The "Shield" Pattern)

    The Consumer Gatekeeper: Only top-level "Smart" components (Controllers/Boards) should consume Context.

    Memoization by Default: All "Dumb" or "Leaf" components (Cards, Rows, Items) must be wrapped in React.memo.

    Stable Prop Drilling: Pass data down as stable props (IDs or memoized objects).

    Reference Integrity: Wrap all event handlers and state-mutating functions in useCallback with minimal dependencies to prevent React.memo failure in children.

3. Rendering Logic

    Avoid the Waterfall: A re-render of a parent should never trigger a re-render of a sibling branch that hasn't changed.

    Prop Types: Prefer passing primitive IDs over complex objects when possible. If objects are passed, ensure they are referentially stable from the state.

    Strict Mode Awareness: Acknowledge that double-renders in development are expected and verify performance by checking which siblings don't log.

4. Interaction & APIs

    Native First: Leverage native Browser APIs (HTML5 Drag and Drop, Intersection Observer, Web Storage) before importing third-party wrappers.

    Action Delegation: Elements should broadcast their identity (e.g., via dataTransfer) rather than carrying the logic of the entire system.