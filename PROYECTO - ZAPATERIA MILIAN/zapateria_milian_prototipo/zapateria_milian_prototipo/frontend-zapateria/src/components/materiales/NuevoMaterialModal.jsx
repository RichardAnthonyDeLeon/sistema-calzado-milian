function NuevoMaterialModal({
  modo,
  formulario,
  manejarCambio,
  guardarMaterial,
  cerrarModal
}) {
  const titulo =
    modo === 'editar'
      ? 'Editar material'
      : 'Registrar material'


  return (
    <div className="modal show">

      <div
        className="modal-backdrop"
        onClick={cerrarModal}
      />


      <div className="modal-card">

        <button
          className="modal-close"
          onClick={cerrarModal}
        >
          ×
        </button>


        <p className="eyebrow">
          Materiales
        </p>

        <h3 className="modal-title">
          {titulo}
        </h3>


        <form onSubmit={guardarMaterial}>

          <div className="form-grid">

            <div className="form-group full-row">

              <label>
                Nombre del material
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
                Unidad de medida
              </label>

              <select
                name="unidad"
                value={formulario.unidad}
                onChange={manejarCambio}
                required
              >
                <option value="">
                  Seleccionar
                </option>

                <option value="m²">
                  m²
                </option>

                <option value="par">
                  Par
                </option>

                <option value="unidad">
                  Unidad
                </option>

                <option value="L">
                  Litro
                </option>

                <option value="m">
                  Metro
                </option>

                <option value="kg">
                  Kilogramo
                </option>
              </select>

            </div>


            <div className="form-group">

              <label>
                Existencia inicial
              </label>

              <input
                type="number"
                name="existencia"
                min="0"
                step="0.01"
                value={formulario.existencia}
                onChange={manejarCambio}
                required
              />

            </div>


            <div className="form-group">

              <label>
                Stock mínimo
              </label>

              <input
                type="number"
                name="minimo"
                min="0"
                step="0.01"
                value={formulario.minimo}
                onChange={manejarCambio}
                required
              />

            </div>


            <div className="form-group">

              <label>
                Costo unitario
              </label>

              <input
                type="number"
                name="costo"
                min="0"
                step="0.01"
                value={formulario.costo}
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
                : 'Registrar material'}
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default NuevoMaterialModal