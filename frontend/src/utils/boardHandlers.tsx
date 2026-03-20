export const handleCardDragStart = (
    e: React.DragEvent,
    taskId: string,
    index: number,
    columnId: string
) => {
    // Store the ID and the Source index in the dataTransfer object
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("sourceIndex", index.toString());
    e.dataTransfer.setData("sourceColId", columnId);
    e.dataTransfer.effectAllowed = "move";
};

export const handleColumnDrop = (
    e: React.DragEvent,
    columnId: string,
    columnTasksLength: number,
    moveTask: (taskId: string, sourceColId: string, destColId: string, index: number) => void
) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const sourceColId = e.dataTransfer.getData("sourceColId");
    const cardElements = Array.from((e.currentTarget as HTMLElement).querySelectorAll('.kanban-card'));

    // 2. Find the index of the first card whose middle is below the mouse
    const dropIndex = cardElements.findIndex(el => {
        const rect = el.getBoundingClientRect();
        const midPoint = rect.top + rect.height / 2;
        return e.clientY < midPoint;
    });

    // 3. If no cards are below, it goes to the end (-1 becomes length)
    const finalIndex = dropIndex === -1 ? columnTasksLength : dropIndex;

    moveTask(taskId, sourceColId, columnId, finalIndex);
};
