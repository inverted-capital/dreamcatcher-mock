import React, { useState } from 'react';
import { GitBranch, Plus, GitFork, LinkIcon, ChevronRight, ChevronDown, Code, Folder, FolderOpen, Star, Home, ExternalLink, ArrowUpToLine, ArrowDownToLine, Trash2 } from 'lucide-react';
import { useRepoStore } from '../state';
import { Repository } from '@/shared/types';
import RepositorySearch from './RepositorySearch';
import NewRepositoryModal from '../modals/NewRepositoryModal';
import CloneRepositoryModal from '../modals/CloneRepositoryModal';
import LinkRepositoryModal from '../modals/LinkRepositoryModal';
import ConfirmationModal from '../modals/ConfirmationModal';
import { useNavigationStore } from '@/features/navigation/state';
import { useChatStore } from '@/features/chat/state';

const TreeItem: React.FC<{
  repo: Repository;
  isSelected: boolean;
  level: number;
  path: string;
}> = ({ repo, isSelected, level, path }) => {
  const { 
    selectRepository, 
    getRepositoryChildren, 
    toggleExpandRepository, 
    isRepositoryExpanded, 
    deleteRepository, 
    unlinkRepository,
    isHomeRepository
  } = useRepoStore();
  
  const setCurrentView = useNavigationStore(state => state.setCurrentView);
  const navigateTo = useChatStore(state => state.navigateTo);
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUnlinkConfirm, setShowUnlinkConfirm] = useState(false);
  
  const childRepos = getRepositoryChildren(repo.id);
  const isExpanded = isRepositoryExpanded(repo.id);
  const hasChildren = childRepos.length > 0;
  
  const viewRepositoryFiles = (repoId: string) => {
    selectRepository(repoId);
    setCurrentView('files');
    navigateTo({
      title: 'Files',
      icon: 'Folder',
      view: 'files',
    });
  };

  const handlePullRepo = () => {
    // Simulate pull operation
    alert(`Pulling latest changes for repository ${repo.name}`);
  };

  const handlePushRepo = () => {
    // Simulate push operation
    alert(`Pushing changes to repository ${repo.name}`);
  };
  
  const handleExternalLink = () => {
    // In a real app, this would navigate to the actual repo URL
    alert(`Navigate to external repository URL for ${repo.name}`);
  };
  
  const formatStars = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };
  
  return (
    <div className="select-none">
      <div 
        className={`flex items-center py-2 px-2 rounded-md hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
        style={{ marginLeft: `${level * 16}px` }}
      >
        <div 
          className="w-5 mr-1 flex-shrink-0 flex justify-center cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            toggleExpandRepository(repo.id);
          }}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown size={16} className="text-gray-500" />
            ) : (
              <ChevronRight size={16} className="text-gray-500" />
            )
          ) : (
            <span className="w-4"></span>
          )}
        </div>
        
        <div 
          className="flex-grow flex items-center cursor-pointer"
          onClick={() => selectRepository(repo.id)}
        >
          {repo.isHome ? (
            <Home size={16} className="text-blue-500 mr-2" />
          ) : (
            <Folder size={16} className="text-blue-500 mr-2" />
          )}
          <span className="font-medium">{repo.name}</span>
          
          {repo.isLinked && (
            <span className="ml-2 flex items-center text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-full">
              <LinkIcon size={10} className="mr-1" />
              Linked
            </span>
          )}
          
          {!repo.isHome && (
            <div className="ml-2 flex items-center text-gray-500 text-xs">
              <Star size={12} className="text-yellow-500 mr-1" />
              {formatStars(repo.stars)}
            </div>
          )}
        </div>
      </div>
      
      {/* Display repo details when selected */}
      {isSelected && (
        <div 
          className="mb-2 pb-2 border-b border-gray-100"
          style={{ marginLeft: `${level * 16 + 20}px` }}
        >
          <div className="bg-white rounded-lg border border-gray-200 p-3 mt-1">
            <div className="text-sm text-gray-500 mb-2">
              {path}
            </div>
            
            <p className="text-sm text-gray-600 mb-3">
              {repo.description}
            </p>
            
            <div className="flex items-center justify-between text-xs mb-3">
              <div className="flex items-center">
                <Code size={14} className="mr-1" />
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {repo.language}
                </span>
              </div>
              <div className="text-gray-500">
                Updated on {repo.lastUpdated}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => viewRepositoryFiles(repo.id)}
                className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded flex items-center hover:bg-blue-100 transition-colors"
              >
                <FolderOpen size={12} className="mr-1" />
                View Files
              </button>
              
              {!repo.isHome && (
                <>
                  <button 
                    onClick={handlePullRepo}
                    className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded flex items-center hover:bg-blue-100 transition-colors"
                  >
                    <ArrowDownToLine size={12} className="mr-1" />
                    Pull
                  </button>
                  
                  {!repo.isLinked && (
                    <button 
                      onClick={handlePushRepo}
                      className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded flex items-center hover:bg-green-100 transition-colors"
                    >
                      <ArrowUpToLine size={12} className="mr-1" />
                      Push
                    </button>
                  )}
                  
                  {repo.isLinked ? (
                    <button 
                      onClick={() => setShowUnlinkConfirm(true)}
                      className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded flex items-center hover:bg-purple-100 transition-colors ml-auto"
                    >
                      <LinkIcon size={12} className="mr-1" />
                      Unlink
                    </button>
                  ) : (
                    <button 
                      onClick={() => setShowDeleteConfirm(true)}
                      className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded flex items-center hover:bg-red-100 transition-colors ml-auto"
                    >
                      <Trash2 size={12} className="mr-1" />
                      Delete
                    </button>
                  )}
                  
                  {/* External link for linked repositories */}
                  {repo.isLinked && (
                    <button 
                      onClick={handleExternalLink}
                      className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded flex items-center hover:bg-gray-100 transition-colors"
                    >
                      <ExternalLink size={12} className="mr-1" />
                      Open External
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Render children if expanded */}
      {isExpanded && hasChildren && (
        <div>
          {childRepos.map(childRepo => (
            <TreeItem 
              key={childRepo.id} 
              repo={childRepo} 
              isSelected={isSelected && childRepo.id === repo.id}
              level={level + 1}
              path={`${path} / ${childRepo.name}`}
            />
          ))}
        </div>
      )}
      
      {/* Confirmation Modals */}
      {showDeleteConfirm && (
        <ConfirmationModal
          title="Delete Repository"
          message={`Are you sure you want to delete ${repo.name}? This action cannot be undone.`}
          confirmText="Delete"
          confirmButtonClass="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          onConfirm={() => {
            deleteRepository(repo.id);
            setShowDeleteConfirm(false);
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
      
      {showUnlinkConfirm && (
        <ConfirmationModal
          title="Unlink Repository"
          message={`Are you sure you want to unlink ${repo.name}? You won't lose any data, but the repository will be removed from your list.`}
          confirmText="Unlink"
          confirmButtonClass="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
          onConfirm={() => {
            unlinkRepository(repo.id);
            setShowUnlinkConfirm(false);
          }}
          onCancel={() => setShowUnlinkConfirm(false)}
        />
      )}
    </div>
  );
};

