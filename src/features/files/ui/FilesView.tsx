import React, { useState, useEffect, useRef } from 'react';
import { File, Upload, Code, GitBranch, FolderOpen, ArrowRight, ChevronDown, FileText, Edit, Download, Home } from 'lucide-react';
import { useFilesStore } from '../state';
import { useRepoStore } from '@/features/repos/state';
import { useNavigationStore } from '@/features/navigation/state';
import { useChatStore } from '@/features/chat/state';

const FilesView: React.FC = () => {
  const { 
    selectFile,
    currentFileId,
    getCurrentFile,
    getRepositoryFiles
  } = useFilesStore();
  
  const {
    repositories, 
    currentRepoId, 
    currentBranch,
    availableBranches,
    switchBranch,
    getRepositoryById,
    isHomeRepository,
    selectHomeRepository,
    selectRepository
  } = useRepoStore();
  
  const setCurrentView = useNavigationStore(state => state.setCurrentView);
  const navigateTo = useChatStore(state => state.navigateTo);
  
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [showFileDetails, setShowFileDetails] = useState(false);
  const branchDropdownRef = useRef<HTMLDivElement>(null);
  
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
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  const files = getRepositoryFiles();
  const currentRepo = repositories.find(repo => repo.id === currentRepoId);
  const selectedFile = files.find(file => file.id === currentFileId);
  
  const handleBranchChange = (branchName: string) => {
    switchBranch(branchName);
    setShowBranchDropdown(false);
  };
  
  const handleFileClick = (fileId: string) => {
    // Toggle file selection if clicking the same file
    if (currentFileId === fileId) {
      selectFile(null);
      setShowFileDetails(false);
    } else {
      selectFile(fileId);
      setShowFileDetails(true);
    }
    setShowBranchDropdown(false);
  };

  const handleRepoClick = () => {
    if (isHomeRepository(currentRepoId)) {
      // For home repo, directly select it
      selectHomeRepository();
    } else {
      // For other repos, navigate to repos view
      setCurrentView('repos');
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
  
  return (
    <div className="animate-fadeIn h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <File className="mr-2" size={24} />
          Files
        </h1>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center transition-colors">
          <Upload size={16} className="mr-2" />
          Upload
        </button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branch
            </label>
            <div className="relative" ref={branchDropdownRef}>
              <button
                type="button"
                className="flex items-center justify-between w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                onClick={() => setShowBranchDropdown(!showBranchDropdown)}
              >
                <div className="flex items-center">
                  <GitBranch size={16} className="text-gray-500 mr-2" />
                  <span>{currentBranch}</span>
                </div>
                <ChevronDown size={16} className="text-gray-500" />
              </button>
              
              {showBranchDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200">
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
          </div>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* File list */}
        <div className={`${showFileDetails && selectedFile ? 'w-1/2' : 'w-full'} overflow-auto`}>
          {!currentRepoId ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="text-gray-400 mb-2">
                <Code size={40} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No Repository Selected</h3>
              <p className="text-gray-500 mb-4">
                Please select a repository to view its files
              </p>
            </div>
          ) : files.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="text-gray-400 mb-2">
                <File size={40} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No Files Found</h3>
              <p className="text-gray-500 mb-4">
                This repository doesn't have any files in the {currentBranch} branch
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden h-full">
              <div className="grid grid-cols-12 gap-4 p-4 font-medium text-gray-500 text-sm border-b border-gray-200">
                <div className="col-span-5">Name</div>
                <div className="col-span-3">Modified</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Size</div>
              </div>
              
              <div className="overflow-auto">
                {files.map((file) => (
                  <div 
                    key={file.id}
                    className={`grid grid-cols-12 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                      file.id === currentFileId ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => handleFileClick(file.id)}
                  >
                    <div className="col-span-5 flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center mr-3">
                        <File size={16} className="text-gray-500" />
                      </div>
                      <span className="truncate">{file.name}</span>
                    </div>
                    <div className="col-span-3 text-gray-500 flex items-center text-sm">
                      {file.modified}
                    </div>
                    <div className="col-span-2 text-gray-500 flex items-center text-sm uppercase">
                      {file.type}
                    </div>
                    <div className="col-span-2 text-gray-500 flex items-center text-sm">
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* File details panel */}
        {showFileDetails && selectedFile && (
          <div className="w-1/2 pl-4 overflow-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                    <File size={20} className="text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{selectedFile.name}</h3>
                    <div className="text-sm text-gray-500">{selectedFile.path}</div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowFileDetails(false)} 
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ChevronDown size={20} />
                </button>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="font-medium mb-2">File Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Type</div>
                  <div className="uppercase">{selectedFile.type}</div>
                  
                  <div className="text-gray-500">Size</div>
                  <div>{formatFileSize(selectedFile.size)}</div>
                  
                  <div className="text-gray-500">Modified</div>
                  <div>{selectedFile.modified}</div>
                  
                  <div className="text-gray-500">Path</div>
                  <div>{selectedFile.path}</div>
                  
                  <div className="text-gray-500">Repository</div>
                  <div>{currentRepo?.name}</div>
                  
                  <div className="text-gray-500">Branch</div>
                  <div>{currentBranch}</div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="font-medium mb-2">Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md flex items-center text-sm hover:bg-blue-100">
                    <FileText size={14} className="mr-1" />
                    View Content
                  </button>
                  <button className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-md flex items-center text-sm hover:bg-purple-100">
                    <Edit size={14} className="mr-1" />
                    Edit
                  </button>
                  <button className="px-3 py-1.5 bg-green-50 text-green-600 rounded-md flex items-center text-sm hover:bg-green-100">
                    <Download size={14} className="mr-1" />
                    Download
                  </button>
                </div>
              </div>
              
              {/* Placeholder for file preview/content */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="font-medium mb-2">Preview</h4>
                <div className="bg-gray-50 p-4 rounded-md h-40 overflow-auto">
                  <div className="text-gray-400 text-center flex flex-col items-center justify-center h-full">
                    <FileText size={24} className="mb-2" />
                    <span>Preview not available</span>
                    <span className="text-xs mt-1">Click "View Content" to see the file</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilesView;