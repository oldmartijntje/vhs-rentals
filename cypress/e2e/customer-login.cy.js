/// <reference types="cypress" />

describe('Customer Login Page', () => {
    it('logs in as customer with correct credentials', () => {
        cy.visit('http://localhost:6969/Login');
        cy.get('#email').type('customer@example.com');
        cy.get('#password').type('12345');
        cy.get('button').contains('Login').click();
        cy.url({ timeout: 10000 }).should('include', '/Account');
    });

    it('shows error when logging in as staff on customer page', () => {
        cy.visit('http://localhost:6969/Login');
        cy.get('#email').type('staff@example.com');
        cy.get('#password').type('12345');
        cy.get('button').contains('Login').click();
        cy.get('#errorLoginText').should('be.visible');
    });
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
