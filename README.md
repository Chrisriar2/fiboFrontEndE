# AI Film Studio Director - FIBO Edition

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## 🚀 Features

- **Image generation with the FIBO API**: Advanced AI technology to create cinematic images
- **Interactive 3D studio**: Control camera and composition in real time
- **Modern interface**: UI/UX optimized with React and Three.js
- **Modular architecture**: Code organized with Zustand for state management

## 🛠️ Requirements

- **Node.js 20+** (the `start-dev.sh` can help set this up)
- **npm** or **yarn**

## 📦 Instalación y ejecución

### Opción 1: Script automático (Recomendado)

```bash
# Hacer ejecutable el script (solo la primera vez)
chmod +x start-dev.sh

# Ejecutar el servidor de desarrollo
./start-dev.sh
```

### Opción 2: Manual

```bash
# Instalar dependencias
npm install

# Configurar Node.js 20
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

# Start server
npm run dev
```

## ⚙️ Configuration

Copia el archivo `.env.example` a `.env` y configura las variables de FIBO:

```env
# FIBO API Configuration
FIBO_API_URL=https://engine.prod.bria-api.com/v2
FIBO_API_KEY=tu_api_key_aqui
FIBO_GENERATE_PATH=/fibo/image/generate
FIBO_AUTH_HEADER=api_token
```

## 🎛️ Lighting and Camera Presets

El frontend ahora soporta presets dinámicos proveniente del backend. Hay dos tipos de presets:

 - Built-in presets (defined in `src/types.ts`): `Studio`, `Golden Hour`, `Midnight`, `Overcast`, `Neon City`.
 - "Director" presets provided by the backend (`/presets/list`) — e.g. `wes_anderson`, `roger_deakins`.

How to use:

- In the side panel (`ControlPanel`), the `Lighting Setup` selector lists built-in presets first.
- Below that, if available, director presets appear as `Director — Name`.
- When selecting a director preset, the scene applies a mapped lighting configuration automatically (for example `golden_hour`, `dramatic`, etc.).

If you need to add new presets in the backend, expose them at `/presets/list` as an object whose value for each key includes `name`, `camera`, `lighting`, and `style`.


## 🌐 Access

Once started, the dev server will be available at:
- **Local**: http://localhost:5173/
- **Network**: http://192.168.1.100:5173/ (and other LAN IPs)

## 📁 Project structure

```
StudioV2/
├── src/
│   ├── components/     # React components
│   ├── services/       # API services (FIBO, backend)
│   ├── stores/         # Zustand stores
│   └── types.ts        # TypeScript definitions
├── public/             # Assets estáticos
└── start-dev.sh        # Script de inicio
```

## 🔧 Technologies

- **React 19** with TypeScript
- **Three.js** + React Three Fiber for 3D
- **Vite** for fast development
- **Zustand** for state management
- **FIBO API** for image generation
- **Tailwind CSS** for styling
