import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import LoopBotPage from './pages/LoopBotPage'
import LoopStreamPage from './pages/LoopStreamPage'
import AdminPage from './pages/AdminPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black">
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/*" element={
            <>
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/loopbot" element={<LoopBotPage />} />
                  <Route path="/loopstream" element={<LoopStreamPage />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
