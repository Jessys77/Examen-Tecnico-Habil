-- Tabla de Estados
CREATE TABLE IF NOT EXISTS estado (
    id_estado INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    numero_habitantes INTEGER CHECK (numero_habitantes >= 0),
    capital TEXT NOT NULL
);

-- Tabla de Municipios
CREATE TABLE IF NOT EXISTS municipio (
    id_municipio INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    tipo_zona TEXT CHECK (tipo_zona IN ('Urbana','Rural')),
    numero_habitantes INTEGER CHECK (numero_habitantes >= 1),
    pueblo_magico INTEGER DEFAULT 0, -- SQLite usa INTEGER para booleanos (0=false, 1=true)
    tipo TEXT CHECK (tipo IN ('Desierto','Playa','Ciudad','Montaña')),
    id_estado INTEGER REFERENCES estado(id_estado) ON DELETE CASCADE
);
