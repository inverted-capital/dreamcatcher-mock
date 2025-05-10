import React from 'react';
import { ChevronRight, ChevronDown, GitBranch, Link, Code, Home, FolderOpen } from 'lucide-react';
import { Repository } from '@/shared/types';
import { useRepoStore } from '../state';
import { useNavigationStore } from '@/features/navigation/state';
import { useChatStore } from '@/features/chat/state';

interface RepositoryTreeProps {
  parentId: string | null;
  level: number;
  openNodes: Set<string>;
  toggleNode: (id: string) => void;
  isRoot?: boolean;
}

const RepositoryTree: React.FC<RepositoryTreeProps> = ({ 
  parentId, 
  level = 0, 
  openNodes, 
  toggleNode,
  isRoot = false
}) => {
  const { 
    getRepositoryChildren, 
    selectRepository, 
    currentRepoId, 
    isHomeRepository,
    getRepositoryById,
    repositories
  } = useRepoStore();
  
  // For the root level, we show the Home repository itself
  // For subsequent levels, we show children of the provided parentId
  let reposToShow: Repository[] = [];
  
  if (isRoot && parentId === 'home-repo') {
    // Get the home repository and show it at root level
    const homeRepo = getRepositoryById('home-repo');
    reposToShow = homeRepo ? [homeRepo] : [];
    
    // Get direct children of home repo
    const homeChildren = getRepositoryChildren('home-repo');
    
    // Get repositories without a parent (except home) for the "root" level
    const rootRepos = repositories.filter(repo => 
      repo.id !== 'home-repo' && !repo.parentId
    );
    
    // Combine home children with root repos
    reposToShow = [...reposToShow, ...homeChildren, ...rootRepos];
  } else {
    // For non-root cases, just get direct children
    reposToShow = getRepositoryChildren(parentId);
  }
  
  if (reposToShow.length === 0) {
    return null;
  }
  
  return (
    <div className={`${level > 0 ? 'pl-6 border-l border-gray-200 ml-3' : ''}`}>
      {reposToShow.map(repo => {
        const children = getRepositoryChildren(repo.id);
        const hasChildren = children.length > 0;
        const isOpen = openNodes.has(repo.id);
        const isSelected = currentRepoId === repo.id;
        
        return (
          <div key={repo.id} className="py-1">
            <div 
              className={`flex items-center py-1.5 px-2 rounded-md cursor-pointer ${
                isSelected 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => selectRepository(repo.id)}
            >
              <div className="w-5 flex-shrink-0">
                {hasChildren && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleNode(repo.id);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {isOpen ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>
                )}
              </div>

              <div className="flex items-center flex-1 min-w-0">
                <div className="mr-2 text-gray-500">
                  {isHomeRepository(repo.id) ? (
                    <Home size={16} />
                  ) : (
                    <Code size={16} />
                  )}
                </div>
                <div className="truncate font-medium text-sm">
                  {repo.name}
                </div>
                {repo.isLinked && (
                  <div className="ml-2">
                    <Link size={14} className="text-purple-500" />
                  </div>
                )}
              </div>
            </div>
            
            {isOpen && hasChildren && (
              <RepositoryTree 
                parentId={repo.id} 
                level={level + 1} 
                openNodes={openNodes} 
                toggleNode={toggleNode} 
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RepositoryTree;