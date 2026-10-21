// Artículos del blog (fuente de datos para la lista y el detalle)
export const BLOGS = [
  {
    id: '1',
    title: 'Cómo armar tu PC',
    color: 'var(--accent-green)',
    summary: 'Guía de armado de PC para principiantes.',
    content: [
      'Armar tu primer PC es más simple de lo que parece si sigues un orden. Antes de comprar, define tu presupuesto y para qué lo usarás: jugar, editar video o trabajo general.',
      'Elige primero el procesador y la placa madre, y revisa que el socket sea compatible. Luego suma memoria RAM compatible con la placa (16 GB es un buen punto de partida para jugar), almacenamiento SSD y la tarjeta de video, que suele ser la pieza que más pesa en los fps.',
      'La fuente de poder debe entregar potencia suficiente con algo de margen y buena certificación. El gabinete debe tener espacio para la tarjeta de video y un buen flujo de aire.',
      'Para el armado, instala procesador, RAM y SSD en la placa fuera del gabinete, móntala, conecta la fuente y los cables frontales, coloca la tarjeta de video y enciende el equipo antes de cerrar para comprobar que todo funcione. Mira el video y la guía de MSI para ver cada paso.',
    ],
    linkText: 'Guía para armar tu PC',
    link: 'https://www.msi.com/Landing/how-to-build-a-pc',
    video: '/assets/img/instrucciones.mp4',
  },
  {
    id: '2',
    title: 'Instrucciones de Catan',
    color: 'var(--accent-blue)',
    summary: 'Instrucciones.',
    content: [
      'Catan es un juego de estrategia para 3 o 4 jugadores en el que construyes caminos, poblados y ciudades para sumar puntos de victoria. En la versión base gana quien llega primero a 10 puntos.',
      'Al inicio, elige tus dos primeros poblados según los números de los hexágonos: el 6 y el 8 salen con más frecuencia, y conviene combinar recursos distintos para no depender de uno solo.',
      'Intercambia recursos con los demás jugadores y usa los puertos cuando te sobre un recurso. Si sale un 7 se mueve el ladrón y quien tenga más de 7 cartas debe descartar la mitad, así que no acumules demasiado.',
      'Mira el video para aprender las reglas en pocos minutos y revisa el PDF con las reglas completas.',
    ],
    linkText: 'Instrucciones Catan',
    link: 'https://deviramericas.com/wp-content/uploads/2016/12/Catan-Plus-reglas.pdf',
    video: '/assets/img/catan2.mp4',
    videoCaption: 'Aprende a jugar en 2 minutos',
  },
];

export const getBlogById = (id) => BLOGS.find((b) => b.id === id);
