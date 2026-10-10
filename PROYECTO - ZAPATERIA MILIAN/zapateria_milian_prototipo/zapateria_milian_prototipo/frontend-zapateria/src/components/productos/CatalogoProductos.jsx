import TarjetaProducto from './TarjetaProducto'

function CatalogoProductos({
  productos,
  abrirFichaTecnica,
  abrirVariantes,
  abrirVariante,
  abrirEditar,
  cambiarEstado
}) {
  return (
    <div className="product-grid">

      {productos.map(producto => (

        <TarjetaProducto
          key={producto.id}
          producto={producto}
          abrirFichaTecnica={abrirFichaTecnica}
          abrirVariantes={abrirVariantes}
          abrirVariante={abrirVariante}
          abrirEditar={abrirEditar}
          cambiarEstado={cambiarEstado}
        />

      ))}

      {productos.length === 0 && (

        <div className="panel empty-table">
          No hay productos registrados.
        </div>

      )}

    </div>
  )
}

export default CatalogoProductos
