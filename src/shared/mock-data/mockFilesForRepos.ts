import { FileItem } from '@/shared/types';

// Files organized by repository ID
export const mockFilesForRepos: Record<string, FileItem[]> = {
  'home-repo': [
    {
      id: 'home-file-1',
      name: 'settings.json',
      type: 'json',
      size: 1240,
      modified: '2023-06-18',
      path: '/',
    },
    {
      id: 'home-file-2',
      name: 'profile.md',
      type: 'md',
      size: 850,
      modified: '2023-06-17',
      path: '/',
    },
    {
      id: 'home-file-3',
      name: 'connected-machines.json',
      type: 'json',
      size: 1650,
      modified: '2023-06-16',
      path: '/configs/',
    },
    {
      id: 'home-file-4',
      name: 'README.md',
      type: 'md',
      size: 2200,
      modified: '2023-06-15',
      path: '/',
    }
  ],
  'repo-1': [
    {
      id: 'file-1-1',
      name: 'index.html',
      type: 'html',
      size: 4500,
      modified: '2023-06-15',
      path: '/',
    },
    {
      id: 'file-1-2',
      name: 'styles.css',
      type: 'css',
      size: 2800,
      modified: '2023-06-14',
      path: '/css/',
    },
    {
      id: 'file-1-3',
      name: 'app.js',
      type: 'js',
      size: 8700,
      modified: '2023-06-15',
      path: '/js/',
    },
    {
      id: 'file-1-4',
      name: 'README.md',
      type: 'md',
      size: 1200,
      modified: '2023-06-10',
      path: '/',
    }
  ],
  'repo-2': [
    {
      id: 'file-2-1',
      name: 'server.py',
      type: 'py',
      size: 6200,
      modified: '2023-06-12',
      path: '/',
    },
    {
      id: 'file-2-2',
      name: 'requirements.txt',
      type: 'txt',
      size: 340,
      modified: '2023-06-05',
      path: '/',
    },
    {
      id: 'file-2-3',
      name: 'database.py',
      type: 'py',
      size: 4100,
      modified: '2023-06-10',
      path: '/models/',
    }
  ],
  'repo-3': [
    {
      id: 'file-3-1',
      name: 'index.md',
      type: 'md',
      size: 5600,
      modified: '2023-05-28',
      path: '/',
    },
    {
      id: 'file-3-2',
      name: 'architecture.md',
      type: 'md',
      size: 12800,
      modified: '2023-05-22',
      path: '/technical/',
    },
    {
      id: 'file-3-3',
      name: 'user-guide.md',
      type: 'md',
      size: 8900,
      modified: '2023-05-20',
      path: '/guides/',
    }
  ],
  'repo-4': [
    {
      id: 'file-4-1',
      name: 'Button.tsx',
      type: 'tsx',
      size: 2300,
      modified: '2023-06-09',
      path: '/components/',
    },
    {
      id: 'file-4-2',
      name: 'Input.tsx',
      type: 'tsx',
      size: 3100,
      modified: '2023-06-08',
      path: '/components/',
    },
    {
      id: 'file-4-3',
      name: 'Card.tsx',
      type: 'tsx',
      size: 1800,
      modified: '2023-06-10',
      path: '/components/',
    },
    {
      id: 'file-4-4',
      name: 'index.ts',
      type: 'ts',
      size: 750,
      modified: '2023-06-09',
      path: '/',
    },
    {
      id: 'file-4-5',
      name: 'theme.ts',
      type: 'ts',
      size: 4200,
      modified: '2023-06-07',
      path: '/styles/',
    }
  ],
  'repo-5': [
    {
      id: 'file-5-1',
      name: 'AppDelegate.swift',
      type: 'swift',
      size: 5400,
      modified: '2023-06-06',
      path: '/',
    },
    {
      id: 'file-5-2',
      name: 'ViewController.swift',
      type: 'swift',
      size: 7800,
      modified: '2023-06-08',
      path: '/Controllers/',
    },
    {
      id: 'file-5-3',
      name: 'User.swift',
      type: 'swift',
      size: 2100,
      modified: '2023-06-04',
      path: '/Models/',
    },
    {
      id: 'file-5-4',
      name: 'Main.storyboard',
      type: 'storyboard',
      size: 15600,
      modified: '2023-06-07',
      path: '/Views/',
    }
  ]
};