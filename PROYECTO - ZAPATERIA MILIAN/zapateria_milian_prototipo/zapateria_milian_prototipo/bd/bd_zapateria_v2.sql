-- =============================================================
-- BASE DE DATOS: Calzado Milian - Backend V2
-- Motor: MySQL 8.0+
-- Enfoque: pedidos -> materiales -> produccion -> inventario -> venta -> credito
-- =============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP DATABASE IF EXISTS bd_zapateria;
CREATE DATABASE bd_zapateria
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE bd_zapateria;

-- =============================================================
-- 1. SEGURIDAD Y USUARIOS
-- =============================================================

CREATE TABLE tbl_roles (
  id_rol INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre_rol VARCHAR(50) NOT NULL,
  descripcion VARCHAR(255),
  estado ENUM('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  CONSTRAINT uq_roles_nombre UNIQUE (nombre_rol)
) ENGINE=InnoDB;

CREATE TABLE tbl_usuarios (
  id_usuario INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_rol INT UNSIGNED NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  nombre_usuario VARCHAR(50) NOT NULL,
  contrasena VARCHAR(255) NOT NULL COMMENT 'Guardar hash, nunca texto plano',
  estado ENUM('ACTIVO','INACTIVO','BLOQUEADO') NOT NULL DEFAULT 'ACTIVO',
  fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_usuarios_nombre_usuario UNIQUE (nombre_usuario),
  CONSTRAINT fk_usuarios_roles FOREIGN KEY (id_rol)
    REFERENCES tbl_roles(id_rol)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =============================================================
-- 2. MAESTROS
-- =============================================================

CREATE TABLE tbl_clientes (
  id_cliente INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  telefono VARCHAR(25),
  direccion VARCHAR(255),
  observaciones VARCHAR(500),
  estado ENUM('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE tbl_proveedores (
  id_proveedor INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  telefono VARCHAR(25),
  direccion VARCHAR(255),
  observaciones VARCHAR(500),
  estado ENUM('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE tbl_unidades_medida (
  id_unidad INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  abreviatura VARCHAR(10) NOT NULL,
  CONSTRAINT uq_unidades_nombre UNIQUE (nombre),
  CONSTRAINT uq_unidades_abreviatura UNIQUE (abreviatura)
) ENGINE=InnoDB;

CREATE TABLE tbl_materiales (
  id_material INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_unidad INT UNSIGNED NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  descripcion VARCHAR(255),
  existencia_actual DECIMAL(14,3) UNSIGNED NOT NULL DEFAULT 0,
  existencia_minima DECIMAL(14,3) UNSIGNED NOT NULL DEFAULT 0,
  costo_referencia DECIMAL(12,2) UNSIGNED NOT NULL DEFAULT 0,
  estado ENUM('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_materiales_nombre UNIQUE (nombre),
  CONSTRAINT fk_materiales_unidades FOREIGN KEY (id_unidad)
    REFERENCES tbl_unidades_medida(id_unidad)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE tbl_productos (
  id_producto INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  descripcion VARCHAR(500),
  imagen_url VARCHAR(500),
  precio_venta DECIMAL(12,2) UNSIGNED NOT NULL DEFAULT 0,
  estado ENUM('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_productos_nombre UNIQUE (nombre)
) ENGINE=InnoDB;

CREATE TABLE tbl_variantes_producto (
  id_variante INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_producto INT UNSIGNED NOT NULL,
  talla VARCHAR(15) NOT NULL,
  color VARCHAR(50) NOT NULL,
  existencia_actual INT UNSIGNED NOT NULL DEFAULT 0,
  estado ENUM('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  CONSTRAINT uq_variante_producto UNIQUE (id_producto, talla, color),
  CONSTRAINT fk_variantes_productos FOREIGN KEY (id_producto)
    REFERENCES tbl_productos(id_producto)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- BOM / receta de materiales para fabricar un par de un producto.
CREATE TABLE tbl_producto_material (
  id_producto_material INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_producto INT UNSIGNED NOT NULL,
  id_material INT UNSIGNED NOT NULL,
  cantidad_por_par DECIMAL(14,4) UNSIGNED NOT NULL,
  porcentaje_desperdicio DECIMAL(5,2) UNSIGNED NOT NULL DEFAULT 0.00,
  estado ENUM('ACTIVO','INACTIVO') NOT NULL DEFAULT 'ACTIVO',
  CONSTRAINT uq_producto_material UNIQUE (id_producto, id_material),
  CONSTRAINT chk_producto_material_cantidad CHECK (cantidad_por_par > 0),
  CONSTRAINT chk_producto_material_desperdicio CHECK (porcentaje_desperdicio <= 100),
  CONSTRAINT fk_producto_material_producto FOREIGN KEY (id_producto)
    REFERENCES tbl_productos(id_producto)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_producto_material_material FOREIGN KEY (id_material)
    REFERENCES tbl_materiales(id_material)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =============================================================
-- 3. COMPRAS DE MATERIALES
-- =============================================================

CREATE TABLE tbl_compras (
  id_compra BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_proveedor INT UNSIGNED NOT NULL,
  id_usuario INT UNSIGNED NOT NULL,
  fecha_compra DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_recepcion DATETIME NULL,
  total_compra DECIMAL(14,2) UNSIGNED NOT NULL DEFAULT 0,
  observaciones VARCHAR(500),
  estado ENUM('PENDIENTE','RECIBIDA','ANULADA') NOT NULL DEFAULT 'PENDIENTE',
  INDEX idx_compras_fecha (fecha_compra),
  INDEX idx_compras_estado (estado),
  CONSTRAINT fk_compras_proveedores FOREIGN KEY (id_proveedor)
    REFERENCES tbl_proveedores(id_proveedor)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_compras_usuarios FOREIGN KEY (id_usuario)
    REFERENCES tbl_usuarios(id_usuario)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE tbl_detalle_compra (
  id_detalle_compra BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_compra BIGINT UNSIGNED NOT NULL,
  id_material INT UNSIGNED NOT NULL,
  cantidad DECIMAL(14,3) UNSIGNED NOT NULL,
  precio_unitario DECIMAL(12,2) UNSIGNED NOT NULL,
  subtotal DECIMAL(14,2) UNSIGNED NOT NULL,
  CONSTRAINT chk_detalle_compra_cantidad CHECK (cantidad > 0),
  CONSTRAINT chk_detalle_compra_subtotal CHECK (subtotal >= 0),
  CONSTRAINT uq_detalle_compra_material UNIQUE (id_compra, id_material),
  CONSTRAINT fk_detalle_compra_compras FOREIGN KEY (id_compra)
    REFERENCES tbl_compras(id_compra)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_detalle_compra_materiales FOREIGN KEY (id_material)
    REFERENCES tbl_materiales(id_material)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =============================================================
-- 4. PEDIDOS
-- =============================================================

CREATE TABLE tbl_pedidos (
  id_pedido BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_cliente INT UNSIGNED NOT NULL,
  id_usuario INT UNSIGNED NOT NULL,
  fecha_pedido DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_estimada_entrega DATE,
  precio_total DECIMAL(14,2) UNSIGNED NOT NULL DEFAULT 0,
  observaciones VARCHAR(500),
  imagen_referencia VARCHAR(500),
  estado ENUM(
    'BORRADOR',
    'CONFIRMADO',
    'EN_PRODUCCION',
    'LISTO',
    'ENTREGADO',
    'CANCELADO'
  ) NOT NULL DEFAULT 'BORRADOR',
  INDEX idx_pedidos_fecha (fecha_pedido),
  INDEX idx_pedidos_estado (estado),
  CONSTRAINT fk_pedidos_clientes FOREIGN KEY (id_cliente)
    REFERENCES tbl_clientes(id_cliente)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_pedidos_usuarios FOREIGN KEY (id_usuario)
    REFERENCES tbl_usuarios(id_usuario)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- La variante identifica de forma consistente producto + talla + color.
-- descripcion_diseno conserva las personalizaciones propias del pedido.
CREATE TABLE tbl_detalle_pedido (
  id_detalle_pedido BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_pedido BIGINT UNSIGNED NOT NULL,
  id_variante INT UNSIGNED NOT NULL,
  descripcion_diseno VARCHAR(1000),
  cantidad INT UNSIGNED NOT NULL,
  precio_unitario DECIMAL(12,2) UNSIGNED NOT NULL,
  subtotal DECIMAL(14,2) UNSIGNED NOT NULL,
  CONSTRAINT chk_detalle_pedido_cantidad CHECK (cantidad > 0),
  CONSTRAINT chk_detalle_pedido_subtotal CHECK (subtotal >= 0),
  CONSTRAINT fk_detalle_pedido_pedidos FOREIGN KEY (id_pedido)
    REFERENCES tbl_pedidos(id_pedido)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_detalle_pedido_variantes FOREIGN KEY (id_variante)
    REFERENCES tbl_variantes_producto(id_variante)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE tbl_pagos_pedido (
  id_pago_pedido BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_pedido BIGINT UNSIGNED NOT NULL,
  id_usuario INT UNSIGNED NOT NULL,
  fecha_pago DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  monto DECIMAL(14,2) UNSIGNED NOT NULL,
  tipo_pago ENUM('ANTICIPO','PAGO_PARCIAL','LIQUIDACION','DEVOLUCION') NOT NULL,
  observaciones VARCHAR(500),
  CONSTRAINT chk_pago_pedido_monto CHECK (monto > 0),
  CONSTRAINT fk_pagos_pedido_pedidos FOREIGN KEY (id_pedido)
    REFERENCES tbl_pedidos(id_pedido)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_pagos_pedido_usuarios FOREIGN KEY (id_usuario)
    REFERENCES tbl_usuarios(id_usuario)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =============================================================
-- 5. PRODUCCION
-- =============================================================

-- La variante ya se obtiene desde tbl_detalle_pedido.
-- Se elimina id_variante de esta tabla para evitar inconsistencias.
CREATE TABLE tbl_producciones (
  id_produccion BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_detalle_pedido BIGINT UNSIGNED NOT NULL,
  id_usuario INT UNSIGNED NOT NULL,
  fecha_inicio DATETIME,
  fecha_finalizacion DATETIME,
  cantidad_total INT UNSIGNED NOT NULL,
  cantidad_producida INT UNSIGNED NOT NULL DEFAULT 0,
  estado ENUM('PENDIENTE','EN_PROCESO','PAUSADA','FINALIZADA','CANCELADA')
    NOT NULL DEFAULT 'PENDIENTE',
  observaciones VARCHAR(500),
  CONSTRAINT uq_produccion_detalle UNIQUE (id_detalle_pedido),
  CONSTRAINT chk_produccion_total CHECK (cantidad_total > 0),
  CONSTRAINT chk_produccion_avance CHECK (cantidad_producida <= cantidad_total),
  CONSTRAINT chk_produccion_fechas CHECK (
    fecha_finalizacion IS NULL OR
    fecha_inicio IS NULL OR
    fecha_finalizacion >= fecha_inicio
  ),
  CONSTRAINT fk_producciones_detalle_pedido FOREIGN KEY (id_detalle_pedido)
    REFERENCES tbl_detalle_pedido(id_detalle_pedido)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_producciones_usuarios FOREIGN KEY (id_usuario)
    REFERENCES tbl_usuarios(id_usuario)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE tbl_lotes_produccion (
  id_lote BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_produccion BIGINT UNSIGNED NOT NULL,
  numero_lote VARCHAR(30) NOT NULL,
  cantidad INT UNSIGNED NOT NULL,
  fecha_inicio DATETIME,
  fecha_finalizacion DATETIME,
  estado ENUM('PENDIENTE','EN_PROCESO','FINALIZADO','CANCELADO')
    NOT NULL DEFAULT 'PENDIENTE',
  observaciones VARCHAR(500),
  CONSTRAINT uq_lote_produccion UNIQUE (id_produccion, numero_lote),
  CONSTRAINT chk_lote_cantidad CHECK (cantidad > 0),
  CONSTRAINT chk_lote_fechas CHECK (
    fecha_finalizacion IS NULL OR
    fecha_inicio IS NULL OR
    fecha_finalizacion >= fecha_inicio
  ),
  CONSTRAINT fk_lotes_producciones FOREIGN KEY (id_produccion)
    REFERENCES tbl_producciones(id_produccion)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Material planificado y consumo real por lote.
CREATE TABLE tbl_detalle_produccion_material (
  id_detalle_material BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_lote BIGINT UNSIGNED NOT NULL,
  id_material INT UNSIGNED NOT NULL,
  cantidad_estimada DECIMAL(14,3) UNSIGNED NOT NULL,
  cantidad_real DECIMAL(14,3) UNSIGNED NULL,
  CONSTRAINT uq_lote_material UNIQUE (id_lote, id_material),
  CONSTRAINT chk_material_estimado CHECK (cantidad_estimada > 0),
  CONSTRAINT chk_material_real CHECK (cantidad_real IS NULL OR cantidad_real >= 0),
  CONSTRAINT fk_detalle_produccion_lotes FOREIGN KEY (id_lote)
    REFERENCES tbl_lotes_produccion(id_lote)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_detalle_produccion_materiales FOREIGN KEY (id_material)
    REFERENCES tbl_materiales(id_material)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =============================================================
-- 6. RESERVAS E INVENTARIO DE PRODUCTO TERMINADO
-- =============================================================

CREATE TABLE tbl_reservas_producto (
  id_reserva BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_pedido BIGINT UNSIGNED NOT NULL,
  id_variante INT UNSIGNED NOT NULL,
  cantidad_reservada INT UNSIGNED NOT NULL,
  fecha_reserva DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('ACTIVA','UTILIZADA','LIBERADA','CANCELADA') NOT NULL DEFAULT 'ACTIVA',
  CONSTRAINT chk_reserva_cantidad CHECK (cantidad_reservada > 0),
  CONSTRAINT uq_reserva_pedido_variante UNIQUE (id_pedido, id_variante),
  CONSTRAINT fk_reservas_pedidos FOREIGN KEY (id_pedido)
    REFERENCES tbl_pedidos(id_pedido)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_reservas_variantes FOREIGN KEY (id_variante)
    REFERENCES tbl_variantes_producto(id_variante)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =============================================================
-- 7. VENTAS
-- =============================================================

CREATE TABLE tbl_ventas (
  id_venta BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_cliente INT UNSIGNED NOT NULL,
  id_pedido BIGINT UNSIGNED NULL,
  id_usuario INT UNSIGNED NOT NULL,
  fecha_venta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tipo_pago ENUM('CONTADO','CREDITO','MIXTO') NOT NULL,
  total_venta DECIMAL(14,2) UNSIGNED NOT NULL DEFAULT 0,

  -- Incluye anticipos del pedido y cualquier pago aplicado al formalizar la venta.
  monto_pagado DECIMAL(14,2) UNSIGNED NOT NULL DEFAULT 0,

  -- Si es mayor que cero y la venta se completa, puede originar tbl_creditos.
  saldo_credito DECIMAL(14,2) UNSIGNED NOT NULL DEFAULT 0,

  observaciones VARCHAR(500),
  estado ENUM('BORRADOR','COMPLETADA','ANULADA') NOT NULL DEFAULT 'BORRADOR',
  CONSTRAINT uq_ventas_pedido UNIQUE (id_pedido),
  CONSTRAINT chk_venta_monto_pagado CHECK (monto_pagado <= total_venta),
  CONSTRAINT chk_venta_saldo CHECK (saldo_credito <= total_venta),
  CONSTRAINT fk_ventas_clientes FOREIGN KEY (id_cliente)
    REFERENCES tbl_clientes(id_cliente)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_ventas_pedidos FOREIGN KEY (id_pedido)
    REFERENCES tbl_pedidos(id_pedido)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_ventas_usuarios FOREIGN KEY (id_usuario)
    REFERENCES tbl_usuarios(id_usuario)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE tbl_detalle_venta (
  id_detalle_venta BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_venta BIGINT UNSIGNED NOT NULL,
  id_variante INT UNSIGNED NOT NULL,
  cantidad INT UNSIGNED NOT NULL,
  precio_unitario DECIMAL(12,2) UNSIGNED NOT NULL,
  subtotal DECIMAL(14,2) UNSIGNED NOT NULL,
  CONSTRAINT chk_detalle_venta_cantidad CHECK (cantidad > 0),
  CONSTRAINT chk_detalle_venta_subtotal CHECK (subtotal >= 0),
  CONSTRAINT uq_detalle_venta_variante UNIQUE (id_venta, id_variante),
  CONSTRAINT fk_detalle_venta_ventas FOREIGN KEY (id_venta)
    REFERENCES tbl_ventas(id_venta)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_detalle_venta_variantes FOREIGN KEY (id_variante)
    REFERENCES tbl_variantes_producto(id_variante)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =============================================================
-- 8. CREDITOS DE CLIENTES
-- =============================================================

CREATE TABLE tbl_creditos (
  id_credito BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_venta BIGINT UNSIGNED NOT NULL,
  id_cliente INT UNSIGNED NOT NULL,
  fecha_credito DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  monto_credito DECIMAL(14,2) UNSIGNED NOT NULL,
  saldo_pendiente DECIMAL(14,2) UNSIGNED NOT NULL,
  numero_cuotas SMALLINT UNSIGNED NOT NULL,
  estado ENUM('ACTIVO','PAGADO','VENCIDO','ANULADO') NOT NULL DEFAULT 'ACTIVO',
  CONSTRAINT uq_creditos_venta UNIQUE (id_venta),
  CONSTRAINT chk_credito_monto CHECK (monto_credito > 0),
  CONSTRAINT chk_credito_saldo CHECK (saldo_pendiente <= monto_credito),
  CONSTRAINT chk_credito_cuotas CHECK (numero_cuotas > 0),
  CONSTRAINT fk_creditos_ventas FOREIGN KEY (id_venta)
    REFERENCES tbl_ventas(id_venta)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_creditos_clientes FOREIGN KEY (id_cliente)
    REFERENCES tbl_clientes(id_cliente)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE tbl_cuotas_credito (
  id_cuota BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_credito BIGINT UNSIGNED NOT NULL,
  numero_cuota SMALLINT UNSIGNED NOT NULL,
  monto_cuota DECIMAL(14,2) UNSIGNED NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  estado ENUM('PENDIENTE','PARCIAL','PAGADA','VENCIDA','ANULADA')
    NOT NULL DEFAULT 'PENDIENTE',
  CONSTRAINT uq_credito_numero_cuota UNIQUE (id_credito, numero_cuota),
  CONSTRAINT chk_cuota_numero CHECK (numero_cuota > 0),
  CONSTRAINT chk_cuota_monto CHECK (monto_cuota > 0),
  CONSTRAINT fk_cuotas_creditos FOREIGN KEY (id_credito)
    REFERENCES tbl_creditos(id_credito)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE tbl_abonos (
  id_abono BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_credito BIGINT UNSIGNED NOT NULL,
  id_cuota BIGINT UNSIGNED NULL,
  id_usuario INT UNSIGNED NOT NULL,
  fecha_abono DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  monto DECIMAL(14,2) UNSIGNED NOT NULL,
  observaciones VARCHAR(500),
  CONSTRAINT chk_abono_monto CHECK (monto > 0),
  CONSTRAINT fk_abonos_creditos FOREIGN KEY (id_credito)
    REFERENCES tbl_creditos(id_credito)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_abonos_cuotas FOREIGN KEY (id_cuota)
    REFERENCES tbl_cuotas_credito(id_cuota)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_abonos_usuarios FOREIGN KEY (id_usuario)
    REFERENCES tbl_usuarios(id_usuario)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =============================================================
-- 9. KARDEX / MOVIMIENTOS
-- =============================================================

CREATE TABLE tbl_movimientos_material (
  id_movimiento_material BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_material INT UNSIGNED NOT NULL,
  id_usuario INT UNSIGNED NOT NULL,
  tipo_movimiento ENUM(
    'ENTRADA',
    'SALIDA',
    'AJUSTE_POSITIVO',
    'AJUSTE_NEGATIVO'
  ) NOT NULL,
  cantidad DECIMAL(14,3) UNSIGNED NOT NULL,
  fecha_movimiento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tipo_referencia ENUM('COMPRA','PRODUCCION','AJUSTE','DEVOLUCION') NOT NULL,
  id_referencia BIGINT UNSIGNED NULL,
  observaciones VARCHAR(500),
  INDEX idx_mov_material_fecha (id_material, fecha_movimiento),
  INDEX idx_mov_material_referencia (tipo_referencia, id_referencia),
  CONSTRAINT chk_mov_material_cantidad CHECK (cantidad > 0),
  CONSTRAINT fk_mov_material_materiales FOREIGN KEY (id_material)
    REFERENCES tbl_materiales(id_material)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_mov_material_usuarios FOREIGN KEY (id_usuario)
    REFERENCES tbl_usuarios(id_usuario)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE tbl_movimientos_producto (
  id_movimiento_producto BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_variante INT UNSIGNED NOT NULL,
  id_usuario INT UNSIGNED NOT NULL,
  tipo_movimiento ENUM(
    'ENTRADA',
    'SALIDA',
    'AJUSTE_POSITIVO',
    'AJUSTE_NEGATIVO',
    'RESERVA',
    'LIBERACION'
  ) NOT NULL,
  cantidad INT UNSIGNED NOT NULL,
  fecha_movimiento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  tipo_referencia ENUM('PRODUCCION','VENTA','RESERVA','AJUSTE','DEVOLUCION') NOT NULL,
  id_referencia BIGINT UNSIGNED NULL,
  observaciones VARCHAR(500),
  INDEX idx_mov_producto_fecha (id_variante, fecha_movimiento),
  INDEX idx_mov_producto_referencia (tipo_referencia, id_referencia),
  CONSTRAINT chk_mov_producto_cantidad CHECK (cantidad > 0),
  CONSTRAINT fk_mov_producto_variantes FOREIGN KEY (id_variante)
    REFERENCES tbl_variantes_producto(id_variante)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_mov_producto_usuarios FOREIGN KEY (id_usuario)
    REFERENCES tbl_usuarios(id_usuario)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =============================================================
-- 10. BITACORA
-- =============================================================

CREATE TABLE tbl_bitacora (
  id_bitacora BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT UNSIGNED NULL,
  accion VARCHAR(100) NOT NULL,
  modulo VARCHAR(80) NOT NULL,
  descripcion VARCHAR(1000),
  fecha_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_bitacora_fecha (fecha_hora),
  INDEX idx_bitacora_modulo (modulo),
  CONSTRAINT fk_bitacora_usuarios FOREIGN KEY (id_usuario)
    REFERENCES tbl_usuarios(id_usuario)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- =============================================================
-- DATOS INICIALES
-- =============================================================

INSERT INTO tbl_roles (nombre_rol, descripcion) VALUES
  ('ADMINISTRADOR', 'Acceso completo al sistema'),
  ('EMPLEADO', 'Acceso operativo según permisos de la aplicación');

INSERT INTO tbl_unidades_medida (nombre, abreviatura) VALUES
  ('Unidad', 'u'),
  ('Par', 'par'),
  ('Metro', 'm'),
  ('Metro cuadrado', 'm2'),
  ('Litro', 'L'),
  ('Kilogramo', 'kg'),
  ('Rollo', 'rollo');

SET FOREIGN_KEY_CHECKS = 1;

-- Debe devolver 26.
SELECT COUNT(*) AS total_tablas
FROM information_schema.tables
WHERE table_schema = 'bd_zapateria'
  AND table_type = 'BASE TABLE';

-- =============================================================
-- REGLAS PARA EL BACKEND
-- =============================================================
-- 1. Los subtotales y totales se calculan en el service antes de guardar.
-- 2. Confirmar una compra RECIBIDA:
--      - aumenta tbl_materiales.existencia_actual
--      - crea ENTRADA en tbl_movimientos_material
-- 3. Al iniciar producción:
--      - calcular materiales requeridos mediante
--        variante -> producto -> tbl_producto_material
--      - comparar contra existencia_actual.
-- 4. Al finalizar un lote:
--      - registrar cantidad_real consumida
--      - disminuir existencia de materiales
--      - crear SALIDA en tbl_movimientos_material
--      - aumentar existencia de la variante producida
--      - crear ENTRADA en tbl_movimientos_producto
-- 5. Al completar una venta:
--      - disminuir existencia de producto terminado
--      - crear SALIDA en tbl_movimientos_producto
--      - si saldo_credito > 0, crear tbl_creditos y sus cuotas
-- 6. Cada operación compuesta debe ejecutarse dentro de una transacción Prisma.
-- =============================================================

ALTER TABLE tbl_clientes
ADD COLUMN correo VARCHAR(150) NULL AFTER telefono,
ADD COLUMN nit VARCHAR(25) NULL AFTER correo;

ALTER TABLE tbl_proveedores
ADD COLUMN contacto VARCHAR(150) NULL AFTER nombre,
ADD COLUMN correo VARCHAR(150) NULL AFTER telefono,
ADD COLUMN nit VARCHAR(25) NULL AFTER correo;

ALTER TABLE tbl_productos
ADD COLUMN categoria VARCHAR(50) NULL AFTER nombre;

ALTER TABLE tbl_variantes_producto
ADD COLUMN material VARCHAR(120) NULL AFTER color,
ADD COLUMN suela VARCHAR(100) NULL AFTER material,
ADD COLUMN precio DECIMAL(12,2) UNSIGNED NULL AFTER suela;