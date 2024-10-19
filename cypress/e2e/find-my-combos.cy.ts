describe('Find My Combos', () => {
  let testUrl = 'https://www.moxfield.com/decks/chDG34jh6E-vPEugnXO1BA';

  it('can find a combo using url parameter', () => {
    cy.visit('/find-my-combos/?deckUrl=' + testUrl);

    cy.url().should('include', testUrl);

    cy.get('#decklist-input').should('have.length', 1);
    cy.get('#commander-input').should('have.length', 1);
  });

  it('can clear the url and data', () => {
    cy.visit('/find-my-combos/?deckUrl=' + testUrl);
    cy.url().should('include', testUrl);

    cy.get('#clear-decklist-input').click();

    cy.get('#decklist-input').should('be.empty');
    cy.get('#commander-input').should('be.empty');
    cy.url().should('not.contain', testUrl);
  });
});

export {};
