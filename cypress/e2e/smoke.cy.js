describe("Smoke", () => {
  it("Abre la página de registro", () => {
    cy.visit("/new-entry");
    cy.contains("Nuevo Registro").should("be.visible");
  });
});
