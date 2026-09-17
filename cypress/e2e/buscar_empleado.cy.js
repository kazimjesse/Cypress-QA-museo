const API = "http://localhost:3000";

function selectCategoria(nombre) {
  cy.get('[data-cy="categoria-col"] input').click({force: true});
  cy.contains(".v-list-item-title", nombre, {timeout: 8000})
  //.then($els => {
  //  const items = [...$els].map(e => e.innerText.trim()).filter(Boolean);
  //  cy.log('Items: ' + items.join(' | '));
  //})
  //.should("be.visible")
  .click();
}

function selectBuscarPor(opcion) {
  cy.get('[data-cy="buscar-por-col"] input').click({force: true});
  cy.contains(".v-list-item-title", opcion, {timeout: 8000})
  .scrollIntoView()
  .click({force: true});
}

function typeBuscar(valor) {
  cy.get('[data-cy="buscar-col"] input').clear();
  if (valor !== "" && valor !== null && valor !== undefined) {
    cy.get('[data-cy="buscar-col"] input').type(String(valor));
  }
}

describe("Buscar Empleado (CP-BUS-EMP)", () => {
    

beforeEach(() => {
  cy.intercept("GET", `${API}/api/search?category=Empleado*field=cargo*`).as("searchCargo");
  cy.intercept("GET", `${API}/api/search*`).as("search"); // opcional para otros tests
  cy.visit("/search");
});

it("CP-BUS-EMP-01 - Buscar empleado por cargo (Exitoso)", () => {
  selectCategoria("Empleado");
  selectBuscarPor("Cargo");

  typeBuscar("Guia"); // sin tilde

  cy.wait("@searchCargo")
    .its("response.statusCode")
    .should("be.oneOf", [200, 304]);

  cy.get('[data-cy="resultado-card"]', { timeout: 8000 })
    .should("have.length.greaterThan", 0);

  cy.get('[data-cy="resultado-card"]').first().within(() => {
    cy.get('[data-cy="ver-detalles"]').click({ force: true });
  });

  cy.url().should("include", "/detalle/Empleado/");
});


  it("CP-BUS-EMP-02 - Búsqueda sin resultados (Fallido)", () => {
  selectCategoria("Empleado");
  selectBuscarPor("Nombre");

  typeBuscar("Juan Antonio");

  cy.wait("@search")
    .its("response.statusCode")
    .should("be.oneOf", [200, 304]);

  cy.get('[data-cy="resultado-card"]').should("have.length", 0);

  cy.get('[data-cy="search-message"]')
    .should("be.visible")
    .and("have.text", "No se encontraron empleados que coincidan con la búsqueda.");
});

it("CP-BUS-EMP-03 - Filtro con formato inválido (Fallido)", () => {
  selectCategoria("Empleado");
  selectBuscarPor("Cédula");

  cy.intercept("GET", `${API}/api/search?category=Empleado*q=ABC*field=cedula*`).as("cedulaInvalida");

  typeBuscar("ABC");

  cy.wait("@cedulaInvalida")
    .its("response.statusCode")
    .should("eq", 400);

  cy.get('[data-cy="search-message"]')
    .should("be.visible")
    .and("have.text", "El formato de la cédula es inválido.");

  cy.get('[data-cy="resultado-card"]').should("have.length", 0);
});

  // (Opcional pero recomendado por el documento)
  //it("CP-BUS-EMP-00 - Sin criterios de búsqueda (Fallido)", () => {
  //  selectCategoria("Empleado");

  //  typeBuscar("");

    // Forzar trigger del @input
  //  cy.get('[data-cy="buscar-input"] input').type(" ").clear();

  //  cy.get('[data-cy="search-message"]')
  //    .should("be.visible")
  //    .and( 
  //      "have.text",
  //      "Debe ingresar al menos un criterio de búsqueda."
  //    );

  //  cy.get('[data-cy="resultado-card"]').should("have.length", 0);
  //});

});
