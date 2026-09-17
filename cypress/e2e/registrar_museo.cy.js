describe('Registrar Museo - Casos de Prueba', () => {

  const selectTipoMuseo = () => {
  cy.contains('Seleccione una opción').should('exist')

  cy.get('[data-cy="tipo"]', { timeout: 10000 })
    .should('exist')
    .within(() => {
      cy.get('input').first().click({ force: true })
    })

  cy.contains('.v-list-item', 'Museo').click()
}


  const fillMuseo = ({
    nombre,
    correo,
    anio,
    telefono,
    ubicacion,
    provincia,
    distrito,
    corregimiento
  }) => {
    if (nombre !== undefined) cy.get('[data-cy="museo-nombre"] input').clear().type(nombre)
    if (correo !== undefined) cy.get('[data-cy="museo-correo"] input').clear().type(correo)
    if (anio !== undefined) cy.get('[data-cy="museo-anio"] input').clear().type(anio)
    if (telefono !== undefined) cy.get('[data-cy="museo-telefono"] input').clear().type(telefono)
    if (ubicacion !== undefined) cy.get('[data-cy="museo-ubicacion"] input').clear().type(ubicacion)

    // Si provincia/distrito/corregimiento son selects, ajusta igual que selectTipoMuseo()
    if (provincia !== undefined) cy.get('[data-cy="museo-provincia"] input').clear().type(provincia)
    if (distrito !== undefined) cy.get('[data-cy="museo-distrito"] input').clear().type(distrito)
    if (corregimiento !== undefined) cy.get('[data-cy="museo-corregimiento"] input').clear().type(corregimiento)
  }

  it('CP-REXH-01: Registro de museo exitoso', () => {
    cy.intercept('POST', '**/api/museo**', { statusCode: 201, body: { ok: true } }).as('createMuseo')

    cy.visit('/new-entry')
    selectTipoMuseo()

    fillMuseo({
      nombre: 'Museo Nacional de Arte',
      correo: 'info@museonacional.gob.pa',
      anio: '1982',
      telefono: '500-1234',
      ubicacion: 'Avenida Central',
      provincia: 'Panamá',
      distrito: 'Panamá',
      corregimiento: 'San Felipe',
    })

    cy.get('[data-cy="crear-museo"]').click()

    cy.wait('@createMuseo')
    cy.get('[data-cy="registro-message"]')
      .should('be.visible')
      .and('contain.text', 'creado')
  })

  it('CP-REXH-02: Registro fallido por campos vacíos', () => {
  cy.visit('/new-entry')
  selectTipoMuseo()

  cy.get('[data-cy="museo-nombre"] input').type('Museo de Historia')
  cy.get('[data-cy="museo-correo"] input').type('historia@museopanama.gob.pa')
  // Año → NO se toca
  cy.get('[data-cy="museo-telefono"] input').type('6000-1234')
  cy.get('[data-cy="museo-ubicacion"] input').type('Casco Antiguo')
  cy.get('[data-cy="museo-provincia"] input').type('Panamá')
  cy.get('[data-cy="museo-distrito"] input').type('Panamá')
  // Corregimiento → NO se toca

  cy.get('[data-cy="crear-museo"]').click()

  cy.get('[data-cy="registro-message"]')
    .should('be.visible')
    .and('contain.text', 'Todos los campos son obligatorios.')
})

  it('CP-REXH-03: Año de fundación inválido', () => {
    cy.intercept('POST', '**/api/museo**').as('createMuseo')

    cy.visit('/new-entry')
    selectTipoMuseo()

    fillMuseo({
      nombre: 'Museo Arqueológico Nacional',
      correo: 'arqueologia@museos.gob.pa',
      anio: '2050', // inválido
      telefono: '500-7890',
      ubicacion: 'Vía España',
      provincia: 'Panamá',
      distrito: 'Panamá',
      corregimiento: 'Bella Vista',
    })

    cy.get('[data-cy="crear-museo"]').click()

    cy.get('[data-cy="registro-message"]')
      .should('be.visible')
      .and('contain.text', 'año')
  })

})
