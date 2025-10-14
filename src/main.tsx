import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import "primereact/resources/themes/saga-orange/theme.css";
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrimeReactProvider >
      <App />
    </PrimeReactProvider>
  </StrictMode>,
)
