import { Routes, Route } from 'react-router-dom'
import { App as AppPage } from './pages/App'
import { VisualHarness } from './widgets/VisualHarness'

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppPage />} />
      <Route path="/harness" element={<VisualHarness />} />
    </Routes>
  )
}

export { App }
