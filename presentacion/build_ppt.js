// Genera AquaMuestra_NoSQL.pptx  ->  node presentacion/build_ppt.js
const path = require("path");
const pptxgen = require("pptxgenjs");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");
const si = require("react-icons/si");
const { applyTheme } = require("./apply_theme.js");

const NAVY = "003366", TEAL = "008080", BG = "F5F5F5", INK = "212121";
const ORANGE = "FF9800", WHITE = "FFFFFF", MUTED = "5F6B76", CODEBG = "0B2239";
const THEME = {
  name: "AquaMuestra", headFontFace: "Cambria", bodyFontFace: "Calibri",
  colors: { dk1: INK, lt1: WHITE, dk2: NAVY, lt2: BG, accent1: TEAL, accent2: ORANGE,
            accent3: "4DB6AC", accent4: "1565C0", accent5: "90A4AE", accent6: "FFCC80",
            hlink: TEAL, folHlink: NAVY },
};
const OUT = path.join(__dirname, "..", "AquaMuestra_NoSQL.pptx");

async function icon(Comp, color, size = 256) {
  const svg = renderToStaticMarkup(React.createElement(Comp, { color: "#" + color, size: String(size) }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

(async () => {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
  pres.title = "AquaMuestra - Migración a MongoDB Atlas";
  pres.author = "Equipo Tridente N°18";
  pres.theme = { headFontFace: "Cambria", bodyFontFace: "Calibri" };

  pres.defineSlideMaster({
    title: "PORTADA", background: { color: NAVY },
    objects: [{ placeholder: { options: { name: "title", type: "title", x: 0.8, y: 2.3, w: 11.5, h: 1.6,
      fontFace: "Cambria", fontSize: 54, bold: true, color: WHITE, margin: 0, valign: "top", align: "left" }, text: "" } }],
  });
  pres.defineSlideMaster({
    title: "CONTENIDO", background: { color: WHITE },
    objects: [{ placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.75, w: 12.1, h: 0.9,
      fontFace: "Cambria", fontSize: 36, bold: true, color: NAVY, margin: 0, valign: "top", align: "left" }, text: "" } }],
    slideNumber: { x: 12.3, y: 7.0, w: 0.6, h: 0.3, fontFace: "Calibri", fontSize: 11, color: "8A8F98" },
  });

  // ---------- helpers ----------
  const content = (tag, title, notes) => {
    const s = pres.addSlide({ masterName: "CONTENIDO" });
    s.addText(tag, { x: 0.6, y: 0.35, w: 8, h: 0.35, fontSize: 13, bold: true, color: TEAL, margin: 0,
      isTextBox: true, objectName: "Sección" });
    s.addText(title, { placeholder: "title" });
    if (notes) s.addNotes(notes);
    return s;
  };
  const code = (s, x, y, w, h, lines, fs = 15) => {
    s.addShape(pres.ShapeType.roundRect, { x, y, w, h, fill: { color: CODEBG }, rectRadius: 0.12,
      line: { color: CODEBG }, objectName: "Panel código" });
    const runs = lines.map((l, i) => ({ text: l, options: {
      color: l.trim().startsWith("//") ? "7FD6D6" : "E6EEF5", breakLine: i < lines.length - 1 } }));
    s.addText(runs, { x: x + 0.15, y: y + 0.1, w: w - 0.3, h: h - 0.2, fontFace: "Courier New",
      fontSize: fs, margin: 0.05, valign: "top", isTextBox: true, objectName: "Código" });
  };
  const captura = (s, x, y, w, h, label) => {
    s.addShape(pres.ShapeType.roundRect, { x, y, w, h, fill: { color: BG }, rectRadius: 0.12,
      line: { color: "B0B8C0", dashType: "dash", width: 1.5 }, objectName: "Hueco captura" });
    s.addText([{ text: "Captura real del Playground", options: { bold: true, breakLine: true } },
      { text: label } ], { x, y, w, h, align: "center", valign: "middle", fontSize: 14, color: MUTED,
      margin: 0.2, isTextBox: true });
  };
  const card = (s, x, y, w, h, fill = BG) =>
    s.addShape(pres.ShapeType.roundRect, { x, y, w, h, fill: { color: fill }, rectRadius: 0.12,
      line: { color: fill }, objectName: "Tarjeta" });
  const chip = (s, text, x, y, w, color, fg = WHITE) => {
    s.addShape(pres.ShapeType.roundRect, { x, y, w, h: 0.4, fill: { color }, rectRadius: 0.2, line: { color } });
    s.addText(text, { x, y, w, h: 0.4, align: "center", valign: "middle", fontSize: 14, bold: true,
      color: fg, margin: 0, isTextBox: true });
  };

  // ---------- 1. Portada ----------
  let s = pres.addSlide({ masterName: "PORTADA" });
  s.addText("AquaMuestra", { placeholder: "title" });
  s.addText("De registros manuales a un modelo documental en MongoDB Atlas", { x: 0.8, y: 3.9, w: 11, h: 0.7,
    fontSize: 24, color: "CFE3F0", margin: 0, isTextBox: true });
  s.addText("Equipo Tridente N°18  ·  Daniel Villamizar  ·  Abraham Vivas  ·  Renato Uribe",
    { x: 0.8, y: 6.2, w: 11.5, h: 0.4, fontSize: 16, color: "CFE3F0", margin: 0, isTextBox: true });
  s.addImage({ data: await icon(si.SiMongodb, "4DB6AC"), x: 11.3, y: 0.8, w: 1.2, h: 1.2, altText: "MongoDB" });
  s.addNotes("Presenta el equipo y el tema. Una frase: migramos el registro de muestras de AquaMuestra a MongoDB Atlas.");

  // ---------- 2. Introducción ----------
  s = content("1 · INTRODUCCIÓN", "Muestras de choritos, hoy lentas y sin trazabilidad",
    "Daniel. Explicar en simple: el operario toma una muestra en el centro de cultivo y hoy la anota a mano. Se pierde tiempo y no se sabe quién midió qué.");
  const intro = [
    [fa.FaClipboardList, "Registro manual", "Papel en terreno, transcripción tardía"],
    [fa.FaSearchLocation, "Sin trazabilidad", "No se sabe quién, dónde ni cuándo"],
    [fa.FaMobileAlt, "AquaMuestra", "App móvil: centro, línea, conteo y foto"],
  ];
  for (let i = 0; i < 3; i++) {
    const x = 0.6 + i * 4.1, last = i === 2;
    card(s, x, 2.2, 3.9, 3.6, last ? NAVY : BG);
    s.addShape(pres.ShapeType.ellipse, { x: x + 0.4, y: 2.6, w: 1.0, h: 1.0, fill: { color: last ? TEAL : NAVY }, line: { color: last ? TEAL : NAVY } });
    s.addImage({ data: await icon(intro[i][0], WHITE), x: x + 0.65, y: 2.85, w: 0.5, h: 0.5, altText: intro[i][1] });
    s.addText(intro[i][1], { x: x + 0.4, y: 3.9, w: 3.2, h: 0.5, fontSize: 24, bold: true, color: last ? WHITE : NAVY, margin: 0, isTextBox: true });
    s.addText(intro[i][2], { x: x + 0.4, y: 4.5, w: 3.2, h: 1.0, fontSize: 16, color: last ? "CFE3F0" : INK, margin: 0, valign: "top", isTextBox: true });
  }

  // ---------- 3. Problema y datos ----------
  s = content("1 · INTRODUCCIÓN", "Qué guardamos y qué consultamos",
    "Abraham. Los datos que ya maneja la app (centro, línea, conteo, foto, estado) y las preguntas que hace el supervisor todos los días.");
  card(s, 0.6, 2.0, 5.9, 3.9);
  s.addText("Guardamos", { x: 0.9, y: 2.2, w: 5, h: 0.5, fontSize: 24, bold: true, color: TEAL, margin: 0, isTextBox: true });
  s.addText(["Centro, sector y línea", "Conteo y tallas por lectura", "Fotos de evidencia", "Estado de validación", "Operario y supervisor"]
    .map((t, i, a) => ({ text: t, options: { bullet: true, breakLine: i < a.length - 1, paraSpaceAfter: 8 } })),
    { x: 0.9, y: 2.9, w: 5.3, h: 2.8, fontSize: 22, color: INK, margin: 0, valign: "top", isTextBox: true });
  card(s, 6.8, 2.0, 5.9, 3.9, NAVY);
  s.addText("Consultamos", { x: 7.1, y: 2.2, w: 5, h: 0.5, fontSize: 24, bold: true, color: "7FD6D6", margin: 0, isTextBox: true });
  s.addText(["¿Qué muestras están pendientes?", "¿Cuáles son urgentes?", "¿Qué centro tiene más conteo?", "¿Qué ficha aprobó el supervisor?", "Historial por fecha"]
    .map((t, i, a) => ({ text: t, options: { bullet: true, breakLine: i < a.length - 1, paraSpaceAfter: 8 } })),
    { x: 7.1, y: 2.9, w: 5.3, h: 2.8, fontSize: 22, color: WHITE, margin: 0, valign: "top", isTextBox: true });

  // ---------- 4. Tecnologías ----------
  s = content("1 · INTRODUCCIÓN", "Tecnologías",
    "Renato. App Android es el origen del dato. Atlas guarda las fichas. VS Code con la extensión MongoDB ejecuta el Playground (.mongodb.js).");
  const tech = [
    [si.SiMongodb, "MongoDB Atlas", "Cluster en la nube. Base aquamuestra_db, colección muestras"],
    [fa.FaCode, "VS Code + MongoDB", "Playground .mongodb.js para ejecutar el CRUD en vivo"],
    [fa.FaAndroid, "App Android", "Kotlin + Jetpack Compose. Origen de los datos"],
  ];
  for (let i = 0; i < 3; i++) {
    const x = 0.6 + i * 4.1;
    card(s, x, 2.2, 3.9, 3.8);
    s.addImage({ data: await icon(tech[i][0], i === 0 ? TEAL : NAVY), x: x + 0.4, y: 2.6, w: 0.9, h: 0.9, altText: tech[i][1] });
    s.addText(tech[i][1], { x: x + 0.4, y: 3.7, w: 3.2, h: 0.5, fontSize: 24, bold: true, color: NAVY, margin: 0, isTextBox: true });
    s.addText(tech[i][2], { x: x + 0.4, y: 4.3, w: 3.2, h: 1.3, fontSize: 16, color: INK, margin: 0, valign: "top", isTextBox: true });
  }

  // ---------- 5. SQL vs NoSQL ----------
  s = content("2 · RELACIONAL VS NO RELACIONAL", "Oracle (SQL) frente a MongoDB (NoSQL)",
    "Daniel. Comparar sin dogmas: ambos son buenos, cambia el tipo de dato. Esquema fijo contra flexible, JOIN contra anidado.");
  const hd = (t, c) => ({ text: t, options: { bold: true, color: WHITE, fill: { color: c }, fontSize: 18, align: "center" } });
  const cell = (t, b = false) => ({ text: t, options: { fontSize: 16, color: INK, bold: b, valign: "middle" } });
  s.addTable([
    [hd("", WHITE), hd("Oracle · SQL", NAVY), hd("MongoDB · NoSQL", TEAL)],
    [cell("Estructura", true), cell("Tablas y columnas fijas"), cell("Documentos JSON flexibles")],
    [cell("Relaciones", true), cell("JOIN entre tablas"), cell("Subdocumentos y arreglos anidados")],
    [cell("Cambios de esquema", true), cell("ALTER TABLE, migración"), cell("Se agrega el campo y listo")],
    [cell("Escala", true), cell("Vertical (servidor más grande)"), cell("Horizontal (sharding)")],
    [cell("Integridad", true), cell("Muy estricta, ACID total"), cell("Validación opcional, ACID por documento")],
  ], { x: 0.6, y: 2.0, w: 12.1, colW: [2.9, 4.6, 4.6], rowH: 0.75, border: { type: "solid", color: "D5DAE0", pt: 1 },
       fill: { color: WHITE }, valign: "middle" });

  // ---------- 6. 9 tablas vs 1 documento ----------
  s = content("2 · RELACIONAL VS NO RELACIONAL", "Una ficha: 9 tablas o 1 documento",
    "Daniel. Para ver UNA muestra completa en Oracle: muestra, centro, linea, usuario (operario y supervisor), lectura, foto, aprobacion, etiqueta y muestra_etiqueta. En Mongo es un find.");
  const tbl = ["MUESTRA", "CENTRO", "LINEA", "USUARIO", "LECTURA", "FOTO", "APROBACION", "ETIQUETA", "MUESTRA_ETIQUETA"];
  tbl.forEach((t, i) => {
    const cx = 0.6 + (i % 3) * 2.45, cy = 2.1 + Math.floor(i / 3) * 1.35;
    s.addShape(pres.ShapeType.roundRect, { x: cx, y: cy, w: 2.3, h: 1.05, fill: { color: i === 0 ? NAVY : BG }, rectRadius: 0.1, line: { color: i === 0 ? NAVY : "C5CCD3" } });
    s.addText(t, { x: cx, y: cy, w: 2.3, h: 1.05, align: "center", valign: "middle", fontSize: t.length > 12 ? 13 : 16, bold: true,
      color: i === 0 ? WHITE : NAVY, margin: 0.05, isTextBox: true });
  });
  s.addText("9 tablas · 8+ JOIN", { x: 0.6, y: 6.2, w: 7.3, h: 0.5, fontSize: 24, bold: true, color: ORANGE, margin: 0, isTextBox: true });
  s.addText("vs", { x: 8.1, y: 3.6, w: 0.8, h: 0.6, fontSize: 28, bold: true, color: MUTED, align: "center", margin: 0, isTextBox: true });
  card(s, 9.1, 2.1, 3.6, 4.05, TEAL);
  s.addText("muestras", { x: 9.3, y: 2.3, w: 3.2, h: 0.5, fontSize: 24, bold: true, color: WHITE, fontFace: "Courier New", margin: 0, isTextBox: true });
  s.addText("{ campos,\n  centro: { },\n  operario: { },\n  etiquetas: [ ],\n  lecturas: [ { } ],\n  fotos: [ { } ] }", { x: 9.3, y: 2.95, w: 3.2, h: 2.9, fontSize: 16, color: WHITE, fontFace: "Courier New", margin: 0, valign: "top", isTextBox: true });
  s.addText("1 documento · 0 JOIN", { x: 9.1, y: 6.2, w: 3.6, h: 0.5, fontSize: 24, bold: true, color: TEAL, margin: 0, isTextBox: true });

  // ---------- 7. Cuándo conviene cada uno ----------
  s = content("2 · RELACIONAL VS NO RELACIONAL", "Cuándo conviene cada uno",
    "Daniel. Si mañana AquaMuestra necesita facturación o contabilidad estricta, eso sí iría en Oracle. La ficha de terreno es lectura completa: documento.");
  card(s, 0.6, 2.0, 5.9, 3.5);
  s.addText("Oracle · SQL", { x: 0.9, y: 2.2, w: 5, h: 0.5, fontSize: 24, bold: true, color: NAVY, margin: 0, isTextBox: true });
  s.addText(["Facturación y contabilidad", "Integridad estricta entre entidades", "Reportes cruzados complejos"]
    .map((t, i, a) => ({ text: t, options: { bullet: true, breakLine: i < a.length - 1, paraSpaceAfter: 8 } })),
    { x: 0.9, y: 2.9, w: 5.3, h: 2.4, fontSize: 20, color: INK, margin: 0, valign: "top", isTextBox: true });
  card(s, 6.8, 2.0, 5.9, 3.5, TEAL);
  s.addText("MongoDB · NoSQL", { x: 7.1, y: 2.2, w: 5, h: 0.5, fontSize: 24, bold: true, color: WHITE, margin: 0, isTextBox: true });
  s.addText(["Ficha que se lee completa", "Datos con forma variable", "Cambios rápidos del modelo"]
    .map((t, i, a) => ({ text: t, options: { bullet: true, breakLine: i < a.length - 1, paraSpaceAfter: 8 } })),
    { x: 7.1, y: 2.9, w: 5.3, h: 2.4, fontSize: 20, color: WHITE, margin: 0, valign: "top", isTextBox: true });
  s.addText("AquaMuestra: la ficha de la muestra se consulta entera, siempre. Elegimos documento.",
    { x: 0.6, y: 5.9, w: 12.1, h: 0.7, fontSize: 22, bold: true, color: NAVY, margin: 0, isTextBox: true });

  // ---------- 8. El documento ----------
  s = content("3 · MODELO DOCUMENTAL", "La ficha de muestra: un documento",
    "Abraham. Mostrar el JSON y recorrer por colores: campos simples, subdocumentos y arreglos. Nombre BD: aquamuestra_db, colección: muestras.");
  const J = [
    ["{", 0], ['  codigo_ficha: "MUE-1001",', 0], ['  estado: "aprobada",', 0], ["  conteo_total: 75,", 0],
    ["  sincronizado: true,", 0], ['  fecha_registro: ISODate("2026-10-25"),', 0],
    ['  centro: { nombre: "Centro Los Fiordos", linea: "A-04" },', 1],
    ['  operario: { nombre: "Operador Demo1", rol: "OPERARIO" },', 1],
    ['  supervision: { supervisor: "Supervisor Demo" },', 1],
    ['  etiquetas: ["biomasa", "semanal"],', 2], ["  lecturas: [", 2],
    ["    { talla_mm: 52, peso_g: 14.2, cantidad: 40 },", 2],
    ["    { talla_mm: 61, peso_g: 18.9, cantidad: 35 }", 2], ["  ],", 2],
    ['  fotos: [ { url: "fotos/MUE-1001-1.jpg" } ]', 2], ["}", 0],
  ];
  const JC = ["E6EEF5", "7FD6D6", "FFB74D"];
  s.addShape(pres.ShapeType.roundRect, { x: 0.6, y: 1.85, w: 8.3, h: 4.7, fill: { color: CODEBG }, rectRadius: 0.12, line: { color: CODEBG } });
  s.addText(J.map(([t, c], i) => ({ text: t, options: { color: JC[c], breakLine: i < J.length - 1 } })),
    { x: 0.8, y: 1.95, w: 7.9, h: 4.5, fontFace: "Courier New", fontSize: 15, margin: 0.05, valign: "top", isTextBox: true });
  chip(s, "Campos simples", 9.3, 2.2, 3.4, "546E7A");
  chip(s, "Subdocumento { }", 9.3, 3.2, 3.4, TEAL);
  chip(s, "Arreglo [ ]", 9.3, 4.2, 3.4, ORANGE, INK);
  s.addText("Texto · número · booleano · fecha BSON", { x: 9.3, y: 5.0, w: 3.4, h: 0.8, fontSize: 14, color: MUTED, margin: 0, valign: "top", isTextBox: true });

  // ---------- 9. Por qué ----------
  s = content("3 · MODELO DOCUMENTAL", "Por qué cada subdocumento y arreglo",
    "Abraham. Regla: si el dato nace y se lee junto a la muestra, va dentro. centro y operario son 1:1, etiquetas, lecturas y fotos son 1:N.");
  const why = [
    ["centro { }", TEAL, "1 muestra, 1 centro: se lee siempre junto"],
    ["operario { } · supervision { }", TEAL, "Quién midió y quién aprobó, sin tabla de usuarios"],
    ["etiquetas [ ]", ORANGE, "Filtrar con $all: urgente, biomasa, semanal"],
    ["lecturas [ { } ]", ORANGE, "N mediciones por muestra. En SQL: tabla hija + JOIN"],
    ["fotos [ { } ]", ORANGE, "Evidencia que viaja con la ficha"],
  ];
  why.forEach(([k, c, t], i) => {
    const y = 2.0 + i * 0.95;
    s.addShape(pres.ShapeType.roundRect, { x: 0.6, y, w: 5.2, h: 0.75, fill: { color: c }, rectRadius: 0.1, line: { color: c } });
    s.addText(k, { x: 0.6, y, w: 5.2, h: 0.75, align: "center", valign: "middle", fontFace: "Courier New", fontSize: 16, bold: true,
      color: c === ORANGE ? INK : WHITE, margin: 0.05, isTextBox: true });
    s.addText(t, { x: 6.1, y, w: 6.6, h: 0.75, valign: "middle", fontSize: 18, color: INK, margin: 0, isTextBox: true });
  });

  // ---------- 10. Diagrama ----------
  s = content("3 · MODELO DOCUMENTAL", "Esquema del documento",
    "Abraham. Mismo documento en forma de mapa: al centro la muestra, a la izquierda subdocumentos, a la derecha arreglos.");
  s.addShape(pres.ShapeType.roundRect, { x: 5.0, y: 3.5, w: 3.3, h: 1.4, fill: { color: NAVY }, rectRadius: 0.15, line: { color: NAVY } });
  s.addText([{ text: "muestras", options: { bold: true, fontSize: 24, breakLine: true } },
    { text: "codigo_ficha · estado · conteo_total · sincronizado · fecha_registro", options: { fontSize: 12, color: "CFE3F0" } }],
    { x: 5.05, y: 3.5, w: 3.2, h: 1.4, align: "center", valign: "middle", color: WHITE, margin: 0.05, isTextBox: true });
  const sub = [["centro { }", "nombre · sector · comuna · linea · profundidad_m"], ["operario { }", "nombre · rol"], ["supervision { }", "supervisor · comentario · fecha"]];
  const arr = [["etiquetas [ ]", "\"urgente\" · \"biomasa\" · \"semanal\""], ["lecturas [ { } ]", "talla_mm · peso_g · cantidad"], ["fotos [ { } ]", "url · tomada_en"]];
  const node = (x, y, c, t, d, fg) => {
    s.addShape(pres.ShapeType.roundRect, { x, y, w: 3.8, h: 1.2, fill: { color: c }, rectRadius: 0.12, line: { color: c } });
    s.addText([{ text: t, options: { bold: true, fontSize: 18, fontFace: "Courier New", breakLine: true } }, { text: d, options: { fontSize: 13 } }],
      { x: x + 0.1, y, w: 3.6, h: 1.2, align: "center", valign: "middle", color: fg, margin: 0.05, isTextBox: true });
  };
  sub.forEach(([t, d], i) => {
    const y = 1.9 + i * 1.7;
    node(0.6, y, TEAL, t, d, WHITE);
  });
  arr.forEach(([t, d], i) => {
    const y = 1.9 + i * 1.7;
    node(8.9, y, ORANGE, t, d, INK);
  });
  const ln = (x, y, h, flipV) => s.addShape(pres.ShapeType.line, { x, y, w: 0.6, h, flipV, line: { color: "90A4AE", width: 2 } });
  ln(4.4, 2.5, 1.4, false); ln(4.4, 4.2, 0, false); ln(4.4, 4.5, 1.4, true);
  ln(8.3, 2.5, 1.4, true);  ln(8.3, 4.2, 0, false); ln(8.3, 4.5, 1.4, false);

  // ---------- 11. CREATE ----------
  s = content("4 · CRUD  ·  CREATE", "Crear: insertOne e insertMany",
    "Abraham. insertOne registra una muestra (el operario en terreno). insertMany carga el lote inicial de 9 fichas. Validación $jsonSchema impide estados inválidos.");
  code(s, 0.6, 1.9, 8.4, 4.9, [
    "// 1 ficha nueva desde terreno",
    "db.muestras.insertOne({",
    "  codigo_ficha: 'MUE-1001',",
    "  estado: 'aprobada',",
    "  conteo_total: 75,",
    "  centro: { nombre: 'Centro Los Fiordos', ... },",
    "  etiquetas: ['biomasa', 'semanal'],",
    "  lecturas: [ { talla_mm: 52, cantidad: 40 }, ... ]",
    "})",
    "",
    "// lote inicial (9 fichas más)",
    "db.muestras.insertMany([",
    "  { codigo_ficha: 'MUE-1002', ... },",
    "  { codigo_ficha: 'MUE-1003', ... },",
    "  ...",
    "])",
  ]);
  captura(s, 9.3, 1.9, 3.4, 4.9, "insertOne e insertMany: acknowledged: true");

  // ---------- 12. READ ----------
  s = content("4 · CRUD  ·  READ", "Buscar con filtros",
    "Abraham. Rango con $gte/$lte, arreglo con $all, subdocumento con notación punto y $in, $or para pendientes o urgentes. Proyección oculta _id; sort y limit traen las 3 más recientes.");
  code(s, 0.6, 1.9, 8.4, 4.9, [
    "// db.muestras.  rango",
    "find({ conteo_total: { $gte: 50, $lte: 100 } })",
    "// arreglo: ambas etiquetas",
    "find({ etiquetas: { $all: ['urgente','biomasa'] } })",
    "// subdocumento + lista",
    "find({ 'centro.comuna': { $in: ['Calbuco','Quellón'] } })",
    "// $or",
    "find({ $or: [ { estado: 'pendiente', sincronizado: false },",
    "              { etiquetas: 'urgente' } ] })",
    "// proyección + sort + limit",
    "find({}, { _id: 0, codigo_ficha: 1, estado: 1 })",
    "  .sort({ fecha_registro: -1 }).limit(3)",
    "// valores únicos",
    "distinct('centro.nombre')",
  ]);
  captura(s, 9.3, 1.9, 3.4, 4.9, "Resultado de find con filtros");

  // ---------- 13. UPDATE ----------
  s = content("4 · CRUD  ·  UPDATE", "Actualizar: $set, $inc, $unset",
    "Renato. $set cambia estado y agrega supervision. $inc suma ejemplares (y restar con negativo). $push agrega una lectura al arreglo. $unset borra el campo temporal borrador en todas las fichas.");
  code(s, 0.6, 1.9, 8.4, 4.9, [
    "// $set: el supervisor aprueba",
    "updateOne({ codigo_ficha: 'MUE-1002' },",
    "  { $set: { estado: 'aprobada',",
    "            supervision: { ... } } })",
    "// $inc + $push: +30 ejemplares",
    "updateOne({ codigo_ficha: 'MUE-1005' },",
    "  { $inc:  { conteo_total: 30 },",
    "    $push: { lecturas: { talla_mm: 49, cantidad: 30 } } })",
    "// $inc negativo: corrección",
    "updateOne({ codigo_ficha: 'MUE-1001' },",
    "  { $inc: { 'lecturas.0.cantidad': -5, conteo_total: -5 } })",
    "// $unset en lote",
    "updateMany({ borrador: { $exists: true } },",
    "  { $unset: { borrador: '' } })",
  ]);
  captura(s, 9.3, 1.9, 3.4, 4.9, "matchedCount / modifiedCount");

  // ---------- 14. DELETE ----------
  s = content("4 · CRUD  ·  DELETE", "Eliminar con filtros seguros",
    "Renato. deleteOne borra una ficha puntual. deleteMany exige DOS condiciones (rechazada Y sin sincronizar) para no tocar nunca fichas aprobadas. Tip: probar el filtro con find primero.");
  code(s, 0.6, 1.9, 8.4, 3.2, [
    "// 1 ficha puntual (foto ilegible)",
    "db.muestras.deleteOne({ codigo_ficha: 'MUE-1009' })",
    "",
    "// lote seguro: rechazadas Y sin sincronizar",
    "db.muestras.deleteMany({",
    "  estado: 'rechazada',",
    "  sincronizado: false",
    "})",
  ], 18);
  card(s, 0.6, 5.35, 8.4, 1.45, NAVY);
  s.addText([{ text: "Regla de oro", options: { bold: true, color: "7FD6D6", breakLine: true } },
    { text: "Probar el filtro con find() antes de deleteMany(). Nunca deleteMany({}).", options: { color: WHITE } }],
    { x: 0.85, y: 5.4, w: 7.9, h: 1.35, fontSize: 20, valign: "middle", margin: 0, isTextBox: true });
  captura(s, 9.3, 1.9, 3.4, 4.9, "deletedCount: 1 y luego countDocuments()");

  // ---------- 15. Conclusión ----------
  s = content("5 · CONCLUSIÓN", "Valor para el negocio y próximos pasos",
    "Renato. Valor: una consulta trae la ficha completa, esquema flexible, trazabilidad. Mejoras: dashboard en Charts, agregación de biomasa semanal, sincronización desde la app.");
  card(s, 0.6, 2.0, 5.9, 3.9);
  s.addText("Valor hoy", { x: 0.9, y: 2.2, w: 5, h: 0.5, fontSize: 24, bold: true, color: TEAL, margin: 0, isTextBox: true });
  s.addText(["Ficha completa en 1 consulta", "Trazabilidad: quién, dónde, cuándo", "Cambios de campos sin migraciones"]
    .map((t, i, a) => ({ text: t, options: { bullet: true, breakLine: i < a.length - 1, paraSpaceAfter: 10 } })),
    { x: 0.9, y: 2.9, w: 5.3, h: 2.8, fontSize: 22, color: INK, margin: 0, valign: "top", isTextBox: true });
  card(s, 6.8, 2.0, 5.9, 3.9, NAVY);
  s.addText("Mejoras a futuro", { x: 7.1, y: 2.2, w: 5, h: 0.5, fontSize: 24, bold: true, color: "7FD6D6", margin: 0, isTextBox: true });
  s.addText(["Sincronizar la app Android con Atlas", "Aggregation: biomasa semanal por centro", "Dashboard en Atlas Charts", "Índice geoespacial por centro"]
    .map((t, i, a) => ({ text: t, options: { bullet: true, breakLine: i < a.length - 1, paraSpaceAfter: 10 } })),
    { x: 7.1, y: 2.9, w: 5.3, h: 2.8, fontSize: 22, color: WHITE, margin: 0, valign: "top", isTextBox: true });

  // ---------- 16. Anexos ----------
  s = content("6 · ANEXOS", "Anexos",
    "Anexo A: script completo aquamuestra.mongodb.js incluido en el proyecto. Anexo B: esquema de validación e índices.");
  card(s, 0.6, 2.0, 5.9, 3.4);
  s.addText("A · Script completo", { x: 0.9, y: 2.2, w: 5.3, h: 0.5, fontSize: 24, bold: true, color: NAVY, margin: 0, isTextBox: true });
  s.addText("aquamuestra.mongodb.js", { x: 0.9, y: 2.9, w: 5.3, h: 0.5, fontSize: 20, fontFace: "Courier New", color: TEAL, bold: true, margin: 0, isTextBox: true });
  s.addText("Setup, insertOne, insertMany, find, update, delete. Listo para el Playground de VS Code.",
    { x: 0.9, y: 3.6, w: 5.3, h: 2.2, fontSize: 18, color: INK, margin: 0, valign: "top", isTextBox: true });
  card(s, 6.8, 2.0, 5.9, 3.4);
  s.addText("B · Esquema y reglas", { x: 7.1, y: 2.2, w: 5.3, h: 0.5, fontSize: 24, bold: true, color: NAVY, margin: 0, isTextBox: true });
  s.addText(["$jsonSchema: campos obligatorios", "estado: pendiente · aprobada · rechazada", "Índice único en codigo_ficha", "Índice en centro.nombre + estado"]
    .map((t, i, a) => ({ text: t, options: { bullet: true, breakLine: i < a.length - 1, paraSpaceAfter: 8 } })),
    { x: 7.1, y: 2.9, w: 5.3, h: 3.4, fontSize: 18, color: INK, margin: 0, valign: "top", isTextBox: true });

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("OK", OUT);
})();
