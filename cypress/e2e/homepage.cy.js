/// <reference types="cypress" />

// this is a modified version of todo, to test our homepage.

describe('example to-do app', () => {
    beforeEach(() => {
        // Cypress starts out with a blank slate for each test
        // so we must tell it to visit our website with the `cy.visit()` command.
        // Since we want to visit the same URL at the start of all our tests,
        // we include it in our beforeEach function so that it runs before each test
        cy.visit('http://localhost:6969')
    })

    it('displays three recent movie items by default', () => {
        // We use the `cy.get()` command to get all elements that match the selector.
        // Then, we use `should` to assert that there are two matched items,
        // which are the two default items.
        cy.get('.recent-movie').should('have.length', 3)
    })
    it('shows the welcome section with correct title', () => {
        cy.get('h1').contains('Welcome to VHS-Rentals').should('exist');
    });

    it('shows info cards for Visit Us, Catalogue, Account, Dashboard', () => {
        cy.get('.card-title').should('include.text', 'Visit Us');
        cy.get('.card-title').should('include.text', 'Catalogue');
        cy.get('.card-title').should('include.text', 'Your Account');
        cy.get('.card-title').should('include.text', 'Dashboard');
    });

    it('header contains navigation links', () => {
        cy.get('nav').should('exist');
        cy.get('.navbar-nav .nav-link').should('include.text', 'Home');
        cy.get('.navbar-nav .nav-link').should('include.text', 'About');
        cy.get('.navbar-nav .nav-link').should('include.text', 'Catalogue');
        cy.get('.navbar-nav .nav-link').should('include.text', 'Login');
    });

    it('newest arrivals cards have Details button', () => {
        cy.get('.recent-movie .btn-info').should('have.length.at.least', 1);
        cy.get('.recent-movie .btn-info').first().should('contain.text', 'Details');
    });

    it('shows error modal when error modal is triggered', () => {
        cy.window().then(win => {
            win.showErrorAndRedirect('/', 'errorModal');
        });
        cy.get('#errorModal').should('be.visible');
        cy.get('#errorModal_redirectBtn').should('exist');
    });
})
