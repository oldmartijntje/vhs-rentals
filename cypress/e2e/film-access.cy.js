/// <reference types="cypress" />

describe('Film and Staff Edit Film Page Access', () => {
    it('redirects /Staff/Edit/Film?v=1 to login modal if not staff', () => {
        cy.visit('http://localhost:6969/Staff/Edit/Film?v=1');
        cy.get('#loginModal').should('be.visible');
        cy.get('#loginModal_redirectBtn').should('exist');
    });

    it('redirects /Staff/Edit/Film to login modal if not staff', () => {
        cy.visit('http://localhost:6969/Staff/Edit/Film');
        cy.get('#loginModal').should('be.visible');
        cy.get('#loginModal_redirectBtn').should('exist');
    });

    it('redirects /Film to catalogue if no movie selected', () => {
        cy.visit('http://localhost:6969/Film');
        cy.url().should('include', '/Catalogue');
    });

    it('shows 404 page for /Film?v=word', () => {
        cy.visit('http://localhost:6969/Film?v=word');
        cy.contains('404').should('exist');
    });
});
