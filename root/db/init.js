const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

function initDatabase() {
  try {
    console.log('Inicializando base de datos SQLite...');
    
    // Crear conexión
    const dbPath = path.join(__dirname, 'catalogo.db');
    const db = new Database(dbPath);
    
    // Habilitar foreign keys
    db.pragma('foreign_keys = ON');
    
    // Leer y ejecutar schema
    console.log('Creando tablas...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Ejecutar cada comando SQL por separado
    const commands = schema.split(';').filter(cmd => cmd.trim().length > 0);
    
    for (const command of commands) {
      const trimmed = command.trim();
      if (trimmed) {
        try {
          db.exec(trimmed);
        } catch (err) {
          // Ignorar errores de "table already exists"
          if (!err.message.includes('already exists')) {
            throw err;
          }
        }
      }
    }
    
    console.log('✅ Tablas creadas exitosamente');

    // Verificar que las tablas existen
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('estado', 'municipio')").all();
    
    if (tables.length === 2) {
      console.log('✅ Tablas verificadas: estado, municipio');
    } else {
      console.log('⚠️  Algunas tablas no se encontraron');
    }
    
    db.close();
    console.log('\n✅ Base de datos inicializada correctamente');
    console.log('📁 Archivo de base de datos: db/catalogo.db');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error al inicializar la base de datos:');
    console.error(err.message);
    if (err.stack) {
      console.error(err.stack);
    }
    process.exit(1);
  }
}

initDatabase();
