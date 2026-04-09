import React from 'react';
import { Task } from '../types/kanban';

interface TaskMenuProps {
    task: Task;
    onClose: () => void;
    onUpdateTask: (updatedTask: Task) => void;
}

const TaskMenu: React.FC<TaskMenuProps> = ({ task, onClose, onUpdateTask }) => {
    // Leveraging Native HTML Form behavior to gather state on submit,
    // avoiding all React component state, useEffects, and dependency arrays.
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);

        const getStr = (name: string) => (data.get(name) as string) || '';
        const getArr = (name: string) => getStr(name).split('\n').filter(s => s.trim() !== '');

        // Safely parse JSON
        let inputSchemaStr = getStr('data.inputSchema');
        let parsedSchema: object | undefined = undefined;
        if (inputSchemaStr.trim() !== '') {
            try {
                parsedSchema = JSON.parse(inputSchemaStr);
            } catch (err) {
                alert('Invalid JSON in Input Schema. Please fix it before saving.');
                return; // halt save on invalid structural json
            }
        }

        const estTokensStr = getStr('metadata.estimatedTokens');

        const updatedTask: Task = {
            ...task, // preserve unchanged top-level properties like id
            content: getStr('content'),
            objective: getStr('objective'),
            context: {
                background: getStr('context.background'),
                dependencies: getArr('context.dependencies'),
                constraints: getArr('context.constraints')
            },
            metadata: {
                status: getStr('metadata.status') as Task['metadata']['status'],
                priority: getStr('metadata.priority') as Task['metadata']['priority'],
                assignedAgentId: getStr('metadata.assignedAgentId') || undefined,
                estimatedTokens: estTokensStr ? parseInt(estTokensStr, 10) : undefined
            },
            data: {
                outputFormat: getStr('data.outputFormat') as NonNullable<Task['data']>['outputFormat'],
                referenceUrls: getArr('data.referenceUrls'),
                inputSchema: parsedSchema
            }
        };
        onUpdateTask(updatedTask);
        onClose();
    };

    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center aero-modal-overlay p-4 overflow-y-auto"
            onClick={onClose}
        >
            <form
                onSubmit={handleSubmit}
                className="aero-modal w-full max-w-4xl flex flex-col max-h-[90vh]"
                onClick={stopPropagation}
            >
                {/* Header */}
                <div className="aero-modal-header flex justify-between items-center p-5 rounded-t-[16px]">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-800 text-shadow-sm flex items-center gap-2">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Task Properties
                    </h2>
                    <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-white/40 border border-white/60 shadow-inner rounded-full text-xs font-mono text-slate-700">
                            ID: {task.id}
                        </span>
                        <button
                            type="button"
                            onClick={onClose}
                            className="aero-button !p-2 !rounded-full !border-red-300 text-red-600 hover:text-red-800"
                            aria-label="Close"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-8 custom-scrollbar relative">

                    {/* General Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-blue-200 pb-2">
                            <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center border border-blue-200 shadow-sm text-sm">1</span>
                                General Information
                            </h3>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">Title / Summary</label>
                            <input
                                type="text"
                                name="content"
                                defaultValue={task.content}
                                className="aero-input w-full p-2.5"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">Objective (Definition of Done)</label>
                            <textarea
                                name="objective"
                                defaultValue={task.objective}
                                rows={2}
                                className="aero-input w-full p-2.5 resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">Background Context</label>
                            <textarea
                                name="context.background"
                                defaultValue={task.context?.background}
                                rows={2}
                                className="aero-input w-full p-2.5 resize-none"
                            />
                        </div>
                    </div>

                    {/* Dependencies & Constraints Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-purple-200 pb-2">
                                <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center border border-purple-200 shadow-sm text-sm">2</span>
                                    Dependencies
                                </h3>
                            </div>
                            <textarea
                                name="context.dependencies"
                                defaultValue={task.context?.dependencies?.join('\n')}
                                rows={3}
                                placeholder="Enter task IDs (one per line)"
                                className="aero-input w-full p-2.5 font-mono text-sm resize-none"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-red-200 pb-2">
                                <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center border border-red-200 shadow-sm text-sm">3</span>
                                    Constraints
                                </h3>
                            </div>
                            <textarea
                                name="context.constraints"
                                defaultValue={task.context?.constraints?.join('\n')}
                                rows={3}
                                placeholder="Enter constraints (one per line)"
                                className="aero-input w-full p-2.5 text-sm resize-none"
                            />
                        </div>
                    </div>

                    {/* Metadata Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-green-200 pb-2">
                            <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center border border-green-200 shadow-sm text-sm">4</span>
                                Execution Metadata
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Status</label>
                                <select
                                    name="metadata.status"
                                    defaultValue={task.metadata?.status}
                                    className="aero-input w-full p-2.5"
                                >
                                    <option value="backlog">Backlog</option>
                                    <option value="todo">To Do</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="review">Review</option>
                                    <option value="done">Done</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Priority</label>
                                <select
                                    name="metadata.priority"
                                    defaultValue={task.metadata?.priority}
                                    className="aero-input w-full p-2.5"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="critical">Critical</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Assigned Agent</label>
                                <input
                                    type="text"
                                    name="metadata.assignedAgentId"
                                    defaultValue={task.metadata?.assignedAgentId || ''}
                                    placeholder="Agent ID"
                                    className="aero-input w-full p-2.5"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Est. Tokens</label>
                                <input
                                    type="number"
                                    name="metadata.estimatedTokens"
                                    defaultValue={task.metadata?.estimatedTokens || ''}
                                    placeholder="e.g. 1500"
                                    className="aero-input w-full p-2.5"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Technical Payload Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-yellow-200 pb-2">
                            <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center border border-yellow-200 shadow-sm text-sm">5</span>
                                Technical Payload (Data)
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Output Format</label>
                                <select
                                    name="data.outputFormat"
                                    defaultValue={task.data?.outputFormat || 'text'}
                                    className="aero-input w-full p-2.5"
                                >
                                    <option value="text">Text</option>
                                    <option value="json">JSON</option>
                                    <option value="markdown">Markdown</option>
                                    <option value="code">Code</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-600 mb-1">Reference URLs</label>
                                <textarea
                                    name="data.referenceUrls"
                                    defaultValue={task.data?.referenceUrls?.join('\n')}
                                    rows={2}
                                    placeholder="https://..."
                                    className="aero-input w-full p-2.5 text-sm resize-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">Input Schema (JSON)</label>
                            <textarea
                                name="data.inputSchema"
                                defaultValue={task.data?.inputSchema ? JSON.stringify(task.data.inputSchema, null, 2) : ''}
                                rows={4}
                                className="aero-input w-full p-2.5 font-mono text-sm resize-none"
                            />
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="aero-modal-header p-5 flex justify-end gap-3 rounded-b-[16px] border-t border-white/40">
                    <button
                        type="button"
                        onClick={onClose}
                        className="aero-button"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="aero-button aero-button-primary px-8"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

TaskMenu.displayName = 'TaskMenu';

export default TaskMenu;
