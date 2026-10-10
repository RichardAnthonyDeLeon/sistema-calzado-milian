import {
  createContext,
  useContext,
  useState
} from 'react'


const PedidosContext =
  createContext(null)


const pedidosIniciales = [

  {
    id: 'PED-1048',

    cliente:
      'Calzado El Centro',

    fechaEntrega:
      '2026-09-20',

    modelo:
      'Oxford Ejecutivo',

    color:
      'Negro',

    materialPrincipal:
      'Cuero negro',

    tipoSuela:
      'Formal',

    colorSuela:
      'Negro',

    tallas: [
      {
        id: 1,
        talla: '38',
        cantidad: 4
      },
      {
        id: 2,
        talla: '39',
        cantidad: 4
      },
      {
        id: 3,
        talla: '40',
        cantidad: 4
      },
      {
        id: 4,
        talla: '41',
        cantidad: 4
      },
      {
        id: 5,
        talla: '42',
        cantidad: 4
      }
    ],

    descripcion:
      'Zapato formal Oxford Ejecutivo en cuero negro.',

    precioUnitario:
      250,

    total:
      5000,

    anticipo:
      1250,

    saldo:
      3750,

    tipoPago:
      'Crédito',

    numeroPagos:
      4,

    estado:
      'En producción'
  },


  {
    id: 'PED-1047',

    cliente:
      'María López',

    fechaEntrega:
      '2026-09-15',

    modelo:
      'Botín Milian',

    color:
      'Café',

    materialPrincipal:
      'Cuero café',

    tipoSuela:
      'Botín',

    colorSuela:
      'Café',

    tallas: [
      {
        id: 1,
        talla: '37',
        cantidad: 4
      },
      {
        id: 2,
        talla: '38',
        cantidad: 5
      },
      {
        id: 3,
        talla: '39',
        cantidad: 3
      }
    ],

    descripcion:
      'Botín artesanal color café.',

    precioUnitario:
      240,

    total:
      2880,

    anticipo:
      1000,

    saldo:
      1880,

    tipoPago:
      'Crédito',

    numeroPagos:
      3,

    estado:
      'Pendiente'
  },


  {
    id: 'PED-1046',

    cliente:
      'Distribuidora Norte',

    fechaEntrega:
      '2026-09-10',

    modelo:
      'Derby Ejecutivo',

    color:
      'Café',

    materialPrincipal:
      'Cuero café',

    tipoSuela:
      'Formal',

    colorSuela:
      'Negro',

    tallas: [
      {
        id: 1,
        talla: '39',
        cantidad: 5
      },
      {
        id: 2,
        talla: '40',
        cantidad: 5
      },
      {
        id: 3,
        talla: '41',
        cantidad: 5
      }
    ],

    descripcion:
      'Modelo Derby Ejecutivo para pedido mayorista.',

    precioUnitario:
      250,

    total:
      3750,

    anticipo:
      3750,

    saldo:
      0,

    tipoPago:
      'Contado',

    numeroPagos:
      1,

    estado:
      'Listo'
  }

]


export function PedidosProvider({
  children
}) {

  const [
    pedidos,
    setPedidos
  ] = useState(
    pedidosIniciales
  )


  function actualizarEstadoPedido(
    pedidoId,
    nuevoEstado
  ) {

    setPedidos(
      pedidosActuales =>
        pedidosActuales.map(
          pedido => {

            if (
              pedido.id !==
              pedidoId
            ) {
              return pedido
            }


            return {
              ...pedido,
              estado:
                nuevoEstado
            }
          }
        )
    )
  }


  return (

    <PedidosContext.Provider
      value={{
        pedidos,
        setPedidos,
        actualizarEstadoPedido
      }}
    >

      {children}

    </PedidosContext.Provider>

  )
}


export function usePedidos() {

  const contexto =
    useContext(
      PedidosContext
    )


  if (!contexto) {

    throw new Error(
      'usePedidos debe utilizarse dentro de PedidosProvider'
    )
  }


  return contexto
}