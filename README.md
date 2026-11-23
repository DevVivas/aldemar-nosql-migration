# AquaMuestra · Migración a MongoDB Atlas

Equipo Tridente N°18: Daniel Villamizar, Abraham Vivas, Renato Uribe.
Origen: [aldemar-chile-muestreo](https://github.com/DevVivas/aldemar-chile-muestreo) (app Android de muestreo de choritos).

## 1. Introducción
Los operarios registran muestras de choritos en terreno (centro, línea, conteo, foto) y el supervisor las aprueba.
Hoy los datos viven en memoria dentro de la app. Este proyecto los lleva a una colección MongoDB.
Tecnologías: MongoDB Atlas + VS Code (extensión MongoDB, Playground).

## 2. Relacional vs no relacional
| | Oracle (SQL) | MongoDB (NoSQL) |
|---|---|---|
| Estructura | Tablas fijas | Documentos JSON flexibles |
| Relaciones | JOIN | Subdocumentos y arreglos |
| Cambio de esquema | ALTER TABLE | Se agrega el campo |
| Escala | Vertical | Horizontal (sharding) |

Una ficha completa en SQL: 9 tablas (`muestra`, `centro`, `linea`, `usuario`, `lectura`, `foto`, `aprobacion`, `etiqueta`, `muestra_etiqueta`) y 8+ JOIN.
En MongoDB: 1 documento, 1 `find`. SQL conviene para facturación o integridad estricta; aquí la ficha se lee siempre completa.

## 3. Modelo documental
BD `aquamuestra_db`, colección `muestras`.

```
codigo_ficha, estado, conteo_total, sincronizado, fecha_registro   campos simples
centro { nombre, sector, comuna, linea, profundidad_m }            subdocumento
operario { nombre, rol }                                           subdocumento
supervision { supervisor, comentario, fecha }                      subdocumento (opcional)
etiquetas [ "biomasa", "semanal" ]                                 arreglo de textos
lecturas [ { especie, talla_mm, peso_g, cantidad } ]               arreglo de subdocumentos
fotos [ { url, tomada_en } ]                                       arreglo de subdocumentos
```

Cambios reales: `$set` estado, `$inc` conteo, `$unset` campo temporal `borrador`.
Validación `$jsonSchema`, índice único en `codigo_ficha`, índice en `centro.nombre + estado`.

## 4. CRUD
Todo en [`aquamuestra.mongodb.js`](aquamuestra.mongodb.js).

1. En VS Code, conecta tu cluster Atlas (extensión MongoDB).
2. Abre `aquamuestra.mongodb.js`.
3. Selecciona el bloque 0 (setup) → clic derecho → *Run Selected Lines From Playground*.
4. Repite con cada bloque numerado (1.1, 2.1, ...). El Playground muestra solo el último resultado, por eso se ejecuta por bloques. **Toma ahí tus capturas.**

Orden recomendado para la demo: insertOne → insertMany → find (2.1–2.9) → update (3.1–3.6) → delete (4.1–4.2).
Los bloques modifican datos: para repetir la demo, vuelve a ejecutar el bloque 0 y los inserts.

## 5. Conclusión
Valor: ficha completa en una consulta, trazabilidad, cambios de campos sin migración.
Mejoras: sincronizar la app Android con Atlas, aggregation de biomasa semanal, dashboard en Atlas Charts, índice geoespacial por centro.

## 6. Anexos
- Script completo: `aquamuestra.mongodb.js`
- Presentación: `AquaMuestra_NoSQL.pptx` (se regenera con `npm install && node presentacion/build_ppt.js`)
- Guion de defensa: `GUION_DEFENSA.md`

## Qué falta hacer (tú)
1. Crear el cluster en MongoDB Atlas (tier gratuito M0) y conectarlo en VS Code.
2. Ejecutar el script y pegar tus capturas en las 4 diapositivas de CRUD (cuadros punteados).
Los datos son de demostración.
