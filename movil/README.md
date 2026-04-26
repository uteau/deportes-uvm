# Deportes UVM — App Móvil

Aplicación móvil de la Plataforma Deportiva Universitaria UVM. Construida con React Native y Expo (JavaScript) para iOS y Android.

## Requisitos previos

- Node.js 18 o superior
- npm 9 o superior
- Expo Go instalado en tu dispositivo (o un emulador Android / simulador iOS)

## Instalación

```bash
npm install
```

## Variables de entorno

Copia el archivo de ejemplo y ajusta los valores:

```bash
cp .env.example .env
```

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | URL base de la API REST | `http://localhost:3000` |

## Ejecución

```bash
# Iniciar el servidor de desarrollo (abre el QR para Expo Go)
npm start

# Abrir directamente en Android
npm run android

# Abrir directamente en iOS
npm run ios
```

## Estructura del proyecto

```
movil/
├── App.js              # Punto de entrada de la aplicación
├── app.json            # Configuración de Expo
├── babel.config.js     # Configuración de Babel
├── package.json        # Dependencias y scripts
├── .env.example        # Variables de entorno de ejemplo
└── README.md           # Este archivo
```

## Stack

- **React Native** con **Expo SDK 51**
- **React Navigation** — navegación por tabs y stack
- **Axios** — cliente HTTP para consumir la API REST
- **expo-secure-store** — almacenamiento seguro del JWT
