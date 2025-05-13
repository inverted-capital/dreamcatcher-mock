import React, { useState } from 'react'
import { ChevronDown, ChevronRight, FolderGit2, Home, Link } from 'lucide-react'
import {
  useTree,
  ArtifactScope,
  RepoScope,
  useScope,
  isRepoScope
} from '@artifact/client'

const RepositoryTreeRoot: React.FC = () => {
  const scope = useScope()
  if (!scope) return <div>Loading repositories...</div>
  return <RepositoryNode scope={scope} home />
}

const RepositoryNode: React.FC<{ scope: RepoScope; home?: boolean }> = ({
  scope,
  home
}) => {
  const [isOpen, setIsOpen] = useState(true)
  const children = useTree() // children of *this* scope

  const toggle = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (children && children.length > 0) {
      setIsOpen((prev) => !prev)
    }
  }

  return (
    <div className="py-1">
      <div
        className="flex items-center py-1.5 px-2 rounded-md hover:bg-gray-100 cursor-pointer"
        onClick={toggle}
      >
        <div className="w-5 flex-shrink-0">
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
        <div className="flex items-center flex-1 min-w-0">
          <div className="mr-2 text-gray-500">
            {home ? <Home size={16} /> : <FolderGit2 size={16} />}
          </div>
          <div className="truncate font-medium text-sm">{scope.repo.name}</div>
          {scope.repo && <Link size={14} className="ml-2 text-purple-500" />}
        </div>
      </div>

      {isOpen && children && children.length > 0 && (
        <div className="pl-4 border-l border-gray-200 ml-2">
          {children.map((child) => (
            <ArtifactScope key={child.repo.publicKey} {...child}>
              <RepositoryNode scope={child} />
            </ArtifactScope>
          ))}
        </div>
      )}
    </div>
  )
}

export default RepositoryTreeRoot
