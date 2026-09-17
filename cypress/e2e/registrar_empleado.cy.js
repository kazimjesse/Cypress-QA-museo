const API = "http://localhost:3000";

function selectTipoEmpleado() {
  cy.get('[data-cy="tipo"]').click();
  cy.contains(".v-list-item", "Empleado").click();
}

function selectMuseo(nombreMuseo) {
  cy.get('[data-cy="museo"]').click();
  cy.contains(".v-list-item", nombreMuseo).click();
}

function typeIfNotEmpty(selector, value) {
  cy.get(selector).clear();
  if (value !== "" && value !== null && value !== undefined) {
    cy.get(selector).type(String(value));
  }
}


function fillEmpleadoForm({
  cedula,
  nombre,
  correo,
  ubicacion,
  provincia,
  distrito,
  corregimiento,
  museo,
  cargo,
  telefono,
}) {

    typeIfNotEmpty('[data-cy="cedula"] input', cedula);
    typeIfNotEmpty('[data-cy="nombre"] input', nombre);
    typeIfNotEmpty('[data-cy="correo"] input', correo);
    typeIfNotEmpty('[data-cy="ubicacion"] input', ubicacion);
    typeIfNotEmpty('[data-cy="provincia"] input', provincia);   // ✅ ahora permite vacío
    typeIfNotEmpty('[data-cy="distrito"] input', distrito);
    typeIfNotEmpty('[data-cy="corregimiento"] input', corregimiento);
    typeIfNotEmpty('[data-cy="cargo"] input', cargo);
    typeIfNotEmpty('[data-cy="telefono-0"] input', telefono);

  if (museo) {
    selectMuseo(museo);
  }
}

describe("Registrar empleado (CP-EMP)", () => {
  beforeEach(() => {
    // Intercept museos para esperar el loadMuseos()
    cy.intercept("GET", `${API}/api/empleados/museos`).as("museos");

    cy.visit("/new-entry");
    selectTipoEmpleado();
    cy.wait("@museos");
  });

  it("CP-EMP-01 - Registro exitoso", () => {
    const correoUnico = `juan.perez_${Date.now()}@galeria.com`;

    cy.intercept("POST", `${API}/api/empleados`).as("crearEmpleado");

    fillEmpleadoForm({
      cedula: "8123456", // en tu store lo conviertes a Number, evita guiones
      nombre: "Juan Pérez",
      correo: correoUnico,
      ubicacion: "Edificio Aventura, apt 4",
      provincia: "Panama",
      distrito: "San Miguelito",
      corregimiento: "Omar Torrijos",
      museo: "Museo Nacional",
      cargo: "Guia",
      telefono: "69188917",
    });

    // Capturar alert
    cy.window().then((win) => cy.stub(win, "alert").as("alerta"));

    cy.get('[data-cy="crear-empleado"]').click();

    cy.wait("@crearEmpleado")
      .its("response.statusCode")
      .should("be.oneOf", [200, 201]);

    // Tu frontend muestra este alert en éxito
    cy.get("@alerta").should("have.been.calledWithMatch", /empleado (creado|registrado)/i);
  });

  it("CP-EMP-02 - Fallido por campos vacíos", () => {
    // Con validación en frontend: NO debe mandar POST
    cy.intercept("POST", `${API}/api/empleados`).as("crearEmpleado");

    fillEmpleadoForm({
      cedula: "8123456",
      nombre: "Juan Pérez",
      correo: `juan.perez_${Date.now()}@galeria.com`,
      ubicacion: "Edificio Aventura, apt 4",
      provincia: "",          // vacío
      distrito: "San Miguelito",
      corregimiento: "Omar Torrijos",
      museo: "Museo Nacional",
      cargo: "",              // vacío
      telefono: "69188917",
    });

    cy.window().then((win) => cy.stub(win, "alert").as("alerta"));

    cy.get('[data-cy="crear-empleado"]').click();

    // Mensaje esperado (si aplicaste el cambio en onSubmit)
    cy.get("@alerta").should("have.been.calledWithMatch", /complete todos los campos obligatorios/i);

    // Debe ser 0 requests si el frontend bloquea
    cy.get("@crearEmpleado.all").then((calls) => {
      expect(calls.length).to.eq(0);
    });
  });

  it("CP-EMP-03 - Fallido por correo inválido", () => {
    cy.intercept("POST", `${API}/api/empleados`).as("crearEmpleado");

    fillEmpleadoForm({
      cedula: "8123456",
      nombre: "Juan Pérez",
      correo: "juan@@galeria__", // inválido
      ubicacion: "Edificio Aventura, apt 4",
      provincia: "Panama",
      distrito: "San Miguelito",
      corregimiento: "Omar Torrijos",
      museo: "Museo Nacional",
      cargo: "Guia",
      telefono: "69188917",
    });

    cy.window().then((win) => cy.stub(win, "alert").as("alerta"));

    cy.get('[data-cy="crear-empleado"]').click();

    // Mensaje esperado si pusiste rules + onSubmit
    cy.get("@alerta").should("have.been.calledWithMatch", /ingrese un correo electrónico válido/i);

    cy.get("@crearEmpleado.all").then((calls) => {
      expect(calls.length).to.eq(0);
    });
  });
});
