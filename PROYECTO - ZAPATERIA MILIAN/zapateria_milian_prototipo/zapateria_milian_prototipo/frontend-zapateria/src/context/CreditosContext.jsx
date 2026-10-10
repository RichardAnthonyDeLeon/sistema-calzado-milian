import {
  createContext,
  useContext,
  useState
} from 'react'


const CreditosContext =
  createContext(null)


const creditosIniciales = [
  {
    id: 'CRE-001',

    cliente:
      'Calzado El Centro',

    pedidoId:
      'PED-1048',

    ventaId:
      'VEN-004',

    fecha:
      '2026-09-01',

    total:
      5000,

    saldo:
      3750,

    numeroPagos:
      4,

    estado:
      'Activo'
  },

  {
    id: 'CRE-002',

    cliente:
      'María López',

    pedidoId:
      'PED-1047',

    ventaId:
      'VEN-002',

    fecha:
      '2026-09-02',

    total:
      2880,

    saldo:
      1880,

    numeroPagos:
      3,

    estado:
      'Activo'
  },

  {
    id: 'CRE-003',

    cliente:
      'Distribuidora Norte',

    pedidoId:
      'PED-1046',

    ventaId:
      'VEN-003',

    fecha:
      '2026-09-03',

    total:
      3750,

    saldo:
      0,

    numeroPagos:
      1,

    estado:
      'Pagado'
  }
]


const abonosIniciales = [
  {
    id:
      'ABO-001',

    creditoId:
      'CRE-001',

    cliente:
      'Calzado El Centro',

    fecha:
      '2026-09-01',

    monto:
      1250,

    observacion:
      'Anticipo inicial'
  },

  {
    id:
      'ABO-002',

    creditoId:
      'CRE-002',

    cliente:
      'María López',

    fecha:
      '2026-09-02',

    monto:
      1000,

    observacion:
      'Primer pago'
  }
]


export function CreditosProvider({
  children
}) {

  const [
    creditos,
    setCreditos
  ] = useState(
    creditosIniciales
  )


  const [
    abonos,
    setAbonos
  ] = useState(
    abonosIniciales
  )


  return (

    <CreditosContext.Provider
      value={{
        creditos,
        setCreditos,

        abonos,
        setAbonos
      }}
    >

      {children}

    </CreditosContext.Provider>

  )
}


export function useCreditos() {

  const contexto =
    useContext(
      CreditosContext
    )


  if (!contexto) {

    throw new Error(
      'useCreditos debe utilizarse dentro de CreditosProvider'
    )
  }


  return contexto
}