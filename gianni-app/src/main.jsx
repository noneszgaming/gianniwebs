/* eslint-disable no-unused-vars */
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
import BgLogo from './components/BgLogo.jsx';
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer.jsx';

  const Root = () => {

    useSignals();

    return (
      <StrictMode>
        <BrowserRouter>
          <LanguageProvider>
            <Toaster position="top-right" />
            <div className='w-full min-h-screen flex flex-col bg-slate-200 selection:bg-accent selection:text-light'>
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
              <div className="flex-grow pt-16">
                <BgLogo />
                <App />
              </div>
              <Footer />
            </div>
          </LanguageProvider>
        </BrowserRouter>
      </StrictMode>
    );
  }
createRoot(document.getElementById('root')).render(<Root />);
