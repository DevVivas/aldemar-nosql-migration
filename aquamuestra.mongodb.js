/* =====================================================================
   AquaMuestra - Migración a MongoDB Atlas
   BD: aquamuestra_db  |  Colección: muestras
   Equipo Tridente N°18: Daniel Villamizar, Abraham Vivas, Renato Uribe

   CÓMO USAR (VS Code + extensión MongoDB):
   1. Conéctate a tu cluster Atlas.
   2. Ejecuta el bloque 0 (setup) una sola vez.
   3. Para la demo: selecciona UN bloque DESDE su línea use('aquamuestra_db');
      hasta el final de la instrucción, y ejecútalo con Ctrl+Shift+P ->
      "MongoDB: Run Selected Lines From Playground". Sin el use() el
      Playground corre en la base "test". (Solo muestra el resultado de
      la última instrucción ejecutada.)
   Datos 100% de demostración.
   ===================================================================== */

use('aquamuestra_db');

/* ---------------------------------------------------------------------
   0. SETUP: colección con validación de esquema + índices
   --------------------------------------------------------------------- */
db.muestras.drop();
db.createCollection('muestras', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['codigo_ficha', 'estado', 'conteo_total', 'sincronizado',
                 'fecha_registro', 'centro', 'operario', 'lecturas'],
      properties: {
        codigo_ficha: { bsonType: 'string' },
        estado: { enum: ['pendiente', 'aprobada', 'rechazada'] },
        conteo_total: { bsonType: 'number', minimum: 0 },
        sincronizado: { bsonType: 'bool' },
        fecha_registro: { bsonType: 'date' },
        centro: { bsonType: 'object', required: ['nombre', 'linea'] },
        operario: { bsonType: 'object', required: ['nombre', 'rol'] },
        etiquetas: { bsonType: 'array', items: { bsonType: 'string' } },
        lecturas: { bsonType: 'array', minItems: 1 }
      }
    }
  }
});
db.muestras.createIndex({ codigo_ficha: 1 }, { unique: true });
db.muestras.createIndex({ 'centro.nombre': 1, estado: 1 });

/* =====================================================================
   1. CREATE
   ===================================================================== */

// 1.1 insertOne: el operario registra UNA muestra en terreno
use('aquamuestra_db');
db.muestras.insertOne({
  codigo_ficha: 'MUE-1001',
  estado: 'aprobada',
  conteo_total: 75,
  sincronizado: true,
  fecha_registro: new Date('2026-10-25T08:30:00-03:00'),
  centro: { nombre: 'Centro Los Fiordos', sector: 'Huito', comuna: 'Quellón', linea: 'A-04', profundidad_m: 8.5 },
  operario: { nombre: 'Operador Demo1', rol: 'OPERARIO' },
  supervision: { supervisor: 'Supervisor Demo', comentario: 'Muestra representativa, talla homogénea', fecha: new Date('2026-10-25T16:00:00-03:00') },
  etiquetas: ['biomasa', 'semanal'],
  lecturas: [
    { especie: 'chorito', talla_mm: 52, peso_g: 14.2, cantidad: 40 },
    { especie: 'chorito', talla_mm: 61, peso_g: 18.9, cantidad: 35 }
  ],
  fotos: [{ url: 'fotos/MUE-1001-1.jpg', tomada_en: new Date('2026-10-25T08:32:00-03:00') }]
});

