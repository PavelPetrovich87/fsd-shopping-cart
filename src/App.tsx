import { Routes, Route } from 'react-router-dom'
import { App as AppPage } from './pages/App'

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppPage />} />
    </Routes>
  )
}

export { App }
