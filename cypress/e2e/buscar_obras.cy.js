describe('Buscar Obras - Casos de Prueba', () => {

  const openCategoriaSelect = () => {
    // Click en el área del select (Vuetify)
    cy.get('[data-cy="categoria-col"]').within(() => {
      cy.get('input').first().click({ force: true })
    })
  }

  const selectCategoria = (texto) => {
    openCategoriaSelect()
    cy.contains('.v-list-item', texto).click()
  }

  it('CP-BUS-OBRA-01: Buscar obras por artista y tipo (Exitoso)', () => {
  cy.intercept(
    'GET',
    '**/api/search**',
    { fixture: 'obras_diegorivera.json' }
  ).as('search')

  cy.visit('/search')

  // Categoría
  selectCategoria('Obra de Arte')
  cy.wait('@search')

  // Texto (Artista)
  cy.get('[data-cy="buscar-col"]').within(() => {
    cy.get('input').clear().type('Diego Rivera')
  })
  cy.wait('@search')

  // ✅ Ahora SIEMPRE hay resultados
  cy.get('[data-cy="resultado-card"]')
    .should('exist')
    .and('have.length.greaterThan', 0)

  cy.get('[data-cy="ver-detalles"]').first().click()
  cy.url().should('include', '/detalle/')
})

  it('CP-BUS-OBRA-02: Búsqueda sin resultados (Fallido)', () => {
    // Forzamos respuesta vacía para que sea 100% determinístico
    cy.intercept('GET', '**/api/search**', []).as('searchEmpty')

    cy.visit('/search')

    selectCategoria('Obra de Arte')

    cy.get('[data-cy="buscar-col"]').within(() => {
      cy.get('input').first().clear().type('ObraInexistente123')
    })

    cy.wait('@searchEmpty')

    // Lista vacía
    cy.get('[data-cy="resultado-card"]').should('have.length', 0)

    // Mensaje esperado (según tu componente v-alert)
    cy.get('[data-cy="search-message"]')
      .should('be.visible')
      .and('contain.text', 'No se encontraron obras que coincidan con la búsqueda.')
  })

  it('CP-BUS-OBRA-03: Año con formato inválido', () => {
      cy.intercept('GET', '**/api/search**').as('search')
      cy.visit('/search')

      cy.get('[data-cy="anio-col"] input').clear().type('abcd')

      cy.get('[data-cy="search-message"]')
        .should('be.visible')
        .and('contain.text', 'formato del año es inválido')

      // Esperamos un poco y CONFIRMAMOS que no crashea
      cy.wait(500)
    })

})