// 1.2 insertMany: carga inicial (9 fichas más, con estados y centros variados)
use('aquamuestra_db');
db.muestras.insertMany([
  { codigo_ficha: 'MUE-1002', estado: 'pendiente', conteo_total: 105, sincronizado: false,
    fecha_registro: new Date('2026-10-24T15:45:00-03:00'),
    centro: { nombre: 'Punta Pelluco', sector: 'Módulo 104', comuna: 'Calbuco', linea: 'Línea 12', profundidad_m: 6.0 },
    operario: { nombre: 'Operador Demo2', rol: 'OPERARIO' },
    etiquetas: ['urgente', 'biomasa'], borrador: true,
    lecturas: [ { especie: 'chorito', talla_mm: 48, peso_g: 11.5, cantidad: 60 },
                { especie: 'chorito', talla_mm: 55, peso_g: 15.0, cantidad: 45 } ],
    fotos: [{ url: 'fotos/MUE-1002-1.jpg', tomada_en: new Date('2026-10-24T15:47:00-03:00') }] },

  { codigo_ficha: 'MUE-1003', estado: 'aprobada', conteo_total: 50, sincronizado: true,
    fecha_registro: new Date('2026-10-23T10:15:00-03:00'),
    centro: { nombre: 'Calbuco Sur', sector: 'Bahía Sur', comuna: 'Calbuco', linea: 'Línea 15', profundidad_m: 7.2 },
    operario: { nombre: 'Operador Demo1', rol: 'OPERARIO' },
    supervision: { supervisor: 'Supervisor Demo', comentario: 'Aprobada para informe semanal', fecha: new Date('2026-10-23T17:00:00-03:00') },
    etiquetas: ['semanal'],
    lecturas: [ { especie: 'chorito', talla_mm: 58, peso_g: 16.8, cantidad: 50 } ],
    fotos: [{ url: 'fotos/MUE-1003-1.jpg', tomada_en: new Date('2026-10-23T10:17:00-03:00') }] },

  { codigo_ficha: 'MUE-1004', estado: 'rechazada', conteo_total: 80, sincronizado: false,
    fecha_registro: new Date('2026-10-22T09:00:00-03:00'),
    centro: { nombre: 'Reloncaví Estuario', sector: 'Estuario', comuna: 'Cochamó', linea: 'Línea 10', profundidad_m: 5.5 },
    operario: { nombre: 'Operador Demo2', rol: 'OPERARIO' },
    supervision: { supervisor: 'Supervisor Demo', comentario: 'Talla bajo el mínimo comercial', fecha: new Date('2026-10-22T14:00:00-03:00') },
    etiquetas: ['urgente', 'reanalisis'],
    lecturas: [ { especie: 'chorito', talla_mm: 35, peso_g: 5.1, cantidad: 80 } ],
    fotos: [{ url: 'fotos/MUE-1004-1.jpg', tomada_en: new Date('2026-10-22T09:03:00-03:00') }] },

  { codigo_ficha: 'MUE-1005', estado: 'pendiente', conteo_total: 72, sincronizado: false,
    fecha_registro: new Date('2026-10-26T11:20:00-03:00'),
    centro: { nombre: 'Centro Chiloé', sector: 'Huito', comuna: 'Castro', linea: 'Línea 18', profundidad_m: 9.0 },
    operario: { nombre: 'Operador Demo1', rol: 'OPERARIO' },
    etiquetas: ['biomasa', 'semanal'], borrador: true,
    lecturas: [ { especie: 'chorito', talla_mm: 50, peso_g: 12.4, cantidad: 30 },
                { especie: 'chorito', talla_mm: 57, peso_g: 16.1, cantidad: 42 } ],
    fotos: [{ url: 'fotos/MUE-1005-1.jpg', tomada_en: new Date('2026-10-26T11:22:00-03:00') }] },

  { codigo_ficha: 'MUE-1006', estado: 'aprobada', conteo_total: 93, sincronizado: true,
    fecha_registro: new Date('2026-10-21T13:40:00-03:00'),
    centro: { nombre: 'Isla Chauques', sector: 'Chauques Norte', comuna: 'Quinchao', linea: 'Línea 12', profundidad_m: 8.0 },
    operario: { nombre: 'Operador Demo2', rol: 'OPERARIO' },
    supervision: { supervisor: 'Supervisor Demo', comentario: 'Sin observaciones', fecha: new Date('2026-10-21T18:00:00-03:00') },
    etiquetas: ['convenio', 'semanal'],
    lecturas: [ { especie: 'chorito', talla_mm: 60, peso_g: 17.5, cantidad: 55 },
                { especie: 'chorito', talla_mm: 54, peso_g: 14.0, cantidad: 38 } ],
    fotos: [{ url: 'fotos/MUE-1006-1.jpg', tomada_en: new Date('2026-10-21T13:42:00-03:00') }] },

  { codigo_ficha: 'MUE-1007', estado: 'pendiente', conteo_total: 44, sincronizado: true,
    fecha_registro: new Date('2026-10-27T08:10:00-03:00'),
    centro: { nombre: 'Centro Los Fiordos', sector: 'Huito', comuna: 'Quellón', linea: 'Línea 15', profundidad_m: 7.5 },
    operario: { nombre: 'Operador Demo1', rol: 'OPERARIO' },
    etiquetas: ['urgente'],
    lecturas: [ { especie: 'chorito', talla_mm: 59, peso_g: 17.0, cantidad: 44 } ],
    fotos: [{ url: 'fotos/MUE-1007-1.jpg', tomada_en: new Date('2026-10-27T08:12:00-03:00') }] },

  { codigo_ficha: 'MUE-1008', estado: 'aprobada', conteo_total: 48, sincronizado: true,
    fecha_registro: new Date('2026-10-20T16:30:00-03:00'),
    centro: { nombre: 'Centro Bahía Azul', sector: 'Bahía Azul', comuna: 'Dalcahue', linea: 'Línea 10', profundidad_m: 6.5 },
    operario: { nombre: 'Operador Demo2', rol: 'OPERARIO' },
    supervision: { supervisor: 'Supervisor Demo', comentario: 'Aprobada', fecha: new Date('2026-10-20T19:00:00-03:00') },
    etiquetas: ['biomasa'],
    lecturas: [ { especie: 'chorito', talla_mm: 56, peso_g: 15.4, cantidad: 48 } ],
    fotos: [{ url: 'fotos/MUE-1008-1.jpg', tomada_en: new Date('2026-10-20T16:32:00-03:00') }] },

  { codigo_ficha: 'MUE-1009', estado: 'rechazada', conteo_total: 25, sincronizado: false,
    fecha_registro: new Date('2026-10-19T12:00:00-03:00'),
    centro: { nombre: 'Punta Pelluco', sector: 'Módulo 104', comuna: 'Calbuco', linea: 'Línea 18', profundidad_m: 4.0 },
    operario: { nombre: 'Operador Demo1', rol: 'OPERARIO' },
    supervision: { supervisor: 'Supervisor Demo', comentario: 'Foto ilegible, repetir muestreo', fecha: new Date('2026-10-19T17:30:00-03:00') },
    etiquetas: ['reanalisis'],
    lecturas: [ { especie: 'chorito', talla_mm: 40, peso_g: 6.3, cantidad: 25 } ],
    fotos: [] },

  { codigo_ficha: 'MUE-1010', estado: 'pendiente', conteo_total: 61, sincronizado: false,
    fecha_registro: new Date('2026-10-28T09:25:00-03:00'),
    centro: { nombre: 'Calbuco Sur', sector: 'Bahía Sur', comuna: 'Calbuco', linea: 'Línea 10', profundidad_m: 6.8 },
    operario: { nombre: 'Operador Demo2', rol: 'OPERARIO' },
    etiquetas: ['urgente', 'semanal', 'biomasa'],
    lecturas: [ { especie: 'chorito', talla_mm: 51, peso_g: 13.0, cantidad: 33 },
                { especie: 'chorito', talla_mm: 63, peso_g: 20.1, cantidad: 28 } ],
    fotos: [{ url: 'fotos/MUE-1010-1.jpg', tomada_en: new Date('2026-10-28T09:27:00-03:00') }] }
]);

