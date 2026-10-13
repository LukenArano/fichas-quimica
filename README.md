# Kimika · Química

App web de estudio de Química (UPV/EHU), bilingüe euskera/castellano (euskera por defecto), sin servidor y con modo sin conexión.

- **Inicio** (`index.html`): ruta de aprendizaje con los temas en orden, progreso, cuenta atrás al examen y plan semanal.
- **Temas** (`tema.html?t=…`): cada tema tiene ruta de unidades (lección visual → práctica), laboratorio interactivo, ejercicios originales con pistas y solución, fichas con repaso espaciado (incluido vocabulario ES↔EU) y resumen.
- **Sala de exámenes** (`azterketak.html`): exámenes 2019-2025 con el enunciado original en euskera y traducción, resoluciones paso a paso, resultados oficiales verificados, simulacro cronometrado y lista de correcciones.
- **Formulación** (`formulacion.html`): 127 compuestos con repaso espaciado.

Ábrela en Safari y usa **Compartir → Añadir a pantalla de inicio**. Después de abrirla una vez, funciona sin conexión. El progreso se guarda en el propio dispositivo.

Archivos: `estudio.js` (motor: idioma, guardado, repaso espaciado, fichas, preguntas), `kimika.js` (estructura del curso y bloques de lección), `lab.js` (laboratorios), `t-*.js` (contenido de cada tema), `az-data.js` / `az-sol.js` (exámenes y resoluciones), `zuzenketak.js` (correcciones), `estudio.css` (estilos).
