# Panel Admin UVM

Panel de administración web para la Plataforma Deportiva Universitaria UVM. Construido con Vite + React (JavaScript).

## Requisitos

- Node.js 18 o superior
- npm 9 o superior

## Configuración

1. Instala las dependencias:

```bash
npm install
```

2. Copia el archivo de variables de entorno y ajusta los valores:

```bash
cp .env.example .env
```

| Variable       | Descripción                        | Valor por defecto          |
|----------------|------------------------------------|----------------------------|
| `VITE_API_URL` | URL base de la API REST del backend | `http://localhost:3000`    |

## Scripts disponibles

| Comando         | Descripción                                      |
|-----------------|--------------------------------------------------|
| `npm run dev`   | Inicia el servidor de desarrollo en `localhost:5173` |
| `npm run build` | Genera el build de producción en `dist/`         |
| `npm run preview` | Previsualiza el build de producción localmente |

## Estructura del proyecto

```
admin/
├── index.html          # Punto de entrada HTML de Vite
├── vite.config.js      # Configuración de Vite
├── .env.example        # Variables de entorno requeridas
└── src/
    ├── main.jsx        # Punto de entrada de React
    └── App.jsx         # Componente raíz (placeholder)
```

## Notas

- Este proyecto es parte del monorepo `deportes-uvm/`. El backend se encuentra en `../backend/` y la app móvil en `../movil/`.
- Las rutas, el layout y el cliente HTTP se configuran en tareas posteriores (12.x).
