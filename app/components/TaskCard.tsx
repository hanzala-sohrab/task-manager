'use client';

import { useState } from 'react';
import { Task } from '../types/task';
import { copyToClipboard } from '../utils/copyToClipboard';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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

  const handleCopyLink = async (link: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await copyToClipboard(link);
      setCopiedLink(link);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick(task)}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
          {task.title}
        </h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
          {task.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
        {task.description}
      </p>

      {/* Dates */}
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
        <div>
          <span className="font-medium">Start:</span> {formatDate(task.start_date)}
        </div>
        <div>
          <span className="font-medium">End:</span> {formatDate(task.end_date)}
        </div>
      </div>

      {/* Links and Actions */}
      <div className="flex flex-wrap gap-2 mb-3">
        {task.jira_link && task.jira_link !== 'string' && (
          <div className="flex items-center gap-1">
            <a
              href={task.jira_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
              </svg>
              Jira
            </a>
            <button
              onClick={(e) => handleCopyLink(task.jira_link, e)}
              className="inline-flex items-center px-1.5 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200 transition-colors cursor-pointer"
              title="Copy Jira link"
            >
              {copiedLink === task.jira_link ? (
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
              )}
            </button>
          </div>
        )}
        {task.pull_requests_links && task.pull_requests_links !== 'string' && (
          task.pull_requests_links.split(',').slice(0, 2).map((link, index) => {
            const trimmedLink = link.trim();
            if (!trimmedLink) return null;
            
            return (
              <div key={index} className="flex items-center gap-1">
                <a
                  href={trimmedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded text-xs hover:bg-green-100 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                  </svg>
                  PR{task.pull_requests_links.split(',').length > 1 ? ` ${index + 1}` : ''}
                </a>
                <button
                  onClick={(e) => handleCopyLink(trimmedLink, e)}
                  className="inline-flex items-center px-1.5 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200 transition-colors cursor-pointer"
                  title="Copy PR link"
                >
                  {copiedLink === trimmedLink ? (
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                  )}
                </button>
              </div>
            );
          })
        )}
        {task.pull_requests_links && task.pull_requests_links !== 'string' && task.pull_requests_links.split(',').length > 2 && (
          <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
            +{task.pull_requests_links.split(',').length - 2} more
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
        <span>ID: {task.id}</span>
        <span>Created by: {task.created_by}</span>
      </div>
    </div>
  );
}
