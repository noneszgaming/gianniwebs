import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import NavBar from './components/NavBar.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <div
        className='w-full h-screen flex flex-col relative bg-slate-200 selection:bg-accent selection:text-light'
        style={{ zIndex: 1 }}
      >
        <NavBar type="admin"/>
        <App />
      </div>
    </BrowserRouter>
  </StrictMode>
)
