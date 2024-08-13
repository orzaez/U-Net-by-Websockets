# Hooks en React

Los hooks permiten usar estado y otras características de React sin escribir una clase.

## useState

El hook `useState` permite añadir estado a componentes funcionales.

1. Manejo de formularios: Para controlar los valores de entrada en un formulario.

2. Interactividad del usuario: Para manejar estados como el contador de clics, alternar entre temas oscuro y claro, o abrir y cerrar modales.

3. Almacenamiento de datos temporales: Para manejar cualquier dato que necesite ser almacenado temporalmente y actualizado.

## useEffect

`useEffect` Permite realizar efectos secundarios en componentes funcionales, como la obtención de datos, la suscripción a servicios, y la manipulación del DOM.

1. Operaciones de carga de datos: Hacer una llamada a una API cuando un componente se monta.

2. Suscripciones: Conectar y desconectar suscripciones, como eventos de WebSocket.

3. Manipulación del DOM: Ejecutar algún código que necesite manipular el DOM directamente después de que se haya renderizado el componente.

## useContext

1. Propagación de datos globales: Para compartir datos entre múltiples componentes sin necesidad de pasar props a través de varios niveles de componentes.
2. Temas y configuración del usuario: Manejar temas, configuraciones de usuario o autenticación de una manera centralizada

## useReducer

Es una alternativa a `useState`, ideal para manejar estados complejos y lógica de actualización

1. Estados complejos: Manejar estados que requieren múltiples sub-valores o cuando las actualizaciones del estado tienen lógica compleja.

2. Lógica de actualización avanzada: Implementar lógica de actualización de estado que es más complicada que simplemente asignar un nuevo valor
