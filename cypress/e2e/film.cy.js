/// <reference types="cypress" />

describe('Film page', () => {
    beforeEach(() => {
        cy.visit('http://localhost:6969/Film?v=999');
    });

    it('shows the VHS case with loading placeholders', () => {
        cy.get('.vhs-content').should('exist');
        cy.get('.filmTitleInnerHTML').should('exist');
        cy.get('.actorInnerHTML').should('exist');
        cy.get('.categoryInnerHTML').should('exist');
        cy.get('.yearInnerHTML').should('exist');
        cy.get('.descriptionInnerHTML').should('exist');
    });

    it('shows the carousel with two items', () => {
        cy.get('.carousel-item').should('have.length', 2);
    });

    it('shows all main action buttons', () => {
        cy.get('.addQueryParam.customer-link').should('exist');
        cy.get('.addQueryParam.login-link').should('exist');
        cy.get('.addQueryParam.customer-link').should('exist');
        cy.get('.btn-success[data-bs-toggle="modal"]').should('exist');
        cy.get('.addQueryParam.staff-link').should('exist');
    });

    it('shows Filmformation section', () => {
        cy.get('h2').contains('Filmformation').should('exist');
        cy.get('.actorsInnerHTML').should('exist');
        cy.get('.categoryInnerHTML').should('exist');
        cy.get('.ratingInnerHTML').should('exist');
        cy.get('.priceInnerHTML').should('exist');
        cy.get('.yearInnerHTML').should('exist');
        cy.get('.lenghtInnerHTML').should('exist');
        cy.get('.copiesInnerHTML').should('exist');
    });

    it('shows error modal if film is not found', () => {
        cy.window().then(win => {
            win.showErrorAndRedirect('/', 'errorModal');
        });
        cy.get('#errorModal').should('be.visible');
        cy.get('#errorModal_redirectBtn').should('exist');
    });
});
