/// <reference types="cypress" />

describe('Catalogue Page', () => {
    beforeEach(() => {
        cy.visit('http://localhost:6969/Catalogue');
    });

    it('shows the catalogue title and filter form', () => {
        cy.get('h1').contains('Film Catalogue').should('exist');
        cy.get('#catalogue-filter-form').should('exist');
    });

    it('shows a list of films or no films found alert', () => {
        cy.get('#catalogue-list .card').then(cards => {
            if (cards.length > 0) {
                expect(cards.length).to.be.gte(1);
            } else {
                cy.get('.alert-warning').contains('No films found.').should('exist');
            }
        });
    });

    it('shows pagination controls', () => {
        cy.get('#catalogue-pagination').should('exist');
        cy.get('#catalogue-pagination-top').should('exist');
    });

    it('filters by name and reduces results or shows no films found', () => {
        cy.get('#catalogue-list .card').then(cards => {
            const initialCount = cards.length;
            cy.get('#filterName').type('a');
            cy.get('#catalogue-filter-form').submit();
            cy.get('#catalogue-list', { timeout: 10000 }).should('exist');
            cy.get('#catalogue-list .card, .alert-warning', { timeout: 10000 }).should('exist').then(elements => {
                const filteredCards = elements.filter('.card');
                const alerts = elements.filter('.alert-warning');
                if (filteredCards.length > 0) {
                    expect(filteredCards.length).to.be.lte(initialCount);
                } else {
                    expect(alerts.length).to.be.gte(1);
                    cy.wrap(alerts).contains('No films found.').should('exist');
                }
            });
        });
    });

    it('filters by genre and reduces results or shows no films found', () => {
        cy.get('#catalogue-list .card').then(cards => {
            const initialCount = cards.length;
            cy.get('#filterGenre').type('Action');
            cy.get('#catalogue-filter-form').submit();
            cy.get('#catalogue-list', { timeout: 10000 }).should('exist');
            cy.get('#catalogue-list .card, .alert-warning', { timeout: 10000 }).should('exist').then(elements => {
                const filteredCards = elements.filter('.card');
                const alerts = elements.filter('.alert-warning');
                if (filteredCards.length > 0) {
                    expect(filteredCards.length).to.be.lte(initialCount);
                } else {
                    expect(alerts.length).to.be.gte(1);
                    cy.wrap(alerts).contains('No films found.').should('exist');
                }
            });
        });
    });

    it('filters by price and reduces results or shows no films found', () => {
        cy.get('#catalogue-list .card').then(cards => {
            const initialCount = cards.length;
            cy.get('#filterPrice').clear().type('2');
            cy.get('#catalogue-filter-form').submit();
            cy.get('#catalogue-list', { timeout: 10000 }).should('exist');
            cy.get('#catalogue-list .card, .alert-warning', { timeout: 10000 }).should('exist').then(elements => {
                const filteredCards = elements.filter('.card');
                const alerts = elements.filter('.alert-warning');
                if (filteredCards.length > 0) {
                    expect(filteredCards.length).to.be.lte(initialCount);
                } else {
                    expect(alerts.length).to.be.gte(1);
                    cy.wrap(alerts).contains('No films found.').should('exist');
                }
            });
        });
    });

    it('filters by rating and reduces results or shows no films found', () => {
        cy.get('#catalogue-list .card').then(cards => {
            const initialCount = cards.length;
            cy.get('#filterRating').select('PG');
            cy.get('#catalogue-filter-form').submit();
            cy.get('#catalogue-list', { timeout: 10000 }).should('exist');
            cy.get('#catalogue-list .card, .alert-warning', { timeout: 10000 }).should('exist').then(elements => {
                const filteredCards = elements.filter('.card');
                const alerts = elements.filter('.alert-warning');
                if (filteredCards.length > 0) {
                    expect(filteredCards.length).to.be.lte(initialCount);
                } else {
                    expect(alerts.length).to.be.gte(1);
                    cy.wrap(alerts).contains('No films found.').should('exist');
                }
            });
        });
    });

    it('filters by year and reduces results or shows no films found', () => {
        cy.get('#catalogue-list .card').then(cards => {
            const initialCount = cards.length;
            cy.get('#filterYear').clear().type('2020');
            cy.get('#catalogue-filter-form').submit();
            cy.get('#catalogue-list', { timeout: 10000 }).should('exist');
            cy.get('#catalogue-list .card, .alert-warning', { timeout: 10000 }).should('exist').then(elements => {
                const filteredCards = elements.filter('.card');
                const alerts = elements.filter('.alert-warning');
                if (filteredCards.length > 0) {
                    expect(filteredCards.length).to.be.lte(initialCount);
                } else {
                    expect(alerts.length).to.be.gte(1);
                    cy.wrap(alerts).contains('No films found.').should('exist');
                }
            });
        });
    });
});
