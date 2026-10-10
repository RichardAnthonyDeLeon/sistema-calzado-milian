import {
  useEffect,
  useRef,
  useState
} from 'react'

import ResumenPedidos
  from '../components/pedidos/ResumenPedidos'

import FlujoPedido
  from '../components/pedidos/FlujoPedido'

import TablaPedidos
  from '../components/pedidos/TablaPedidos'

import FormularioPedido
  from '../components/pedidos/FormularioPedido'

import DetallePedidoModal
  from '../components/pedidos/DetallePedidoModal'


const API_URL =
  'http://localhost:3000/api'


function crearFormularioVacio() {

  return {

    idCliente: '',

    fechaEntrega: '',

    tipoModelo: 'EXISTENTE',

    idProducto: '',

    nombrePersonalizado: '',

    categoria: '',

    color: '',

    material: '',

    suela: '',

    colorSuela: '',

    tallas: [
      {
        id: Date.now(),
        idVariante: '',
        talla: '',
        cantidad: ''
      }
    ],

    descripcion: '',

    precioUnitario: '',

    anticipo: ''

  }

}


function Pedidos() {
  const confirmacionEnCurso = useRef(false)
  const [confirmando, setConfirmando] = useState(false)

  async function confirmarPedido(pedido) {
    if (confirmacionEnCurso.current || pedido.estadoBD !== 'BORRADOR') return
    if (!window.confirm(`¿Confirmar el pedido ${pedido.id} para habilitar su producción?`)) return
    confirmacionEnCurso.current = true
    setConfirmando(true)
    try {
      const respuesta = await fetch(`${API_URL}/pedidos/${pedido.idPedido}/estado`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'CONFIRMADO' })
      })
      const resultado = await respuesta.json()
      if (!respuesta.ok || !resultado.ok) throw new Error(resultado.message || 'No se pudo confirmar el pedido.')
      const actualizar = actual => ({ ...actual, estadoBD: resultado.data.estado, estado: traducirEstado(resultado.data.estado) })
      setPedidos(actuales => actuales.map(actual => actual.idPedido === pedido.idPedido ? actualizar(actual) : actual))
      setPedidoSeleccionado(actual => actual?.idPedido === pedido.idPedido ? actualizar(actual) : actual)
      try { await cargarPedidos() } catch {
        window.alert('Pedido confirmado. No se pudo recargar el listado; actualiza la página.')
        return
      }
      window.alert('Pedido confirmado correctamente. Ya está disponible para producción.')
    } catch (error) {
      window.alert(error.message || 'No se pudo confirmar el pedido.')
    } finally {
      confirmacionEnCurso.current = false
      setConfirmando(false)
    }
  }

  const [
    pedidos,
    setPedidos
  ] = useState([])


  const [
    clientes,
    setClientes
  ] = useState([])


  const [
    productos,
    setProductos
  ] = useState([])


  const [
    cargando,
    setCargando
  ] = useState(true)


  const [
    busqueda,
    setBusqueda
  ] = useState('')


  const [
    filtroEstado,
    setFiltroEstado
  ] = useState('Todos')


  const [
    mostrarFormulario,
    setMostrarFormulario
  ] = useState(false)


  const [
    mostrarDetalle,
    setMostrarDetalle
  ] = useState(false)


  const [
    modoPedido,
    setModoPedido
  ] = useState('nuevo')


  const [
    pedidoSeleccionado,
    setPedidoSeleccionado
  ] = useState(null)


  const [
    formulario,
    setFormulario
  ] = useState(
    crearFormularioVacio()
  )


  // =========================
  // ESTADOS
  // =========================

  function traducirEstado(estado) {

    const estados = {

      BORRADOR:
        'Borrador',

      CONFIRMADO:
        'Confirmado',

      EN_PRODUCCION:
        'En producción',

      LISTO:
        'Listo',

      ENTREGADO:
        'Entregado',

      CANCELADO:
        'Cancelado'

    }


    return estados[estado] || estado

  }


  // =========================
  // TRANSFORMAR PEDIDO API
  // =========================

  function transformarPedido(pedido) {

    const detalles =
      pedido.tbl_detalle_pedido || []


    const primerDetalle =
      detalles[0]


    const variante =
      primerDetalle
        ?.tbl_variantes_producto


    const producto =
      variante
        ?.tbl_productos


    const pagos =
      pedido.tbl_pagos_pedido || []


    const anticipo =
      pagos

        .filter(
          pago =>
            pago.tipo_pago ===
            'ANTICIPO'
        )

        .reduce(
          (total, pago) =>
            total +
            Number(pago.monto),
          0
        )


    const tallas =
      detalles.map(
        detalle => ({

          id:
            String(
              detalle.id_detalle_pedido
            ),

          idDetalle:
            String(
              detalle.id_detalle_pedido
            ),

          idVariante:
            detalle.id_variante,

          talla:
            detalle
              .tbl_variantes_producto
              ?.talla || '',

          color:
            detalle
              .tbl_variantes_producto
              ?.color || '',

          cantidad:
            Number(
              detalle.cantidad
            )

        })
      )


    const total =
      Number(
        pedido.precio_total
      ) || 0


    return {

      id:
        `PED-${pedido.id_pedido}`,

      idPedido:
        String(
          pedido.id_pedido
        ),

      idCliente:
        pedido.id_cliente,

      cliente:
        pedido.tbl_clientes
          ?.nombre || '',

      fechaPedido:
        pedido.fecha_pedido,

      fechaEntrega:
        pedido
          .fecha_estimada_entrega
          ? String(
              pedido
                .fecha_estimada_entrega
            ).slice(0, 10)
          : '',

      idProducto:
        producto?.id_producto || '',

      modelo:
        producto?.nombre || '',

      categoria:
        producto?.categoria || '',

      color:
        variante?.color || '',

      materialPrincipal:
        variante?.material || '',

      tipoSuela:
        variante?.suela || '',

      tallas,

      descripcion:
        pedido.observaciones || '',

      precioUnitario:
        primerDetalle
          ? Number(
              primerDetalle
                .precio_unitario
            )
          : 0,

      total,

      anticipo,

      saldo:
        Math.max(
          total - anticipo,
          0
        ),

      estadoBD:
        pedido.estado,

      estado:
        traducirEstado(
          pedido.estado
        )

    }

  }


  // =========================
  // API
  // =========================

  async function cargarPedidos() {

    const respuesta =
      await fetch(
        `${API_URL}/pedidos`
      )


    const resultado =
      await respuesta.json()


    if (!respuesta.ok) {

      throw new Error(
        resultado.message ||
        'Error al obtener pedidos'
      )

    }


    setPedidos(
      (resultado.data || [])
        .map(transformarPedido)
    )

  }


  async function cargarClientes() {

    const respuesta =
      await fetch(
        `${API_URL}/clientes`
      )


    const resultado =
      await respuesta.json()


    if (!respuesta.ok) {

      throw new Error(
        resultado.message ||
        'Error al obtener clientes'
      )

    }


    setClientes(
      (resultado.data || [])
        .filter(
          cliente =>
            cliente.estado ===
            'ACTIVO'
        )
    )

  }


  async function cargarProductos() {

    const respuesta =
      await fetch(
        `${API_URL}/productos`
      )


    const resultado =
      await respuesta.json()


    if (!respuesta.ok) {

      throw new Error(
        resultado.message ||
        'Error al obtener productos'
      )

    }


    setProductos(
      (resultado.data || [])

        .filter(
          producto =>
            producto.estado ===
            'ACTIVO'
        )

        .map(
          producto => ({

            ...producto,

            tbl_variantes_producto:
              (
                producto
                  .tbl_variantes_producto ||
                []
              ).filter(
                variante =>
                  variante.estado ===
                  'ACTIVO'
              )

          })
        )
    )

  }


  async function cargarDatos() {

    try {

      setCargando(true)


      await Promise.all([
        cargarPedidos(),
        cargarClientes(),
        cargarProductos()
      ])

    } catch (error) {

      console.error(error)

      window.alert(
        error.message ||
        'No se pudieron cargar los datos.'
      )

    } finally {

      setCargando(false)

    }

  }


  useEffect(() => {

    cargarDatos()

  }, [])


  // =========================
  // FILTROS
  // =========================

  const pedidosFiltrados =
    pedidos.filter(
      pedido => {

        const texto =
          busqueda
            .toLowerCase()
            .trim()


        const coincideBusqueda =

          pedido.id
            .toLowerCase()
            .includes(texto) ||

          pedido.cliente
            .toLowerCase()
            .includes(texto) ||

          pedido.modelo
            .toLowerCase()
            .includes(texto)


        const coincideEstado =

          filtroEstado ===
            'Todos' ||

          pedido.estado ===
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

  const pendientes =
    pedidos.filter(
      pedido =>
        pedido.estado ===
        'Confirmado'
    ).length


  const enProduccion =
    pedidos.filter(
      pedido =>
        pedido.estado ===
        'En producción'
    ).length


  const listos =
    pedidos.filter(
      pedido =>
        pedido.estado ===
        'Listo'
    ).length


  const totalPendiente =
    pedidos

      .filter(
        pedido =>
          pedido.estado !==
          'Cancelado'
      )

      .reduce(
        (total, pedido) =>
          total +
          Number(
            pedido.saldo
          ),
        0
      )


  // =========================
  // CÁLCULOS
  // =========================

  const cantidadTotal =
    formulario.tallas.reduce(
      (total, item) =>
        total +
        (
          Number(
            item.cantidad
          ) || 0
        ),
      0
    )


  const precioUnitario =
    Number(
      formulario.precioUnitario
    ) || 0


  const anticipo =
    Number(
      formulario.anticipo
    ) || 0


  const totalPedido =
    cantidadTotal *
    precioUnitario


  const saldoPendiente =
    Math.max(
      totalPedido -
      anticipo,
      0
    )


  // =========================
  // NUEVO
  // =========================

  function abrirNuevoPedido() {

    setModoPedido('nuevo')

    setPedidoSeleccionado(null)

    setFormulario(
      crearFormularioVacio()
    )

    setMostrarFormulario(true)

  }


  // =========================
  // DETALLE
  // =========================

  function abrirDetalle(pedido) {

    setPedidoSeleccionado(pedido)

    setMostrarDetalle(true)

  }


  function cerrarDetalle() {

    setMostrarDetalle(false)

    setPedidoSeleccionado(null)

  }


  // =========================
  // EDITAR
  // =========================

  function abrirEditar(pedido) {

    if (
      pedido.estadoBD !==
        'BORRADOR' &&
      pedido.estadoBD !==
        'CONFIRMADO'
    ) {

      return

    }


    setModoPedido('editar')

    setPedidoSeleccionado(pedido)


    /*
     * Un modelo personalizado ya fue
     * registrado como Producto al crear
     * el pedido. Por eso al editarlo se
     * maneja como EXISTENTE.
     */
    setFormulario({

      idCliente:
        String(
          pedido.idCliente
        ),

      fechaEntrega:
        pedido.fechaEntrega,

      tipoModelo:
        'EXISTENTE',

      idProducto:
        String(
          pedido.idProducto
        ),

      nombrePersonalizado: '',

      categoria: '',

      color: '',

      material: '',

      suela: '',

      colorSuela: '',

      tallas:
        pedido.tallas.map(
          item => ({

            id:
              item.id,

            idVariante:
              String(
                item.idVariante
              ),

            talla:
              item.talla,

            cantidad:
              item.cantidad

          })
        ),

      descripcion:
        pedido.descripcion || '',

      precioUnitario:
        pedido.precioUnitario,

      anticipo:
        pedido.anticipo

    })


    setMostrarFormulario(true)

  }


  // =========================
  // CERRAR FORMULARIO
  // =========================

  function cerrarFormulario() {

    setMostrarFormulario(false)

    setPedidoSeleccionado(null)

    setModoPedido('nuevo')

  }


  // =========================
  // CAMBIOS
  // =========================

  function manejarCambio(evento) {

    const {
      name,
      value
    } = evento.target


    if (
      name ===
      'tipoModelo'
    ) {

      setFormulario(
        formularioActual => ({

          ...formularioActual,

          tipoModelo:
            value,

          idProducto: '',

          nombrePersonalizado: '',

          categoria: '',

          color: '',

          material: '',

          suela: '',

          colorSuela: '',

          precioUnitario: '',

          tallas: [
            {
              id: Date.now(),
              idVariante: '',
              talla: '',
              cantidad: ''
            }
          ]

        })
      )


      return

    }


    if (
      name ===
      'idProducto'
    ) {

      const producto =
        productos.find(
          item =>
            String(
              item.id_producto
            ) ===
            String(value)
        )


      setFormulario(
        formularioActual => ({

          ...formularioActual,

          idProducto:
            value,

          precioUnitario:
            producto
              ? Number(
                  producto.precio_venta
                )
              : '',

          tallas: [
            {
              id: Date.now(),
              idVariante: '',
              talla: '',
              cantidad: ''
            }
          ]

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


  // =========================
  // TALLAS
  // =========================

  function agregarTalla() {

    setFormulario(
      formularioActual => ({

        ...formularioActual,

        tallas: [

          ...formularioActual.tallas,

          {
            id:
              Date.now() +
              Math.random(),

            idVariante: '',

            talla: '',

            cantidad: ''
          }

        ]

      })
    )

  }


  function cambiarTalla(
    id,
    campo,
    valor
  ) {

    setFormulario(
      formularioActual => ({

        ...formularioActual,

        tallas:
          formularioActual
            .tallas
            .map(
              item => {

                if (
                  item.id !== id
                ) {

                  return item

                }


                if (
                  campo ===
                    'idVariante' &&
                  formularioActual
                    .tipoModelo ===
                    'EXISTENTE'
                ) {

                  const producto =
                    productos.find(
                      producto =>
                        String(
                          producto
                            .id_producto
                        ) ===
                        String(
                          formularioActual
                            .idProducto
                        )
                    )


                  const variante =
                    producto
                      ?.tbl_variantes_producto
                      ?.find(
                        variante =>
                          String(
                            variante
                              .id_variante
                          ) ===
                          String(valor)
                      )


                  return {

                    ...item,

                    idVariante:
                      valor,

                    talla:
                      variante?.talla ||
                      ''

                  }

                }


                return {

                  ...item,

                  [campo]:
                    valor

                }

              }
            )

      })
    )

  }


  function eliminarTalla(id) {

    if (
      formulario.tallas.length <=
      1
    ) {

      window.alert(
        'El pedido debe tener al menos una talla.'
      )

      return

    }


    setFormulario(
      formularioActual => ({

        ...formularioActual,

        tallas:
          formularioActual
            .tallas
            .filter(
              item =>
                item.id !== id
            )

      })
    )

  }


  // =========================
  // GUARDAR
  // =========================

  async function guardarPedido(
    evento
  ) {

    evento.preventDefault()


    if (
      !formulario.idCliente ||
      !formulario.fechaEntrega
    ) {

      window.alert(
        'Selecciona el cliente y la fecha de entrega.'
      )

      return

    }


    if (
      formulario.tipoModelo ===
      'EXISTENTE' &&
      !formulario.idProducto
    ) {

      window.alert(
        'Selecciona un modelo.'
      )

      return

    }


    if (
      formulario.tipoModelo ===
      'PERSONALIZADO'
    ) {

      if (
        !formulario
          .nombrePersonalizado
          .trim() ||
        !formulario.color.trim() ||
        !formulario.material.trim() ||
        !formulario.suela.trim() ||
        !formulario.colorSuela.trim()
      ) {

        window.alert(
          'Completa las características del modelo personalizado.'
        )

        return

      }

    }


    if (
      precioUnitario <= 0
    ) {

      window.alert(
        'Ingresa un precio unitario válido.'
      )

      return

    }


    const tallasValidas =
      formulario.tallas.filter(
        item =>
          item.talla &&
          Number(
            item.cantidad
          ) > 0
      )


    if (
      tallasValidas.length !==
      formulario.tallas.length
    ) {

      window.alert(
        'Completa todas las tallas y cantidades.'
      )

      return

    }


    const valoresTalla =
      tallasValidas.map(
        item =>
          String(
            item.talla
          ).trim()
      )


    if (
      new Set(
        valoresTalla
      ).size !==
      valoresTalla.length
    ) {

      window.alert(
        'No puedes repetir una talla en el mismo pedido.'
      )

      return

    }


    if (
      anticipo >
      totalPedido
    ) {

      window.alert(
        'El anticipo no puede ser mayor al total del pedido.'
      )

      return

    }


    let datos


    if (
      formulario.tipoModelo ===
      'PERSONALIZADO'
    ) {

      datos = {

        id_cliente:
          Number(
            formulario.idCliente
          ),

        tipo_modelo:
          'PERSONALIZADO',

        fecha_estimada_entrega:
          formulario.fechaEntrega,

        observaciones:
          formulario.descripcion
            .trim() ||
          null,

        imagen_referencia:
          null,

        anticipo,

        modelo_personalizado: {

          nombre:
            formulario
              .nombrePersonalizado
              .trim(),

          categoria:
            formulario.categoria
              .trim() ||
            'Personalizado',

          color:
            formulario.color.trim(),

          material:
            formulario.material.trim(),

          suela:
            formulario.suela.trim(),

          color_suela:
            formulario
              .colorSuela
              .trim(),

          precio:
            precioUnitario

        },

        detalles:
          tallasValidas.map(
            item => ({

              talla:
                String(
                  item.talla
                ).trim(),

              cantidad:
                Number(
                  item.cantidad
                )

            })
          )

      }

    } else {

      datos = {

        id_cliente:
          Number(
            formulario.idCliente
          ),

        tipo_modelo:
          'EXISTENTE',

        fecha_estimada_entrega:
          formulario.fechaEntrega,

        observaciones:
          formulario.descripcion
            .trim() ||
          null,

        imagen_referencia:
          null,

        anticipo,

        detalles:
          tallasValidas.map(
            item => ({

              id_variante:
                Number(
                  item.idVariante
                ),

              cantidad:
                Number(
                  item.cantidad
                ),

              precio_unitario:
                precioUnitario,

              descripcion_diseno:
                formulario.descripcion
                  .trim() ||
                null

            })
          )

      }

    }


    try {

      let url =
        `${API_URL}/pedidos`

      let metodo =
        'POST'


      if (
        modoPedido ===
          'editar' &&
        pedidoSeleccionado
      ) {

        url =
          `${API_URL}/pedidos/${pedidoSeleccionado.idPedido}`

        metodo =
          'PUT'

      }


      const respuesta =
        await fetch(
          url,
          {

            method:
              metodo,

            headers: {

              'Content-Type':
                'application/json'

            },

            body:
              JSON.stringify(datos)

          }
        )


      const resultado =
        await respuesta.json()


      if (!respuesta.ok) {

        throw new Error(
          resultado.message ||
          resultado.error ||
          'No se pudo guardar el pedido'
        )

      }


      /*
       * Recargamos Productos porque un
       * personalizado crea un producto
       * y sus variantes.
       */
      await Promise.all([
        cargarPedidos(),
        cargarProductos()
      ])


      cerrarFormulario()


      window.alert(
        modoPedido ===
          'editar'
          ? 'Pedido actualizado correctamente.'
          : 'Pedido registrado correctamente.'
      )

    } catch (error) {

      console.error(error)

      window.alert(
        error.message ||
        'Error al guardar el pedido.'
      )

    }

  }


  // =========================
  // CANCELAR
  // =========================

  async function cancelarPedido(
    pedido
  ) {

    if (
      pedido.estadoBD !==
        'BORRADOR' &&
      pedido.estadoBD !==
        'CONFIRMADO'
    ) {

      return

    }


    const confirmar =
      window.confirm(
        `¿Deseas cancelar el pedido ${pedido.id}?`
      )


    if (!confirmar) {

      return

    }


    try {

      const respuesta =
        await fetch(
          `${API_URL}/pedidos/${pedido.idPedido}/estado`,
          {

            method:
              'PATCH',

            headers: {

              'Content-Type':
                'application/json'

            },

            body:
              JSON.stringify({

                estado:
                  'CANCELADO'

              })

          }
        )


      const resultado =
        await respuesta.json()


      if (!respuesta.ok) {

        throw new Error(
          resultado.message ||
          resultado.error ||
          'No se pudo cancelar el pedido'
        )

      }


      await cargarPedidos()

    } catch (error) {

      console.error(error)

      window.alert(
        error.message ||
        'Error al cancelar el pedido.'
      )

    }

  }


  // =========================
  // CSS ESTADO
  // =========================

  function claseEstado(estado) {

    if (
      estado ===
      'En producción'
    ) {

      return 'status production'

    }


    if (
      estado ===
      'Listo'
    ) {

      return 'status ready'

    }


    if (
      estado ===
      'Cancelado'
    ) {

      return 'status cancelled'

    }


    return 'status pending'

  }


  // =========================
  // RENDER
  // =========================

  return (

    <section>

      <div className="page-actions">

        <div>

          <p className="eyebrow">
            Pedidos
          </p>

          <h3>
            Gestión de pedidos
          </h3>

        </div>


        <button
          className="btn btn-gold"
          onClick={
            abrirNuevoPedido
          }
        >
          + Nuevo pedido
        </button>

      </div>


      <ResumenPedidos
        totalPedidos={pedidos.length}
        pedidosPendientes={pendientes}
        pedidosProduccion={enProduccion}
        pedidosListos={listos}
        pendientes={pendientes}
        enProduccion={enProduccion}
        listos={listos}
        totalPendiente={
          totalPendiente
        }
      />


      <FlujoPedido />


      {cargando ? (

        <div className="panel">
          Cargando pedidos...
        </div>

      ) : (

        <TablaPedidos
          confirmarPedido={confirmarPedido}
          confirmando={confirmando}
          pedidos={
            pedidosFiltrados
          }
          busqueda={busqueda}
          setBusqueda={
            setBusqueda
          }
          filtroEstado={
            filtroEstado
          }
          setFiltroEstado={
            setFiltroEstado
          }
          abrirDetalle={
            abrirDetalle
          }
          abrirEditar={
            abrirEditar
          }
          cancelarPedido={
            cancelarPedido
          }
          claseEstado={
            claseEstado
          }
        />

      )}


      {mostrarFormulario && (

        <FormularioPedido
          modo={modoPedido}
          formulario={
            formulario
          }
          clientes={clientes}
          productos={productos}
          manejarCambio={
            manejarCambio
          }
          agregarTalla={
            agregarTalla
          }
          cambiarTalla={
            cambiarTalla
          }
          eliminarTalla={
            eliminarTalla
          }
          guardarPedido={
            guardarPedido
          }
          cerrarModal={
            cerrarFormulario
          }
          cantidadTotal={
            cantidadTotal
          }
          totalPedido={
            totalPedido
          }
          saldoPendiente={
            saldoPendiente
          }
        />

      )}


      {mostrarDetalle &&
        pedidoSeleccionado && (

          <DetallePedidoModal
            pedido={
              pedidos.find(
                pedido =>
                  pedido.id ===
                  pedidoSeleccionado.id
              ) ||
              pedidoSeleccionado
            }
            claseEstado={
              claseEstado
            }
            cerrarModal={
              cerrarDetalle
            }
          />

        )}

    </section>

  )

}


export default Pedidos
