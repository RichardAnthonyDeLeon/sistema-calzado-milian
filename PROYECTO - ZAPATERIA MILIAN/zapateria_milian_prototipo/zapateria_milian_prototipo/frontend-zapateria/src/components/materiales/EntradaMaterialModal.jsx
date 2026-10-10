function EntradaMaterialModal({
  materiales,
  proveedores,
  materialSeleccionado,
  formulario,
  seleccionarMaterial,
  manejarCambio,
  guardarEntrada,
  cerrarModal
}) {
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
          Inventario
        </p>

        <h3 className="modal-title">
          Registrar entrada de material
        </h3>


        <form onSubmit={guardarEntrada}>

          <div className="form-grid">

            <div className="form-group full-row">

              <label>
                Material
              </label>

              <select
                value={
                  materialSeleccionado?.id || ''
                }
                onChange={evento =>
                  seleccionarMaterial(
                    evento.target.value
                  )
                }
                required
              >

                <option value="">
                  Seleccione un material...
                </option>

                {materiales.map(material => (

                  <option
                    key={material.id}
                    value={material.id}
                  >
                    {material.nombre}
                    {' - '}
                    Existencia: {material.existencia} {material.unidad}
                  </option>

                ))}

              </select>

            </div>


            <div className="form-group">

              <label>
                Proveedor
              </label>

              <select
                name="proveedor"
                value={formulario.proveedor}
                onChange={manejarCambio}
                required
              >

                <option value="">
                  Seleccione...
                </option>

                {proveedores.map(proveedor => (

                  <option
                    key={proveedor.id}
                    value={proveedor.id}
                  >
                    {proveedor.nombre}
                  </option>

                ))}

              </select>

            </div>


            <div className="form-group">

              <label>
                Cantidad
              </label>

              <input
                type="number"
                name="cantidad"
                min="0.01"
                step="0.01"
                value={formulario.cantidad}
                onChange={manejarCambio}
                required
              />

            </div>


            <div className="form-group">

              <label>
                Costo total
              </label>

              <input
                type="number"
                name="costoTotal"
                min="0"
                step="0.01"
                value={formulario.costoTotal}
                onChange={manejarCambio}
                required
              />

            </div>


            <div className="form-group full-row">

              <label>
                Observaciones
              </label>

              <textarea
                rows="3"
                name="observaciones"
                value={formulario.observaciones}
                onChange={manejarCambio}
                placeholder="Información adicional de la entrada..."
              />

            </div>

          </div>


          {materialSeleccionado && (

            <div className="note">

              Existencia actual:{' '}

              <strong>
                {materialSeleccionado.existencia}{' '}
                {materialSeleccionado.unidad}
              </strong>

              {' · '}

              Nueva existencia:{' '}

              <strong>
                {
                  (
                    materialSeleccionado.existencia +
                    Number(
                      formulario.cantidad || 0
                    )
                  ).toFixed(2)
                }
                {' '}
                {materialSeleccionado.unidad}
              </strong>

            </div>

          )}


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
              disabled={!materialSeleccionado}
            >
              Registrar entrada
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default EntradaMaterialModal