const db = require('../db/db');

const zonasValidas = ['Urbana', 'Rural'];
const tiposValidos = ['Desierto', 'Playa', 'Ciudad', 'Montaña'];

// Esta función ya no se usa para validar, solo se mantiene por compatibilidad
// La validación real se hace comparando con el número de habitantes del estado
function validarRangoHabitantes(numero_habitantes) {
  // Esta función ya no bloquea, solo valida que sea un número válido
  const num = Number(numero_habitantes);
  
  // Validar que sea un número válido
  if (isNaN(num) || !isFinite(num)) {
    return { valido: false, mensaje: 'Número de habitantes debe ser un número válido' };
  }
  
  if (num < 1) {
    return { valido: false, mensaje: 'Número de habitantes debe ser mayor a 0' };
  }
  
  // Siempre retornar válido si es un número mayor a 0
  // La validación real se hace comparando con el estado
  return { valido: true };
}

// Listar municipios
exports.getMunicipios = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM municipio ORDER BY id_municipio');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al listar municipios:', err);
    res.status(500).json({ error: 'Error al listar municipios', details: err.message });
  }
};

// Crear municipio
exports.createMunicipio = async (req, res) => {
  try {
    const { nombre, tipo_zona, numero_habitantes, pueblo_magico, tipo, id_estado } = req.body;

    console.log('Datos recibidos para crear municipio:', { nombre, tipo_zona, numero_habitantes, pueblo_magico, tipo, id_estado });

    if (!nombre || !id_estado) {
      return res.status(400).json({ error: 'Nombre e id_estado son requeridos' });
    }
    if (!zonasValidas.includes(tipo_zona)) {
      return res.status(400).json({ error: 'Tipo de zona inválido. Debe ser "Urbana" o "Rural"' });
    }
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({ error: 'Tipo de municipio inválido. Debe ser "Desierto", "Playa", "Ciudad" o "Montaña"' });
    }
    
    // Convertir número de habitantes a entero
    const numHabitantes = parseInt(numero_habitantes, 10);
    console.log('Número de habitantes convertido:', numHabitantes, 'Tipo:', typeof numHabitantes);
    
    // Validar que el número de habitantes sea mayor a 0
    if (isNaN(numHabitantes) || numHabitantes < 1) {
      return res.status(400).json({ error: 'El número de habitantes debe ser mayor a 0' });
    }
    
    // Obtener el estado para verificar su número de habitantes
    const estadoResult = await db.query('SELECT numero_habitantes, nombre FROM estado WHERE id_estado = $1', [id_estado]);
    if (estadoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Estado no encontrado' });
    }
    
    const estadoHabitantes = estadoResult.rows[0].numero_habitantes;
    const estadoNombre = estadoResult.rows[0].nombre;
    
    console.log(`Estado ${estadoNombre} tiene ${estadoHabitantes} habitantes. Municipio tiene ${numHabitantes} habitantes.`);
    
    // Validar que el número de habitantes del municipio sea menor o igual al del estado
    if (numHabitantes > estadoHabitantes) {
      return res.status(400).json({ 
        error: `El número de habitantes del municipio (${numHabitantes.toLocaleString()}) no puede ser mayor que el del estado "${estadoNombre}" (${estadoHabitantes.toLocaleString()})` 
      });
    }
    
    // La validación principal es que sea menor o igual al estado
    // Los rangos fijos son solo informativos, no bloquean si el municipio es menor al estado

    console.log('Intentando insertar municipio con datos:', {
      nombre,
      tipo_zona,
      numHabitantes,
      pueblo_magico: Boolean(pueblo_magico),
      tipo,
      id_estado
    });

    const result = await db.query(
      'INSERT INTO municipio (nombre, tipo_zona, numero_habitantes, pueblo_magico, tipo, id_estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nombre, tipo_zona, numHabitantes, Boolean(pueblo_magico) ? 1 : 0, tipo, id_estado]
    );
    
    console.log('Municipio creado exitosamente:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error completo al crear municipio:', err);
    console.error('Stack trace:', err.stack);
    res.status(500).json({ 
      error: 'Error al crear municipio', 
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// Actualizar municipio
exports.updateMunicipio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, tipo_zona, numero_habitantes, pueblo_magico, tipo, id_estado } = req.body;

    if (!nombre || !id_estado) {
      return res.status(400).json({ error: 'Nombre e id_estado son requeridos' });
    }
    if (!zonasValidas.includes(tipo_zona)) {
      return res.status(400).json({ error: 'Tipo de zona inválido. Debe ser "Urbana" o "Rural"' });
    }
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({ error: 'Tipo de municipio inválido. Debe ser "Desierto", "Playa", "Ciudad" o "Montaña"' });
    }
    
    // Convertir número de habitantes a entero
    const numHabitantes = parseInt(numero_habitantes, 10);
    
    // Validar que el número de habitantes sea mayor a 0
    if (isNaN(numHabitantes) || numHabitantes < 1) {
      return res.status(400).json({ error: 'El número de habitantes debe ser mayor a 0' });
    }
    
    // Obtener el estado para verificar su número de habitantes
    const estadoResult = await db.query('SELECT numero_habitantes, nombre FROM estado WHERE id_estado = $1', [id_estado]);
    if (estadoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Estado no encontrado' });
    }
    
    const estadoHabitantes = estadoResult.rows[0].numero_habitantes;
    const estadoNombre = estadoResult.rows[0].nombre;
    
    // Validar que el número de habitantes del municipio sea menor o igual al del estado
    if (numHabitantes > estadoHabitantes) {
      return res.status(400).json({ 
        error: `El número de habitantes del municipio (${numHabitantes.toLocaleString()}) no puede ser mayor que el del estado "${estadoNombre}" (${estadoHabitantes.toLocaleString()})` 
      });
    }

    const result = await db.query(
      'UPDATE municipio SET nombre=$1, tipo_zona=$2, numero_habitantes=$3, pueblo_magico=$4, tipo=$5, id_estado=$6 WHERE id_municipio=$7 RETURNING *',
      [nombre, tipo_zona, numHabitantes, Boolean(pueblo_magico), tipo, id_estado, id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Municipio no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar municipio:', err);
    res.status(500).json({ error: 'Error al actualizar municipio', details: err.message });
  }
};

// Eliminar municipio
exports.deleteMunicipio = async (req, res) => {
  try {
    const { id } = req.params;
    const del = await db.query('DELETE FROM municipio WHERE id_municipio=$1', [id]);
    if (del.rowCount === 0) return res.status(404).json({ error: 'Municipio no encontrado' });
    res.sendStatus(204);
  } catch (err) {
    console.error('Error al eliminar municipio:', err);
    res.status(500).json({ error: 'Error al eliminar municipio', details: err.message });
  }
};