/* =====================================================================
   2. READ
   ===================================================================== */

// 2.1 Ficha completa por código (1 consulta, 0 JOIN)
use('aquamuestra_db');
db.muestras.find({ codigo_ficha: 'MUE-1001' });

// 2.2 Rango $gte/$lte: muestras con conteo entre 50 y 100
use('aquamuestra_db');
db.muestras.find({ conteo_total: { $gte: 50, $lte: 100 } });

// 2.3 Lista $in: muestras de centros de Calbuco o Quellón (subdocumento)
use('aquamuestra_db');
db.muestras.find({ 'centro.comuna': { $in: ['Calbuco', 'Quellón'] } });

// 2.4 Arreglo $all: etiquetadas "urgente" Y "biomasa" a la vez
use('aquamuestra_db');
db.muestras.find({ etiquetas: { $all: ['urgente', 'biomasa'] } });

// 2.5 $nin: todo lo que NO es rechazada ni aprobada (queda pendiente)
use('aquamuestra_db');
db.muestras.find({ estado: { $nin: ['rechazada', 'aprobada'] } });

// 2.6 $or: pendientes sin sincronizar O con etiqueta urgente
use('aquamuestra_db');
db.muestras.find({ $or: [
  { estado: 'pendiente', sincronizado: false },
  { etiquetas: 'urgente' }
] });

