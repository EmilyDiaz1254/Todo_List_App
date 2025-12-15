# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
📝 Todo List App
📌 Descripción

Todo List App es una aplicación de tareas sencilla que permite:

Crear, leer, actualizar y eliminar tareas (CRUD).

Marcar tareas como completadas.

Interfaz limpia y responsiva con React + Vite.

Backend en Node.js + Express conectado a MySQL (Railway).

Se encuentra desplegada completamente en Railway:

Backend: https://backend-production-b652.up.railway.app

Frontend: https://frontend-production-69f7.up.railway.app

🛠 Tecnologías
Parte	Tecnología
Frontend	React, Vite, CSS inline
Backend	Node.js, Express
Base de datos	MySQL (Railway)
Despliegue	Railway
🔧 Variables de Entorno
1️⃣ Backend (backend/.env)
DB_HOST=yamabiko.proxy.rlwy.net
DB_USER=root
DB_PASSWORD=<tu-contraseña>
DB_NAME=railway
DB_PORT=12764
PORT=4000


✅ El backend se conecta a MySQL de Railway usando SSL. La tabla trabajos se crea automáticamente si no existe.

2️⃣ Frontend (frontend/.env)
VITE_API_URL=https://backend-production-b652.up.railway.app


⚠️ Muy importante:

No uses localhost en producción.

No agregues / al final de la URL.

🚀 Instalación
1️⃣ Backend
cd backend
npm install
npm start       # Para desarrollo

2️⃣ Frontend
cd frontend
npm install
npm run dev     # Desarrollo
npm run build   # Producción


🔹 En producción, sube el build al hosting de Railway o a otro servicio de hosting estático.

🌐 URLs de Despliegue

Backend: https://backend-production-b652.up.railway.app

Frontend: https://frontend-production-69f7.up.railway.app

📝 Uso de la Aplicación

Crear tarea:

Escribe el título en el input

Presiona Enter o clic en Crear

Editar tarea:

Haz clic en Editar

Modifica el texto

Haz clic en Guardar

Marcar como completada:

Usa el checkbox junto a la tarea

Eliminar tarea:

Haz clic en Eliminar

Todas las acciones se sincronizan automáticamente con el backend y actualizan la lista.

🔗 Ejemplos de fetch (Frontend)
Obtener todas las tareas
const res = await fetch(`${import.meta.env.VITE_API_URL}/trabajos`);
const data = await res.json();

Crear una nueva tarea
await fetch(`${import.meta.env.VITE_API_URL}/trabajos`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Nueva tarea" }),
});

Actualizar tarea
await fetch(`${import.meta.env.VITE_API_URL}/trabajos/${id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Nuevo título", done: 1 }),
});

Eliminar tarea
await fetch(`${import.meta.env.VITE_API_URL}/trabajos/${id}`, {
  method: "DELETE",
});

⚡ Tips y buenas prácticas

Siempre usa la variable VITE_API_URL en frontend para llamadas al backend.

No uses rutas relativas al frontend para llamar al backend.

Mantén las credenciales de MySQL privadas y seguras en Railway.

La tabla trabajos se crea automáticamente si no existe, no es necesario crearla manualmente.

🛡 Errores comunes y soluciones
Error	Causa	Solución
405 Method Not Allowed	URL backend mal configurada	Revisar VITE_API_URL en frontend
Unexpected token '<'	Backend devuelve HTML (frontend llama a frontend)	Revisar URL correcta en fetch
Conexión MySQL fallida	Host, usuario o contraseña incorrectos	Revisar variables de entorno del backend
Tabla trabajos no existe	Conexión correcta pero tabla no creada	Reinicia backend, se crea automáticamente
📂 Estructura del Proyecto
todo-project/
├─ backend/
│  ├─ index.js
│  ├─ db.js
│  └─ package.json
├─ frontend/
│  ├─ src/
│  │  └─ App.jsx
│  ├─ vite.config.js
│  └─ package.json
└─ README.md

📌 Notas finales

Proyecto listo para producción en Railway.

Frontend y backend separados, comunicación mediante la variable VITE_API_URL.

Fácil de extender con autenticación, filtros o categorías.
