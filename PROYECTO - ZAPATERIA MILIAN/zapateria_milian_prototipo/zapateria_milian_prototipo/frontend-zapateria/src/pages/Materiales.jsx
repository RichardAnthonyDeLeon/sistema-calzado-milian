import { useEffect, useState } from 'react'

import ResumenMateriales from '../components/materiales/ResumenMateriales'
import TablaMateriales from '../components/materiales/TablaMateriales'
import NuevoMaterialModal from '../components/materiales/NuevoMaterialModal'
import EntradaMaterialModal from '../components/materiales/EntradaMaterialModal'


function Materiales() {

  // =========================
  // DATOS
  // =========================

const [proveedores, setProveedores] = useState([]) 

const [materiales, setMateriales] = useState([])

useEffect(() => {
  cargarMateriales()
  cargarProveedores()
}, [])

async function cargarProveedores() {

  try {

    const respuesta = await fetch(
      'http://localhost:3000/api/proveedores'
    )

    const resultado = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(resultado.message)
    }

    setProveedores(
      resultado.data
        .filter(
          proveedor =>
            proveedor.estado === 'ACTIVO'
        )
        .map(proveedor => ({
          id: proveedor.id_proveedor,
          nombre: proveedor.nombre
        }))
    )

  } catch (error) {

    console.error(
      'Error al cargar proveedores:',
      error
    )

  }

}

async function cargarMateriales() {

  try {

    const respuesta = await fetch(
      'http://localhost:3000/api/materiales'
    )

    const resultado =
      await respuesta.json()


    if (!respuesta.ok) {
      throw new Error(
        resultado.message
      )
    }


    const materialesFormateados =
      resultado.data.map(material => ({

        id:
          material.id_material,

        nombre:
          material.nombre,

        unidad:
          material.tbl_unidades_medida?.abreviatura || '',

        existencia:
          Number(material.existencia_actual),

        minimo:
          Number(material.existencia_minima),

        costo:
          Number(material.costo_referencia),

        descripcion:
          material.descripcion || '',

        activo:
          material.estado === 'ACTIVO'

      }))


    setMateriales(
      materialesFormateados
    )


  } catch (error) {

    console.error(
      'Error al cargar materiales:',
      error
    )

  }

}

  // =========================
  // BÚSQUEDA
  // =========================

  const [busqueda, setBusqueda] =
    useState('')


  // =========================
  // MODAL MATERIAL
  // =========================

  const [mostrarNuevoMaterial, setMostrarNuevoMaterial] =
    useState(false)


  const [modoMaterial, setModoMaterial] =
    useState('nuevo')


  const [materialSeleccionado, setMaterialSeleccionado] =
    useState(null)


  const formularioMaterialInicial = {
    nombre: '',
    unidad: '',
    existencia: '',
    minimo: '',
    costo: '',
    descripcion: ''
  }


  const [formularioMaterial, setFormularioMaterial] =
    useState(formularioMaterialInicial)


  // =========================
  // MODAL ENTRADA
  // =========================

  const [mostrarEntrada, setMostrarEntrada] =
    useState(false)


  const [materialEntrada, setMaterialEntrada] =
    useState(null)


  const formularioEntradaInicial = {
    materialId: '',
    proveedor: '',
    cantidad: '',
    costoTotal: '',
    observaciones: ''
  }


  const [formularioEntrada, setFormularioEntrada] =
    useState(formularioEntradaInicial)


  // =========================
  // FILTRAR MATERIALES
  // =========================

  const materialesFiltrados =
    materiales.filter(material => {

      const texto =
        busqueda.toLowerCase()


      return (
        material.nombre
          .toLowerCase()
          .includes(texto) ||

        material.unidad
          .toLowerCase()
          .includes(texto)
      )

    })


  // =========================
  // ESTADO DEL STOCK
  // =========================

  function obtenerEstado(material) {

    if (
      material.existencia <=
      material.minimo * 0.5
    ) {
      return 'Bajo'
    }


    if (
      material.existencia <=
      material.minimo
    ) {
      return 'Atención'
    }


    return 'Normal'

  }


  // =========================
  // RESUMEN
  // =========================

  const totalMateriales =
    materiales.length


  const materialesStockBajo =
    materiales.filter(material =>
      material.activo &&
      material.existencia <= material.minimo
    ).length


  const valorInventario =
    materiales.reduce(
      (total, material) => {

        if (!material.activo) {
          return total
        }


        return (
          total +
          Number(material.existencia) *
          Number(material.costo)
        )

      },
      0
    )


  // =========================
  // ABRIR NUEVO MATERIAL
  // =========================

  function abrirNuevoMaterial() {

    setModoMaterial('nuevo')

    setMaterialSeleccionado(null)

    setFormularioMaterial(
      formularioMaterialInicial
    )

    setMostrarNuevoMaterial(true)

  }


  // =========================
  // EDITAR MATERIAL
  // =========================

  function abrirEditar(material) {

    setModoMaterial('editar')

    setMaterialSeleccionado(material)

    setFormularioMaterial({
      nombre: material.nombre,
      unidad: material.unidad,
      existencia: material.existencia,
      minimo: material.minimo,
      costo: material.costo,
      descripcion:
        material.descripcion || ''
    })

    setMostrarNuevoMaterial(true)

  }


  // =========================
  // CERRAR MATERIAL
  // =========================

  function cerrarNuevoMaterial() {

    setMostrarNuevoMaterial(false)

    setModoMaterial('nuevo')

    setMaterialSeleccionado(null)

    setFormularioMaterial(
      formularioMaterialInicial
    )

  }


  // =========================
  // CAMBIO FORMULARIO MATERIAL
  // =========================

  function manejarCambioMaterial(evento) {

    const {
      name,
      value
    } = evento.target


    setFormularioMaterial({
      ...formularioMaterial,
      [name]: value
    })

  }


  // =========================
  // GUARDAR MATERIAL
  // =========================