const ReposView: React.FC = () => {
  const { 
    currentRepoId,
    getRepositoryChildren,
    filterRepositories,
    selectRepository,
    getRepositoryPath
  } = useRepoStore();
  
  const [showNewRepoModal, setShowNewRepoModal] = useState(false);
  const [showCloneRepoModal, setShowCloneRepoModal] = useState(false);
  const [showLinkRepoModal, setShowLinkRepoModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const rootRepositories = getRepositoryChildren(null);
  const filteredRepositories = searchQuery ? filterRepositories(searchQuery) : [];
  
  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <GitBranch className="mr-2" size={24} />
          Repositories
        </h1>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowNewRepoModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center transition-colors"
          >
            <Plus size={16} className="mr-2" />
            New Repo
          </button>
          
          <button 
            onClick={() => setShowCloneRepoModal(true)}
            className="border border-gray-200 bg-white hover:bg-gray-50 px-3 py-2 rounded-md flex items-center transition-colors"
          >
            <GitFork size={16} className="mr-2" />
            Clone
          </button>
          
          <button 
            onClick={() => setShowLinkRepoModal(true)}
            className="border border-gray-200 bg-white hover:bg-gray-50 px-3 py-2 rounded-md flex items-center transition-colors"
          >
            <LinkIcon size={16} className="mr-2" />
            Link
          </button>
        </div>
      </div>
      
      <RepositorySearch 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />
      
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        {searchQuery ? (
          <div>
            <h2 className="text-sm font-medium text-gray-700 mb-2">Search Results</h2>
            
            {filteredRepositories.length > 0 ? (
              <div className="space-y-1">
                {filteredRepositories.map(repo => (
                  <div 
                    key={repo.id}
                    className="p-2 hover:bg-gray-50 rounded-md cursor-pointer flex items-center"
                    onClick={() => selectRepository(repo.id)}
                  >
                    <Folder size={16} className="text-blue-500 mr-2" />
                    <div>
                      <div className="font-medium">{repo.name}</div>
                      <div className="text-xs text-gray-500">{getRepositoryPath(repo.id)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 text-gray-500">
                No repositories match "{searchQuery}"
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-sm font-medium text-gray-700 mb-3">Repository Tree</h2>
            
            <div className="space-y-1">
              {rootRepositories.map(repo => (
                <TreeItem 
                  key={repo.id} 
                  repo={repo} 
                  isSelected={repo.id === currentRepoId}
                  level={0}
                  path={repo.name}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Modals */}
      {showNewRepoModal && (
        <NewRepositoryModal onClose={() => setShowNewRepoModal(false)} />
      )}
      
      {showCloneRepoModal && (
        <CloneRepositoryModal onClose={() => setShowCloneRepoModal(false)} />
      )}
      
      {showLinkRepoModal && (
        <LinkRepositoryModal onClose={() => setShowLinkRepoModal(false)} />
      )}
    </div>
  );
};

export default ReposView;