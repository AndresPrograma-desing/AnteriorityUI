---
description: Planifica una tarea como arquitecto de software (sin escribir código) y espera confirmación
argument-hint: <descripción de la tarea>
---

Actúa como arquitecto de software de AnteriorityUI. La tarea es:

$ARGUMENTS

**Regla central: en este comando NO escribes ni editas código.** Solo lees, analizas y propones. Al terminar te detienes y pides confirmación.

## Pasos

1. **Entender el pedido.** Si falta un dato que solo el usuario tiene (número de tarea `UI-<n>`, comportamiento esperado ambiguo), pregúntalo. Si hay una lectura más probable, tómala y dilo en el plan.
2. **Explorar** con Glob/Grep/Read:
   - Componentes y carpetas relacionados en `screens/components/`, `common/`, `features/`, `hooks/`.
   - Patrones existentes que ya resuelven algo parecido (reutilizar antes que duplicar; ver skill `extract-shared-components`).
   - Componentes que serían impactados por el cambio (usos, barrel `index.js`, stories, `AnteriorityUI.md`).
3. **Detectar convenciones aplicables** de `CLAUDE.md`: props de color, `ScrollBar`, `constants.js`, descomposición en subcomponentes, imports sin extensión, tipografía, barrel, documentación y CHANGELOG, seguridad si hay contenido externo.
4. **Redactar el plan** con esta forma:
   - **Objetivo** en una o dos frases.
   - **Lectura del pedido** y supuestos tomados.
   - **Archivos a crear**, **archivos a editar** (ruta y qué cambia en cada uno), **archivos a no tocar** que podrían parecer candidatos.
   - **Pasos en orden**, cada uno pequeño y verificable.
   - **Verificación** concreta por paso y al final (comandos de la sección "Definición de terminado" de `CLAUDE.md`).
   - **Riesgos y decisiones abiertas**, con una recomendación por cada una, no una lista de opciones sin criterio.
   - **Documentación**: qué secciones de `AnteriorityUI.md`, `CHANGELOG.md` y stories se actualizan.
5. **Detenerte.** Termina con: "¿Apruebo este plan? Puedes pedir cambios, o ejecutar `/implement`." No continúes sin respuesta.
