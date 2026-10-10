import { useState } from 'react'

import './App.css'

import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'

import Dashboard from './pages/Dashboard'
import Clientes from './pages/Clientes'
import Proveedores from './pages/Proveedores'
import Materiales from './pages/Materiales'
import Productos from './pages/Productos'
import Pedidos from './pages/Pedidos'
import Produccion from './pages/Produccion'
import Ventas from './pages/Ventas'
import Creditos from './pages/Creditos'
import Reportes from './pages/Reportes'


function App() {

  const [vistaActiva, setVistaActiva] = useState('dashboard')


  const titulos = {
    dashboard: 'Dashboard',
    clientes: 'Clientes',
    proveedores: 'Proveedores',
    materiales: 'Inventario de materiales',
    productos: 'Productos y variantes',
    pedidos: 'Pedidos de clientes',
    produccion: 'Órdenes de producción',
    ventas: 'Ventas',
    creditos: 'Créditos y abonos',
    reportes: 'Reportes'
  }


  function renderizarVista() {

    switch (vistaActiva) {

      case 'clientes':
        return <Clientes />

      case 'proveedores':
        return <Proveedores />

      case 'materiales':
        return <Materiales />

      case 'productos':
        return <Productos />

      case 'pedidos':
        return <Pedidos />

      case 'produccion':
        return <Produccion />

      case 'ventas':
        return <Ventas />

      case 'creditos':
        return <Creditos />

      case 'reportes':
        return <Reportes />

      default:
        return (
          <Dashboard
            cambiarVista={setVistaActiva}
          />
        )
    }

  }


  function nuevaAccion() {

    if (vistaActiva === 'clientes') {

      window.dispatchEvent(
        new CustomEvent('nuevoCliente')
      )

    }

  }


  return (
    <div className="app-shell">

      <Sidebar
        vistaActiva={vistaActiva}
        cambiarVista={setVistaActiva}
      />


      <main className="main">

        <Topbar
          titulo={titulos[vistaActiva]}
          nuevaAccion={nuevaAccion}
        />


        {renderizarVista()}

      </main>

    </div>
  )
}


export default App