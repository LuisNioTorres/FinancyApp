import {UI} from './js.js';

let totales = UI.calcularTotales();

const ctx = document.getElementById('myChart');

new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Ingresos'+" $"+totales.ingreso.toLocaleString(), 'Gastos' + " $"+totales.gasto.toLocaleString(), 'Ahorros'+" $"+totales.ahorro.toLocaleString()],
    datasets: [{
      label: 'Porcentaje',
      data: [totales.ingreso, totales.gasto, totales.ahorro],
      borderWidth: 1,
      backgroundColor: [
        'rgb(37, 190, 37)',
        'rgb(236, 109, 109)',
        'gray'
      ],
    }]
  },
  options: {
    responsive: true,
  }
});