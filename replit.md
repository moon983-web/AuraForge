# 3D Avatar Creator

## Overview

This is a full-stack web application for creating, customizing, and interacting with 3D avatars. Users can generate random avatars or customize their appearance, personality, and voice characteristics. The application features a 3D viewer using React Three Fiber for rendering humanoid avatars, and integrates with LM Studio for conversational AI capabilities. The app supports multilingual interfaces (English/German) and includes text-to-speech and speech recognition for voice interactions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and dev server with HMR support
- Client-side routing handled through a single-page application structure
- Component-based architecture with reusable UI elements

**3D Rendering**
- React Three Fiber (@react-three/fiber) for declarative 3D scene management
- React Three Drei (@react-three/drei) for common 3D utilities (OrbitControls, KeyboardControls)
- React Three Postprocessing for visual effects
- GLSL shader support via vite-plugin-glsl
- Custom humanoid avatar models with procedural generation and animation

**UI Components**
- Radix UI primitives for accessible, unstyled components
- Tailwind CSS for styling with custom design tokens
- shadcn/ui component patterns for consistent UI elements
- Custom color palette: bright-blue, dark-brown, black, light-grey, dark-blue
- Typography: Lora (serif), Space Grotesk (mono), Inter (sans)

**State Management**
- Local React state with useState/useRef for component-level state
- Custom hooks for reusable stateful logic (useAvatarStorage, useLMStudio, useSpeech)
- LocalStorage for persistent avatar data
- TanStack Query for server state management (configured but minimal usage)

**Internationalization**
- i18next for multilingual support (English/German)
- Translation keys organized by feature domain
- Language toggle component in header

**Avatar System**
- TypeScript interfaces define avatar structure (appearance, personality, voice)
- Random avatar generation with configurable parameters
- Procedural humanoid mesh generation based on avatar properties
- Animation states: idle, talking, waving, nodding
- Avatar storage with import/export capabilities

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and API routing
- ESM modules throughout the codebase
- Custom middleware for request logging and error handling
- Vite middleware integration for development mode with HMR

**API Endpoints**
- `/api/health` - Health check endpoint
- `/api/avatars` - Avatar management (currently returns empty array)
- `/api/chat` - Proxy endpoint for LM Studio integration

**Development vs Production**
- Development: Vite dev server with middleware mode for instant updates
- Production: Static file serving from dist/public after build
- Environment-based configuration using NODE_ENV

**Data Storage**
- In-memory storage implementation (MemStorage class)
- Interface-based storage abstraction (IStorage) for future database integration
- User schema defined but minimal current usage
- Avatar data stored client-side in LocalStorage

### External Dependencies

**Database**
- PostgreSQL configured via Drizzle ORM
- Neon Database serverless driver (@neondatabase/serverless)
- Schema defined in shared/schema.ts with users table
- Migration system via drizzle-kit
- Currently using in-memory storage; database infrastructure ready but not actively used

**LM Studio Integration**
- Local LLM inference via LM Studio (http://localhost:1234/v1 by default)
- OpenAI-compatible chat completions API
- Connection testing and status tracking
- Configurable model, max tokens, and temperature
- CORS proxy through backend /api/chat endpoint

**Browser APIs**
- Web Speech API for speech recognition (SpeechRecognition/webkitSpeechRecognition)
- Speech Synthesis API for text-to-speech with configurable voice parameters
- LocalStorage for persistent data
- Canvas/WebGL for 3D rendering

**Font Loading**
- Fontsource packages for self-hosted fonts (Inter, Lora, Space Grotesk)
- CSS font-face declarations in index.css

**Build & Development Tools**
- TypeScript for static type checking
- ESBuild for server-side bundling
- PostCSS with Tailwind CSS for style processing
- TSX for running TypeScript files directly in development

**Asset Handling**
- Support for 3D model formats: .gltf, .glb
- Audio file formats: .mp3, .ogg, .wav
- Vite asset pipeline for optimization and bundling