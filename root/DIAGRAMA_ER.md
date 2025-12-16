# Diagrama Entidad-Relación

## Descripción del Modelo de Datos

### Entidad: ESTADO

**Atributos:**
- `id_estado` (PK): INTEGER - Identificador único del estado (AUTOINCREMENT)
- `nombre` (NN): TEXT(100) - Nombre del estado
- `numero_habitantes` (CK): INTEGER - Número de habitantes (>= 0)
- `capital` (NN): TEXT(100) - Capital del estado

**Restricciones:**
- `numero_habitantes` debe ser mayor o igual a 0

---

### Entidad: MUNICIPIO

**Atributos:**
- `id_municipio` (PK): INTEGER - Identificador único del municipio (AUTOINCREMENT)
- `nombre` (NN): TEXT(100) - Nombre del municipio
- `tipo_zona` (CK): TEXT(10) - Tipo de zona: 'Urbana' o 'Rural'
- `numero_habitantes` (CK): INTEGER - Número de habitantes (>= 1)
  - Rangos válidos: 1-1000, 10001-100000, 100001-1000000, 1000001+
- `pueblo_magico` (DF): INTEGER (BOOLEAN) - Indica si es pueblo mágico (0=false, 1=true)
- `tipo` (CK): TEXT(20) - Tipo de municipio: 'Desierto', 'Playa', 'Ciudad', 'Montaña'
- `id_estado` (FK): INTEGER - Referencia al estado al que pertenece

**Restricciones:**
- `tipo_zona` debe ser 'Urbana' o 'Rural'
- `numero_habitantes` debe ser >= 1 y estar en los rangos especificados
- `tipo` debe ser uno de: 'Desierto', 'Playa', 'Ciudad', 'Montaña'

---

## Relación

**ESTADO** (1) ────< (N) **MUNICIPIO**

- **Tipo:** Uno a Muchos (1:N)
- **Cardinalidad:** Un estado puede tener uno o varios municipios. Un municipio pertenece a un solo estado.
- **Integridad Referencial:** 
  - `ON DELETE CASCADE`: Si se elimina un estado, se eliminan automáticamente todos sus municipios asociados.

---

## Representación Gráfica (Texto)

```
┌─────────────────────┐
│      ESTADO         │
├─────────────────────┤
│ PK id_estado        │
│    nombre           │
│    numero_habitantes│
│    capital          │
└─────────────────────┘
         │
         │ 1
         │
         │ N
         │
         ▼
┌─────────────────────┐
│     MUNICIPIO       │
├─────────────────────┤
│ PK id_municipio     │
│    nombre           │
│    tipo_zona        │
│    numero_habitantes│
│    pueblo_magico    │
│    tipo             │
│ FK id_estado        │──┐
└─────────────────────┘  │
                         │
                         │
         ┌───────────────┘
         │
         │ (ON DELETE CASCADE)
```

---

## Esquema SQL

```sql
CREATE TABLE estado (
    id_estado INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    numero_habitantes INTEGER CHECK (numero_habitantes >= 0),
    capital TEXT NOT NULL
);

CREATE TABLE municipio (
    id_municipio INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    tipo_zona TEXT CHECK (tipo_zona IN ('Urbana','Rural')),
    numero_habitantes INTEGER CHECK (numero_habitantes >= 1),
    pueblo_magico INTEGER DEFAULT 0,
    tipo TEXT CHECK (tipo IN ('Desierto','Playa','Ciudad','Montaña')),
    id_estado INTEGER REFERENCES estado(id_estado) ON DELETE CASCADE
);
```

---

## Notas de Diseño

1. **Normalización:** El modelo está en 3NF (Tercera Forma Normal), evitando redundancias.

2. **Integridad Referencial:** Se utiliza `ON DELETE CASCADE` para mantener la integridad de datos cuando se elimina un estado.

3. **Validaciones:** Las restricciones CHECK aseguran la integridad de los datos a nivel de base de datos.

4. **Escalabilidad:** El diseño permite agregar más atributos o relaciones en el futuro sin afectar la estructura existente.

