import { useState } from 'react'

import ResumenVentas
  from '../components/ventas/ResumenVentas'

import TablaVentas
  from '../components/ventas/TablaVentas'

import NuevaVentaModal
  from '../components/ventas/NuevaVentaModal'


import {
  useInventarioTerminados
} from '../context/InventarioTerminadosContext'


import {
  useCreditos
} from '../context/CreditosContext'


import {
  usePedidos
} from '../context/PedidosContext'


function Ventas() {

  // ========================================
  // PEDIDOS COMPARTIDOS
  // ========================================

  const {
    pedidos
  } = usePedidos()


  // ========================================
  // INVENTARIO TERMINADO
  // ========================================

  const {
    inventarioTerminados,
    setInventarioTerminados
  } = useInventarioTerminados()


  // ========================================
  // CRÉDITOS
  // ========================================

  const {
    creditos,
    setCreditos,
    abonos
  } = useCreditos()


  // ========================================
  // VARIANTES PARA VENTA DIRECTA
  // ========================================

  const variantes =
    inventarioTerminados

      .filter(
        item =>
          item.destino ===
            'Stock' &&

          Number(
            item.existencia
          ) > 0
      )

      .map(
        item => ({
          id:
            item.id,

          producto:
            item.modelo,

          talla:
            String(
              item.talla
            ),

          color:
            item.color,

          precio:
            Number(
              item.precioUnitario
            ),

          stock:
            Number(
              item.existencia
            )
        })
      )


  // ========================================
  // VENTAS
  // ========================================

  const [
    ventas,
    setVentas
  ] = useState([
    {
      id:
        'VEN-001',

      fecha:
        '2026-09-01',

      origen:
        'Pedido',

      cliente:
        'Calzado El Centro',

      referencia:
        'PED-1044',

      producto:
        'Oxford Ejecutivo',

      cantidad:
        10,

      precioUnitario:
        250,

      total:
        2500,

      tipoPago:
        'Contado',

      recibido:
        2500,

      numeroPagos:
        1,

      estado:
        'Pagado',

      tallas:
        [],

      movimientosInventario:
        []
    },


    {
      id:
        'VEN-002',

      fecha:
        '2026-09-02',

      origen:
        'Pedido',

      cliente:
        'María López',

      referencia:
        'PED-1047',

      producto:
        'Botín Milian',

      cantidad:
        6,

      precioUnitario:
        320,

      total:
        1920,

      tipoPago:
        'Crédito',

      recibido:
        0,

      numeroPagos:
        3,

      estado:
        'Pendiente',

      tallas:
        [],

      movimientosInventario:
        []
    },


    {
      id:
        'VEN-003',

      fecha:
        '2026-09-03',

      origen:
        'Venta directa',

      cliente:
        'Distribuidora Norte',

      referencia:
        '—',

      producto:
        'Derby Ejecutivo',

      cantidad:
        15,

      precioUnitario:
        275,

      total:
        4125,

      tipoPago:
        'Contado',

      recibido:
        4125,

      numeroPagos:
        1,

      estado:
        'Pagado',

      tallas:
        [],

      movimientosInventario:
        []
    }
  ])


  // ========================================
  // FORMULARIO
  // ========================================

  const formularioInicial = {
    origen:
      'Pedido',

    pedidoId:
      '',

    varianteId:
      '',

    cliente:
      '',

    fecha:
      '',

    producto:
      '',

    cantidad:
      '',

    precioUnitario:
      '',

    tipoPago:
      'Contado',

    recibido:
      '',

    numeroPagos:
      '',

    tallasEntrega:
      []
  }


  const [
    formulario,
    setFormulario
  ] = useState(
    formularioInicial
  )


  const [
    mostrarModal,
    setMostrarModal
  ] = useState(false)


  const [
    busqueda,
    setBusqueda
  ] = useState('')


  const [
    filtroPago,
    setFiltroPago
  ] = useState('Todos')


  // ========================================
  // PEDIDOS CON PRODUCTOS DISPONIBLES
  // ========================================

  const pedidosDisponibles =
    pedidos.filter(
      pedido => {

        if (
          pedido.estado ===
          'Cancelado'
        ) {
          return false
        }


        return inventarioTerminados.some(
          item =>
            item.destino ===
              'Pedido' &&

            item.pedidoId ===
              pedido.id &&

            Number(
              item.existencia
            ) > 0
        )
      }
    )


  // ========================================
  // FILTROS
  // ========================================

  const ventasFiltradas =
    ventas.filter(
      venta => {

        const texto =
          busqueda
            .toLowerCase()
            .trim()


        const coincideBusqueda =

          venta.id
            .toLowerCase()
            .includes(texto) ||

          venta.cliente
            .toLowerCase()
            .includes(texto) ||

          venta.producto
            .toLowerCase()
            .includes(texto) ||

          String(
            venta.referencia
          )
            .toLowerCase()
            .includes(texto)


        const coincidePago =

          filtroPago ===
            'Todos' ||

          venta.tipoPago ===
            filtroPago


        return (
          coincideBusqueda &&
          coincidePago
        )
      }
    )


  // ========================================
  // RESUMEN
  // ========================================

  const ventasValidas =
    ventas.filter(
      venta =>
        venta.estado !==
        'Anulada'
    )


  const totalVentas =
    ventasValidas.length


  const ventasContado =
    ventasValidas.filter(
      venta =>
        venta.tipoPago ===
        'Contado'
    ).length


  const ventasCredito =
    ventasValidas.filter(
      venta =>
        venta.tipoPago ===
        'Crédito'
    ).length


  const ingresos =
    ventasValidas

      .filter(
        venta =>
          venta.estado ===
          'Pagado'
      )

      .reduce(
        (
          total,
          venta
        ) =>

          total +
          Number(
            venta.total
          ),

        0
      )


  // ========================================
  // SELECCIONES
  // ========================================

  const pedidoSeleccionado =
    pedidos.find(
      pedido =>
        pedido.id ===
        formulario.pedidoId
    )


  const varianteSeleccionada =
    variantes.find(
      variante =>
        String(
          variante.id
        ) ===
        String(
          formulario.varianteId
        )
    )


  // ========================================
  // CANTIDADES
  // ========================================

  const cantidadEntregaPedido =
    formulario
      .tallasEntrega
      .reduce(
        (
          total,
          item
        ) =>

          total +
          (
            Number(
              item.cantidad
            ) ||
            0
          ),

        0
      )


  const cantidadVentaDirecta =
    Number(
      formulario.cantidad
    ) ||
    0


  const cantidadVenta =
    formulario.origen ===
      'Pedido'
      ? cantidadEntregaPedido
      : cantidadVentaDirecta


  const precioUnitario =
    Number(
      formulario.precioUnitario
    ) ||
    0


  const totalVenta =
    cantidadVenta *
    precioUnitario


  // ========================================
  // ABRIR NUEVA VENTA
  // ========================================

  function abrirNuevaVenta() {

    setFormulario({
      ...formularioInicial,

      tallasEntrega:
        []
    })


    setMostrarModal(
      true
    )
  }


  // ========================================
  // CERRAR MODAL
  // ========================================

  function cerrarModal() {

    setMostrarModal(
      false
    )


    setFormulario({
      ...formularioInicial,

      tallasEntrega:
        []
    })
  }


  // ========================================
  // CAMBIO FORMULARIO
  // ========================================

  function manejarCambio(
    evento
  ) {

    const {
      name,
      value
    } = evento.target


    // ========================================
    // CAMBIAR ORIGEN
    // ========================================

    if (
      name ===
      'origen'
    ) {

      setFormulario({
        ...formularioInicial,

        origen:
          value,

        tallasEntrega:
          []
      })


      return
    }


    // ========================================
    // CAMBIAR TIPO PAGO
    // ========================================

    if (
      name ===
      'tipoPago'
    ) {

      setFormulario(
        formularioActual => ({
          ...formularioActual,

          tipoPago:
            value,

          recibido:
            '',

          numeroPagos:
            ''
        })
      )


      return
    }


    setFormulario(
      formularioActual => ({
        ...formularioActual,

        [name]:
          value
      })
    )
  }


  // ========================================
  // SELECCIONAR PEDIDO
  // ========================================

  function seleccionarPedido(
    evento
  ) {

    const pedidoId =
      evento.target.value


    const pedido =
      pedidos.find(
        item =>
          item.id ===
          pedidoId
      )


    if (!pedido) {

      setFormulario(
        formularioActual => ({
          ...formularioActual,

          pedidoId:
            '',

          cliente:
            '',

          producto:
            '',

          precioUnitario:
            '',

          tallasEntrega:
            []
        })
      )


      return
    }


    // ========================================
    // OBTENER TALLAS PRODUCIDAS
    // ========================================

    const tallasEntrega =
      pedido.tallas

        .map(
          tallaPedido => {

            const disponible =
              inventarioTerminados

                .filter(
                  item =>
                    item.destino ===
                      'Pedido' &&

                    item.pedidoId ===
                      pedido.id &&

                    String(
                      item.talla
                    ) ===
                      String(
                        tallaPedido.talla
                      )
                )

                .reduce(
                  (
                    total,
                    item
                  ) =>

                    total +
                    Number(
                      item.existencia
                    ),

                  0
                )


            return {
              talla:
                String(
                  tallaPedido.talla
                ),

              disponible,

              cantidad:
                ''
            }
          }
        )

        .filter(
          item =>
            item.disponible >
            0
        )


    setFormulario(
      formularioActual => ({
        ...formularioActual,

        pedidoId:
          pedido.id,

        cliente:
          pedido.cliente,

        producto:
          pedido.modelo,

        precioUnitario:
          Number(
            pedido.precioUnitario
          ),

        cantidad:
          '',

        tallasEntrega
      })
    )
  }


  // ========================================
  // CAMBIAR CANTIDAD TALLA
  // ========================================

  function cambiarCantidadTalla(
    talla,
    valor
  ) {

    setFormulario(
      formularioActual => ({
        ...formularioActual,

        tallasEntrega:
          formularioActual
            .tallasEntrega
            .map(
              item => {

                if (
                  String(
                    item.talla
                  ) !==
                  String(
                    talla
                  )
                ) {
                  return item
                }


                return {
                  ...item,

                  cantidad:
                    valor
                }
              }
            )
      })
    )
  }


  // ========================================
  // SELECCIONAR VARIANTE
  // ========================================

  function seleccionarVariante(
    evento
  ) {

    const varianteId =
      evento.target.value


    const variante =
      variantes.find(
        item =>
          String(
            item.id
          ) ===
          String(
            varianteId
          )
      )


    if (!variante) {

      setFormulario(
        formularioActual => ({
          ...formularioActual,

          varianteId:
            '',

          producto:
            '',

          cantidad:
            '',

          precioUnitario:
            ''
        })
      )


      return
    }


    setFormulario(
      formularioActual => ({
        ...formularioActual,

        varianteId:
          variante.id,

        producto:
          `${variante.producto} - Talla ${variante.talla} - ${variante.color}`,

        cantidad:
          '',

        precioUnitario:
          Number(
            variante.precio
          )
      })
    )
  }


  // ========================================
  // DESCONTAR INVENTARIO PEDIDO
  // ========================================

  function descontarInventarioPedido(
    pedidoId,
    tallasVendidas
  ) {

    const movimientos =
      []


    const nuevoInventario =
      inventarioTerminados.map(
        item => {

          if (
            item.destino !==
              'Pedido' ||

            item.pedidoId !==
              pedidoId
          ) {
            return item
          }


          const tallaVendida =
            tallasVendidas.find(
              talla =>
                String(
                  talla.talla
                ) ===
                String(
                  item.talla
                )
            )


          if (!tallaVendida) {
            return item
          }


          const cantidad =
            Number(
              tallaVendida.cantidad
            )


          if (
            !cantidad ||
            cantidad <= 0
          ) {
            return item
          }


          movimientos.push({
            inventarioId:
              item.id,

            cantidad
          })


          return {
            ...item,

            existencia:
              Number(
                item.existencia
              ) -
              cantidad
          }
        }
      )


    return {
      nuevoInventario,
      movimientos
    }
  }


  // ========================================
  // GENERAR CRÉDITO
  // ========================================

  function generarCredito(
    venta
  ) {

    setCreditos(
      creditosActuales => {

        const yaExiste =
          creditosActuales.some(
            credito =>
              credito.ventaId ===
              venta.id
          )


        if (yaExiste) {
          return creditosActuales
        }


        const numeros =
          creditosActuales
            .map(
              credito =>
                Number(
                  credito.id.replace(
                    'CRE-',
                    ''
                  )
                )
            )
            .filter(
              numero =>
                !Number.isNaN(
                  numero
                )
            )


        const siguiente =
          numeros.length > 0
            ? Math.max(
                ...numeros
              ) + 1
            : 1


        const nuevoCredito = {
          id:
            `CRE-${String(
              siguiente
            ).padStart(
              3,
              '0'
            )}`,

          cliente:
            venta.cliente,

          pedidoId:
            venta.origen ===
              'Pedido'
              ? venta.referencia
              : '—',

          ventaId:
            venta.id,

          fecha:
            venta.fecha,

          total:
            Number(
              venta.total
            ),

          saldo:
            Number(
              venta.total
            ),

          numeroPagos:
            Number(
              venta.numeroPagos
            ),

          estado:
            'Activo'
        }


        return [
          nuevoCredito,
          ...creditosActuales
        ]
      }
    )
  }


  // ========================================
  // GUARDAR VENTA
  // ========================================

  function guardarVenta(
    evento
  ) {

    evento.preventDefault()


    if (!formulario.fecha) {

      window.alert(
        'Selecciona la fecha de la venta.'
      )

      return
    }


    // ========================================
    // VALIDAR PEDIDO
    // ========================================

    if (
      formulario.origen ===
        'Pedido' &&
      !pedidoSeleccionado
    ) {

      window.alert(
        'Selecciona un pedido.'
      )

      return
    }


    // ========================================
    // VALIDAR VENTA DIRECTA
    // ========================================

    if (
      formulario.origen ===
        'Venta directa' &&
      !varianteSeleccionada
    ) {

      window.alert(
        'Selecciona un producto.'
      )

      return
    }


    if (
      cantidadVenta <= 0
    ) {

      window.alert(
        'Debes indicar al menos un par para vender.'
      )

      return
    }


    // ========================================
    // VALIDAR TALLAS DEL PEDIDO
    // ========================================

    if (
      formulario.origen ===
      'Pedido'
    ) {

      const tallaInvalida =
        formulario
          .tallasEntrega
          .find(
            item =>
              Number(
                item.cantidad
              ) >
              Number(
                item.disponible
              )
          )


      if (tallaInvalida) {

        window.alert(
          `La talla ${tallaInvalida.talla} solo tiene ${tallaInvalida.disponible} pares disponibles.`
        )

        return
      }
    }


    // ========================================
    // VALIDAR STOCK DIRECTO
    // ========================================

    if (
      formulario.origen ===
        'Venta directa' &&

      cantidadVenta >
      Number(
        varianteSeleccionada.stock
      )
    ) {

      window.alert(
        `Solo hay ${varianteSeleccionada.stock} pares disponibles.`
      )

      return
    }


    // ========================================
    // CONTADO
    // ========================================

    if (
      formulario.tipoPago ===
      'Contado'
    ) {

      const recibido =
        Number(
          formulario.recibido
        ) ||
        0


      if (
        recibido <
        totalVenta
      ) {

        window.alert(
          'El monto recibido no puede ser menor al total de la venta.'
        )

        return
      }
    }


    // ========================================
    // CRÉDITO
    // ========================================

    if (
      formulario.tipoPago ===
        'Crédito' &&

      Number(
        formulario.numeroPagos
      ) <= 0
    ) {

      window.alert(
        'Indica el número de pagos.'
      )

      return
    }


    // ========================================
    // ID VENTA
    // ========================================

    const numerosVentas =
      ventas
        .map(
          venta =>
            Number(
              venta.id.replace(
                'VEN-',
                ''
              )
            )
        )
        .filter(
          numero =>
            !Number.isNaN(
              numero
            )
        )


    const siguienteVenta =
      numerosVentas.length > 0
        ? Math.max(
            ...numerosVentas
          ) + 1
        : 1


    const idVenta =
      `VEN-${String(
        siguienteVenta
      ).padStart(
        3,
        '0'
      )}`


    // ========================================
    // TALLAS VENDIDAS
    // ========================================

    const tallasVendidas =
      formulario.origen ===
        'Pedido'

        ? formulario
            .tallasEntrega
            .filter(
              item =>
                Number(
                  item.cantidad
                ) > 0
            )
            .map(
              item => ({
                talla:
                  String(
                    item.talla
                  ),

                cantidad:
                  Number(
                    item.cantidad
                  )
              })
            )

        : [
            {
              talla:
                String(
                  varianteSeleccionada
                    .talla
                ),

              cantidad:
                cantidadVenta
            }
          ]


    let movimientosInventario =
      []


    // ========================================
    // DESCONTAR PEDIDO
    // ========================================

    if (
      formulario.origen ===
      'Pedido'
    ) {

      const resultado =
        descontarInventarioPedido(
          formulario.pedidoId,
          tallasVendidas
        )


      movimientosInventario =
        resultado.movimientos


      setInventarioTerminados(
        resultado.nuevoInventario
      )

    } else {

      // ========================================
      // DESCONTAR VENTA DIRECTA
      // ========================================

      movimientosInventario = [
        {
          inventarioId:
            varianteSeleccionada.id,

          cantidad:
            cantidadVenta
        }
      ]


      setInventarioTerminados(
        inventarioActual =>
          inventarioActual.map(
            item => {

              if (
                String(
                  item.id
                ) !==
                String(
                  varianteSeleccionada.id
                )
              ) {
                return item
              }


              return {
                ...item,

                existencia:
                  Number(
                    item.existencia
                  ) -
                  cantidadVenta
              }
            }
          )
      )
    }


    // ========================================
    // CREAR VENTA
    // ========================================

    const nuevaVenta = {
      id:
        idVenta,

      fecha:
        formulario.fecha,

      origen:
        formulario.origen,

      cliente:
        formulario.cliente
          ?.trim() ||
        'Consumidor final',

      referencia:
        formulario.origen ===
          'Pedido'
          ? formulario.pedidoId
          : '—',

      producto:
        formulario.producto,

      tallas:
        tallasVendidas,

      cantidad:
        cantidadVenta,

      precioUnitario:
        precioUnitario,

      total:
        totalVenta,

      tipoPago:
        formulario.tipoPago,

      recibido:
        formulario.tipoPago ===
          'Contado'
          ? Number(
              formulario.recibido
            )
          : 0,

      numeroPagos:
        formulario.tipoPago ===
          'Crédito'
          ? Number(
              formulario.numeroPagos
            )
          : 1,

      estado:
        formulario.tipoPago ===
          'Contado'
          ? 'Pagado'
          : 'Pendiente',

      movimientosInventario
    }


    setVentas(
      ventasActuales => [
        nuevaVenta,
        ...ventasActuales
      ]
    )


    // ========================================
    // CRÉDITO AUTOMÁTICO
    // ========================================

    if (
      nuevaVenta.tipoPago ===
      'Crédito'
    ) {

      generarCredito(
        nuevaVenta
      )
    }


    cerrarModal()
  }


  // ========================================
  // ANULAR VENTA
  // ========================================

  function anularVenta(
    venta
  ) {

    if (
      venta.estado ===
      'Anulada'
    ) {
      return
    }


    // ========================================
    // BUSCAR CRÉDITO
    // ========================================

    const creditoRelacionado =
      creditos.find(
        credito =>
          credito.ventaId ===
          venta.id
      )


    // ========================================
    // VALIDAR ABONOS
    // ========================================

    if (creditoRelacionado) {

      const tieneAbonos =
        abonos.some(
          abono =>
            abono.creditoId ===
            creditoRelacionado.id
        )


      if (tieneAbonos) {

        window.alert(
          'Esta venta tiene un crédito con abonos registrados. No puede anularse directamente.'
        )

        return
      }
    }


    const confirmar =
      window.confirm(
        `¿Deseas anular la venta ${venta.id}?`
      )


    if (!confirmar) {
      return
    }


    // ========================================
    // DEVOLVER INVENTARIO
    // ========================================

    if (
      Array.isArray(
        venta.movimientosInventario
      ) &&
      venta
        .movimientosInventario
        .length > 0
    ) {

      setInventarioTerminados(
        inventarioActual =>
          inventarioActual.map(
            item => {

              const movimiento =
                venta
                  .movimientosInventario
                  .find(
                    movimiento =>
                      String(
                        movimiento
                          .inventarioId
                      ) ===
                      String(
                        item.id
                      )
                  )


              if (!movimiento) {
                return item
              }


              return {
                ...item,

                existencia:
                  Number(
                    item.existencia
                  ) +
                  Number(
                    movimiento.cantidad
                  )
              }
            }
          )
      )
    }


    // ========================================
    // ANULAR VENTA
    // ========================================

    setVentas(
      ventasActuales =>
        ventasActuales.map(
          item => {

            if (
              item.id !==
              venta.id
            ) {
              return item
            }


            return {
              ...item,

              estado:
                'Anulada'
            }
          }
        )
    )


    // ========================================
    // ANULAR CRÉDITO RELACIONADO
    // ========================================

    if (
      creditoRelacionado
    ) {

      setCreditos(
        creditosActuales =>
          creditosActuales.map(
            credito => {

              if (
                credito.id !==
                creditoRelacionado.id
              ) {
                return credito
              }


              return {
                ...credito,

                estado:
                  'Anulado',

                saldo:
                  0
              }
            }
          )
      )
    }
  }


  // ========================================
  // CLASE ESTADO
  // ========================================

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
      'Anulada'
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
            Ventas
          </p>

          <h3>
            Gestión de ventas
          </h3>

        </div>


        <button
          className="btn btn-gold"
          onClick={
            abrirNuevaVenta
          }
        >
          + Nueva venta
        </button>

      </div>


      <ResumenVentas
        totalVentas={
          totalVentas
        }

        ventasContado={
          ventasContado
        }

        ventasCredito={
          ventasCredito
        }

        ingresos={
          ingresos
        }
      />


      <TablaVentas
        ventas={
          ventasFiltradas
        }

        busqueda={
          busqueda
        }

        setBusqueda={
          setBusqueda
        }

        filtroPago={
          filtroPago
        }

        setFiltroPago={
          setFiltroPago
        }

        claseEstado={
          claseEstado
        }

        anularVenta={
          anularVenta
        }
      />


      {mostrarModal && (

        <NuevaVentaModal
          formulario={
            formulario
          }

          manejarCambio={
            manejarCambio
          }

          seleccionarPedido={
            seleccionarPedido
          }

          seleccionarVariante={
            seleccionarVariante
          }

          cambiarCantidadTalla={
            cambiarCantidadTalla
          }

          pedidos={
            pedidosDisponibles
          }

          variantes={
            variantes
          }

          pedidoSeleccionado={
            pedidoSeleccionado
          }

          varianteSeleccionada={
            varianteSeleccionada
          }

          cantidadVenta={
            cantidadVenta
          }

          totalVenta={
            totalVenta
          }

          guardarVenta={
            guardarVenta
          }

          cerrarModal={
            cerrarModal
          }
        />

      )}

    </section>

  )
}


export default Ventas