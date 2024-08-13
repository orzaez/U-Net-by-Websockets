# Info React

## Crear proyecto

    node -v
    npx create-next-app@latest
    npm run dev

## Estructura  proyecto

    mi-proyecto-nextjs/
    │
    ├── pages/              # Páginas de tu aplicación
    │   ├── index.tsx        # Página principal (http://localhost:3000/)
    │   └── _app.tsx         # Asegura que el contexto WebSocket esté disponible en todas las páginas.
    │
    ├── public/             # Archivos públicos, accesibles directamente
    │   └── favicon.ico     # Favicon por defecto
    │
    ├── styles/             # Archivos de estilos
    │   ├── globals.css     # Estilos globales
    │   └── Home.module.css # Estilos para el componente Home
    │
    ├── .gitignore          # Archivos y carpetas que git ignorará
    ├── package.json        # Información del proyecto y dependencias
    └── README.md           # Información general sobre el proyecto
.

## TypeScript
TypeScript es un superset de JavaScript que añade tipado estático al lenguaje. Esto significa que permite definir los tipos de datos (como números, cadenas, objetos, etc.) de las variables, funciones, y objetos en tu código, lo que ayuda a evitar errores comunes en tiempo de ejecución y facilita el desarrollo de aplicaciones más grandes y robustas. Además, TypeScript se compila a JavaScript, por lo que se puede ejecutar en cualquier entorno que soporte JavaScript.


## El DOM Virtual

El DOM (Document Object Model) es una representación en forma de árbol de un documento HTML
Una de las razones por las que React es tan eficiente es el uso del DOM Virtual. En lugar de manipular directamente el DOM del navegador (que es lento), React mantiene una representación del DOM en la memoria. Cuando cambian los datos, React actualiza el DOM virtual primero, calcula la manera más eficiente de hacer las actualizaciones necesarias en el DOM real, y luego las aplica. Esto resulta en una experiencia de usuario más rápida y suave.

## Componentes

Dos tipos principales de componentes en React:

- Componentes funcionales: Son funciones de JavaScript que reciben propiedades (props) como argumentos y devuelven elementos de React, que son esencialmente el código TSX que representa lo que se muestra en la pantalla.

- Componentes de clase: Son clases de JavaScript que extienden de React.Component y tienen un método render que devuelve elementos de React. Aunque son más poderosos en términos de funcionalidades,  desde la introducción de Hooks, los componentes funcionales son más comunes.

## Hooks en React

Los hooks permiten usar estado y otras características de React sin escribir una clase.

### useState

El hook `useState` permite añadir estado a componentes funcionales.

1. Manejo de formularios: Para controlar los valores de entrada en un formulario.

2. Interactividad del usuario: Para manejar estados como el contador de clics, alternar entre temas oscuro y claro, o abrir y cerrar modales.

3. Almacenamiento de datos temporales: Para manejar cualquier dato que necesite ser almacenado temporalmente y actualizado.

### useEffect

`useEffect` Permite realizar efectos secundarios en componentes funcionales, como la obtención de datos, la suscripción a servicios, y la manipulación del DOM.

1. Operaciones de carga de datos: Hacer una llamada a una API cuando un componente se monta.

2. Suscripciones: Conectar y desconectar suscripciones, como eventos de WebSocket.

3. Manipulación del DOM: Ejecutar algún código que necesite manipular el DOM directamente después de que se haya renderizado el componente.

### useContext

1. Propagación de datos globales: Para compartir datos entre múltiples componentes sin necesidad de pasar props a través de varios niveles de componentes.
2. Temas y configuración del usuario: Manejar temas, configuraciones de usuario o autenticación de una manera centralizada

### useReducer

Es una alternativa a `useState`, ideal para manejar estados complejos y lógica de actualización

1. Estados complejos: Manejar estados que requieren múltiples sub-valores o cuando las actualizaciones del estado tienen lógica compleja.

2. Lógica de actualización avanzada: Implementar lógica de actualización de estado que es más complicada que simplemente asignar un nuevo valor
