/// <reference types="cypress" />

describe('Customer Login Page', () => {
    beforeEach(() => {
        cy.visit('http://localhost:6969/Login');
    });

    it('shows the customer login form', () => {
        cy.get('.customer-login-form').should('exist');
        cy.get('.customer-login-title').should('contain.text', 'Customer Login');
        cy.get('input#email').should('exist');
        cy.get('input#password').should('exist');
        cy.get('button[type="button"]').contains('Login').should('exist');
    });

    it('shows remember me checkbox', () => {
        cy.get('input#rememberMe').should('exist');
        cy.get('label[for="rememberMe"]').should('contain.text', 'Remember me');
    });

    it('shows forgot password and staff login links', () => {
        cy.get('.login-links-row a').contains('Forgot password?').should('exist');
        cy.get('.login-links-row a').contains('I work here').should('exist');
    });

    it('shows error message when error is present', () => {
        cy.get('.customer-login-form').then($form => {
            $form.append('<div class="error-message">Test error</div>');
        });
        cy.get('.error-message').contains('Test error').should('exist');
    });
});
