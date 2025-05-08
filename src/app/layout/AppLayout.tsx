import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import ChatContainer from '@/features/chat/ui/ChatContainer';
import { Home, GitBranch, FileText, ChevronDown, Code } from 'lucide-react';
import { useRepoStore } from '@/features/repos/state';
import { useFilesStore } from '@/features/files/state';
import { useNavigationStore } from '@/features/navigation/state';
import { useChatStore } from '@/features/chat/state';

const AppLayout: React.FC = () => {
  // Get state and actions from Zustand stores
  const {
    currentRepoId,
    currentBranch,
    getRepositoryById,
    isHomeRepository,
    selectRepository,
    switchBranch,
    availableBranches,
    selectHomeRepository
  } = useRepoStore();
  
  const {
    currentFileId,
    selectFile,
    getCurrentFile
  } = useFilesStore();
  
  const currentView = useNavigationStore(state => state.currentView);
  const navigateTo = useChatStore(state => state.navigateTo);
  
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const branchDropdownRef = useRef<HTMLDivElement>(null);
  
  const currentFile = getCurrentFile();
  const currentRepo = currentRepoId ? getRepositoryById(currentRepoId) : null;
  
  // Keep track of previous state values to detect changes
  const prevRepoIdRef = useRef<string | null>(currentRepoId);
  const prevBranchRef = useRef<string>(currentBranch);
  const prevFileIdRef = useRef<string | null>(currentFileId);
  const prevViewRef = useRef<string>(currentView);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target as Node)) {
        setShowBranchDropdown(false);
      }
    }
    
    // Add event listener when dropdown is shown
    if (showBranchDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Cleanup function
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showBranchDropdown]);
  
  // Close dropdown when changing views or selections
  useEffect(() => {
    setShowBranchDropdown(false);
  }, [currentView, currentRepoId, currentFileId]);

  // Create navigation marker when state changes (repo, branch, file, or view)
  useEffect(() => {
    const hasRepoChanged = currentRepoId !== prevRepoIdRef.current;
    const hasBranchChanged = currentBranch !== prevBranchRef.current;
    const hasFileChanged = currentFileId !== prevFileIdRef.current;
    const hasViewChanged = currentView !== prevViewRef.current;
    
    if (hasRepoChanged || hasBranchChanged || hasFileChanged || hasViewChanged) {
      // Create context parts for navigation
      const contextParts = [];
      
      if (currentRepoId && currentRepo) {
        const repoName = isHomeRepository(currentRepoId) ? 'Home' : currentRepo.name;
        contextParts.push({ type: 'repo', value: repoName });
      }
      
      if (currentBranch) {
        contextParts.push({ type: 'branch', value: currentBranch });
      }
      
      if (currentFile) {
        contextParts.push({ type: 'file', value: currentFile.name });
      }
      
      // Only create navigation marker if we have a view and at least one context item
      if (currentView && contextParts.length > 0) {
        // Determine the view title based on current view
        let viewTitle;
        let viewIcon;
        
        switch (currentView) {
          case 'repos':
            viewTitle = 'Repositories';
            viewIcon = 'GitBranch';
            break;
          case 'files':
            viewTitle = 'Files';
            viewIcon = 'Folder';
            break;
          case 'settings':
            viewTitle = 'Settings';
            viewIcon = 'Settings';
            break;
          case 'account':
            viewTitle = 'Account';
            viewIcon = 'User';
            break;
          case 'chats':
            viewTitle = 'Chats';
            viewIcon = 'MessageSquare';
            break;
          case 'home':
            viewTitle = 'Home';
            viewIcon = 'Home';
            break;
          default:
            viewTitle = currentView.charAt(0).toUpperCase() + currentView.slice(1);
            viewIcon = 'MessageSquare';
        }
        
        // Create navigation marker
        navigateTo({
          title: viewTitle,
          icon: viewIcon,
          view: currentView,
          context: contextParts
        });
      }
    }
    
    // Update refs with current values
    prevRepoIdRef.current = currentRepoId;
    prevBranchRef.current = currentBranch;
    prevFileIdRef.current = currentFileId;
    prevViewRef.current = currentView;
    
  }, [currentRepoId, currentBranch, currentFileId, currentView, currentRepo, currentFile, isHomeRepository, navigateTo]);

  const handleRepoClick = () => {
    if (isHomeRepository(currentRepoId!)) {
      // For home repo, just navigate to home view
      selectHomeRepository();
    } else {
      // For other repos, navigate to repos view
      navigateTo({
        title: 'Repos',
        icon: 'GitBranch',
        view: 'repos'
      });
    }
    setShowBranchDropdown(false);
  };

  const handleBranchClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the repo click
    setShowBranchDropdown(!showBranchDropdown);
  };

  const handleBranchChange = (branchName: string) => {
    switchBranch(branchName);
    setShowBranchDropdown(false);
  };

  const handleFileClick = () => {
    if (currentFileId) {
      // Toggle file selection if clicking the same file
      selectFile(null);
    } else if (currentFile) {
      navigateTo({
        title: 'Files',
        icon: 'Folder',
        view: 'files'
      });
    }
    setShowBranchDropdown(false);
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Status bar showing current selection context */}
        {(currentRepoId || currentBranch || currentFileId) && (
          <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 text-sm flex items-center">
            <div className="flex items-center">
              <div 
                onClick={handleRepoClick} 
                className="flex items-center text-blue-600 font-medium hover:text-blue-700 cursor-pointer"
              >
                {isHomeRepository(currentRepoId!) ? (
                  <Home size={16} className="text-gray-700 mr-2" />
                ) : (
                  <Code size={16} className="text-gray-700 mr-2" />
                )}
                <span className="hover:underline">
                  {isHomeRepository(currentRepoId!) ? 'Home' : currentRepo?.name}
                </span>
              </div>
              
              {currentBranch && (
                <>
                  <span className="mx-1 text-gray-400">/</span>
                  <div className="relative" ref={branchDropdownRef}>
                    <div 
                      onClick={handleBranchClick}
                      className="text-purple-600 font-medium flex items-center hover:text-purple-700 cursor-pointer"
                    >
                      <GitBranch size={14} className="mr-1" />
                      <span className="hover:underline">{currentBranch}</span>
                    </div>
                    
                    {showBranchDropdown && (
                      <div className="absolute z-10 mt-1 bg-white shadow-lg rounded-md border border-gray-200">
                        <ul className="py-1 max-h-60 overflow-auto">
                          {availableBranches.map(branch => (
                            <li 
                              key={branch.name}
                              className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 flex items-center ${
                                branch.name === currentBranch ? 'bg-blue-50 text-blue-700' : ''
                              }`}
                              onClick={() => handleBranchChange(branch.name)}
                            >
                              {branch.name}
                              {branch.isDefault && (
                                <span className="ml-2 px-1.5 py-0.5 text-xs bg-gray-100 text-gray-800 rounded">
                                  default
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {currentFile && (
                <>
                  <span className="mx-1 text-gray-400">/</span>
                  <div 
                    onClick={handleFileClick}
                    className="text-green-600 font-medium flex items-center hover:text-green-700 cursor-pointer"
                  >
                    <FileText size={14} className="mr-1" />
                    <span className="hover:underline">{currentFile.name}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        <ChatContainer />
      </main>
    </div>
  );
};

export default AppLayout;