# Manual de Desarrollo - App Finanzas Personales

## 1. Introducción
Este documento detalla el proceso de creación de la aplicación de gestión de finanzas personales, cumpliendo con los requisitos de multipantalla, almacenamiento local y en la nube (Supabase), manejo de archivos, multiusuario y multiidioma.

## 2. Tecnologías Utilizadas
- **Frontend**: React, Vite, TypeScript
- **Estilos**: Tailwind CSS (Diseño responsivo y estética moderna)
- **Backend/Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Almacenamiento**: Supabase Storage
- **Navegación**: React Router DOM
- **Internacionalización**: i18next

## 3. Arquitectura del Proyecto
La estructura del proyecto sigue una arquitectura modular:

- `src/components`: Componentes UI reutilizables (Layout, Sidebar, ProtectedRoute).
- `src/pages`: Vistas principales (Login, Dashboard, Transactions, Files).
- `src/services`: Lógica de comunicación con Supabase.
- `src/store`: Estado global con Zustand (Manejo de sesión de usuario).
- `src/types`: Definiciones de tipos TypeScript.

## 4. Desarrollo Paso a Paso

### Paso 1: Inicialización y Configuración
Se creó el proyecto utilizando Vite y se configuró Tailwind CSS.
**Prompt utilizado**: "Inicializar proyecto Vite + React y configurar Tailwind CSS".

### Paso 2: Autenticación (Supabase)
Se implementó el registro e inicio de sesión utilizando Supabase Auth.
**Código destacado** (`src/store/useAuthStore.ts`):
Gestión del estado de la sesión del usuario.
```typescript
export const useAuthStore = create<AuthState>((set) => ({
  // ... lógica de sesión
  checkUser: async () => { /* ... */ },
}));
```

### Paso 3: Base de Datos y CRUD (Transacciones)
Se diseñó el esquema en Supabase (ver `supabase_schema.sql`) y se creó el servicio de transacciones.
**Código destacado** (`src/services/transactionService.ts`):
Funciones `getTransactions`, `createTransaction`, `updateTransaction`, `deleteTransaction`.

### Paso 4: Interfaz de Usuario (Dashboard y Listas)
Se creó un Dashboard con tarjetas de resumen y una lista de transacciones. Se usó Tailwind para asegurar que fuera responsivo ("Multipantalla").
**Captura**: (Aquí iría una captura del Dashboard con gráficas/tarjetas).

### Paso 5: Manejo de Archivos
Se integró Supabase Storage para subir recibos o imágenes.
**Código destacado** (`src/services/storageService.ts`):
Lógica para `uploadFile` y `getFiles` obteniendo URLs públicas.

## 5. Instrucciones para Generar APK (Android)

Para convertir esta aplicación web en una aplicación Android nativa, utilizamos **Capacitor**.

### Prerrequisitos
- Node.js instalado.
- Android Studio instalado y configurado.

### Pasos
1. **Instalar Capacitor**:
   ```bash
   npm install @capacitor/core
   npm install -D @capacitor/cli
   ```

2. **Inicializar Capacitor**:
   ```bash
   npx cap init FinanzasApp com.example.finanzasapp
   ```

3. **Instalar Plataforma Android**:
   ```bash
   npm install @capacitor/android
   npx cap add android
   ```

4. **Construir el Proyecto Web**:
   Debemos generar la carpeta `dist` con la compilación de React.
   ```bash
   npm run build
   ```

5. **Sincronizar con Android**:
   Copia los archivos de `dist` a la plataforma Android nativa.
   ```bash
   npx cap sync
   ```

6. **Abrir en Android Studio**:
   ```bash
   npx cap open android
   ```
   Desde Android Studio, puedes ejecutar la app en un emulador o generar el APK firmado desde `Build > Generate Signed Bundle / APK`.

   **Ubicación rápida del APK (Debug):**
   Si compilas desde la línea de comandos (`gradlew assembleDebug`), el archivo se genera en:
   `AppFinal/android/app/build/outputs/apk/debug/app-debug.apk`

   ### Cómo pasar el APK al móvil
   1. **Por Cable USB**: Conecta tu móvil al PC, activa "Transferencia de archivos" y pega el archivo `.apk` en la carpeta "Descargas" de tu móvil.
   2. **Por Google Drive/WhatsApp Web**: Sube el archivo `.apk` y descárgalo en tu móvil.
   3. **Instalación**: En el móvil, pulsa sobre el archivo descargado. (Tendrás que dar permiso para "Instalar aplicaciones desconocidas").

## 6. Enlaces Requeridos
- **App Web**: [Enlace a tu despliegue, e.g., Vercel/Netlify]
- **Repositorio GitHub**: [Enlace a tu repositorio]
- **Proceso de Resolución**: [Enlace a este documento]
