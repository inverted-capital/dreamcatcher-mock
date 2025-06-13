import AppLayout from './AppLayout'
import useHashRouter from './useHashRouter'
import useInitTargetScope from '@/shared/useInitTargetScope'

function App() {
  useHashRouter()
  useInitTargetScope()
  return <AppLayout />
}

export default App
