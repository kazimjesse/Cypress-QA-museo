# Suite de Pruebas Automatizadas E2E — Sistema de Gestión Cultural

## Contexto

Este repositorio contiene el trabajo de **QA (documentación y automatización de pruebas)** que desarrollé como parte de un proyecto académico grupal: *"Sistema de Gestión Integral — Instituto Nacional de Cultura"* (Universidad Tecnológica de Panamá, curso de Mantenimiento y Prueba de Software).

El proyecto completo fue construido por un equipo de 4 personas. El frontend y el backend del sistema fueron desarrollados por mis compañeros de equipo. **Mi responsabilidad específica** fue documentar la especificación funcional y automatizar las pruebas de 4 de los casos de uso del sistema.

## Mi responsabilidad

Para los casos de uso **Registrar Museo**, **Buscar Obras**, **Registrar Empleado** y **Buscar Empleado**, realicé el ciclo completo de QA:

1. **Documentación funcional**: especificación de caso de uso, flujo básico, flujos alternos, precondiciones, postcondiciones, escenarios (exitosos y fallidos) y casos de prueba formales (ID, objetivo, pasos de ejecución, datos de prueba, resultado esperado).
2. **Automatización**: implementación de las pruebas end-to-end con Cypress, incluyendo interceptación de peticiones HTTP, fixtures para datos deterministas y validaciones de mensajes de error.

## Resumen de la suite

| Suite | Casos | Cobertura |
|---|---|---|
| `registrar_museo.cy.js` | 3 | Registro exitoso, campos vacíos, año de fundación inválido |
| `buscar_obras.cy.js` | 3 | Búsqueda por artista/tipo, sin resultados, formato de año inválido |
| `registrar_empleado.cy.js` | 3 | Registro exitoso, campos vacíos, correo inválido |
| `buscar_empleado.cy.js` | 3 | Búsqueda por cargo, sin resultados, formato de cédula inválido |
| `smoke.cy.js` | 1 | Verifica que la página de registro cargue correctamente |

**Total: 13 casos de prueba automatizados.**

## Técnicas y herramientas utilizadas

- **Cypress** para automatización end-to-end
- **Interceptación de red** (`cy.intercept()`) para validar códigos de respuesta de la API (200, 201, 304, 400)
- **Fixtures** para simular respuestas del backend y hacer las pruebas deterministas e independientes del estado real de la base de datos
- **Funciones auxiliares reutilizables** para reducir duplicación entre casos de prueba
- Nomenclatura estandarizada de casos (`CP-REXH`, `CP-BUS-OBRA`, `CP-EMP`, `CP-BUS-EMP`) para trazabilidad entre la documentación funcional y la automatización

## Estructura del repositorio

```
cypress/
├── e2e/
│   ├── registrar_museo.cy.js
│   ├── buscar_obras.cy.js
│   ├── registrar_empleado.cy.js
│   ├── buscar_empleado.cy.js
│   └── smoke.cy.js
├── fixtures/
│   ├── example.json
│   └── obras_diegorivera.json
└── support/
    ├── commands.js
    └── e2e.js
```

## Autor

**Kazim Jesse** — Estudiante de Ingeniería de Software, Universidad Tecnológica de Panamá
[LinkedIn](https://www.linkedin.com/in/kazim-jesse) · [GitHub](https://github.com/kazimjesse)
