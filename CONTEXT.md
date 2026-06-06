# PROYECTO

Crear una interfaz de chat donde el usuario pueda escribir mensajes y recibir respuestas de la IA.  Es una interfaz de chat con un panel de historial de mensajes y una barra lateral con estadísticas de consumo de tokens.
Cada respuesta de Groq incluye un objeto usage — registra y muestra el consumo de tokens (tokens de prompt, tokens de completado y totales acumulados) para toda la sesión
Las métricas que se deben mostrar abajo en el chat.  Nombre del modelo, tiempo de respuesta y tokens por segundo.
El historial de la conversación debe sobrevivir una recarga de página — el usuario no debería perder su sesión por haber cerrado accidentalmente la pestaña.
En el diseño de pantalla se deben ahorrar lineas en pantalla para todos los elementos, permitiendo maximizar el contenedor donde va quedando el historial de mensajes. En este contenedor no dejar muchas lineas en blanco para que se puedan visualizar mas mensajes a la vez.  El contenedor donde el usuario escribe su solicitud o mensaje debe tener visuales maximo 4 lineas de mensaje y un padding muy pequeño para separar las letras de los bordes.  
El titulo del chat debe ser una sola línea para no perder espacio vertical con titulos innecesarios.
Para pantallas en web, coloca las métricas hacia los lados para no perder espacio vertical en las métricas sino aprovechar el máximo espacio posible para la historia de mensajes.  La idea es que el cuerpo del chat y el mensaje del usuario ocupen la pantalla cuando se está en modo web para no tener que deslizar hacia abajo para escribir el mensaje. 
Por supuesto debe ser responsivo.  Para móviles todas las métricas laterales deben ir debajo del chat, pero siempre manteniendo que en la pantalla del movil quepan tanto la historia de mensajes como el contenedor donde el usuario coloca su solicitud, este último de máximo dos lineas

## Autenticación con la API externa:

Cuando llamas a una API externa como usuario registrado de ese servicio, estableces tu identidad usando un Bearer Token — una credencial que obtuviste al registrarte, que se envía en la cabecera Authorization de cada petición:

Authorization: Bearer TU_API_KEY_AQUÍ
Piensa en él como el pase de sesión que te da acceso. Sin él, el servidor de la API no sabe quién eres y rechazará tu petición con un error 401 Unauthorized. 
En este proyecto, tu Bearer Token es la API Key que generarás en tu cuenta de Groq. Es lo que abre la sesión entre tu aplicación y la API — y debe almacenarse siempre en un archivo .env, nunca escrita directamente en el código ni subida a GitHub.
La API debe llamarse usando fetch — sin SDK de terceros ni librerías de envoltorio. Debes configurar manualmente las cabeceras Authorization: Bearer <tu_clave> y Content-Type: application/json en cada petición.


## Requisitos:

El contenedor donde el usuario hace su solicitud debe ser un campo de texto y un botón de envío que disparen la llamada a la API

Muestra el historial completo de la conversación — mensajes del usuario y respuestas de la IA visualmente diferenciados

Usa useState para gestionar la lista de mensajes y el valor del campo de texto

Cada vez que el usuario envíe un mensaje, agrégalo al estado y envía el historial completo de la conversación (todos los turnos anteriores) a la API de Groq — usa el modelo Llama 3 de Meta disponible en Groq

Gestiona la llamada fetch usando async/await

Mientras la API procesa la petición, muestra un indicador de carga o un estado "pensando..." en la interfaz — usa useState para controlarlo

Si la API devuelve un error (código de estado no 2xx), captúralo y muestra al usuario un mensaje claro y legible en lugar de dejar que la aplicación falle

Tras cada respuesta, lee el objeto usage de la respuesta de la API de Groq

Acumula y muestra el total acumulado de tokens de prompt enviados durante toda la sesión

Acumula y muestra el total acumulado de tokens de completado recibidos durante toda la sesión

Muestra el total combinado de tokens consumidos hasta el momento en la sesión

Muestra las métricas adicionales de la respuesta de Groq: nombre del modelo, tiempo de respuesta o tokens por segundo

Usa useEffect para cargar el historial de la conversación desde localStorage cuando el componente se monte

Guarda el historial de la conversación en localStorage después de cada nuevo mensaje para que la sesión sobreviva una recarga de página

Incluye un botón "Borrar conversación" que reinicie el estado de mensajes y limpie el localStorage
