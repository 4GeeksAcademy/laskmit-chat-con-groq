# Laskmit Chat con Groq

Proyecto de chat moderno construido con [Next.js](https://nextjs.org) versión 16, utilizando un stack tecnológico moderno y optimizado.

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Descripción |
|---|---|---|
| **Next.js** | 16.2.7 | Framework React con renderizado del lado del servidor |
| **React** | 19.2.4 | Biblioteca para interfaces de usuario |
| **TypeScript** | 5.9.3 | JavaScript con tipado estático |
| **Tailwind CSS** | 4.3.0 | Framework CSS utility-first |
| **ESLint** | 9.39.4 | Linter para JavaScript/TypeScript |

## 📦 Requisitos Previos

- Node.js 18+
- npm 9+

## ⚙️ Configuración de la API de Groq

La API KEY: estará en el archivo .env en la variable siguiente:
GROQ_API_KEY=aqui va la api
El modelo de GROQ que vamos a usar es: llama-3.1-8b-instant

### 1. Instalación de Dependencias

Colocar aqui las dependencias que se instalarán cuando se cree la estructura del proyecto.

### 2. Ejecutar el Servidor de Desarrollo

Colocar aqui las instrucciones del terminal para correr el proyecto

## 📂 Estructura del Proyecto
A continuación se crea una estructura mínima para comenzar con el proyecto usando Next.js + TypeScript + Tailwind + Groq:

- `package.json`: Scripts y dependencias del proyecto.
- `tsconfig.json`: Configuración de TypeScript.
- `next.config.js`: Configuración de Next.js.
- `.env`: Variables de entorno (`GROQ_API_KEY`, `GROQ_MODEL`).
- `.gitignore`: Ignorar `node_modules`, `.next`, `.env`, etc.
- `.eslintrc.cjs`: Configuración base de ESLint.
- `tailwind.config.cjs` y `postcss.config.cjs`: Configuración de Tailwind/PostCSS.
- `styles/globals.css`: Estilos globales con directivas de Tailwind.

Ahora utilizamos el App Router de Next.js y la estructura se organiza en `app/`:

- `app/layout.tsx`: Layout raíz que importa estilos globales.
- `app/page.tsx`: Página principal (sin ejemplos de UI incluidos en el repositorio).
- `components/`: Carpeta para componentes compartidos si las necesitas.

He eliminado los ejemplos de UI y el endpoint placeholder que había creado inicialmente.

Esta estructura sirve como punto de partida. Podemos añadir:

- Integración real con la API de Groq en `app/api` o en un endpoint servidor que prefieras, usando `process.env.GROQ_API_KEY`.