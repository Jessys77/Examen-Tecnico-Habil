# Catálogo de Estados y Municipios

Aplicación web desarrollada en Node.js con Express para administrar un catálogo de estados y municipios de México.

## 📋 Características

- ✅ Consulta y pantalla principal
- ✅ Registro de estado
- ✅ Modificación del estado
- ✅ Eliminar estado
- ✅ Registro de municipio
- ✅ Modificación de municipio
- ✅ Eliminar municipio
- ✅ Validación de datos
- ✅ Manejo de excepciones
- ✅ Interfaz moderna y responsive

## 🛠️ Tecnologías Utilizadas

- **Backend:** Node.js + Express
- **Base de Datos:** SQLite (better-sqlite3)
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Arquitectura:** REST API

## 📦 Requisitos Previos

- Node.js (versión 14 o superior)
- npm (incluido con Node.js)

## 🚀 Instalación

1. **Clonar o descargar el proyecto**

2. **Instalar dependencias:**
   ```bash
   cd root
   npm install
   ```

3. **Inicializar la base de datos:**
   ```bash
   npm run init-db
   ```
   Esto creará el archivo `db/catalogo.db` con las tablas necesarias.

4. **Iniciar el servidor:**
   ```bash
   npm start
   ```

5. **Abrir en el navegador:**
   ```
   http://localhost:3000
   ```

## 📁 Estructura del Proyecto

```
root/
├── controllers/
│   ├── estadoController.js    # Controlador de estados
│   └── municipioController.js  # Controlador de municipios
├── db/
│   ├── db.js                  # Configuración de base de datos
│   ├── schema.sql             # Esquema de la base de datos
│   ├── init.js                # Script de inicialización
│   └── catalogo.db            # Archivo de base de datos SQLite (se crea automáticamente)
├── index.js                   # Servidor Express
├── index.html                 # Interfaz de usuario
├── package.json               # Dependencias del proyecto
└── README.md                  # Este archivo
```

## 🎯 Funcionalidades

### Estados

- **Crear Estado:** Permite registrar un nuevo estado con nombre, número de habitantes y capital.
- **Listar Estados:** Muestra todos los estados registrados.
- **Editar Estado:** Permite modificar los datos de un estado existente.
- **Eliminar Estado:** Elimina un estado y todos sus municipios asociados (CASCADE).

### Municipios

- **Crear Municipio:** Permite registrar un nuevo municipio con:
  - Nombre
  - Tipo de zona (Urbana/Rural)
  - Número de habitantes (con validación de rangos)
  - Es Pueblo Mágico (checkbox)
  - Tipo (Desierto, Playa, Ciudad, Montaña)
  - Estado al que pertenece (select)

- **Listar Municipios:** Muestra todos los municipios con su información completa.
- **Editar Municipio:** Permite modificar los datos de un municipio existente.
- **Eliminar Municipio:** Elimina un municipio específico.

## 🔒 Validaciones

### Estados
- Nombre: Requerido
- Número de habitantes: Debe ser >= 0
- Capital: Requerido

### Municipios
- Nombre: Requerido
- Tipo de zona: Debe ser 'Urbana' o 'Rural'
- Número de habitantes: Debe estar en uno de los siguientes rangos:
  - 1 a 1,000
  - 10,001 a 100,000
  - 100,001 a 1,000,000
  - 1,000,001 en adelante
- Tipo: Debe ser 'Desierto', 'Playa', 'Ciudad' o 'Montaña'
- Estado: Debe seleccionarse de la lista de estados disponibles

## 📊 Base de Datos

### Diagrama E-R
Ver archivo `DIAGRAMA_ER.md` para el diagrama entidad-relación completo.

### Esquema de Tablas

**Tabla: estado**
- `id_estado` (PK, AUTOINCREMENT)
- `nombre` (TEXT, NOT NULL)
- `numero_habitantes` (INTEGER, CHECK >= 0)
- `capital` (TEXT, NOT NULL)

**Tabla: municipio**
- `id_municipio` (PK, AUTOINCREMENT)
- `nombre` (TEXT, NOT NULL)
- `tipo_zona` (TEXT, CHECK IN ('Urbana','Rural'))
- `numero_habitantes` (INTEGER, CHECK >= 1)
- `pueblo_magico` (INTEGER, DEFAULT 0)
- `tipo` (TEXT, CHECK IN ('Desierto','Playa','Ciudad','Montaña'))
- `id_estado` (FK → estado.id_estado, ON DELETE CASCADE)

## 🔌 API REST

### Estados

- `GET /estados` - Obtener todos los estados
- `POST /estados` - Crear un nuevo estado
- `PUT /estados/:id` - Actualizar un estado
- `DELETE /estados/:id` - Eliminar un estado

### Municipios

- `GET /municipios` - Obtener todos los municipios
- `POST /municipios` - Crear un nuevo municipio
- `PUT /municipios/:id` - Actualizar un municipio
- `DELETE /municipios/:id` - Eliminar un municipio

## 🐛 Solución de Problemas

### Error: Puerto 3000 en uso
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# O usar otro puerto
set PORT=3001 && npm start
```

### Error de base de datos
```bash
# Recrear la base de datos
npm run init-db
```

### Dependencias faltantes
```bash
npm install
```

## 📝 Scripts Disponibles

- `npm start` - Inicia el servidor
- `npm run dev` - Inicia el servidor con nodemon (auto-reload)
- `npm run init-db` - Inicializa la base de datos

## 🎨 Características de la Interfaz

- Diseño moderno y responsive
- Modales para editar registros
- Confirmación antes de eliminar
- Mensajes de éxito/error claros
- Validación en tiempo real
- Formato de números con separadores de miles

## 📸 Capturas de Pantalla

La aplicación incluye:
- Formularios intuitivos para crear estados y municipios
- Listas con botones de acción (Editar/Eliminar)
- Modales para editar registros
- Mensajes de confirmación y feedback

## 🔐 Manejo de Errores

- Validación en frontend y backend
- Mensajes de error descriptivos
- Manejo de excepciones en todos los endpoints
- Logs de errores en consola del servidor

## 📄 Licencia

Este proyecto fue desarrollado como parte de un examen técnico.

## 👨‍💻 Autor

Desarrollado para el examen técnico de desarrollo de aplicaciones web.

---

**Nota:** Para más detalles sobre el diseño de la base de datos, consultar `DIAGRAMA_ER.md`.
