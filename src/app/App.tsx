import AppLayout from './AppLayout'
import useHashRouter from './useHashRouter'

function App() {
  useHashRouter()
  return <AppLayout />
}

export default App
