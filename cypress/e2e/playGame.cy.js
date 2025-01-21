describe("Guest User: Test Incorrect Guess", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/themes").as("fetchThemes"); // Intercept the theme fetch request
    cy.visit("http://localhost:5173");
  });

  it("checks that an incorrect guess decrements lives and shows 'Wrong!'", () => {
    // Step 1: Play as a guest
    cy.get('[data-cy=play-button]').click();

    // Step 2: Choose difficulty
    cy.get('[data-cy=difficulty-medium]').should("be.visible").click();
    cy.url().should("include", "/choose-theme");

    // Step 3: Choose a theme
    cy.wait("@fetchThemes"); // Wait for the themes to be fetched
    cy.get('[data-cy=theme-cards-container]').should("be.visible");

    // Use a dynamic selector for the first theme card
    cy.get('[data-cy^="theme-card-"]').first().within(() => {
      cy.get('[data-cy^="select-theme-button-"]').click();
    });
    cy.url().should("include", "/game");

    // Step 4: Simulate an incorrect guess
    cy.wait("@fetchThemes"); // Wait for the themes to be fetched
    cy.get('[data-cy=game-container]').should("be.visible");
    cy.get("[data-cy=guess-input]").type("tomatoes");
    cy.get("[data-cy=guess-button]").click();

    // Verify that lives are decremented
    cy.get("[data-cy=lives]").invoke("text").then((initialText) => {
      const initialLives = parseInt(initialText.split(":")[1].trim());
      cy.get("[data-cy=guess-button]").click();
      cy.get("[data-cy=lives]").invoke("text").then((updatedText) => {
        const updatedLives = parseInt(updatedText.split(":")[1].trim());
        expect(updatedLives).to.equal(initialLives - 1);
      });
    });

    cy.get('[data-cy=end-game-button]').click();

    
  });
});
