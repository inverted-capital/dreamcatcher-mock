import { FileItem } from '@/shared/types'

// Files organized by repository ID
export const mockFilesForRepos: Record<string, FileItem[]> = {
  'home-repo': [
    {
      id: 'home-file-1',
      name: 'settings.json',
      type: 'json',
      size: 1240,
      modified: '2023-06-18',
      path: '/'
    },
    {
      id: 'home-file-2',
      name: 'profile.md',
      type: 'md',
      size: 850,
      modified: '2023-06-17',
      path: '/'
    },
    {
      id: 'home-folder-1',
      name: 'configs',
      type: 'folder',
      size: 0,
      modified: '2023-06-16',
      path: '/',
      isFolder: true
    },
    {
      id: 'home-file-3',
      name: 'connected-machines.json',
      type: 'json',
      size: 1650,
      modified: '2023-06-16',
      path: '/configs/',
      parentId: 'home-folder-1'
    },
    {
      id: 'home-folder-2',
      name: 'secrets',
      type: 'folder',
      size: 0,
      modified: '2023-06-16',
      path: '/configs/',
      isFolder: true,
      parentId: 'home-folder-1'
    },
    {
      id: 'home-file-5',
      name: 'api-keys.json',
      type: 'json',
      size: 520,
      modified: '2023-06-15',
      path: '/configs/secrets/',
      parentId: 'home-folder-2'
    },
    {
      id: 'home-file-4',
      name: 'README.md',
      type: 'md',
      size: 2200,
      modified: '2023-06-15',
      path: '/'
    }
  ],
  'repo-1': [
    {
      id: 'file-1-1',
      name: 'index.html',
      type: 'html',
      size: 4500,
      modified: '2023-06-15',
      path: '/'
    },
    {
      id: 'folder-1-1',
      name: 'css',
      type: 'folder',
      size: 0,
      modified: '2023-06-14',
      path: '/',
      isFolder: true
    },
    {
      id: 'file-1-2',
      name: 'styles.css',
      type: 'css',
      size: 2800,
      modified: '2023-06-14',
      path: '/css/',
      parentId: 'folder-1-1'
    },
    {
      id: 'file-1-3',
      name: 'components.css',
      type: 'css',
      size: 3500,
      modified: '2023-06-13',
      path: '/css/',
      parentId: 'folder-1-1'
    },
    {
      id: 'folder-1-2',
      name: 'js',
      type: 'folder',
      size: 0,
      modified: '2023-06-15',
      path: '/',
      isFolder: true
    },
    {
      id: 'file-1-4',
      name: 'app.js',
      type: 'js',
      size: 8700,
      modified: '2023-06-15',
      path: '/js/',
      parentId: 'folder-1-2'
    },
    {
      id: 'folder-1-3',
      name: 'modules',
      type: 'folder',
      size: 0,
      modified: '2023-06-14',
      path: '/js/',
      isFolder: true,
      parentId: 'folder-1-2'
    },
    {
      id: 'file-1-5',
      name: 'auth.js',
      type: 'js',
      size: 2700,
      modified: '2023-06-14',
      path: '/js/modules/',
      parentId: 'folder-1-3'
    },
    {
      id: 'file-1-6',
      name: 'data.js',
      type: 'js',
      size: 3200,
      modified: '2023-06-14',
      path: '/js/modules/',
      parentId: 'folder-1-3'
    },
    {
      id: 'file-1-7',
      name: 'README.md',
      type: 'md',
      size: 1200,
      modified: '2023-06-10',
      path: '/'
    }
  ],
  'repo-2': [
    {
      id: 'file-2-1',
      name: 'server.py',
      type: 'py',
      size: 6200,
      modified: '2023-06-12',
      path: '/'
    },
    {
      id: 'file-2-2',
      name: 'requirements.txt',
      type: 'txt',
      size: 340,
      modified: '2023-06-05',
      path: '/'
    },
    {
      id: 'folder-2-1',
      name: 'models',
      type: 'folder',
      size: 0,
      modified: '2023-06-10',
      path: '/',
      isFolder: true
    },
    {
      id: 'file-2-3',
      name: 'database.py',
      type: 'py',
      size: 4100,
      modified: '2023-06-10',
      path: '/models/',
      parentId: 'folder-2-1'
    },
    {
      id: 'file-2-4',
      name: 'user.py',
      type: 'py',
      size: 2500,
      modified: '2023-06-09',
      path: '/models/',
      parentId: 'folder-2-1'
    },
    {
      id: 'folder-2-2',
      name: 'tests',
      type: 'folder',
      size: 0,
      modified: '2023-06-08',
      path: '/',
      isFolder: true
    },
    {
      id: 'file-2-5',
      name: 'test_server.py',
      type: 'py',
      size: 1800,
      modified: '2023-06-08',
      path: '/tests/',
      parentId: 'folder-2-2'
    },
    {
      id: 'file-2-6',
      name: 'test_database.py',
      type: 'py',
      size: 1600,
      modified: '2023-06-07',
      path: '/tests/',
      parentId: 'folder-2-2'
    }
  ],
  'repo-3': [
    {
      id: 'file-3-1',
      name: 'index.md',
      type: 'md',
      size: 5600,
      modified: '2023-05-28',
      path: '/'
    },
    {
      id: 'folder-3-1',
      name: 'technical',
      type: 'folder',
      size: 0,
      modified: '2023-05-22',
      path: '/',
      isFolder: true
    },
    {
      id: 'file-3-2',
      name: 'architecture.md',
      type: 'md',
      size: 12800,
      modified: '2023-05-22',
      path: '/technical/',
      parentId: 'folder-3-1'
    },
    {
      id: 'file-3-3',
      name: 'database-schema.md',
      type: 'md',
      size: 8400,
      modified: '2023-05-21',
      path: '/technical/',
      parentId: 'folder-3-1'
    },
    {
      id: 'folder-3-2',
      name: 'guides',
      type: 'folder',
      size: 0,
      modified: '2023-05-20',
      path: '/',
      isFolder: true
    },
    {
      id: 'file-3-4',
      name: 'user-guide.md',
      type: 'md',
      size: 8900,
      modified: '2023-05-20',
      path: '/guides/',
      parentId: 'folder-3-2'
    },
    {
      id: 'file-3-5',
      name: 'admin-guide.md',
      type: 'md',
      size: 7500,
      modified: '2023-05-19',
      path: '/guides/',
      parentId: 'folder-3-2'
    },
    {
      id: 'folder-3-3',
      name: 'images',
      type: 'folder',
      size: 0,
      modified: '2023-05-18',
      path: '/',
      isFolder: true
    },
    {
      id: 'folder-3-4',
      name: 'diagrams',
      type: 'folder',
      size: 0,
      modified: '2023-05-17',
      path: '/images/',
      isFolder: true,
      parentId: 'folder-3-3'
    },
    {
      id: 'file-3-6',
      name: 'system-overview.png',
      type: 'png',
      size: 950000,
      modified: '2023-05-17',
      path: '/images/diagrams/',
      parentId: 'folder-3-4'
    }
  ],
  'repo-4': [
    {
      id: 'folder-4-1',
      name: 'components',
      type: 'folder',
      size: 0,
      modified: '2023-06-10',
      path: '/',
      isFolder: true
    },
    {
      id: 'file-4-1',
      name: 'Button.tsx',
      type: 'tsx',
      size: 2300,
      modified: '2023-06-09',
      path: '/components/',
      parentId: 'folder-4-1'
    },
    {
      id: 'file-4-2',
      name: 'Input.tsx',
      type: 'tsx',
      size: 3100,
      modified: '2023-06-08',
      path: '/components/',
      parentId: 'folder-4-1'
    },
    {
      id: 'file-4-3',
      name: 'Card.tsx',
      type: 'tsx',
      size: 1800,
      modified: '2023-06-10',
      path: '/components/',
      parentId: 'folder-4-1'
    },
    {
      id: 'folder-4-2',
      name: 'core',
      type: 'folder',
      size: 0,
      modified: '2023-06-08',
      path: '/components/',
      isFolder: true,
      parentId: 'folder-4-1'
    },
    {
      id: 'file-4-4',
      name: 'Layout.tsx',
      type: 'tsx',
      size: 3200,
      modified: '2023-06-08',
      path: '/components/core/',
      parentId: 'folder-4-2'
    },
    {
      id: 'file-4-5',
      name: 'Container.tsx',
      type: 'tsx',
      size: 1500,
      modified: '2023-06-07',
      path: '/components/core/',
      parentId: 'folder-4-2'
    },
    {
      id: 'folder-4-3',
      name: 'styles',
      type: 'folder',
      size: 0,
      modified: '2023-06-07',
      path: '/',
      isFolder: true
    },
    {
      id: 'file-4-6',
      name: 'theme.ts',
      type: 'ts',
      size: 4200,
      modified: '2023-06-07',
      path: '/styles/',
      parentId: 'folder-4-3'
    },
    {
      id: 'file-4-7',
      name: 'colors.ts',
      type: 'ts',
      size: 2800,
      modified: '2023-06-06',
      path: '/styles/',
      parentId: 'folder-4-3'
    },
    {
      id: 'file-4-8',
      name: 'index.ts',
      type: 'ts',
      size: 750,
      modified: '2023-06-09',
      path: '/'
    }
  ],
  'repo-5': [
    {
      id: 'file-5-1',
      name: 'AppDelegate.swift',
      type: 'swift',
      size: 5400,
      modified: '2023-06-06',
      path: '/'
    },
    {
      id: 'folder-5-1',
      name: 'Controllers',
      type: 'folder',
      size: 0,
      modified: '2023-06-08',
      path: '/',
      isFolder: true
    },
    {
      id: 'file-5-2',
      name: 'ViewController.swift',
      type: 'swift',
      size: 7800,
      modified: '2023-06-08',
      path: '/Controllers/',
      parentId: 'folder-5-1'
    },
    {
      id: 'file-5-3',
      name: 'ProfileController.swift',
      type: 'swift',
      size: 6200,
      modified: '2023-06-07',
      path: '/Controllers/',
      parentId: 'folder-5-1'
    },
    {
      id: 'folder-5-2',
      name: 'Models',
      type: 'folder',
      size: 0,
      modified: '2023-06-05',
      path: '/',
      isFolder: true
    },
    {
      id: 'file-5-4',
      name: 'User.swift',
      type: 'swift',
      size: 2100,
      modified: '2023-06-04',
      path: '/Models/',
      parentId: 'folder-5-2'
    },
    {
      id: 'file-5-5',
      name: 'Post.swift',
      type: 'swift',
      size: 1800,
      modified: '2023-06-03',
      path: '/Models/',
      parentId: 'folder-5-2'
    },
    {
      id: 'folder-5-3',
      name: 'Views',
      type: 'folder',
      size: 0,
      modified: '2023-06-07',
      path: '/',
      isFolder: true
    },
    {
      id: 'file-5-6',
      name: 'Main.storyboard',
      type: 'storyboard',
      size: 15600,
      modified: '2023-06-07',
      path: '/Views/',
      parentId: 'folder-5-3'
    },
    {
      id: 'folder-5-4',
      name: 'Custom',
      type: 'folder',
      size: 0,
      modified: '2023-06-06',
      path: '/Views/',
      isFolder: true,
      parentId: 'folder-5-3'
    },
    {
      id: 'file-5-7',
      name: 'ProfileView.swift',
      type: 'swift',
      size: 4200,
      modified: '2023-06-06',
      path: '/Views/Custom/',
      parentId: 'folder-5-4'
    },
    {
      id: 'file-5-8',
      name: 'FeedCell.swift',
      type: 'swift',
      size: 3800,
      modified: '2023-06-05',
      path: '/Views/Custom/',
      parentId: 'folder-5-4'
    }
  ]
}
