import React, { useState, useEffect } from 'react';
import { GitBranch, Plus, GitFork, LinkIcon, Home, FileText, ChevronRight, Link as LinkIcon2 } from 'lucide-react';
import { useRepoStore } from '../state';
import RepositoryTree from './RepositoryTree';
import RepositoryCard from './RepositoryCard';
import NewRepositoryModal from '../modals/NewRepositoryModal';
import CloneRepositoryModal from '../modals/CloneRepositoryModal';
import LinkRepositoryModal from '../modals/LinkRepositoryModal';
import { useNavigationStore } from '@/features/navigation/state';
import { useChatStore } from '@/features/chat/state';

const ReposView: React.FC = () => {
  const { 
    repositories, 
    currentRepoId,
    getRepositoryById,
    isHomeRepository,
    getRepositoryPath,
    selectRepository
  } = useRepoStore();
  
  const setCurrentView = useNavigationStore(state => state.setCurrentView);
  const navigateTo = useChatStore(state => state.navigateTo);
  
  const [showNewRepoModal, setShowNewRepoModal] = useState(false);
  const [showCloneRepoModal, setShowCloneRepoModal] = useState(false);
  const [showLinkRepoModal, setShowLinkRepoModal] = useState(false);
  
  // Initialize with all repo IDs to fully expand the tree by default
  const [openNodes, setOpenNodes] = useState<Set<string>>(() => {
    const allRepoIds = new Set<string>();
    repositories.forEach(repo => allRepoIds.add(repo.id));
    return allRepoIds;
  });

  // Always ensure we have a repository selected, defaulting to home
  useEffect(() => {
    if (!currentRepoId) {
      selectRepository('home-repo');
    }
  }, [currentRepoId, selectRepository]);

  const toggleNode = (id: string) => {
    const newOpenNodes = new Set(openNodes);
    if (newOpenNodes.has(id)) {
      newOpenNodes.delete(id);
    } else {
      newOpenNodes.add(id);
    }
    setOpenNodes(newOpenNodes);
  };

  const currentRepo = currentRepoId ? getRepositoryById(currentRepoId) : null;
  const repoPath = currentRepoId ? getRepositoryPath(currentRepoId) : [];

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
      
      {/* Current Repository Card */}
      {currentRepo && (
        <div className="mb-6">
          <RepositoryCard 
            repo={currentRepo}
            isSelected={true}
          />
        </div>
      )}
      
      {/* Repository Path Breadcrumbs */}
      {repoPath.length > 0 && (
        <div className="flex items-center mb-4 bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="text-sm text-gray-500 mr-2">Repository Path:</div>
          <div className="flex items-center flex-wrap">
            {repoPath.map((repo, index) => (
              <React.Fragment key={repo.id}>
                <button 
                  className="flex items-center text-blue-600 hover:text-blue-800"
                  onClick={() => selectRepository(repo.id)}
                >
                  <span className="text-sm font-medium">{repo.name}</span>
                  {repo.isLinked && (
                    <LinkIcon2 size={12} className="ml-1 text-purple-500" />
                  )}
                </button>
                {index < repoPath.length - 1 && (
                  <ChevronRight size={16} className="mx-1 text-gray-400" />
                )}
              </React.Fragment>
            ))}
          </div>
          
          {currentRepo && (
            <button 
              onClick={() => viewRepositoryFiles(currentRepo.id)}
              className="ml-auto flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <FileText size={14} className="mr-1" />
              View Files
            </button>
          )}
        </div>
      )}
      
      {/* Repository Tree */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-medium mb-4">Repository Structure</h2>
        
        <div className="mb-2 text-sm text-gray-500">
          Click on a repository to select it. Expand and collapse to navigate the hierarchy.
        </div>
        
        <div className="mt-4">
          <RepositoryTree 
            parentId="home-repo" 
            level={0} 
            openNodes={openNodes} 
            toggleNode={toggleNode} 
            isRoot={true}
          />
        </div>
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