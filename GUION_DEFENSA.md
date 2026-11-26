# Guion de defensa · AquaMuestra (16 diapositivas, ~15 min)

Cada integrante debe poder explicar CUALQUIER consulta y cubrir todos los puntos de la rúbrica (problema, datos, SQL vs NoSQL, modelo, CRUD y conclusión): la evaluación es individual. Reparto sugerido para hablar; el resto lo repasa.

| Quién | Diapositivas |
|---|---|
| Daniel | 1–2, 5–7 (problema, SQL vs NoSQL) |
| Abraham | 3–4, 8–12 (datos, documento, Create y Read) |
| Renato | 13–16 (Update, Delete, conclusión, anexos) |

## 1. El problema y los datos (30 s)
"El operario toma una muestra de choritos en el centro y hoy la anota a mano. Necesitamos guardar centro, línea, conteo, tallas, fotos y estado, y consultar pendientes, urgentes y por fecha."

## 2. SQL vs NoSQL (1 min)
"Para ver UNA ficha en Oracle haría falta unir 9 tablas. En MongoDB la ficha es un solo documento: un `find`, cero JOIN. Oracle sigue siendo mejor para facturación o integridad estricta."

## 3. Justificar el documento (1,5 min)
- `centro {}`, `operario {}`, `supervision {}`: relaciones 1 a 1; se leen siempre junto a la muestra.
- `etiquetas []`: lista de textos; se filtra con `$all`.
- `lecturas [ {} ]`: una muestra tiene N mediciones; en SQL sería una tabla hija con JOIN.
- `fotos [ {} ]`: evidencia que viaja con la ficha.

## 4. Explicar el CRUD
| Consulta | Qué hace y por qué |
|---|---|
| `insertOne` | El operario registra una ficha nueva en terreno. |
| `insertMany` | Carga inicial de 9 fichas de una vez. |
| `find({conteo_total:{$gte:50,$lte:100}})` | Rango: muestras con conteo entre 50 y 100. |
| `find({etiquetas:{$all:[...]}})` | Arreglo: fichas con TODAS esas etiquetas. |
| `find({'centro.comuna':{$in:[...]}})` | Subdocumento con notación punto + lista. |
| `find({$or:[...]})` | Pendientes sin sincronizar O urgentes. |
| `find({}, {_id:0,...}).sort().limit(3)` | Proyección + las 3 más recientes. |
| `distinct('centro.nombre')` | Qué centros tienen muestras. |
| `updateOne + $set` | El supervisor aprueba y deja su comentario. |
| `updateOne + $inc + $push` | Se suman 30 ejemplares y se agrega la lectura. |
| `$inc` negativo | Corrección: resta 5 ejemplares. |
| `updateMany + $unset` | Borra el campo temporal `borrador` de todas las fichas. |
| `deleteOne` | Borra una ficha puntual (foto ilegible). |
| `deleteMany({estado:'rechazada', sincronizado:false})` | Dos condiciones para no borrar nunca fichas aprobadas. |

## Preguntas probables
- *¿Por qué no tablas?* Porque la ficha siempre se lee completa; los JOIN no aportan.
- *¿Y si cambia un centro?* Se actualiza con `updateMany` por `centro.nombre`; es el costo de embeber, aceptable porque los centros casi no cambian.
- *¿Qué evita datos inválidos?* La validación `$jsonSchema` (estado solo pendiente/aprobada/rechazada).
- *¿Por qué `$inc` y no `$set`?* Suma de forma atómica, sin leer antes el valor.
- *¿Por qué documental y no clave-valor, columnar o grafos?* Clave-valor no consulta por rango o estado; columnar apunta a escrituras masivas; grafos sirven cuando lo central son las relaciones. Aquí la ficha se lee completa y tiene datos anidados.
- *¿Desventajas de MongoDB?* Datos repetidos al embeber, sin llaves foráneas nativas y JOIN ($lookup) más limitados. Para facturación o integridad estricta, Oracle.
- *¿Mongo no tiene transacciones?* Sí: ACID por documento y transacciones multi-documento desde la 4.0.
- *¿Por qué corrieron antes en la base test?* El Playground usa test si el bloque se selecciona sin use('aquamuestra_db'). Se detectó en el panel, se borró test.muestras y se agregó use() a cada bloque.
- *¿Qué pasa si ejecutas dos veces un update?* $inc suma otra vez; $unset y $set devuelven matchedCount 0 porque ya no hay nada que cambiar. Se reinicia con el bloque 0.
