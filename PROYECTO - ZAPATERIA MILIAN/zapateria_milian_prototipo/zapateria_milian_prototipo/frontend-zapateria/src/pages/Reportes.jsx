import { useState } from 'react'

import FiltrosReportes from '../components/reportes/FiltrosReportes'
import ResumenReportes from '../components/reportes/ResumenReportes'
import GraficaVentas from '../components/reportes/GraficaVentas'
import ProductosVendidos from '../components/reportes/ProductosVendidos'
import EstadoMateriales from '../components/reportes/EstadoMateriales'
import ResumenFinanciero from '../components/reportes/ResumenFinanciero'


function Reportes() {

  const [periodo, setPeriodo] =
    useState('Mes')


  // =========================
  // DATOS DE EJEMPLO
  // =========================

  const datosPorPeriodo = {

    Semana: {
      ventas: 8,
      ingresos: 4250,
      pedidos: 5,
      producidos: 38,
      creditosPendientes: 2900,
      valorInventario: 7200,

      grafica: [
        {
          nombre: 'Lun',
          valor: 450
        },
        {
          nombre: 'Mar',
          valor: 800
        },
        {
          nombre: 'Mié',
          valor: 600
        },
        {
          nombre: 'Jue',
          valor: 950
        },
        {
          nombre: 'Vie',
          valor: 1450
        }
      ]
    },


    Mes: {
      ventas: 24,
      ingresos: 12575,
      pedidos: 16,
      producidos: 112,
      creditosPendientes: 5630,
      valorInventario: 9840,

      grafica: [
        {
          nombre: 'Sem 1',
          valor: 2500
        },
        {
          nombre: 'Sem 2',
          valor: 3150
        },
        {
          nombre: 'Sem 3',
          valor: 2875
        },
        {
          nombre: 'Sem 4',
          valor: 4050
        }
      ]
    },


    Trimestre: {
      ventas: 67,
      ingresos: 34850,
      pedidos: 42,
      producidos: 315,
      creditosPendientes: 8450,
      valorInventario: 11250,

      grafica: [
        {
          nombre: 'Jun',
          valor: 9800
        },
        {
          nombre: 'Jul',
          valor: 11250
        },
        {
          nombre: 'Ago',
          valor: 13800
        }
      ]
    },


    Año: {
      ventas: 256,
      ingresos: 136450,
      pedidos: 178,
      producidos: 1280,
      creditosPendientes: 8450,
      valorInventario: 11250,

      grafica: [
        {
          nombre: 'Ene',
          valor: 8500
        },
        {
          nombre: 'Feb',
          valor: 9700
        },
        {
          nombre: 'Mar',
          valor: 10400
        },
        {
          nombre: 'Abr',
          valor: 11200
        },
        {
          nombre: 'May',
          valor: 10850
        },
        {
          nombre: 'Jun',
          valor: 9800
        },
        {
          nombre: 'Jul',
          valor: 11250
        },
        {
          nombre: 'Ago',
          valor: 13800
        },
        {
          nombre: 'Sep',
          valor: 14950
        }
      ]
    }

  }


  const productos = [
    {
      nombre: 'Oxford Ejecutivo',
      cantidad: 48,
      total: 12000
    },
    {
      nombre: 'Derby Ejecutivo',
      cantidad: 36,
      total: 9900
    },
    {
      nombre: 'Botín Milian',
      cantidad: 28,
      total: 8960
    }
  ]


  const materiales = [
    {
      nombre: 'Cuero negro',
      existencia: 8,
      unidad: 'm²',
      estado: 'Atención'
    },
    {
      nombre: 'Cuero café',
      existencia: 34,
      unidad: 'm²',
      estado: 'Normal'
    },
    {
      nombre: 'Suela No.40',
      existencia: 12,
      unidad: 'par',
      estado: 'Atención'
    },
    {
      nombre: 'Pegamento industrial',
      existencia: 4,
      unidad: 'L',
      estado: 'Normal'
    }
  ]


  // =========================
  // PERÍODO SELECCIONADO
  // =========================

  const datos =
    datosPorPeriodo[periodo]


  // =========================
  // INTERFAZ
  // =========================

  return (
    <section>

      <div className="page-actions">

        <div>

          <p className="eyebrow">
            Reportes
          </p>

          <h3>
            Reportes e indicadores
          </h3>

        </div>


        <FiltrosReportes
          periodo={
            periodo
          }
          setPeriodo={
            setPeriodo
          }
        />

      </div>


      <ResumenReportes
        ventas={
          datos.ventas
        }
        ingresos={
          datos.ingresos
        }
        pedidos={
          datos.pedidos
        }
        producidos={
          datos.producidos
        }
      />


      <div className="report-grid">

        <GraficaVentas
          datos={
            datos.grafica
          }
        />


        <ProductosVendidos
          productos={
            productos
          }
        />

      </div>


      <div className="report-grid">

        <EstadoMateriales
          materiales={
            materiales
          }
        />


        <ResumenFinanciero
          ingresos={
            datos.ingresos
          }
          creditosPendientes={
            datos.creditosPendientes
          }
          valorInventario={
            datos.valorInventario
          }
          paresProducidos={
            datos.producidos
          }
        />

      </div>

    </section>
  )
}

export default Reportes