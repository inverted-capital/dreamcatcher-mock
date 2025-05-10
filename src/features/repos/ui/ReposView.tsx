import React, { useState } from 'react';
import { GitBranch, Plus, GitFork, LinkIcon } from 'lucide-react';
import { useRepoStore } from '../state';
import RepositorySearch from './RepositorySearch';
import HomeRepositoryCard from './HomeRepositoryCard';
import RepositoryCard from './RepositoryCard';
import NewRepositoryModal from '../modals/NewRepositoryModal';
import CloneRepositoryModal from '../modals/CloneRepositoryModal';
import LinkRepositoryModal from '../modals/LinkRepositoryModal';

const ReposView: React.FC = () => {
  const { 
    repositories, 
    currentRepoId,
    filterRepositories
  } = useRepoStore();
  
  const [showNewRepoModal, setShowNewRepoModal] = useState(false);
  const [showCloneRepoModal, setShowCloneRepoModal] = useState(false);
  const [showLinkRepoModal, setShowLinkRepoModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRepositories = searchQuery ? filterRepositories(searchQuery) : repositories;
  
  // Place home repository first
  const sortedRepositories = [...filteredRepositories].sort((a, b) => {
    if (a.id === 'home-repo') return -1;
    if (b.id === 'home-repo') return 1;
    return 0;
  });

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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Home Repository - Special handling */}
        {sortedRepositories.filter(repo => repo.id === 'home-repo').map((repo) => (
          <HomeRepositoryCard 
            key={repo.id} 
            repo={repo}
            isSelected={repo.id === currentRepoId} 
          />
        ))}
        
        {/* Regular Repositories */}
        {sortedRepositories.filter(repo => repo.id !== 'home-repo').map((repo) => (
          <RepositoryCard 
            key={repo.id} 
            repo={repo}
            isSelected={repo.id === currentRepoId} 
          />
        ))}
        
        {sortedRepositories.length === 0 && (
          <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="text-gray-400 mb-2">
              <GitBranch size={40} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Repositories Found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? `No repositories match "${searchQuery}"` : "You don't have any repositories yet"}
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowNewRepoModal(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Create New Repository
              </button>
              <button
                onClick={() => setShowLinkRepoModal(true)}
                className="px-4 py-2 border border-gray-300 bg-white rounded-md hover:bg-gray-50"
              >
                Connect Existing Repository
              </button>
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