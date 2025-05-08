import React from 'react';
import { Home, Code, FolderOpen } from 'lucide-react';
import { Repository } from '@/shared/types';
import { useRepoStore } from '../state';
import { useNavigationStore } from '@/features/navigation/state';
import { useChatStore } from '@/features/chat/state';

interface HomeRepositoryCardProps {
  repo: Repository;
  isSelected: boolean;
}

const HomeRepositoryCard: React.FC<HomeRepositoryCardProps> = ({ repo, isSelected }) => {
  const { selectRepository } = useRepoStore();
  const setCurrentView = useNavigationStore(state => state.setCurrentView);
  const navigateTo = useChatStore(state => state.navigateTo);

  const viewRepositoryFiles = (repoId: string) => {
    selectRepository(repoId);
    setCurrentView('files');
    navigateTo({
      title: 'Files',
      icon: 'Folder',
      view: 'files',
    });
  };

  return (
    <div 
      className={`bg-gray-50 border ${isSelected ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer`}
      onClick={() => selectRepository(repo.id)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-blue-600 flex items-center">
          <Home size={18} className="mr-2" />
          {repo.name}
        </h3>
        <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
          Personal
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">
        {repo.description}
      </p>
      
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center">
          <Code size={14} className="mr-1" />
          <span className="bg-gray-100 px-2 py-1 rounded">
            Settings & Configuration
          </span>
        </div>
        <div className="text-gray-500">
          Your main workspace
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            viewRepositoryFiles(repo.id);
          }}
          className={`text-xs px-2 py-1 ${isSelected ? 'bg-blue-100 text-blue-700' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'} rounded flex items-center transition-colors`}
        >
          <FolderOpen size={12} className="mr-1" />
          View Files
        </button>
      </div>
    </div>
  );
};

export default HomeRepositoryCard;