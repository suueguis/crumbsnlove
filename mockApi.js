export function obtenerProductos() {

  return new Promise((resolve, reject) => {

    setTimeout(() => {

      const error = false;

      if (error) {
        console.log('500 internal server error');

        reject({
          mensaje: 'No fue posible cargar el catálogo. Intenta nuevamente.'
        });

        return;
      }

      resolve([
        {
          id: 1,
          nombre: 'Chocolate Chips',
          precio: 18000,
          imagen: 'assets/cookie1.jpg'
        },
        {
          id: 2,
          nombre: 'Red Velvet',
          precio: 22000,
          imagen: 'assets/cookie2.jpg'
        },
        {
          id: 3,
          nombre: 'Matcha Cream',
          precio: 24000,
          imagen: 'assets/cookie3.jpg'
        }
      ]);

    }, 1000);

  });
}


export function registrarPedido(datosPedido) {

  return new Promise((resolve, reject) => {

    setTimeout(() => {

      const error = false;

      if (error) {

        console.log('500 internal server error');

        reject({
          mensaje: 'No fue posible registrar el pedido.'
        });

        return;
      }

      resolve({
        mensaje: `Pedido registrado correctamente para ${datosPedido.nombre}`
      });

    }, 1500);

  });
}