async function guardarMaterial(evento) {

  evento.preventDefault()


  if (
    !formularioMaterial.nombre ||
    !formularioMaterial.unidad
  ) {
    return
  }


  try {

    const datosMaterial = {

      nombre:
        formularioMaterial.nombre,

      unidad:
        formularioMaterial.unidad,

      existencia:
        Number(
          formularioMaterial.existencia
        ),

      minimo:
        Number(
          formularioMaterial.minimo
        ),

      costo:
        Number(
          formularioMaterial.costo
        ),

      descripcion:
        formularioMaterial.descripcion

    }


    if (
      modoMaterial === 'editar' &&
      materialSeleccionado
    ) {

      const respuesta = await fetch(

        `http://localhost:3000/api/materiales/${materialSeleccionado.id}`,

        {

          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify(
              datosMaterial
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


      await cargarMateriales()

      cerrarNuevoMaterial()

      return

    }


    const respuesta = await fetch(

      'http://localhost:3000/api/materiales',

      {

        method: 'POST',

        headers: {
          'Content-Type':
            'application/json'
        },

        body:
          JSON.stringify(
            datosMaterial
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


    await cargarMateriales()

    cerrarNuevoMaterial()


  } catch (error) {

    console.error(
      'Error al guardar material:',
      error
    )

  }

}


  // =========================
  // DESACTIVAR / REACTIVAR
  // =========================

async function cambiarEstado(material) {

  try {

    const nuevoEstado =
      material.activo
        ? 'INACTIVO'
        : 'ACTIVO'


    const respuesta = await fetch(

      `http://localhost:3000/api/materiales/${material.id}`,

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


    await cargarMateriales()


  } catch (error) {

    console.error(
      'Error al cambiar estado del material:',
      error
    )

  }

}


  // =========================
  // ABRIR ENTRADA GLOBAL
  // =========================

  function abrirEntradaGeneral() {

    setMaterialEntrada(null)

    setFormularioEntrada(
      formularioEntradaInicial
    )

    setMostrarEntrada(true)

  }


  // =========================
  // CERRAR ENTRADA
  // =========================

  function cerrarEntrada() {

    setMostrarEntrada(false)

    setMaterialEntrada(null)

    setFormularioEntrada(
      formularioEntradaInicial
    )

  }


  // =========================
  // CAMBIO FORMULARIO ENTRADA
  // =========================

  function manejarCambioEntrada(evento) {

    const {
      name,
      value
    } = evento.target


    setFormularioEntrada({
      ...formularioEntrada,
      [name]: value
    })


    // Si se selecciona otro material
    // desde el modal global

    if (
      name === 'materialId'
    ) {

      const material =
        materiales.find(
          item =>
            item.id === Number(value)
        )


      setMaterialEntrada(
        material || null
      )

    }

  }


  // =========================
  // GUARDAR ENTRADA
  // =========================

async function guardarEntrada(evento) {

  evento.preventDefault()


  const idMaterial =
    Number(
      formularioEntrada.materialId
    )

  const idProveedor =
    Number(
      formularioEntrada.proveedor
    )

  const cantidad =
    Number(
      formularioEntrada.cantidad
    )

  const costoTotal =
    Number(
      formularioEntrada.costoTotal
    )


  if (
    !idMaterial ||
    !idProveedor ||
    cantidad <= 0
  ) {
    return
  }


  try {

    const respuesta = await fetch(
      'http://localhost:3000/api/materiales/entrada',
      {

        method: 'POST',

        headers: {
          'Content-Type':
            'application/json'
        },

        body: JSON.stringify({

          id_material:
            idMaterial,

          id_proveedor:
            idProveedor,

          cantidad:
            cantidad,

          costo_total:
            costoTotal,

          observaciones:
            formularioEntrada.observaciones

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


    await cargarMateriales()

    cerrarEntrada()


  } catch (error) {

    console.error(
      'Error al registrar entrada:',
      error
    )

  }

}


  // =========================
  // INTERFAZ
  // =========================

function seleccionarMaterialEntrada(id) {

  const material =
    materiales.find(
      item => item.id === Number(id)
    )

  setMaterialEntrada(
    material || null
  )

  setFormularioEntrada({
    ...formularioEntrada,
    materialId: id
  })

}

  return (
    <section>

      <div className="page-actions">

        <div>

          <p className="eyebrow">
            Materiales
          </p>

          <h3>
            Inventario de materiales
          </h3>

        </div>


        <div className="product-actions">

          <button
            className="btn btn-outline"
            onClick={
              abrirEntradaGeneral
            }
          >
            + Entrada de material
          </button>


          <button
            className="btn btn-gold"
            onClick={
              abrirNuevoMaterial
            }
          >
            + Nuevo material
          </button>

        </div>

      </div>


      <ResumenMateriales
        totalMateriales={totalMateriales}
        materialesBajoStock={materialesStockBajo}
        valorInventario={valorInventario}
      />


        <TablaMateriales
      materiales={materialesFiltrados}
      busqueda={busqueda}
      setBusqueda={setBusqueda}
      abrirEditar={abrirEditar}
      cambiarEstado={cambiarEstado}
      obtenerEstado={obtenerEstado}
    />

      {mostrarNuevoMaterial && (

        <NuevoMaterialModal
          modo={
            modoMaterial
          }
          formulario={
            formularioMaterial
          }
          manejarCambio={
            manejarCambioMaterial
          }
          guardarMaterial={
            guardarMaterial
          }
          cerrarModal={
            cerrarNuevoMaterial
          }
        />

      )}


      {mostrarEntrada && (

      <EntradaMaterialModal

        materiales={
          materiales.filter(
            material => material.activo
          )
        }

        proveedores={
          proveedores
        }

        materialSeleccionado={
          materialEntrada
        }

        formulario={
          formularioEntrada
        }

        seleccionarMaterial={
          seleccionarMaterialEntrada
        }

        manejarCambio={
          manejarCambioEntrada
        }

        guardarEntrada={
          guardarEntrada
        }

        cerrarModal={
          cerrarEntrada
        }

      />

      )}

    </section>
  )

  
}

export default Materiales