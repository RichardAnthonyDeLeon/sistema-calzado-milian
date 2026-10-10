function ResumenVenta({
  cantidad,
  precioUnitario,
  totalVenta
}) {

  return (
    <div className="venta-calculation">

      <div>

        <small>
          Cantidad
        </small>

        <strong>
          {Number(cantidad) || 0} pares
        </strong>

      </div>


      <span className="venta-operation">
        ×
      </span>


      <div>

        <small>
          Precio unitario
        </small>

        <strong>
          Q {Number(
            precioUnitario || 0
          ).toFixed(2)}
        </strong>

      </div>


      <span className="venta-operation">
        =
      </span>


      <div className="venta-total">

        <small>
          Total
        </small>

        <strong>
          Q {Number(
            totalVenta
          ).toFixed(2)}
        </strong>

      </div>

    </div>
  )
}


export default ResumenVenta