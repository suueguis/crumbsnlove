# Crumbs & Love

Tienda web de galletas artesanales desarrollada para el Parcial 1 de Programación con Tecnologías Web.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript Vanilla

## Cómo ejecutar el proyecto

1. Descargar el repositorio
2. Abrir la carpeta en VS Code
3. Ejecutar con Live Server

## Endpoints simulados


GET /productos
Función:

```javascript
obtenerProductos()
Descripción:
Obtiene el catálogo de galletas.

Respuesta exitosa:
[
  {
    id: 1,
    nombre: 'Chocolate Chips',
    precio: 18000
  }
]

Respuesta error:
{
  mensaje: 'No fue posible cargar el catálogo.'
}

----------------------------------------

POST /pedidos
Función:
registrarPedido(datosPedido)

Descripción:
Registra un nuevo pedido.

Parámetros:
{
  nombre,
  correo,
  telefono,
  cantidad
}

Respuesta exitosa:
{
  mensaje: 'Pedido registrado correctamente'
}

Respuesta error:
{
  mensaje: 'No fue posible registrar el pedido'
}