// 2.7 $elemMatch: alguna lectura con talla >= 55 mm Y peso >= 16 g
use('aquamuestra_db');
db.muestras.find({ lecturas: { $elemMatch: { talla_mm: { $gte: 55 }, peso_g: { $gte: 16 } } } });

// 2.8 Proyección + sort + limit: las 3 más recientes (solo lo útil, sin _id)
use('aquamuestra_db');
db.muestras
  .find({}, { _id: 0, codigo_ficha: 1, estado: 1, 'centro.nombre': 1, fecha_registro: 1 })
  .sort({ fecha_registro: -1 })
  .limit(3);

// 2.9 distinct: ¿qué centros tienen muestras?
use('aquamuestra_db');
db.muestras.distinct('centro.nombre');

/* =====================================================================
   3. UPDATE
   ===================================================================== */

// 3.1 $set (+ subdocumento nuevo): el supervisor aprueba MUE-1002
use('aquamuestra_db');
db.muestras.updateOne(
  { codigo_ficha: 'MUE-1002' },
  { $set: {
      estado: 'aprobada',
      supervision: { supervisor: 'Supervisor Demo', comentario: 'Muestra homogénea', fecha: new Date() }
  } }
);

// 3.2 $inc + $push: el operario agrega 30 ejemplares a MUE-1005 (suma al conteo)
use('aquamuestra_db');
db.muestras.updateOne(
  { codigo_ficha: 'MUE-1005' },
  { $inc: { conteo_total: 30 },
    $push: { lecturas: { especie: 'chorito', talla_mm: 49, peso_g: 11.8, cantidad: 30 } } }
);

// 3.3 $inc negativo: corrección, se restan 5 ejemplares de la 1ª lectura de MUE-1001
use('aquamuestra_db');
db.muestras.updateOne(
  { codigo_ficha: 'MUE-1001' },
  { $inc: { 'lecturas.0.cantidad': -5, conteo_total: -5 } }
);

// 3.4 $addToSet: agrega etiqueta sin duplicarla
use('aquamuestra_db');
db.muestras.updateOne(
  { codigo_ficha: 'MUE-1010' },
  { $addToSet: { etiquetas: 'revisado' } }
);

// 3.5 updateMany + $unset: limpia el campo temporal "borrador" de todas las fichas
use('aquamuestra_db');
db.muestras.updateMany({ borrador: { $exists: true } }, { $unset: { borrador: '' } });

// 3.6 updateMany + $set: sincroniza todo lo no sincronizado que no esté rechazado
use('aquamuestra_db');
db.muestras.updateMany(
  { sincronizado: false, estado: { $ne: 'rechazada' } },
  { $set: { sincronizado: true } }
);

/* =====================================================================
   4. DELETE
   ===================================================================== */

// 4.1 deleteOne: se borra la ficha puntual MUE-1009 (foto ilegible, se repitió)
use('aquamuestra_db');
db.muestras.deleteOne({ codigo_ficha: 'MUE-1009' });

// 4.1b Prueba del filtro antes de borrar: debe aparecer solo lo que se va a eliminar
use('aquamuestra_db');
db.muestras.find({ estado: 'rechazada', sincronizado: false });

// 4.2 deleteMany seguro: solo rechazadas Y sin sincronizar (nunca aprobadas)
use('aquamuestra_db');
db.muestras.deleteMany({ estado: 'rechazada', sincronizado: false });

// Control final: debe quedar 8 documentos
use('aquamuestra_db');
db.muestras.countDocuments();

/* =====================================================================
   5. VALIDACIÓN (opcional, para el informe): este insert DEBE fallar
      con "Document failed validation" porque el estado no es válido.
   ===================================================================== */
use('aquamuestra_db');
db.muestras.insertOne({ codigo_ficha: 'MUE-9999', estado: 'otro', conteo_total: 1, sincronizado: false,
  fecha_registro: new Date(), centro: { nombre: 'X', linea: 'L' }, operario: { nombre: 'Y', rol: 'OPERARIO' },
  lecturas: [{ especie: 'chorito', talla_mm: 50, peso_g: 10, cantidad: 1 }] });
