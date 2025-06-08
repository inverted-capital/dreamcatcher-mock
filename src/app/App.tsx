import AppLayout from './layout/AppLayout'
import useHashRouter from './useHashRouter'

function App() {
  useHashRouter()
  return <AppLayout />
}

export default App
