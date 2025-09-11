'use client';

import { useState } from 'react';
import { Task } from '../types/task';

interface TaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask: (updatedTask: Task) => Promise<void>;
}

export default function TaskModal({ task, isOpen, onClose, onUpdateTask }: TaskModalProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !task) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateTimeLocal = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
      case 'in progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEditClick = () => {
    setFormData({ ...task });
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setFormData(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!formData) return;
    
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev!,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setIsLoading(true);
    try {
      await onUpdateTask(formData);
      setIsEditMode(false);
      setFormData(null);
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1 mr-4">
            {isEditMode ? (
              <input
                type="text"
                name="title"
                value={formData?.title || ''}
                onChange={handleInputChange}
                className="text-2xl font-bold text-gray-900 dark:text-white mb-2 w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2"
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {task.title}
              </h2>
            )}
            {isEditMode ? (
              <select
                name="status"
                value={formData?.status || ''}
                onChange={handleInputChange}
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(formData?.status || '')} bg-gray-50 dark:bg-gray-700`}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            ) : (
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(task.status)}`}>
                {task.status.replace('_', ' ').toUpperCase()}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
            {isEditMode ? (
              <textarea
                name="description"
                value={formData?.description || ''}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={4}
              />
            ) : (
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>

          {/* Task Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dates */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Timeline</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Start Date:</span>
                  {isEditMode ? (
                    <input
                      type="datetime-local"
                      name="start_date"
                      value={formData ? formatDateTimeLocal(formData.start_date) : ''}
                      onChange={handleInputChange}
                      className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 dark:text-white">{formatDate(task.start_date)}</span>
                  )}
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">End Date:</span>
                  {isEditMode ? (
                    <input
                      type="datetime-local"
                      name="end_date"
                      value={formData ? formatDateTimeLocal(formData.end_date) : ''}
                      onChange={handleInputChange}
                      className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 dark:text-white">{formatDate(task.end_date)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Task Info */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Task Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Task ID:</span>
                  <span className="text-sm text-gray-900 dark:text-white">#{task.id}</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Assignee:</span>
                  {isEditMode ? (
                    <input
                      type="number"
                      name="user_id"
                      value={formData?.user_id || ''}
                      onChange={handleInputChange}
                      className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 dark:text-white">{task.username}</span>
                  )}
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Created By:</span>
                  {isEditMode ? (
                    <input
                      type="number"
                      name="created_by"
                      value={formData?.created_by || ''}
                      onChange={handleInputChange}
                      className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
                    />
                  ) : (
                    <span className="text-sm text-gray-900 dark:text-white">{task.created_by}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Related Links</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Jira Link:</span>
                {isEditMode ? (
                  <input
                    type="url"
                    name="jira_link"
                    value={formData?.jira_link || ''}
                    onChange={handleInputChange}
                    className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
                    placeholder="https://jira.example.com/browse/TICKET-123"
                  />
                ) : task.jira_link && task.jira_link !== 'string' ? (
                  <a
                    href={task.jira_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm hover:bg-blue-100 transition-colors border border-blue-200"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                    View
                  </a>
                ) : (
                  <span className="text-sm text-gray-500">No Jira Link</span>
                )}
              </div>
              
              <div className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Pull Requests:</span>
                {isEditMode ? (
                  <input
                    type="text"
                    name="pull_requests_links"
                    value={formData?.pull_requests_links || ''}
                    onChange={handleInputChange}
                    className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
                    placeholder="https://github.com/repo/pull/123, https://github.com/repo/pull/456"
                  />
                ) : task.pull_requests_links && task.pull_requests_links !== 'string' ? (
                  <div className="flex flex-wrap gap-1">
                    {task.pull_requests_links.split(',').map((link, index) => {
                      const trimmedLink = link.trim();
                      if (!trimmedLink) return null;
                      
                      return (
                        <a
                          key={index}
                          href={trimmedLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded text-sm hover:bg-green-100 transition-colors border border-green-200"
                        >
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                          </svg>
                          PR #{index + 1}
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">No Pull Requests</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          {isEditMode ? (
            <>
              <button
                onClick={handleCancelEdit}
                disabled={isLoading}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEditClick}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Edit Task
              </button>
              <button
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
