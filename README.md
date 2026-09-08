# SOCIUM ACADEMY

Plataforma educativa tecnológica (EdTech) para **SOCIUM TECHNOLOGY**.

---

## 🚀 Tecnologías

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Shadcn/ui**
- **Supabase** (Auth, PostgreSQL, Storage)
- **Lucide React** (iconos)
- **next-themes** (modo oscuro/claro)

---

## 📦 Dependencias instaladas

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install lucide-react
npm install next-themes
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge
📥 Instalación del proyecto
Bash
git clone [https://github.com/jairorubio716/socium-academy.git](https://github.com/jairorubio716/socium-academy.git)
cd socium-academy
npm install
🔐 Variables de entorno
Crea un archivo .env.local en la raíz del proyecto con las siguientes variables:

Fragmento de código
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_llave_anon_de_supabase
Nota: Las claves reales NO están en el repositorio. Cada desarrollador debe crear su propio archivo .env.local.

🗄️ Base de datos
El script SQL para crear la base de datos se entrega por separado (bd.sql).

Abre tu proyecto en Supabase.

Ve al SQL Editor.

Ejecuta el contenido del archivo bd.sql.

Esto creará automáticamente:

14 tablas con sus respectivas relaciones.

Políticas RLS (seguridad a nivel de fila).

Trigger para crear el perfil de usuario al registrarse.

Insignias predeterminadas del sistema.

🔑 Google OAuth (Iniciar sesión con Google)
El proyecto incluye la opción de Iniciar sesión con Google. Para que funcione, cada desarrollador debe:

Crear un proyecto en Google Cloud Console.

Configurar la pantalla de consentimiento OAuth.

Generar un Client ID y Client Secret.

Activar Google como proveedor en Supabase (Authentication → Providers → Google).

Copiar el Client ID y Client Secret dentro de Supabase.

Importante: Las credenciales de Google no están incluidas en el repositorio. Cada desarrollador debe generar las suyas propias con su cuenta de Google o la cuenta corporativa de SOCIUM.

🖥️ Desarrollo
Para iniciar el servidor local de desarrollo:

Bash
npm run dev
Abre http://localhost:3000 en tu navegador.

🌿 Ramas del repositorio
main: Versión estable con autenticación, dashboard y diseño base.

feature/cms: Panel de administración completo (gestión de categorías).

🎨 Configuración de Shadcn/ui
Bash
npx shadcn@latest init
Selección recomendada:

Base UI: Recommended

Tema: Nova - Lucide / Geist

Color base: Slate

📄 Estructura del proyecto
Plaintext
src/
├── app/
│   ├── auth/              # Login, Registro, Callback de Google
│   ├── admin/             # Panel de administración (CMS)
│   ├── dashboard/         # Dashboard del estudiante
│   └── layout.tsx         # Layout principal con ThemeProvider
├── components/
│   ├── ui/                # Componentes de Shadcn/ui
│   └── admin/             # Componentes del panel de admin
├── lib/
│   └── supabase/          # Clientes de Supabase (client.ts, server.ts)
└── actions/               # Server Actions (lógica de negocio)

 Notas importantes
El proyecto está estructurado totalmente en español (tablas, columnas, mensajes de la interfaz).

El modo oscuro/claro está configurado globalmente con next-themes.

La autenticación soporta credenciales estándar (correo/contraseña) y OAuth con Google.

 Documentación útil
Documentación de Next.js

Documentación de Supabase

Documentación de Shadcn/ui

Documentación de Google Cloud OAuth

📄 Licencia
Propiedad de SOCIUM TECHNOLOGY. Todos los derechos reservados.