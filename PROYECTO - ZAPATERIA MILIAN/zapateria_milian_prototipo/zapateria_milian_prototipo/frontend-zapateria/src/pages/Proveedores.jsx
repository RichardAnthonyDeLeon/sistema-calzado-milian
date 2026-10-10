import { useEffect, useState } from 'react'

import ResumenProveedores from '../components/proveedores/ResumenProveedores'
import TablaProveedores from '../components/proveedores/TablaProveedores'
import ProveedorModal from '../components/proveedores/ProveedorModal'


function Proveedores() {

const [proveedores, setProveedores] = useState([])

useEffect(() => {
  cargarProveedores()
}, [])


async function cargarProveedores() {

  try {

    const respuesta = await fetch(
      'http://localhost:3000/api/proveedores'
    )

    const resultado =
      await respuesta.json()


    if (!respuesta.ok) {
      throw new Error(
        resultado.message
      )
    }


    const proveedoresFormateados =
      resultado.data.map(proveedor => ({

        id:
          proveedor.id_proveedor,

        nombre:
          proveedor.nombre,

        contacto:
          proveedor.contacto || '',

        telefono:
          proveedor.telefono || '',

        correo:
          proveedor.correo || '',

        direccion:
          proveedor.direccion || '',

        nit:
          proveedor.nit || '',

        activo:
          proveedor.estado === 'ACTIVO'

      }))


    setProveedores(
      proveedoresFormateados
    )


  } catch (error) {

    console.error(
      'Error al cargar proveedores:',
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


  const [proveedorSeleccionado, setProveedorSeleccionado] =
    useState(null)


  const formularioInicial = {
    nombre: '',
    contacto: '',
    telefono: '',
    correo: '',
    direccion: '',
    nit: ''
  }


  const [formulario, setFormulario] =
    useState(formularioInicial)


  const proveedoresFiltrados =
    proveedores.filter(proveedor => {

      const texto =
        busqueda.toLowerCase()


      return (
        proveedor.nombre
          .toLowerCase()
          .includes(texto) ||

        proveedor.contacto
          .toLowerCase()
          .includes(texto) ||

        proveedor.telefono
          .toLowerCase()
          .includes(texto) ||

        proveedor.correo
          .toLowerCase()
          .includes(texto) ||

        proveedor.nit
          .toLowerCase()
          .includes(texto)
      )

    })


  const totalProveedores =
    proveedores.length


  const proveedoresActivos =
    proveedores.filter(
      proveedor => proveedor.activo
    ).length


  const proveedoresInactivos =
    proveedores.filter(
      proveedor => !proveedor.activo
    ).length


  function abrirNuevo() {

    setModo('nuevo')

    setProveedorSeleccionado(null)

    setFormulario(
      formularioInicial
    )

    setMostrarModal(true)

  }


  function abrirEditar(proveedor) {

    setModo('editar')

    setProveedorSeleccionado(
      proveedor
    )

    setFormulario({
      nombre: proveedor.nombre,
      contacto: proveedor.contacto,
      telefono: proveedor.telefono,
      correo: proveedor.correo,
      direccion: proveedor.direccion,
      nit: proveedor.nit
    })

    setMostrarModal(true)

  }


  function cerrarModal() {

    setMostrarModal(false)

    setProveedorSeleccionado(null)

    setFormulario(
      formularioInicial
    )

    setModo('nuevo')

  }


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


async function guardarProveedor(evento) {

  evento.preventDefault()


  if (
    !formulario.nombre ||
    !formulario.telefono
  ) {
    return
  }


  try {

    const datosProveedor = {

      nombre:
        formulario.nombre,

      contacto:
        formulario.contacto,

      telefono:
        formulario.telefono,

      correo:
        formulario.correo,

      direccion:
        formulario.direccion,

      nit:
        formulario.nit

    }


    if (
      modo === 'editar' &&
      proveedorSeleccionado
    ) {

      const respuesta = await fetch(

        `http://localhost:3000/api/proveedores/${proveedorSeleccionado.id}`,

        {

          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify(
              datosProveedor
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


      await cargarProveedores()

      cerrarModal()

      return

    }


    const respuesta = await fetch(

      'http://localhost:3000/api/proveedores',

      {

        method: 'POST',

        headers: {
          'Content-Type':
            'application/json'
        },

        body:
          JSON.stringify(
            datosProveedor
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


    await cargarProveedores()

    cerrarModal()


  } catch (error) {

    console.error(
      'Error al guardar proveedor:',
      error
    )

  }

}


async function cambiarEstado(proveedor) {

  try {

    const nuevoEstado =
      proveedor.activo
        ? 'INACTIVO'
        : 'ACTIVO'


    const respuesta = await fetch(

      `http://localhost:3000/api/proveedores/${proveedor.id}`,

      {

        method: 'PUT',

        headers: {
          'Content-Type':
            'application/json'
        },

        body:
          JSON.stringify({
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


    await cargarProveedores()


  } catch (error) {

    console.error(
      'Error al cambiar estado del proveedor:',
      error
    )

  }

}


  return (
    <section>

      <div className="page-actions">

        <div>

          <p className="eyebrow">
            Proveedores
          </p>

          <h3>
            Gestión de proveedores
          </h3>

        </div>


        <button
          className="btn btn-gold"
          onClick={abrirNuevo}
        >
          + Nuevo proveedor
        </button>

      </div>


      <ResumenProveedores
        totalProveedores={
          totalProveedores
        }
        proveedoresActivos={
          proveedoresActivos
        }
        proveedoresInactivos={
          proveedoresInactivos
        }
      />


      <TablaProveedores
        proveedores={
          proveedoresFiltrados
        }
        busqueda={
          busqueda
        }
        setBusqueda={
          setBusqueda
        }
        abrirEditar={
          abrirEditar
        }
        cambiarEstado={
          cambiarEstado
        }
      />


      {mostrarModal && (

        <ProveedorModal
          modo={
            modo
          }
          formulario={
            formulario
          }
          manejarCambio={
            manejarCambio
          }
          guardarProveedor={
            guardarProveedor
          }
          cerrarModal={
            cerrarModal
          }
        />

      )}

    </section>
  )
}

export default Proveedores