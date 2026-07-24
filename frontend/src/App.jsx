import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ComparePage from './pages/ComparePage'
import DetailPage from './pages/DetailPage'
import HomePage from './pages/HomePage'
import RecommendPage from './pages/RecommendPage'
import SearchPage from './pages/SearchPage'

export default function App() {
  return (
    <BrowserRouter>
      <a href="#main-content" className="skip-link">
        본문으로 건너뛰기
      </a>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recommend" element={<RecommendPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/products/:id" element={<DetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
