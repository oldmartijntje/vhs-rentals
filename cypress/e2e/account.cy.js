/// <reference types="cypress" />

describe('Customer Account Page', () => {
    it('does not close error modal when clicking outside or on modal', () => {
        cy.clearLocalStorage();
        cy.visit('http://localhost:6969/Account');
        cy.get('#loginModal').should('be.visible');
        // Try clicking the backdrop
        cy.get('.modal-backdrop').click({ force: true });
        cy.get('#loginModal').should('be.visible');
        // Try clicking the modal itself
        cy.get('#loginModal').click({ force: true });
        cy.get('#loginModal').should('be.visible');
    });
    const customer = { email: 'customer@example.com', password: '12345' };

    function login() {
        cy.visit('http://localhost:6969/Login');
        cy.get('#email').type(customer.email);
        cy.get('#password').type(customer.password);
        cy.get('button').contains('Login').click();
        cy.url({ timeout: 10000 }).should('include', '/Account');
    }

    beforeEach(() => {
        cy.clearLocalStorage();
        login();
    });

    it('shows the account title and personal info card', () => {
        cy.get('h1').contains('My Account').should('exist');
        cy.get('.card-title').contains('Personal Information').should('exist');
        cy.get('.list-group-item').should('have.length.at.least', 6);
    });

    it('shows correct customer info fields', () => {
        cy.get('.list-group-item').eq(0).should('contain', 'Name:');
        cy.get('.list-group-item').eq(1).should('contain', 'Email:');
        cy.get('.list-group-item').eq(2).should('contain', 'Address:');
        cy.get('.list-group-item').eq(3).should('contain', 'Account Created:');
        cy.get('.list-group-item').eq(4).should('contain', 'Last Update:');
        cy.get('.list-group-item').eq(5).should('contain', 'Status:');
    });

    it('shows navigation buttons for rented items and history', () => {
        cy.get('.card-body.d-flex a.btn.customer-link').contains('Rented Items').should('exist');
        cy.get('.card-body.d-flex a.btn.customer-link').contains('Renting History').should('exist');
        cy.get('.card-body.d-flex a.btn.staff-link').contains('Staff Dashboard').should('exist');
    });
    it('shows error modal if not authenticated', () => {
        cy.clearLocalStorage();
        cy.visit('http://localhost:6969/Account');
        cy.get('#loginModal').should('be.visible');
    });

    it('closes error modal when clicking OK', () => {
        cy.clearLocalStorage();
        cy.visit('http://localhost:6969/Account');
        cy.get('#loginModal').should('be.visible');
        cy.get('#loginModal_redirectBtn').click();
        cy.get('#loginModal').should('not.be.visible');
    });
});
