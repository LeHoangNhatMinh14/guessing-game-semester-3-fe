describe("Admin User: Access Admin Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  it("logs in as admin and navigates to the Admin page", () => {
    cy.contains("Login").click();
    cy.log("Navigated to login page");

    cy.get("input[placeholder='Enter your name']").type("AdminUser");
    cy.get("input[placeholder='Enter your password']").type("password");
    cy.get("[data-cy=login-button]").click();
    cy.wait(5000)
    cy.log("Submitted login form");

    // Verify URL or Admin button visibility
    cy.url({ timeout: 10000 }).then((url) => {
      if (url === "http://localhost:5173/") {
        cy.contains("Admin").should("be.visible");
      } else if (url.includes("/login")) {
        cy.contains("Admin").should("be.visible");
      } else {
        throw new Error("Unexpected redirection URL: " + url);
      }
    });

    // Navigate to Admin page
    cy.get("[data-cy=admin-button]").click();
    cy.url().should("include", "/admin");

    cy.get("[data-cy=stats-page]").click();
    cy.url().should("include", "/stats");
  });
});
