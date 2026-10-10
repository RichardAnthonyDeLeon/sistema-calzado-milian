import ResumenEconomicoPedido
  from './ResumenEconomicoPedido'


function FormularioPedido({
  modo,
  formulario,
  clientes,
  productos,
  manejarCambio,
  agregarTalla,
  cambiarTalla,
  eliminarTalla,
  guardarPedido,
  cerrarModal,
  cantidadTotal,
  totalPedido,
  saldoPendiente
}) {

  const titulo =
    modo === 'editar'
      ? 'Editar pedido'
      : 'Registrar pedido'


  const esPersonalizado =
    formulario.tipoModelo ===
    'PERSONALIZADO'


  const productoSeleccionado =
    productos.find(
      producto =>
        String(
          producto.id_producto
        ) ===
        String(
          formulario.idProducto
        )
    )


  const variantes =
    productoSeleccionado
      ?.tbl_variantes_producto ||
    []


  return (

    <div className="modal show">

      <div
        className="modal-backdrop"
        onClick={cerrarModal}
      />


      <div className="modal-card pedido-modal">

        <button
          type="button"
          className="modal-close"
          onClick={cerrarModal}
        >
          ×
        </button>


        <p className="eyebrow">
          Pedidos
        </p>


        <h3 className="modal-title">
          {titulo}
        </h3>


        <form onSubmit={guardarPedido}>

          <div className="form-grid">

            <div className="form-group">

              <label>
                Cliente
              </label>


              <select
                name="idCliente"
                value={
                  formulario.idCliente
                }
                onChange={
                  manejarCambio
                }
                required
              >

                <option value="">
                  Seleccionar cliente
                </option>


                {clientes.map(
                  cliente => (

                    <option
                      key={
                        cliente.id_cliente
                      }
                      value={
                        cliente.id_cliente
                      }
                    >
                      {cliente.nombre}
                    </option>

                  )
                )}

              </select>

            </div>


            <div className="form-group">

              <label>
                Fecha de entrega
              </label>


              <input
                type="date"
                name="fechaEntrega"
                value={
                  formulario.fechaEntrega
                }
                onChange={
                  manejarCambio
                }
                required
              />

            </div>


            <div className="form-group">

              <label>
                Tipo de modelo
              </label>


              <select
                name="tipoModelo"
                value={
                  formulario.tipoModelo
                }
                onChange={
                  manejarCambio
                }
                disabled={
                  modo === 'editar'
                }
              >

                <option value="EXISTENTE">
                  Modelo existente
                </option>

                <option value="PERSONALIZADO">
                  Modelo personalizado
                </option>

              </select>

            </div>


            {!esPersonalizado && (

              <div className="form-group">

                <label>
                  Modelo
                </label>


                <select
                  name="idProducto"
                  value={
                    formulario.idProducto
                  }
                  onChange={
                    manejarCambio
                  }
                  required
                >

                  <option value="">
                    Seleccionar modelo
                  </option>


                  {productos.map(
                    producto => (

                      <option
                        key={
                          producto.id_producto
                        }
                        value={
                          producto.id_producto
                        }
                      >
                        {producto.nombre}
                      </option>

                    )
                  )}

                </select>

              </div>

            )}

          </div>


          {esPersonalizado && (

            <div className="pedido-custom-box">

              <div className="section-header-inline">

                <div>

                  <p className="eyebrow">
                    Personalización
                  </p>

                  <h3>
                    Características del modelo
                  </h3>

                </div>

              </div>


              <div className="form-grid">

                <div className="form-group">

                  <label>
                    Nombre del modelo
                  </label>


                  <input
                    type="text"
                    name="nombrePersonalizado"
                    value={
                      formulario
                        .nombrePersonalizado
                    }
                    onChange={
                      manejarCambio
                    }
                    placeholder="Ej. Botín especial"
                    required
                  />

                </div>


                <div className="form-group">

                  <label>
                    Categoría
                  </label>


                  <input
                    type="text"
                    name="categoria"
                    value={
                      formulario.categoria
                    }
                    onChange={
                      manejarCambio
                    }
                    placeholder="Ej. Botín"
                  />

                </div>


                <div className="form-group">

                  <label>
                    Color
                  </label>


                  <input
                    type="text"
                    name="color"
                    value={
                      formulario.color
                    }
                    onChange={
                      manejarCambio
                    }
                    placeholder="Ej. Negro"
                    required
                  />

                </div>


                <div className="form-group">

                  <label>
                    Material principal
                  </label>


                  <input
                    type="text"
                    name="material"
                    value={
                      formulario.material
                    }
                    onChange={
                      manejarCambio
                    }
                    placeholder="Ej. Cuero negro"
                    required
                  />

                </div>


                <div className="form-group">

                  <label>
                    Tipo de suela
                  </label>


                  <input
                    type="text"
                    name="suela"
                    value={
                      formulario.suela
                    }
                    onChange={
                      manejarCambio
                    }
                    placeholder="Ej. Formal"
                    required
                  />

                </div>


                <div className="form-group">

                  <label>
                    Color de suela
                  </label>


                  <input
                    type="text"
                    name="colorSuela"
                    value={
                      formulario.colorSuela
                    }
                    onChange={
                      manejarCambio
                    }
                    placeholder="Ej. Negro"
                    required
                  />

                </div>

              </div>

            </div>

          )}


          <div className="pedido-tallas-section">

            <div className="section-header-inline">

              <div>

                <p className="eyebrow">
                  Tallas
                </p>

                <h3>
                  Distribución de tallas
                </h3>

                <p className="section-help">

                  {esPersonalizado
                    ? 'Ingresa las tallas solicitadas para el modelo personalizado.'
                    : 'Selecciona las variantes registradas del modelo.'}

                </p>

              </div>


              <button
                type="button"
                className="btn btn-outline"
                onClick={agregarTalla}
                disabled={
                  !esPersonalizado &&
                  !formulario.idProducto
                }
              >
                + Agregar talla
              </button>

            </div>


            {!esPersonalizado &&
              !formulario.idProducto && (

                <p className="section-help">
                  Primero selecciona un modelo.
                </p>

              )}


            <div className="pedido-tallas-list">

              {formulario.tallas.map(
                item => {

                  const variantesUsadas =
                    formulario.tallas

                      .filter(
                        fila =>
                          fila.id !==
                          item.id
                      )

                      .map(
                        fila =>
                          String(
                            fila.idVariante
                          )
                      )


                  return (

                    <div
                      className="pedido-talla-row"
                      key={item.id}
                    >

                      <div className="form-group">

                        <label>
                          Talla
                        </label>


                        {esPersonalizado ? (

                          <input
                            type="number"
                            min="20"
                            max="50"
                            value={
                              item.talla
                            }
                            onChange={
                              evento =>
                                cambiarTalla(
                                  item.id,
                                  'talla',
                                  evento
                                    .target
                                    .value
                                )
                            }
                            required
                          />

                        ) : (

                          <select
                            value={
                              item.idVariante
                            }
                            onChange={
                              evento =>
                                cambiarTalla(
                                  item.id,
                                  'idVariante',
                                  evento
                                    .target
                                    .value
                                )
                            }
                            disabled={
                              !formulario
                                .idProducto
                            }
                            required
                          >

                            <option value="">
                              Seleccionar talla
                            </option>


                            {variantes

                              .filter(
                                variante =>
                                  !variantesUsadas
                                    .includes(
                                      String(
                                        variante
                                          .id_variante
                                      )
                                    ) ||
                                  String(
                                    variante
                                      .id_variante
                                  ) ===
                                  String(
                                    item
                                      .idVariante
                                  )
                              )

                              .map(
                                variante => (

                                  <option
                                    key={
                                      variante
                                        .id_variante
                                    }
                                    value={
                                      variante
                                        .id_variante
                                    }
                                  >
                                    Talla {variante.talla}
                                    {' - '}
                                    {variante.color}
                                  </option>

                                )
                              )}

                          </select>

                        )}

                      </div>


                      <div className="form-group">

                        <label>
                          Cantidad
                        </label>


                        <input
                          type="number"
                          min="1"
                          value={
                            item.cantidad
                          }
                          onChange={
                            evento =>
                              cambiarTalla(
                                item.id,
                                'cantidad',
                                evento
                                  .target
                                  .value
                              )
                          }
                          required
                        />

                      </div>


                      <button
                        type="button"
                        className="text-btn pedido-remove-size"
                        onClick={() =>
                          eliminarTalla(
                            item.id
                          )
                        }
                        disabled={
                          formulario
                            .tallas
                            .length ===
                          1
                        }
                      >
                        Eliminar
                      </button>

                    </div>

                  )

                }
              )}

            </div>


            <div className="pedido-total-pares">

              <span>
                Total solicitado
              </span>

              <strong>
                {cantidadTotal} pares
              </strong>

            </div>

          </div>


          <div className="form-grid">

            <div className="form-group">

              <label>
                Precio unitario
              </label>


              <input
                type="number"
                name="precioUnitario"
                min="0.01"
                step="0.01"
                value={
                  formulario
                    .precioUnitario
                }
                onChange={
                  manejarCambio
                }
                readOnly={
                  !esPersonalizado
                }
                required
              />

            </div>


            <div className="form-group">

              <label>
                Anticipo
              </label>


              <input
                type="number"
                name="anticipo"
                min="0"
                step="0.01"
                value={
                  formulario.anticipo
                }
                onChange={
                  manejarCambio
                }
              />

            </div>


            <div className="form-group full-row">

              <label>
                Observaciones del pedido
              </label>


              <textarea
                name="descripcion"
                value={
                  formulario.descripcion
                }
                onChange={
                  manejarCambio
                }
                rows="4"
                placeholder="Indicaciones especiales del cliente..."
              />

            </div>

          </div>


          <ResumenEconomicoPedido
            totalPedido={
              totalPedido
            }
            anticipo={
              formulario.anticipo
            }
            saldoPendiente={
              saldoPendiente
            }
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
              {modo === 'editar'
                ? 'Guardar cambios'
                : 'Registrar pedido'}
            </button>

          </div>

        </form>

      </div>

    </div>

  )

}


export default FormularioPedido