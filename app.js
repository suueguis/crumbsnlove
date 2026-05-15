import {
  obtenerProductos,
  registrarPedido
} from './mockApi.js';

const productosContainer = document.getElementById('productos-container');
const estadoVacio = document.getElementById('estado-vacio');
const formulario = document.getElementById('pedido-form');
const mensaje = document.getElementById('mensaje');
const botonSubmit = document.getElementById('submit-btn');

async function cargarProductos() {

  productosContainer.innerHTML = '<p>Cargando catálogo...</p>';

  try {

    const productos = await obtenerProductos();

    productosContainer.innerHTML = '';

    if (productos.length === 0) {
      estadoVacio.hidden = false;
      return;
    }

    productos.forEach(producto => {

      productosContainer.innerHTML += `
        <article class="card">
          <img src="${producto.imagen}" alt="${producto.nombre}">
          <h3>${producto.nombre}</h3>
          <p>$${producto.precio}</p>
          <button>
            Agregar ${producto.nombre} al pedido
          </button>
        </article>
      `;

    });

  } catch (error) {

    productosContainer.innerHTML = `
      <p>
        No pudimos cargar el catálogo. Verifica tu conexión e intenta nuevamente.
      </p>
    `;

  }
}

cargarProductos();

formulario.addEventListener('submit', async (event) => {

  event.preventDefault();

  const confirmar = confirm(
    '¿Deseas confirmar el pedido de galletas?'
  );

  if (!confirmar) {
    return;
  }

  const datosPedido = {
    nombre: document.getElementById('nombre').value,
    correo: document.getElementById('correo').value,
    telefono: document.getElementById('telefono').value,
    cantidad: document.getElementById('cantidad').value
  };

  if (datosPedido.nombre.trim().length < 3) {

    mensaje.textContent =
      'El nombre debe tener al menos 3 caracteres.';

    return;
  }

  botonSubmit.disabled = true;
  botonSubmit.textContent = 'Procesando pedido...';

  try {

    const respuesta = await registrarPedido(datosPedido);

    mensaje.textContent = respuesta.mensaje;

    formulario.reset();

  } catch (error) {

    mensaje.textContent =
      'No fue posible completar el pedido. Intenta nuevamente.';

  } finally {

    botonSubmit.disabled = false;

    botonSubmit.textContent =
      'Confirmar pedido de galletas';

  }

});
