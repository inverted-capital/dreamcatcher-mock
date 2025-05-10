import React, { useState } from 'react';
import { X, Globe } from 'lucide-react';
import { useRepoStore } from '../state';

interface CloneRepositoryModalProps {
  onClose: () => void;
}

const CloneRepositoryModal: React.FC<CloneRepositoryModalProps> = ({ onClose }) => {
  const { addRepository, selectRepository } = useRepoStore();
  const [repoUrl, setRepoUrl] = useState('');
  
  const handleCloneRepo = () => {
    if (!repoUrl.trim()) return;
    
    // Extract repo name from URL
    const urlParts = repoUrl.trim().split('/');
    const repoName = urlParts[urlParts.length - 1].replace('.git', '') || 'cloned-repo';
    
    const newRepo = {
      name: repoName,
      description: `Cloned from ${repoUrl.trim()}`,
      stars: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      language: 'Unknown',
    };
    
    const newRepoId = addRepository(newRepo);
    selectRepository(newRepoId);
    onClose();
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black/20 flex items-center justify-center z-50" 
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div 
        className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Clone Repository</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Repository URL*
          </label>
          <div className="flex items-center">
            <div className="mr-2">
              <Globe size={16} className="text-gray-500" />
            </div>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://github.com/username/repo.git"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Enter the URL of the repository you want to clone
          </p>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleCloneRepo}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            disabled={!repoUrl.trim()}
          >
            Clone Repository
          </button>
        </div>
      </div>
    </div>
  );
};

export default CloneRepositoryModal;