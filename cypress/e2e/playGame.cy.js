describe("Guest User: Test Incorrect Guess", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173");
  });

  it("checks that an incorrect guess decrements lives and shows 'Wrong!'", () => {
    // Step 1: Play as a guest
    cy.contains("Play").click();

    // Step 2: Choose difficulty
    cy.contains("Choose Difficulty").should("be.visible");
    cy.contains("Medium").click();
    cy.url().should("include", "/choose-theme");

    // Step 3: Choose a theme
    cy.wait(5000); // Allow the themes to load
    cy.contains("Pokemon").should("be.visible");
    cy.contains("Select Theme").click();
    cy.url().should("include", "/game");

    // Step 4: Simulate an incorrect guess
    cy.wait(5000); // Allow the game to fully load
    cy.get("[data-cy=guess-input]").type("tomatoes"); // Enter a wrong guess
    cy.get("[data-cy=guess-button]").click();

    // Verify the incorrect guess is registered
    cy.contains("Wrong!").should("be.visible");

    // Verify that lives are decremented
    cy.get("[data-cy=lives]") // Assuming there's a data-cy tag for lives
      .invoke("text")
      .then((text) => {
        const lives = parseInt(text.split(":")[1].trim()); // Extract the number of lives
        expect(lives).to.be.lessThan(5); // Assuming the initial lives are 5
      });
  });
});
