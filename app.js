import {
  obtenerProductos,
  registrarPedido
} from './mockApi.js';

const productosContainer = document.getElementById('productos-container');
const estadoVacio = document.getElementById('estado-vacio');
const formulario = document.getElementById('pedido-form');
const mensaje = document.getElementById('mensaje');
const botonSubmit = document.getElementById('submit-btn');
const carritoSection = document.getElementById('carrito');
const carritoLista = document.getElementById('carrito-lista');
const carritoBadge = document.getElementById('carrito-badge');
const carritoTotalValor = document.getElementById('carrito-total-valor');
const carritoVacio = document.getElementById('carrito-vacio');

let carrito = [];
let productos = [];

function agregarAlCarrito(producto) {
  const itemExistente = carrito.find(item => item.productoId === producto.id);

  if (itemExistente) {
    itemExistente.cantidad++;
  } else {
    carrito.push({
      productoId: producto.id,
      nombre: producto.nombre,
      cantidad: 1,
      precio: producto.precio
    });
  }
}

function eliminarDelCarrito(productoId) {
  carrito = carrito.filter(item => item.productoId !== productoId);
}

function actualizarCantidad(productoId, nuevaCantidad) {
  if (nuevaCantidad <= 0) {
    eliminarDelCarrito(productoId);
  } else {
    const item = carrito.find(item => item.productoId === productoId);
    if (item) {
      item.cantidad = nuevaCantidad;
    }
  }
}

function calcularTotal() {
  return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

function renderizarCarrito() {
  const total = calcularTotal();

  if (carrito.length === 0) {
    carritoSection.hidden = true;
    carritoBadge.hidden = true;
    mensaje.textContent = '';
    return;
  }

  carritoSection.hidden = false;
  carritoVacio.hidden = true;

  carritoLista.innerHTML = carrito.map(item => `
    <div class="carrito-item" data-producto-id="${item.productoId}">
      <div class="carrito-item-info">
        <h4>${item.nombre}</h4>
        <p>$${item.precio.toLocaleString('es-CO')}</p>
      </div>
      <div class="cantidad-controles">
        <button class="btn-menos" data-producto-id="${item.productoId}">−</button>
        <span class="cantidad-valor">${item.cantidad}</span>
        <button class="btn-mas" data-producto-id="${item.productoId}">+</button>
      </div>
      <p class="carrito-subtotal">$${(item.precio * item.cantidad).toLocaleString('es-CO')}</p>
      <button class="btn-eliminar" data-producto-id="${item.productoId}">Eliminar</button>
    </div>
  `).join('');

  carritoTotalValor.textContent = `$${total.toLocaleString('es-CO')}`;

  carritoBadge.textContent = carrito.length;
  carritoBadge.hidden = false;

  document.querySelectorAll('.btn-menos').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.productoId);
      const item = carrito.find(i => i.productoId === id);
      if (item) {
        actualizarCantidad(id, item.cantidad - 1);
        renderizarCarrito();
      }
    });
  });

  document.querySelectorAll('.btn-mas').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.productoId);
      const item = carrito.find(i => i.productoId === id);
      if (item) {
        actualizarCantidad(id, item.cantidad + 1);
        renderizarCarrito();
      }
    });
  });

  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.productoId);
      eliminarDelCarrito(id);
      renderizarCarrito();
    });
  });
}

async function cargarProductos() {

  productosContainer.innerHTML = '<p>Cargando catálogo...</p>';

  try {

    productos = await obtenerProductos();

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
          <p>$${producto.precio.toLocaleString('es-CO')}</p>
          <button class="btn-agregar" data-id="${producto.id}">
            Agregar ${producto.nombre} al pedido
          </button>
        </article>
      `;

    });

    document.querySelectorAll('.btn-agregar').forEach(btn => {
      btn.addEventListener('click', () => {
        const productoId = Number(btn.dataset.id);
        const producto = productos.find(p => p.id === productoId);
        if (producto) {
          agregarAlCarrito(producto);
          renderizarCarrito();
        }
      });
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

  if (carrito.length === 0) {
    mensaje.textContent = 'Tu carrito está vacío. Agrega productos antes de confirmar.';
    return;
  }

  const datosPedido = {
    nombre: document.getElementById('nombre').value,
    correo: document.getElementById('correo').value,
    telefono: document.getElementById('telefono').value,
    items: carrito,
    total: calcularTotal()
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

    carrito = [];
    renderizarCarrito();
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
