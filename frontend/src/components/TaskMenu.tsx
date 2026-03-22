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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 overflow-y-auto"
            onClick={onClose}
        >
            <form
                onSubmit={handleSubmit}
                className="bg-slate-900/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl w-full max-w-4xl flex flex-col max-h-[90vh] text-slate-200"
                onClick={stopPropagation}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5 rounded-t-2xl">
                    <h2 className="text-2xl font-semibold tracking-tight text-white">Edit Task</h2>
                    <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono text-slate-300">
                            ID: {task.id}
                        </span>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 focus:outline-none"
                            aria-label="Close"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-8 custom-scrollbar">

                    {/* General Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-lg font-medium text-white">General Information</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Title / Summary</label>
                            <input
                                type="text"
                                name="content"
                                defaultValue={task.content}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Objective (Definition of Done)</label>
                            <textarea
                                name="objective"
                                defaultValue={task.objective}
                                rows={2}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Background Context</label>
                            <textarea
                                name="context.background"
                                defaultValue={task.context?.background}
                                rows={2}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
                            />
                        </div>
                    </div>

                    {/* Dependencies & Constraints Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                <h3 className="text-lg font-medium text-white">Dependencies</h3>
                            </div>
                            <textarea
                                name="context.dependencies"
                                defaultValue={task.context?.dependencies?.join('\n')}
                                rows={3}
                                placeholder="Enter task IDs (one per line)"
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none font-mono text-sm"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <h3 className="text-lg font-medium text-white">Constraints</h3>
                            </div>
                            <textarea
                                name="context.constraints"
                                defaultValue={task.context?.constraints?.join('\n')}
                                rows={3}
                                placeholder="Enter constraints (one per line)"
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none text-sm"
                            />
                        </div>
                    </div>

                    {/* Metadata Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <h3 className="text-lg font-medium text-white">Execution Metadata</h3>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
                                <select
                                    name="metadata.status"
                                    defaultValue={task.metadata?.status}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all appearance-none"
                                >
                                    <option className="bg-slate-800" value="backlog">Backlog</option>
                                    <option className="bg-slate-800" value="todo">To Do</option>
                                    <option className="bg-slate-800" value="in-progress">In Progress</option>
                                    <option className="bg-slate-800" value="review">Review</option>
                                    <option className="bg-slate-800" value="done">Done</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Priority</label>
                                <select
                                    name="metadata.priority"
                                    defaultValue={task.metadata?.priority}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all appearance-none"
                                >
                                    <option className="bg-slate-800" value="low">Low</option>
                                    <option className="bg-slate-800" value="medium">Medium</option>
                                    <option className="bg-slate-800" value="high">High</option>
                                    <option className="bg-slate-800" value="critical">Critical</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Assigned Agent</label>
                                <input
                                    type="text"
                                    name="metadata.assignedAgentId"
                                    defaultValue={task.metadata?.assignedAgentId || ''}
                                    placeholder="Agent ID"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Est. Tokens</label>
                                <input
                                    type="number"
                                    name="metadata.estimatedTokens"
                                    defaultValue={task.metadata?.estimatedTokens || ''}
                                    placeholder="e.g. 1500"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Technical Payload Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            <h3 className="text-lg font-medium text-white">Technical Payload (Data)</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Output Format</label>
                                <select
                                    name="data.outputFormat"
                                    defaultValue={task.data?.outputFormat || 'text'}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all appearance-none"
                                >
                                    <option className="bg-slate-800" value="text">Text</option>
                                    <option className="bg-slate-800" value="json">JSON</option>
                                    <option className="bg-slate-800" value="markdown">Markdown</option>
                                    <option className="bg-slate-800" value="code">Code</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Reference URLs (one per line)</label>
                                <textarea
                                    name="data.referenceUrls"
                                    defaultValue={task.data?.referenceUrls?.join('\n')}
                                    rows={2}
                                    placeholder="https://..."
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between">
                                <label className="block text-sm font-medium text-slate-400 mb-1">Input Schema (JSON)</label>
                            </div>
                            <textarea
                                name="data.inputSchema"
                                defaultValue={task.data?.inputSchema ? JSON.stringify(task.data.inputSchema, null, 2) : ''}
                                rows={4}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono text-sm resize-none"
                                placeholder="realll"
                            />
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-5 border-t border-white/10 flex justify-end gap-3 bg-white/5 rounded-b-2xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2.5 rounded-lg text-sm font-medium text-white transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-600/90 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-blue-400/30"
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
