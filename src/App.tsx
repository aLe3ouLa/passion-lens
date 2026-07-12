import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { CreateMemoryPage } from './pages/CreateMemory';
import { MemoryPage } from './pages/Memory';
import { Header } from './components/landing/Header';
import { Footer } from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      {/* Navigation */}
      <Header />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create-memory" element={<CreateMemoryPage />} />
        <Route path="/memory/generated" element={<MemoryPage />} />
        <Route path="/story" element={<Navigate to="/memory/generated" replace />} />
        <Route path="/story/generated" element={<Navigate to="/memory/generated" replace />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
