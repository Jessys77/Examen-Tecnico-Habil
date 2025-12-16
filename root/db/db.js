const Database = require('better-sqlite3');
const path = require('path');

// Crear conexión a la base de datos SQLite
const dbPath = path.join(__dirname, 'catalogo.db');
const db = new Database(dbPath);

// Habilitar foreign keys
db.pragma('foreign_keys = ON');

// Convertir placeholders de PostgreSQL ($1, $2) a SQLite (?)
function convertPlaceholders(sql) {
  return sql.replace(/\$(\d+)/g, () => '?');
}

// Wrapper para mantener compatibilidad con la API de pg (async)
const dbWrapper = {
  query: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      try {
        // Convertir placeholders de PostgreSQL a SQLite
        const sqliteSql = convertPlaceholders(sql);
        
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
          const stmt = db.prepare(sqliteSql);
          const rows = stmt.all(params);
          resolve({ rows });
        } else if (sql.includes('INSERT') && sql.includes('RETURNING')) {
          // Para INSERT con RETURNING
          const insertSql = sqliteSql.replace(/RETURNING\s+\*/i, '');
          const stmt = db.prepare(insertSql);
          const result = stmt.run(params);
          const lastId = result.lastInsertRowid;
          
          // Obtener el registro insertado
          const tableMatch = sql.match(/INTO\s+(\w+)/i);
          if (tableMatch && lastId) {
            const table = tableMatch[1];
            const idColumn = table === 'estado' ? 'id_estado' : 'id_municipio';
            const selectStmt = db.prepare(`SELECT * FROM ${table} WHERE ${idColumn} = ?`);
            const row = selectStmt.get(lastId);
            resolve({ rows: row ? [row] : [], rowCount: result.changes });
          } else {
            resolve({ rows: [], rowCount: result.changes });
          }
        } else if (sql.includes('UPDATE') && sql.includes('RETURNING')) {
          // Para UPDATE con RETURNING
          const updateSql = sqliteSql.replace(/RETURNING\s+\*/i, '');
          const stmt = db.prepare(updateSql);
          const result = stmt.run(params);
          
          if (result.changes > 0) {
            // Obtener el registro actualizado
            const tableMatch = sql.match(/UPDATE\s+(\w+)/i);
            const idMatch = sql.match(/WHERE\s+(\w+)\s*=/i);
            if (tableMatch && idMatch) {
              const table = tableMatch[1];
              const idColumn = idMatch[1];
              // El último parámetro es el ID
              const id = params[params.length - 1];
              const selectStmt = db.prepare(`SELECT * FROM ${table} WHERE ${idColumn} = ?`);
              const row = selectStmt.get(id);
              resolve({ rows: row ? [row] : [], rowCount: result.changes });
            } else {
              resolve({ rows: [], rowCount: result.changes });
            }
          } else {
            resolve({ rows: [], rowCount: result.changes });
          }
        } else {
          // DELETE u otras operaciones
          const stmt = db.prepare(sqliteSql);
          const result = stmt.run(params);
          resolve({ rows: [], rowCount: result.changes });
        }
      } catch (err) {
        reject(err);
      }
    });
  }
};

module.exports = dbWrapper;
