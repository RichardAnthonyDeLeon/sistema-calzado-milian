import { useState } from 'react'


function NuevoProductoModal({
  modo,
  producto,
  guardarProducto,
  cerrarModal
}) {

  const [formulario, setFormulario] =
    useState({
      nombre:
        producto?.nombre || '',

      categoria:
        producto?.categoria || '',

      precioBase:
        producto?.precioBase || '',

      descripcion:
        producto?.descripcion || '',

      imagen:
        producto?.imagen || ''
    })


  const titulo =
    modo === 'editar'
      ? 'Editar producto'
      : 'Registrar producto'


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


  function manejarSubmit(evento) {

    evento.preventDefault()

    guardarProducto(formulario)
  }


  return (

    <div className="modal show">

      <div
        className="modal-backdrop"
        onClick={cerrarModal}
      />


      <div className="modal-card">

        <button
          type="button"
          className="modal-close"
          onClick={cerrarModal}
        >
          ×
        </button>


        <p className="eyebrow">
          Productos
        </p>

        <h3 className="modal-title">
          {titulo}
        </h3>


        <form onSubmit={manejarSubmit}>

          <div className="form-grid">

            <div className="form-group full-row">

              <label>
                Nombre del modelo
              </label>

              <input
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={manejarCambio}
                required
              />

            </div>


            <div className="form-group">

              <label>
                Categoría
              </label>

              <select
                name="categoria"
                value={formulario.categoria}
                onChange={manejarCambio}
                required
              >

                <option value="">
                  Seleccionar
                </option>

                <option value="Formal">
                  Formal
                </option>

                <option value="Casual">
                  Casual
                </option>

                <option value="Botín">
                  Botín
                </option>

                <option value="Escolar">
                  Escolar
                </option>

              </select>

            </div>


            <div className="form-group">

              <label>
                Precio base
              </label>

              <input
                type="number"
                name="precioBase"
                min="0"
                step="0.01"
                value={formulario.precioBase}
                onChange={manejarCambio}
                required
              />

            </div>


            <div className="form-group full-row">

              <label>
                Descripción
              </label>

              <textarea
                name="descripcion"
                value={formulario.descripcion}
                onChange={manejarCambio}
                rows="3"
              />

            </div>


            <div className="form-group full-row">

              <label>
                Imagen
              </label>

              <input
                type="text"
                name="imagen"
                value={formulario.imagen}
                onChange={manejarCambio}
                placeholder="URL o referencia de imagen"
              />

            </div>

          </div>


          <div className="form-actions">

            <button
              type="button"
              className="btn btn-outline"
              onClick={cerrarModal}
            >
              Cancelar
            </button>


            <button
              type="submit"
              className="btn btn-gold"
            >
              {modo === 'editar'
                ? 'Guardar cambios'
                : 'Registrar producto'}
            </button>

          </div>

        </form>

      </div>

    </div>

  )
}


export default NuevoProductoModal