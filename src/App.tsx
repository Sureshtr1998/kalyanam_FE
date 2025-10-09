import './App.scss'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import BgAnimation from './components/background/BgAnimation'
import Login from './screens/login/Login'
import Register from './screens/register/Register'

const AppContent = () => {
  const location = useLocation()

  const isAnimation = location.pathname === '/'

  return (
    <>
      <BgAnimation isAnimation={isAnimation} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </div>
    </>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
