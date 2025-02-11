import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import NavBar from './components/NavBar.jsx'
import AddItem from './components/admin/AddItem.jsx'
import { isAddItemOpened } from './signals.jsx'
import { useSignals } from '@preact/signals-react/runtime'

const Root = () => {
  useSignals();
  
  return (
    <StrictMode>
      <BrowserRouter>
        <div className='w-full h-screen flex flex-col relative bg-slate-200 selection:bg-accent selection:text-light'>
          {isAddItemOpened.value && <AddItem />}
          <NavBar type="admin"/>
          <App />
        </div>
      </BrowserRouter>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<Root />);
