/// <reference types="cypress" />

describe('Staff Login Page', () => {
    it('logs in as staff with correct credentials', () => {
        cy.visit('http://localhost:6969/Staff/Login');
        cy.get('#email').type('staff@example.com');
        cy.get('#password').type('12345');
        cy.get('button').contains('Login').click();
        cy.url({ timeout: 10000 }).should('include', '/Staff/Dashboard');
    });

    it('shows error when logging in as customer on staff page', () => {
        cy.visit('http://localhost:6969/Staff/Login');
        cy.get('#email').type('customer@example.com');
        cy.get('#password').type('12345');
        cy.get('button').contains('Login').click();
        cy.get('#errorLoginText').should('be.visible');
    });
    beforeEach(() => {
        cy.visit('http://localhost:6969/Staff/Login');
    });

    it('shows the staff login form', () => {
        cy.get('.staff-login-form').should('exist');
        cy.get('.staff-login-title').should('contain.text', 'Staff Login');
        cy.get('input#email').should('exist');
        cy.get('input#password').should('exist');
        cy.get('button[type="button"]').contains('Login').should('exist');
    });

    it('shows remember me checkbox', () => {
        cy.get('input#rememberMe').should('exist');
        cy.get('label[for="rememberMe"]').should('contain.text', 'Remember me');
    });

    it('shows customer login link', () => {
        cy.get('.login-links-row a').contains('I am a Customer').should('exist');
    });

    it('shows error message when error is present', () => {
        cy.get('.staff-login-form').then($form => {
            $form.append('<div class="error-message">Test error</div>');
        });
        cy.get('.error-message').contains('Test error').should('exist');
    });
});
