import './i18n.js';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import NavBar from './components/NavBar.jsx'
import AddUpdateItem from './components/admin/AddUpdateItem.jsx'
import { isAddBoxOpened, isAddItemOpened, isSidePanelOpened, isSuccessfulPaymentOpened, isUpdateBoxOpened, isUpdateItemOpened } from './signals.jsx'
import { useSignals } from '@preact/signals-react/runtime'
import SuccessfulPopup from './components/SuccessfulPopup.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import SidePanel from './components/SidePanel.jsx';

const Root = () => {

  useSignals();

  return (
    <StrictMode>
      <BrowserRouter>
        <LanguageProvider>
          <div className='w-full h-screen flex flex-col relative bg-slate-200 selection:bg-accent selection:text-light'>
            {isAddBoxOpened.value && <AddUpdateItem />}
            {isAddItemOpened.value && <AddUpdateItem />}
            {isUpdateBoxOpened.value && <AddUpdateItem />}
            {isUpdateItemOpened.value && <AddUpdateItem />}
            {isSidePanelOpened.value && <SidePanel />}
            {isSuccessfulPaymentOpened.value && 
              <SuccessfulPopup 
                titleKey="payment" 
                textKey="sucPaymentDesc"
                onClick={() => isSuccessfulPaymentOpened.value = false}
              />
            }
            <NavBar type="admin"/>
            <App />
          </div>
        </LanguageProvider>
      </BrowserRouter>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<Root />);
