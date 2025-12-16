const db = require('../db/db');

// Listar estados
exports.getEstados = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM estado ORDER BY id_estado');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al listar estados:', err);
    res.status(500).json({ error: 'Error al listar estados', details: err.message });
  }
};

// Crear estado
exports.createEstado = async (req, res) => {
  try {
    const { nombre, numero_habitantes, capital } = req.body;
    if (!nombre || !capital) return res.status(400).json({ error: 'Nombre y capital son requeridos' });
    if (Number.isNaN(Number(numero_habitantes)) || numero_habitantes < 0) {
      return res.status(400).json({ error: 'Número de habitantes inválido' });
    }
    const result = await db.query(
      'INSERT INTO estado (nombre, numero_habitantes, capital) VALUES ($1, $2, $3) RETURNING *',
      [nombre, numero_habitantes, capital]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear estado:', err);
    res.status(500).json({ error: 'Error al crear estado', details: err.message });
  }
};

// Actualizar estado
exports.updateEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, numero_habitantes, capital } = req.body;
    if (!nombre || !capital) return res.status(400).json({ error: 'Nombre y capital son requeridos' });
    if (Number.isNaN(Number(numero_habitantes)) || numero_habitantes < 0) {
      return res.status(400).json({ error: 'Número de habitantes inválido' });
    }
    const result = await db.query(
      'UPDATE estado SET nombre=$1, numero_habitantes=$2, capital=$3 WHERE id_estado=$4 RETURNING *',
      [nombre, numero_habitantes, capital, id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Estado no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar estado:', err);
    res.status(500).json({ error: 'Error al actualizar estado', details: err.message });
  }
};

// Eliminar estado
exports.deleteEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const del = await db.query('DELETE FROM estado WHERE id_estado=$1', [id]);
    if (del.rowCount === 0) return res.status(404).json({ error: 'Estado no encontrado' });
    res.sendStatus(204);
  } catch (err) {
    console.error('Error al eliminar estado:', err);
    res.status(500).json({ error: 'Error al eliminar estado', details: err.message });
  }
};