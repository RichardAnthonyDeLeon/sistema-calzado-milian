import {
  createContext,
  useContext,
  useState
} from 'react'


const InventarioTerminadosContext =
  createContext(null)


const inventarioInicial = [

  // ========================================
  // PRODUCTOS PRODUCIDOS PARA PEDIDOS
  // ========================================

  {
    id: 'PT-001',
    modelo: 'Oxford Ejecutivo',
    talla: '38',
    color: 'Negro',
    existencia: 4,

    origen: 'OP-001',
    tipoOrigen: 'Producción',

    destino: 'Pedido',
    pedidoId: 'PED-1048',

    precioUnitario: 250
  },

  {
    id: 'PT-002',
    modelo: 'Oxford Ejecutivo',
    talla: '39',
    color: 'Negro',
    existencia: 2,

    origen: 'OP-001',
    tipoOrigen: 'Producción',

    destino: 'Pedido',
    pedidoId: 'PED-1048',

    precioUnitario: 250
  },

  {
    id: 'PT-003',
    modelo: 'Oxford Ejecutivo',
    talla: '40',
    color: 'Negro',
    existencia: 2,

    origen: 'OP-001',
    tipoOrigen: 'Producción',

    destino: 'Pedido',
    pedidoId: 'PED-1048',

    precioUnitario: 250
  },


  // PEDIDO TERMINADO

  {
    id: 'PT-004',
    modelo: 'Derby Ejecutivo',
    talla: '39',
    color: 'Café',
    existencia: 5,

    origen: 'OP-002',
    tipoOrigen: 'Producción',

    destino: 'Pedido',
    pedidoId: 'PED-1046',

    precioUnitario: 250
  },

  {
    id: 'PT-005',
    modelo: 'Derby Ejecutivo',
    talla: '40',
    color: 'Café',
    existencia: 5,

    origen: 'OP-002',
    tipoOrigen: 'Producción',

    destino: 'Pedido',
    pedidoId: 'PED-1046',

    precioUnitario: 250
  },

  {
    id: 'PT-006',
    modelo: 'Derby Ejecutivo',
    talla: '41',
    color: 'Café',
    existencia: 5,

    origen: 'OP-002',
    tipoOrigen: 'Producción',

    destino: 'Pedido',
    pedidoId: 'PED-1046',

    precioUnitario: 250
  },


  // ========================================
  // PRODUCTOS DISPONIBLES PARA VENTA DIRECTA
  // ========================================

  {
    id: 'STOCK-001',
    modelo: 'Oxford Clásico',
    talla: '40',
    color: 'Negro',
    existencia: 8,

    origen: 'Inventario',
    tipoOrigen: 'Stock',

    destino: 'Stock',
    pedidoId: null,

    precioUnitario: 250
  },

  {
    id: 'STOCK-002',
    modelo: 'Oxford Clásico',
    talla: '42',
    color: 'Negro',
    existencia: 5,

    origen: 'Inventario',
    tipoOrigen: 'Stock',

    destino: 'Stock',
    pedidoId: null,

    precioUnitario: 250
  },

  {
    id: 'STOCK-003',
    modelo: 'Derby Ejecutivo',
    talla: '41',
    color: 'Café',
    existencia: 6,

    origen: 'Inventario',
    tipoOrigen: 'Stock',

    destino: 'Stock',
    pedidoId: null,

    precioUnitario: 275
  },

  {
    id: 'STOCK-004',
    modelo: 'Botín Milian',
    talla: '38',
    color: 'Café',
    existencia: 4,

    origen: 'Inventario',
    tipoOrigen: 'Stock',

    destino: 'Stock',
    pedidoId: null,

    precioUnitario: 320
  }
]


export function InventarioTerminadosProvider({
  children
}) {

  const [
    inventarioTerminados,
    setInventarioTerminados
  ] = useState(inventarioInicial)


  return (

    <InventarioTerminadosContext.Provider
      value={{
        inventarioTerminados,
        setInventarioTerminados
      }}
    >

      {children}

    </InventarioTerminadosContext.Provider>

  )
}


export function useInventarioTerminados() {

  const contexto =
    useContext(
      InventarioTerminadosContext
    )


  if (!contexto) {

    throw new Error(
      'useInventarioTerminados debe utilizarse dentro de InventarioTerminadosProvider'
    )
  }


  return contexto
}