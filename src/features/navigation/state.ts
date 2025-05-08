import { create } from 'zustand';
import { View } from '@/shared/types';

interface NavigationState {
  currentView: View;
}

interface NavigationActions {
  setCurrentView: (view: View) => void;
}

export const useNavigationStore = create<NavigationState & NavigationActions>()((set) => ({
  // State
  currentView: 'chats', // Default view
  
  // Actions
  setCurrentView: (view) => {
    set({ currentView: view });
  }
}));