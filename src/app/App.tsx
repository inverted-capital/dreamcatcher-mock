import AppLayout from './AppLayout'
import useHashRouter from './useHashRouter'
import useHomeScope from '@/shared/useHomeScope'

function App() {
  useHashRouter()
  useHomeScope()
  return <AppLayout />
}

export default App
