// Función para formatear la fecha en formato dd/mm/yy
function formatearFecha(fecha) {
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const anio = fecha.getFullYear().toString().slice(-2); // Tomar solo los últimos dos dígitos del año
  return `${dia}/${mes}/${anio}`;
}

// Función para calcular la fecha de pago en base a la fecha de desembolso y el número de cuota
function calcularFechaPago(fechaDesembolso, cuota) {
  const fecha = new Date(fechaDesembolso);
  fecha.setMonth(fecha.getMonth() + cuota);
  return formatearFecha(fecha);
}

// Función principal para manejar el formulario de crédito
document.getElementById('creditoForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Obtener los valores del formulario
  const cliente = document.getElementById('cliente').value;
  const marca = document.getElementById('marca').value;
  const valor = parseFloat(document.getElementById('valor').value);
  const cuotaInicial = parseFloat(document.getElementById('cuotaInicial').value);
  const fechaDesembolso = document.getElementById('fechaDesembolso').value;
  const modelo = document.getElementById('modelo').value;
  const nroCuotas = parseInt(document.getElementById('nroCuotas').value);
  const periodoGracia = parseInt(document.getElementById('periodoGracia').value);
  const seguro = document.getElementById('seguro').value;

  // Calcular el cronograma de pagos
  const cronogramaTable = document.getElementById('cronogramaTable').getElementsByTagName('tbody')[0];
  cronogramaTable.innerHTML = ''; // Limpiar contenido anterior

  let totalCuotas = 0;
  let totalInteres = 0;
  let totalSeguro = 0;
  let totalPagar = 0;

  // Calcular detalle de cada cuota
  for (let cuota = 1; cuota <= nroCuotas; cuota++) {
    let montoCuota = 0;
    let interes = 0;

    // Calcular monto de la cuota
    if (periodoGracia > 0 && cuota <= periodoGracia) {
      montoCuota = 0; // Período de gracia
    } else {
      montoCuota = (valor - cuotaInicial) / (nroCuotas - periodoGracia);
    }

    // Calcular interés (ejemplo: 5% de interés anual)
    interes = montoCuota * (0.05 / 12); // 5% de interés anual dividido entre 12 meses

    // Sumar al total
    totalCuotas += montoCuota;
    totalInteres += interes;

    // Mostrar fila en la tabla
    const row = `
      <tr>
        <td>${cuota}</td>
        <td>S/ ${montoCuota.toFixed(2)}</td>
        <td>S/ ${interes.toFixed(2)}</td>
        <td>${seguro === 'si' ? 'Sí' : 'No'}</td>
        <td>S/ ${(montoCuota + interes).toFixed(2)}</td>
        <td>${calcularFechaPago(fechaDesembolso, cuota)}</td>
      </tr>
    `;
    cronogramaTable.innerHTML += row;
  }

  // Calcular totales finales
  totalSeguro = seguro === 'si' ? (nroCuotas * 50) : 0; // Ejemplo: S/ 50 de seguro por cuota
  totalPagar = totalCuotas + totalInteres + totalSeguro;

  // Mostrar totales
  document.getElementById('totalCuotas').textContent = `S/ ${totalCuotas.toFixed(2)}`;
  document.getElementById('totalInteres').textContent = `S/ ${totalInteres.toFixed(2)}`;
  document.getElementById('totalSeguro').textContent = `S/ ${totalSeguro.toFixed(2)}`;
  document.getElementById('totalPagar').textContent = `S/ ${totalPagar.toFixed(2)}`;

  // Mostrar cronograma de pagos
  document.getElementById('cronogramaContainer').style.display = 'block';
});
