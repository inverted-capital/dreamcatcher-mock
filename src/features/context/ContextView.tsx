import React from 'react';
import { Clipboard, Trash2, Plus, Edit, Copy } from 'lucide-react';
import { useChatStore } from '@/features/chat/state';

const ContextView: React.FC = () => {
  const navigationHistory = useChatStore(state => state.navigationHistory);
  
  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Clipboard className="mr-2" size={24} />
        Context Manager
      </h1>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Current Context</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded flex items-center text-sm hover:bg-blue-100">
              <Plus size={16} className="mr-2" />
              Add Context
            </button>
            <button className="px-3 py-1.5 bg-red-50 text-red-600 rounded flex items-center text-sm hover:bg-red-100">
              <Trash2 size={16} className="mr-2" />
              Clear All
            </button>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">
          The following context will be included in your conversations. You can add, edit, or remove context items as needed.
        </p>
        
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Active Context Items</h3>
          
          {navigationHistory.length > 0 ? (
            <div className="space-y-3">
              {navigationHistory.map((navItem) => (
                <div 
                  key={navItem.id} 
                  className="bg-white p-3 rounded border border-gray-200 flex justify-between items-start"
                >
                  <div>
                    <div className="font-medium flex items-center">
                      {navItem.title}
                      <span className="ml-2 px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                        {navItem.view}
                      </span>
                    </div>
                    
                    {navItem.context && navItem.context.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {navItem.context.map((ctxPart, idx) => (
                          <div key={idx} className="text-sm text-gray-600 flex items-center">
                            <span className="text-xs bg-blue-50 text-blue-700 rounded px-1 mr-1">
                              {ctxPart.type}
                            </span>
                            {ctxPart.value}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(navItem.timestamp).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <button className="p-1 text-gray-400 hover:text-gray-600" title="Edit">
                      <Edit size={14} />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600" title="Copy">
                      <Copy size={14} />
                    </button>
                    <button className="p-1 text-red-400 hover:text-red-600" title="Remove">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No context items have been added yet.
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium mb-4">Saved Context Templates</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer">
            <h3 className="font-medium">Development Environment</h3>
            <p className="text-sm text-gray-600 mt-1">Repository, branch, and file context for development tasks</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer">
            <h3 className="font-medium">Customer Support</h3>
            <p className="text-sm text-gray-600 mt-1">Customer data and recent interactions for support queries</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer">
            <h3 className="font-medium">Project Planning</h3>
            <p className="text-sm text-gray-600 mt-1">Project details, milestones, and team information</p>
          </div>
          
          <div className="border border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center text-gray-500">
            <Plus size={16} className="mr-2" />
            <span>Create New Template</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextView;