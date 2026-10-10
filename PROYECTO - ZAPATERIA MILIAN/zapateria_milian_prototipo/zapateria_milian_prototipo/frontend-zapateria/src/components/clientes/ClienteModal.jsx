function ClienteModal({
  modo,
  formulario,
  manejarCambio,
  guardarCliente,
  cerrarModal
}) {
  const titulo =
    modo === 'editar'
      ? 'Editar cliente'
      : 'Registrar cliente'


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
          Clientes
        </p>

        <h3 className="modal-title">
          {titulo}
        </h3>


        <form onSubmit={guardarCliente}>

          <div className="form-grid">

            <div className="form-group full-row">

              <label>
                Nombre
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
                Teléfono
              </label>

              <input
                type="text"
                name="telefono"
                value={formulario.telefono}
                onChange={manejarCambio}
                required
              />

            </div>


            <div className="form-group">

              <label>
                Correo
              </label>

              <input
                type="email"
                name="correo"
                value={formulario.correo}
                onChange={manejarCambio}
              />

            </div>


            <div className="form-group full-row">

              <label>
                Dirección
              </label>

              <input
                type="text"
                name="direccion"
                value={formulario.direccion}
                onChange={manejarCambio}
              />

            </div>


            <div className="form-group">

              <label>
                NIT
              </label>

              <input
                type="text"
                name="nit"
                value={formulario.nit}
                onChange={manejarCambio}
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
                : 'Registrar cliente'}
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default ClienteModal