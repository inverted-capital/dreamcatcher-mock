import React from 'react';
import { Search, X } from 'lucide-react';

interface RepositorySearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const RepositorySearch: React.FC<RepositorySearchProps> = ({ searchQuery, setSearchQuery }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="relative mb-4">
      <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search repositories..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="pl-9 pr-9 py-2 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {searchQuery && (
        <button 
          onClick={clearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default RepositorySearch;