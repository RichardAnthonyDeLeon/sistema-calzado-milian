import { useEffect, useState } from 'react'

import ResumenProductos from '../components/productos/ResumenProductos'
import CatalogoProductos from '../components/productos/CatalogoProductos'
import NuevoProductoModal from '../components/productos/NuevoProductoModal'
import NuevaVarianteModal from '../components/productos/NuevaVarianteModal'
import VariantesProductoModal from '../components/productos/VariantesProductoModal'
import FichaTecnicaModal from '../components/productos/FichaTecnicaModal'

import ResumenTerminados from '../components/productos/ResumenTerminados'
import InventarioTerminados from '../components/productos/InventarioTerminados'

import {
  useInventarioTerminados
} from '../context/InventarioTerminadosContext'


function Productos() {
  const [productoFicha, setProductoFicha] = useState(null)

  // =========================
  // INVENTARIO COMPARTIDO
  // =========================

  const {
    inventarioTerminados
  } = useInventarioTerminados()


  // =========================
  // PRODUCTOS
  // =========================

    const [productos, setProductos] =
      useState([])

    const [materiales, setMateriales] =
      useState([])


  useEffect(() => {

  cargarProductos()
  cargarMateriales()

}, [])

async function cargarMateriales() {

  try {

    const respuesta =
      await fetch(
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
      resultado.data
        .filter(
          material =>
            material.estado ===
            'ACTIVO'
        )
        .map(
          material => ({
            id:
              material.id_material,

            nombre:
              material.nombre
          })
        )

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

//Carga los productos desde la API
async function cargarProductos() {

  try {

    const respuesta =
      await fetch(
        'http://localhost:3000/api/productos'
      )


    const resultado =
      await respuesta.json()


    if (!respuesta.ok) {

      throw new Error(
        resultado.message
      )

    }


    const productosFormateados =
      resultado.data.map(
        producto => ({

          id:
            producto.id_producto,

          nombre:
            producto.nombre,

          categoria:
            producto.categoria || '',

          precioBase:
            Number(
              producto.precio_venta
            ),

          descripcion:
            producto.descripcion || '',

          imagen:
            producto.imagen_url || '',

          activo:
            producto.estado ===
            'ACTIVO',

          variantes:
            (
              producto
                .tbl_variantes_producto ||
              []
            ).map(
              variante => ({

                id:
                  variante.id_variante,

                talla:
                  String(
                    variante.talla
                  ),

                color:
                  variante.color,

                material:
                  variante.material || '',

                suela:
                  variante.suela || '',

                precio:
                  Number(
                    variante.precio
                  ),

                stock:
                  Number(
                    variante
                      .existencia_actual
                  ),

                activo:
                  variante.estado ===
                  'ACTIVO'

              })
            )

        })
      )


    setProductos(
      productosFormateados
    )

  } catch (error) {

    console.error(
      'Error al cargar productos:',
      error
    )

  }

}

  // =========================
  // PRODUCTOS CON STOCK REAL
  // =========================

  const productosConStock =
    productos.map(producto => {

      return {

        ...producto,

        variantes:
          producto.variantes.map(
            variante => {

              const existencia =
                inventarioTerminados
                  .filter(item =>
                    item.destino ===
                      'Stock' &&

                    item.modelo ===
                      producto.nombre &&

                    item.talla ===
                      variante.talla &&

                    item.color ===
                      variante.color
                  )
                  .reduce(
                    (total, item) =>
                      total +
                      Number(
                        item.existencia
                      ),
                    0
                  )


              return {
                ...variante,
                stock:
                  existencia
              }
            }
          )
      }
    })


  // =========================
  // ESTADOS
  // =========================

  const [
    vistaProductos,
    setVistaProductos
  ] = useState('catalogo')


  const [
    busqueda,
    setBusqueda
  ] = useState('')


  const [
    busquedaTerminados,
    setBusquedaTerminados
  ] = useState('')


  const [
    mostrarProducto,
    setMostrarProducto
  ] = useState(false)


  const [
    modoProducto,
    setModoProducto
  ] = useState('nuevo')


  const [
    productoSeleccionado,
    setProductoSeleccionado
  ] = useState(null)


  const [
    productoVariante,
    setProductoVariante
  ] = useState(null)


  const [
    productoVariantes,
    setProductoVariantes
  ] = useState(null)


  // =========================
  // FILTRADO
  // =========================

  const productosFiltrados =
    productosConStock.filter(
      producto => {

        const texto =
          busqueda
            .toLowerCase()
            .trim()


        return (

          producto.nombre
            .toLowerCase()
            .includes(texto) ||

          producto.categoria
            .toLowerCase()
            .includes(texto) ||

          producto.descripcion
            .toLowerCase()
            .includes(texto)

        )
      }
    )


  // =========================
  // RESUMEN
  // =========================

  const totalProductos =
    productos.length


  const productosActivos =
    productos.filter(
      producto =>
        producto.activo
    ).length


  const totalVariantes =
    productos.reduce(
      (total, producto) =>
        total +
        producto.variantes.length,
      0
    )


  // =========================
  // NUEVO PRODUCTO
  // =========================

  function abrirNuevo() {

    setModoProducto(
      'nuevo'
    )

    setProductoSeleccionado(
      null
    )

    setMostrarProducto(
      true
    )
  }


  // =========================
  // EDITAR
  // =========================

  function abrirEditar(producto) {

    setModoProducto(
      'editar'
    )

    setProductoSeleccionado(
      producto
    )

    setMostrarProducto(
      true
    )
  }


  function cerrarProducto() {

    setMostrarProducto(
      false
    )

    setProductoSeleccionado(
      null
    )

    setModoProducto(
      'nuevo'
    )
  }


  // =========================
  // GUARDAR PRODUCTO
  // =========================

async function guardarProducto(datos) {

  const nombre =
    datos.nombre?.trim()

  const categoria =
    datos.categoria?.trim()

  const precioBase =
    Number(
      datos.precioBase
    )


  if (!nombre) {

    window.alert(
      'Ingresa el nombre del producto.'
    )

    return
  }


  if (!categoria) {

    window.alert(
      'Ingresa la categoría.'
    )

    return
  }


  if (
    !precioBase ||
    precioBase <= 0
  ) {

    window.alert(
      'Ingresa un precio válido.'
    )

    return
  }


  try {

    const editando =
      modoProducto === 'editar' &&
      productoSeleccionado


    const url =
      editando
        ? `http://localhost:3000/api/productos/${productoSeleccionado.id}`
        : 'http://localhost:3000/api/productos'


    const respuesta =
      await fetch(
        url,
        {

          method:
            editando
              ? 'PUT'
              : 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify({

              nombre,

              categoria,

              precioBase,

              descripcion:
                datos.descripcion || '',

              imagen:
                datos.imagen || ''

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


    await cargarProductos()

    cerrarProducto()

  } catch (error) {

    console.error(
      'Error al guardar producto:',
      error
    )

  }

}


  // =========================
  // ESTADO
  // =========================

async function cambiarEstado(
  producto
) {

  const accion =
    producto.activo
      ? 'desactivar'
      : 'reactivar'


  const confirmar =
    window.confirm(
      `¿Deseas ${accion} el producto ${producto.nombre}?`
    )


  if (!confirmar) {
    return
  }


  try {

    const respuesta =
      await fetch(
        `http://localhost:3000/api/productos/${producto.id}`,
        {

          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify({

              estado:
                producto.activo
                  ? 'INACTIVO'
                  : 'ACTIVO'

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


    await cargarProductos()

  } catch (error) {

    console.error(
      'Error al cambiar estado:',
      error
    )

  }

}


  // =========================
  // VARIANTES
  // =========================

  function abrirVariante(
    producto
  ) {

    if (!producto.activo) {
      return
    }


    const original =
      productos.find(
        item =>
          item.id ===
          producto.id
      )


    setProductoVariante(
      original ||
      producto
    )
  }


  function cerrarVariante() {

    setProductoVariante(
      null
    )
  }


async function guardarVariante(
  datos
) {

  if (!productoVariante) {
    return
  }


  const talla =
    datos.talla?.trim()

  const color =
    datos.color?.trim()

  const material =
    datos.material?.trim()

  const suela =
    datos.suela?.trim()

  const precio =
    Number(
      datos.precio
    )


  if (
    !talla ||
    !color ||
    !material ||
    !suela
  ) {

    window.alert(
      'Completa los datos de la variante.'
    )

    return
  }


  if (
    !precio ||
    precio <= 0
  ) {

    window.alert(
      'Ingresa un precio válido.'
    )

    return
  }


  try {

    const respuesta =
      await fetch(
        `http://localhost:3000/api/productos/${productoVariante.id}/variantes`,
        {

          method:
            'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify({

              talla,

              color,

              material,

              suela,

              precio
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


    await cargarProductos()

    cerrarVariante()

  } catch (error) {

    console.error(
      'Error al registrar variante:',
      error
    )

  }

}


  // =========================
  // VER VARIANTES
  // =========================

  function abrirVariantes(
    producto
  ) {

    setProductoVariantes(
      producto
    )
  }


  function cerrarVariantes() {

    setProductoVariantes(
      null
    )
  }


  return (

    <section>

      <div className="page-actions">

        <div>

          <p className="eyebrow">
            Productos
          </p>

          <h3>
            Gestión de productos
          </h3>

        </div>


        {vistaProductos ===
          'catalogo' && (

          <button
            className="btn btn-gold"
            onClick={
              abrirNuevo
            }
          >
            + Nuevo producto
          </button>

        )}

      </div>


      <div className="product-tabs">

        <button
          className={
            vistaProductos ===
            'catalogo'
              ? 'product-tab active'
              : 'product-tab'
          }
          onClick={() =>
            setVistaProductos(
              'catalogo'
            )
          }
        >
          Catálogo de productos
        </button>


        <button
          className={
            vistaProductos ===
            'inventario'
              ? 'product-tab active'
              : 'product-tab'
          }
          onClick={() =>
            setVistaProductos(
              'inventario'
            )
          }
        >
          Inventario terminado
        </button>

      </div>


      {vistaProductos ===
        'catalogo' && (

        <>

          <ResumenProductos
            totalProductos={
              totalProductos
            }
            productosActivos={
              productosActivos
            }
            totalVariantes={
              totalVariantes
            }
          />


          <CatalogoProductos
            abrirFichaTecnica={setProductoFicha}
            productos={
              productosFiltrados
            }
            busqueda={
              busqueda
            }
            setBusqueda={
              setBusqueda
            }
            abrirVariantes={
              abrirVariantes
            }
            abrirVariante={
              abrirVariante
            }
            abrirEditar={
              abrirEditar
            }
            cambiarEstado={
              cambiarEstado
            }
          />

        </>

      )}


      {vistaProductos ===
        'inventario' && (

        <>

          <ResumenTerminados
            inventario={
              inventarioTerminados
            }
          />


          <InventarioTerminados
            inventario={
              inventarioTerminados
            }
            busqueda={
              busquedaTerminados
            }
            setBusqueda={
              setBusquedaTerminados
            }
          />

        </>

      )}


      {productoFicha && (
        <FichaTecnicaModal
          key={productoFicha.id}
          producto={productoFicha}
          cerrarModal={() => setProductoFicha(null)}
        />
      )}

      {mostrarProducto && (

        <NuevoProductoModal
          modo={
            modoProducto
          }
          producto={
            productoSeleccionado
          }
          guardarProducto={
            guardarProducto
          }
          cerrarModal={
            cerrarProducto
          }
        />

      )}


      {productoVariante && (

      <NuevaVarianteModal
        producto={
          productoVariante
        }
        materiales={
          materiales
        }
        guardarVariante={
          guardarVariante
        }
        cerrarModal={
          cerrarVariante
        }
      />

      )}


      {productoVariantes && (

        <VariantesProductoModal
          producto={
            productosConStock.find(
              producto =>
                producto.id ===
                productoVariantes.id
            ) ||
            productoVariantes
          }
          cerrarModal={
            cerrarVariantes
          }
        />

      )}

    </section>

  )
}


export default Productos
