import { useState } from 'react'

import ResumenCreditos
  from '../components/creditos/ResumenCreditos'

import TablaCreditos
  from '../components/creditos/TablaCreditos'

import ProgresoCredito
  from '../components/creditos/ProgresoCredito'

import RegistrarAbonoModal
  from '../components/creditos/RegistrarAbonoModal'

import {
  useCreditos
} from '../context/CreditosContext'


function Creditos() {

  const {
    creditos,
    setCreditos,

    abonos,
    setAbonos
  } = useCreditos()


  // =========================
  // ESTADOS
  // =========================

  const [
    busqueda,
    setBusqueda
  ] = useState('')


  const [
    filtroEstado,
    setFiltroEstado
  ] = useState('Todos')


  const [
    creditoSeleccionado,
    setCreditoSeleccionado
  ] = useState(null)


  const [
    creditoAbono,
    setCreditoAbono
  ] = useState(null)


  const [
    mostrarAbono,
    setMostrarAbono
  ] = useState(false)


  // =========================
  // FILTROS
  // =========================

  const creditosFiltrados =
    creditos.filter(
      credito => {

        const texto =
          busqueda
            .toLowerCase()
            .trim()


        const coincideBusqueda =

          credito.id
            .toLowerCase()
            .includes(texto) ||

          credito.cliente
            .toLowerCase()
            .includes(texto) ||

          (
            credito.pedidoId ||
            ''
          )
            .toLowerCase()
            .includes(texto) ||

          (
            credito.ventaId ||
            ''
          )
            .toLowerCase()
            .includes(texto)


        const coincideEstado =

          filtroEstado ===
            'Todos' ||

          credito.estado ===
            filtroEstado


        return (
          coincideBusqueda &&
          coincideEstado
        )
      }
    )


  // =========================
  // RESUMEN
  // =========================

  const creditosValidos =
    creditos.filter(
      credito =>
        credito.estado !==
        'Anulado'
    )


  const saldoPendiente =
    creditosValidos.reduce(
      (
        total,
        credito
      ) =>

        total +
        Number(
          credito.saldo
        ),

      0
    )


  const creditosActivos =
    creditosValidos.filter(
      credito =>
        credito.estado ===
        'Activo'
    ).length


  const totalAbonado =
    creditosValidos.reduce(
      (
        total,
        credito
      ) => {

        const abonado =

          Number(
            credito.total
          ) -

          Number(
            credito.saldo
          )


        return (
          total +
          abonado
        )
      },

      0
    )


  // =========================
  // DETALLE
  // =========================

  function abrirDetalle(
    credito
  ) {

    setCreditoSeleccionado(
      credito
    )
  }


  function cerrarDetalle() {

    setCreditoSeleccionado(
      null
    )
  }


  // =========================
  // ABONO
  // =========================

  function abrirAbonoCredito(
    credito
  ) {

    if (
      credito.estado !==
      'Activo'
    ) {
      return
    }


    setCreditoAbono(
      credito
    )

    setMostrarAbono(
      true
    )
  }


  function cerrarAbono() {

    setMostrarAbono(
      false
    )

    setCreditoAbono(
      null
    )
  }


  // =========================
  // REGISTRAR ABONO
  // =========================

  function registrarAbono({
    creditoId,
    fecha,
    monto,
    observacion
  }) {

    const credito =
      creditos.find(
        item =>
          item.id ===
          creditoId
      )


    if (!credito) {

      window.alert(
        'Selecciona un crédito.'
      )

      return
    }


    if (
      credito.estado !==
      'Activo'
    ) {

      window.alert(
        'Este crédito ya no está activo.'
      )

      return
    }


    if (!fecha) {

      window.alert(
        'Selecciona la fecha del abono.'
      )

      return
    }


    const montoNumerico =
      Number(monto)


    if (
      !montoNumerico ||
      montoNumerico <= 0
    ) {

      window.alert(
        'El monto debe ser mayor a cero.'
      )

      return
    }


    if (
      montoNumerico >
      Number(
        credito.saldo
      )
    ) {

      window.alert(
        `El abono no puede superar el saldo pendiente de Q ${Number(
          credito.saldo
        ).toFixed(2)}.`
      )

      return
    }


    const nuevoSaldo =
      Math.max(

        Number(
          credito.saldo
        ) -

        montoNumerico,

        0
      )


    const nuevoEstado =
      nuevoSaldo === 0
        ? 'Pagado'
        : 'Activo'


    // =========================
    // ACTUALIZAR CRÉDITO
    // =========================

    setCreditos(
      creditos.map(
        item => {

          if (
            item.id !==
            credito.id
          ) {
            return item
          }


          return {

            ...item,

            saldo:
              nuevoSaldo,

            estado:
              nuevoEstado

          }
        }
      )
    )


    // =========================
    // GENERAR ID ABONO
    // =========================

    const numeros =
      abonos.map(
        abono =>
          Number(
            abono.id.replace(
              'ABO-',
              ''
            )
          )
      )


    const siguiente =
      numeros.length > 0
        ? Math.max(
            ...numeros
          ) + 1
        : 1


    const nuevoAbono = {

      id:
        `ABO-${String(
          siguiente
        ).padStart(
          3,
          '0'
        )}`,

      creditoId:
        credito.id,

      cliente:
        credito.cliente,

      fecha,

      monto:
        montoNumerico,

      observacion:
        observacion ||
        'Abono registrado'
    }


    setAbonos([
      nuevoAbono,
      ...abonos
    ])


    // =========================
    // ACTUALIZAR DETALLE
    // =========================

    if (
      creditoSeleccionado?.id ===
      credito.id
    ) {

      setCreditoSeleccionado({

        ...credito,

        saldo:
          nuevoSaldo,

        estado:
          nuevoEstado

      })
    }


    cerrarAbono()
  }


  // =========================
  // CLASE ESTADO
  // =========================

  function claseEstado(
    estado
  ) {

    if (
      estado ===
      'Pagado'
    ) {
      return 'status paid'
    }


    if (
      estado ===
      'Anulado'
    ) {
      return 'status cancelled'
    }


    return 'status credit'
  }


  return (

    <section>

      <div className="page-actions">

        <div>

          <p className="eyebrow">
            Créditos
          </p>

          <h3>
            Control de créditos
          </h3>

        </div>

      </div>


      <ResumenCreditos
        saldoPendiente={
          saldoPendiente
        }
        creditosActivos={
          creditosActivos
        }
        totalAbonado={
          totalAbonado
        }
      />


      <TablaCreditos
        creditos={
          creditosFiltrados
        }
        busqueda={
          busqueda
        }
        setBusqueda={
          setBusqueda
        }
        filtroEstado={
          filtroEstado
        }
        setFiltroEstado={
          setFiltroEstado
        }
        claseEstado={
          claseEstado
        }
        abrirDetalle={
          abrirDetalle
        }
        abrirAbono={
          abrirAbonoCredito
        }
      />


      {creditoSeleccionado && (

        <ProgresoCredito
          credito={
            creditos.find(
              credito =>
                credito.id ===
                creditoSeleccionado.id
            ) ||
            creditoSeleccionado
          }

          abonos={
            abonos.filter(
              abono =>
                abono.creditoId ===
                creditoSeleccionado.id
            )
          }

          claseEstado={
            claseEstado
          }

          abrirAbono={
            abrirAbonoCredito
          }

          cerrarModal={
            cerrarDetalle
          }
        />

      )}


      {mostrarAbono && (

        <RegistrarAbonoModal
          creditos={
            creditos.filter(
              credito =>
                credito.estado ===
                'Activo'
            )
          }

          creditoInicial={
            creditoAbono
          }

          guardar={
            registrarAbono
          }

          cerrarModal={
            cerrarAbono
          }
        />

      )}

    </section>

  )
}


export default Creditos