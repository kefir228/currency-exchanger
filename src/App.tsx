import './App.css'
import { Header } from './components/Header/Header'
import { MainPart } from './components/Main/MainPart'
import { ErrorBoundaryProvider } from './Providers/errorBoundary'

function App() {
  return (
    <ErrorBoundaryProvider>
      <div>
        <Header />
        <MainPart />
      </div>
    </ErrorBoundaryProvider>
  )
}

export default App
