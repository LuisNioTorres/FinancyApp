import {UI} from './js.js';

let prueba = UI.calcularTotales();
console.log(prueba.ahorro);

const ctx = document.getElementById('myChart');

new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Ingresos'+" $"+prueba.ingreso, 'Gastos' + " $"+prueba.gasto, 'Ahorros'+" $"+prueba.ahorro],
    datasets: [{
      label: 'Porcentaje',
      data: [prueba.ingreso, prueba.gasto, prueba.ahorro],
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