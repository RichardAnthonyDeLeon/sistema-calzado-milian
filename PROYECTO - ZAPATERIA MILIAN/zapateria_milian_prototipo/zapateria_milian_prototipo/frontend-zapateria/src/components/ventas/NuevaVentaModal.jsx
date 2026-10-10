import ResumenVenta from './ResumenVenta'


function NuevaVentaModal({
  formulario,
  manejarCambio,
  seleccionarPedido,
  seleccionarVariante,
  cambiarCantidadTalla,
  pedidos,
  variantes,
  pedidoSeleccionado,
  varianteSeleccionada,
  cantidadVenta,
  totalVenta,
  guardarVenta,
  cerrarModal
}) {

  return (
    <div className="modal show">

      <div
        className="modal-backdrop"
        onClick={cerrarModal}
      />


      <div className="modal-card venta-modal">

        <button
          className="modal-close"
          onClick={cerrarModal}
        >
          ×
        </button>


        <p className="eyebrow">
          Ventas
        </p>

        <h3 className="modal-title">
          Registrar venta
        </h3>


        <form onSubmit={guardarVenta}>

          <div className="venta-origin">

            <label
              className={
                formulario.origen === 'Pedido'
                  ? 'venta-origin-option active'
                  : 'venta-origin-option'
              }
            >

              <input
                type="radio"
                name="origen"
                value="Pedido"
                checked={
                  formulario.origen === 'Pedido'
                }
                onChange={manejarCambio}
              />

              <div>

                <strong>
                  Pedido
                </strong>

                <small>
                  Entrega relacionada con un pedido.
                </small>

              </div>

            </label>


            <label
              className={
                formulario.origen === 'Venta directa'
                  ? 'venta-origin-option active'
                  : 'venta-origin-option'
              }
            >

              <input
                type="radio"
                name="origen"
                value="Venta directa"
                checked={
                  formulario.origen === 'Venta directa'
                }
                onChange={manejarCambio}
              />

              <div>

                <strong>
                  Venta directa
                </strong>

                <small>
                  Producto disponible en inventario.
                </small>

              </div>

            </label>

          </div>


          {/* PEDIDO */}

          {formulario.origen === 'Pedido' && (

            <>

              <div className="form-group">

                <label>
                  Pedido
                </label>

                <select
                  value={formulario.pedidoId}
                  onChange={seleccionarPedido}
                  required
                >

                  <option value="">
                    Seleccionar pedido
                  </option>

                  {pedidos.map(
                    pedido => (

                      <option
                        key={pedido.id}
                        value={pedido.id}
                      >
                        {pedido.id} - {pedido.cliente}
                      </option>

                    )
                  )}

                </select>

              </div>


              {pedidoSeleccionado && (

                <>

                  <div className="venta-source-summary">

                    <div>

                      <small>
                        Cliente
                      </small>

                      <strong>
                        {pedidoSeleccionado.cliente}
                      </strong>

                    </div>


                    <div>

                      <small>
                        Modelo
                      </small>

                      <strong>
                        {pedidoSeleccionado.modelo}
                      </strong>

                    </div>


                    <div>

                      <small>
                        Precio acordado
                      </small>

                      <strong>
                        Q {Number(
                          pedidoSeleccionado.precioUnitario
                        ).toFixed(2)}
                      </strong>

                    </div>

                  </div>


                  <div className="venta-tallas-section">

                    <div>

                      <p className="eyebrow">
                        Entrega
                      </p>

                      <h3>
                        Tallas a entregar
                      </h3>

                      <p className="section-help">
                        Indica cuántos pares se entregarán de cada talla disponible.
                      </p>

                    </div>


                    <div className="table-wrap">

                      <table>

                        <thead>
                          <tr>
                            <th>Talla</th>
                            <th>Disponibles</th>
                            <th>Entregar</th>
                          </tr>
                        </thead>


                        <tbody>

                          {formulario.tallasEntrega.map(
                            item => (

                              <tr key={item.talla}>

                                <td>
                                  <strong>
                                    Talla {item.talla}
                                  </strong>
                                </td>


                                <td>
                                  {item.disponible} pares
                                </td>


                                <td>

                                  <input
                                    className="venta-size-input"
                                    type="number"
                                    min="0"
                                    max={item.disponible}
                                    value={item.cantidad}
                                    onChange={
                                      evento =>
                                        cambiarCantidadTalla(
                                          item.talla,
                                          evento.target.value
                                        )
                                    }
                                  />

                                </td>

                              </tr>

                            )
                          )}

                        </tbody>

                      </table>

                    </div>


                    <div className="pedido-total-pares">

                      <span>
                        Total a entregar
                      </span>

                      <strong>
                        {cantidadVenta} pares
                      </strong>

                    </div>

                  </div>

                </>

              )}

            </>

          )}


          {/* VENTA DIRECTA */}

          {formulario.origen === 'Venta directa' && (

            <>

              <div className="form-grid">

                <div className="form-group">

                  <label>
                    Cliente
                  </label>

                  <select
                    name="cliente"
                    value={formulario.cliente}
                    onChange={manejarCambio}
                  >

                    <option value="">
                      Consumidor final
                    </option>

                    <option value="Calzado El Centro">
                      Calzado El Centro
                    </option>

                    <option value="María López">
                      María López
                    </option>

                    <option value="Distribuidora Norte">
                      Distribuidora Norte
                    </option>

                  </select>

                </div>


                <div className="form-group">

                  <label>
                    Producto / variante
                  </label>

                  <select
                    value={formulario.varianteId}
                    onChange={seleccionarVariante}
                    required
                  >

                    <option value="">
                      Seleccionar producto
                    </option>

                    {variantes.map(
                      variante => (

                        <option
                          key={variante.id}
                          value={variante.id}
                        >
                          {variante.producto}
                          {' - '}
                          Talla {variante.talla}
                          {' - '}
                          {variante.color}
                        </option>

                      )
                    )}

                  </select>

                </div>

              </div>


              {varianteSeleccionada && (

                <div className="venta-source-summary">

                  <div>

                    <small>
                      Producto
                    </small>

                    <strong>
                      {varianteSeleccionada.producto}
                    </strong>

                  </div>


                  <div>

                    <small>
                      Talla
                    </small>

                    <strong>
                      {varianteSeleccionada.talla}
                    </strong>

                  </div>


                  <div>

                    <small>
                      Existencia
                    </small>

                    <strong>
                      {varianteSeleccionada.stock} pares
                    </strong>

                  </div>


                  <div>

                    <small>
                      Precio
                    </small>

                    <strong>
                      Q {Number(
                        varianteSeleccionada.precio
                      ).toFixed(2)}
                    </strong>

                  </div>

                </div>

              )}

            </>

          )}


          <div className="form-grid venta-form-section">

            <div className="form-group">

              <label>
                Fecha
              </label>

              <input
                type="date"
                name="fecha"
                value={formulario.fecha}
                onChange={manejarCambio}
                required
              />

            </div>


            {formulario.origen ===
              'Venta directa' && (

              <div className="form-group">

                <label>
                  Cantidad
                </label>

                <input
                  type="number"
                  name="cantidad"
                  min="1"
                  value={formulario.cantidad}
                  onChange={manejarCambio}
                  required
                />

              </div>

            )}


            <div className="form-group">

              <label>
                Precio unitario
              </label>

              <input
                type="text"
                value={
                  formulario.precioUnitario
                    ? `Q ${Number(
                        formulario.precioUnitario
                      ).toFixed(2)}`
                    : ''
                }
                placeholder="Automático"
                disabled
              />

            </div>


            <div className="form-group">

              <label>
                Tipo de pago
              </label>

              <select
                name="tipoPago"
                value={formulario.tipoPago}
                onChange={manejarCambio}
              >

                <option value="Contado">
                  Contado
                </option>

                <option value="Crédito">
                  Crédito
                </option>

              </select>

            </div>


            {formulario.tipoPago === 'Contado' && (

              <div className="form-group">

                <label>
                  Monto recibido
                </label>

                <input
                  type="number"
                  name="recibido"
                  min="0"
                  step="0.01"
                  value={formulario.recibido}
                  onChange={manejarCambio}
                  required
                />

              </div>

            )}


            {formulario.tipoPago === 'Crédito' && (

              <div className="form-group">

                <label>
                  Número de pagos
                </label>

                <input
                  type="number"
                  name="numeroPagos"
                  min="1"
                  value={formulario.numeroPagos}
                  onChange={manejarCambio}
                  required
                />

              </div>

            )}

          </div>


          <ResumenVenta
            cantidad={cantidadVenta}
            precioUnitario={formulario.precioUnitario}
            totalVenta={totalVenta}
          />


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
              Registrar venta
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}


export default NuevaVentaModal