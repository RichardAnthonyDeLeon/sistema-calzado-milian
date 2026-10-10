import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'

import App from './App.jsx'

import {
  InventarioTerminadosProvider
} from './context/InventarioTerminadosContext.jsx'

import {
  CreditosProvider
} from './context/CreditosContext.jsx'

import {
  PedidosProvider
} from './context/PedidosContext.jsx'


createRoot(
  document.getElementById('root')
).render(

  <StrictMode>

    <PedidosProvider>

      <InventarioTerminadosProvider>

        <CreditosProvider>

          <App />

        </CreditosProvider>

      </InventarioTerminadosProvider>

    </PedidosProvider>

  </StrictMode>

)