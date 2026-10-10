import { useEffect, useState } from 'react'

import ResumenClientes from '../components/clientes/ResumenClientes'
import TablaClientes from '../components/clientes/TablaClientes'
import ClienteModal from '../components/clientes/ClienteModal'


function Clientes() {

const [clientes, setClientes] = useState([])

useEffect(() => {
  cargarClientes()
}, [])


async function cargarClientes() {

  try {

    const respuesta = await fetch(
      'http://localhost:3000/api/clientes'
    )

    const resultado = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(resultado.message)
    }


    const clientesFormateados =
      resultado.data.map(cliente => ({

        id: cliente.id_cliente,

        nombre: cliente.nombre,

        telefono: cliente.telefono || '',

        correo: cliente.correo || '',

        direccion: cliente.direccion || '',

        nit: cliente.nit || '',

        activo: cliente.estado === 'ACTIVO'

      }))


    setClientes(clientesFormateados)

  } catch (error) {

    console.error(
      'Error al cargar clientes:',
      error
    )

  }

}

  const [busqueda, setBusqueda] =
    useState('')


  const [mostrarModal, setMostrarModal] =
    useState(false)


  const [modo, setModo] =
    useState('nuevo')


  const [clienteSeleccionado, setClienteSeleccionado] =
    useState(null)


  const formularioInicial = {
    nombre: '',
    telefono: '',
    correo: '',
    direccion: '',
    nit: ''
  }


  const [formulario, setFormulario] =
    useState(formularioInicial)


  // =========================
  // FILTRO
  // =========================

  const clientesFiltrados =
    clientes.filter(cliente => {

      const texto =
        busqueda.toLowerCase()


      return (
        cliente.nombre
          .toLowerCase()
          .includes(texto) ||

        cliente.telefono
          .toLowerCase()
          .includes(texto) ||

        cliente.correo
          .toLowerCase()
          .includes(texto) ||

        cliente.nit
          .toLowerCase()
          .includes(texto)
      )

    })


  // =========================
  // RESUMEN
  // =========================

  const totalClientes =
    clientes.length


  const clientesActivos =
    clientes.filter(
      cliente => cliente.activo
    ).length


  const clientesInactivos =
    clientes.filter(
      cliente => !cliente.activo
    ).length


  // =========================
  // NUEVO CLIENTE
  // =========================

  function abrirNuevo() {

    setModo('nuevo')

    setClienteSeleccionado(null)

    setFormulario(
      formularioInicial
    )

    setMostrarModal(true)

  }



  // =========================
  // EDITAR CLIENTE
  // =========================

  function abrirEditar(cliente) {

    setModo('editar')

    setClienteSeleccionado(
      cliente
    )

    setFormulario({
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      correo: cliente.correo,
      direccion: cliente.direccion,
      nit: cliente.nit
    })

    setMostrarModal(true)

  }


  // =========================
  // CERRAR MODAL
  // =========================

  function cerrarModal() {

    setMostrarModal(false)

    setClienteSeleccionado(null)

    setFormulario(
      formularioInicial
    )

    setModo('nuevo')

  }


  // =========================
  // CAMBIOS FORMULARIO
  // =========================

  function manejarCambio(evento) {

    const {
      name,
      value
    } = evento.target


    setFormulario({
      ...formulario,
      [name]: value
    })

  }


  // =========================
  // GUARDAR CLIENTE
  // =========================

async function guardarCliente(evento) {

  evento.preventDefault()


  if (
    !formulario.nombre ||
    !formulario.telefono
  ) {
    return
  }


  try {

    const datosCliente = {

      nombre: formulario.nombre,

      telefono: formulario.telefono,

      correo: formulario.correo,

      direccion: formulario.direccion,

      nit: formulario.nit

    }


    if (
      modo === 'editar' &&
      clienteSeleccionado
    ) {

      const respuesta = await fetch(
        `http://localhost:3000/api/clientes/${clienteSeleccionado.id}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify(
            datosCliente
          )
        }
      )


      const resultado =
        await respuesta.json()


      if (!respuesta.ok) {
        throw new Error(
          resultado.message
        )
      }


      await cargarClientes()

      cerrarModal()

      return
    }


    const respuesta = await fetch(
      'http://localhost:3000/api/clientes',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(
          datosCliente
        )
      }
    )


    const resultado =
      await respuesta.json()


    if (!respuesta.ok) {
      throw new Error(
        resultado.message
      )
    }


    await cargarClientes()

    cerrarModal()


  } catch (error) {

    console.error(
      'Error al guardar cliente:',
      error
    )

  }

}


  // =========================
  // DESACTIVAR / REACTIVAR
  // =========================

async function cambiarEstado(cliente) {

  try {

    const nuevoEstado =
      cliente.activo
        ? 'INACTIVO'
        : 'ACTIVO'


    const respuesta = await fetch(
      `http://localhost:3000/api/clientes/${cliente.id}`,
      {
        method: 'PUT',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          estado: nuevoEstado
        })
      }
    )


    const resultado =
      await respuesta.json()


    if (!respuesta.ok) {
      throw new Error(
        resultado.message
      )
    }


    await cargarClientes()


  } catch (error) {

    console.error(
      'Error al cambiar estado:',
      error
    )

  }

}

  // =========================
  // INTERFAZ
  // =========================

  return (
    <section>

      <div className="page-actions">

        <div>

          <p className="eyebrow">
            Clientes
          </p>

          <h3>
            Gestión de clientes
          </h3>

        </div>


        <button
          className="btn btn-gold"
          onClick={abrirNuevo}
        >
          + Nuevo cliente
        </button>

      </div>


      <ResumenClientes
        totalClientes={
          totalClientes
        }
        clientesActivos={
          clientesActivos
        }
        clientesInactivos={
          clientesInactivos
        }
      />


      <TablaClientes
        clientes={clientesFiltrados}
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        abrirEditar={abrirEditar}
        cambiarEstado={cambiarEstado}
      />

      {mostrarModal && (

        <ClienteModal
          modo={
            modo
          }
          formulario={
            formulario
          }
          manejarCambio={
            manejarCambio
          }
          guardarCliente={
            guardarCliente
          }
          cerrarModal={
            cerrarModal
          }
        />

      )}

    </section>
  )
}

export default Clientes