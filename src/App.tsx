import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { CreateMemoryPage } from './pages/CreateMemory';
import { Story } from './pages/Story';
import { Header } from './components/landing/Header';
import { Footer } from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      {/* Navigation */}
      <Header />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create-memory" element={<CreateMemoryPage />} />
        <Route path="/story" element={<Story />} />
        <Route path="/story/generated" element={<Story />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
