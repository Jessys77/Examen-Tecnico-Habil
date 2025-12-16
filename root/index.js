const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware para leer JSON
app.use(express.json());

// Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Importar controladores
const estadoController = require('./controllers/estadoController');
const municipioController = require('./controllers/municipioController');

// Ruta raíz - servir HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rutas de Estados
app.get('/estados', estadoController.getEstados);
app.post('/estados', estadoController.createEstado);
app.put('/estados/:id', estadoController.updateEstado);
app.delete('/estados/:id', estadoController.deleteEstado);

// Rutas de Municipios
app.get('/municipios', municipioController.getMunicipios);
app.post('/municipios', municipioController.createMunicipio);
app.put('/municipios/:id', municipioController.updateMunicipio);
app.delete('/municipios/:id', municipioController.deleteMunicipio);

// Levantar servidor
const server = app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: El puerto ${port} ya está en uso.`);
    console.log(`\nOpciones:`);
    console.log(`1. Cerrar el proceso que usa el puerto ${port}:`);
    console.log(`   netstat -ano | findstr :${port}`);
    console.log(`   taskkill /PID <PID> /F`);
    console.log(`\n2. Usar otro puerto:`);
    console.log(`   set PORT=3001 && npm start`);
    console.log(`   o`);
    console.log(`   PORT=3001 npm start`);
    process.exit(1);
  } else {
    console.error('Error al iniciar el servidor:', err);
    process.exit(1);
  }
});