// Cypress tests for /Rented, /Customer/History, /Rent?v=1


const customer = { email: 'customer@example.com', password: '12345' };

function login() {
    cy.visit('http://localhost:6969/Login');
    cy.get('#email').type(customer.email);
    cy.get('#password').type(customer.password);
    cy.get('button').contains('Login').click();
    cy.url({ timeout: 10000 }).should('include', '/Account');
}

describe('Customer Rented/History/Rent Pages', () => {
    beforeEach(() => {
        cy.clearLocalStorage();
        login();
    });

    it('should load the Rented page after login', () => {
        cy.visit('http://localhost:6969/Rented');
        cy.location('pathname').should('eq', '/Rented');
    });

    it('should load the Customer History page after login', () => {
        cy.visit('http://localhost:6969/Customer/History');
        cy.location('pathname').should('eq', '/Customer/History');
    });

    it('should load the Rent page after login', () => {
        cy.visit('http://localhost:6969/Rent?v=1');
        cy.location('pathname').should('eq', '/Rent');
    });
});
