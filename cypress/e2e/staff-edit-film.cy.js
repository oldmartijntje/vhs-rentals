/// <reference types="cypress" />

describe('Staff Edit Film CRUD Access', () => {
    const staff = { email: 'staff@example.com', password: '12345' };
    const customer = { email: 'customer@example.com', password: '12345' };
    const filmData = {
        title: 'Test Film',
        description: 'Test Description',
        category: 'Test Category',
        price: '9.99',
        length: '120',
        rating: 'PG',
        release_year: '2025',
        actors: 'Actor One,Actor Two'
    };

    function login(role) {
        cy.visit(role === 'staff' ? 'http://localhost:6969/Staff/Login' : 'http://localhost:6969/Login');
        cy.get('#email').type(role === 'staff' ? staff.email : customer.email);
        cy.get('#password').type(role === 'staff' ? staff.password : customer.password);
        cy.get('button').contains('Login').click();
        cy.url({ timeout: 10000 }).should('include', role === 'staff' ? '/Staff/Dashboard' : '/Account');
    }

    let staffToken;

    context('as staff', () => {
        before(() => {
            cy.clearLocalStorage();
            login('staff');
            cy.window().then(win => {
                staffToken = win.localStorage.getItem('vhs_rental_user');
            });
        });

        beforeEach(() => {
            cy.clearLocalStorage();
            if (staffToken) {
                cy.window().then(win => {
                    win.localStorage.setItem('vhs_rental_user', staffToken);
                });
            }
        });

        it('can add a new film', () => {
            cy.visit('http://localhost:6969/Staff/Edit/Film');
            cy.get('#title').type(filmData.title);
            cy.get('#description').type(filmData.description);
            cy.get('#category').type(filmData.category);
            cy.get('#price').type(filmData.price);
            cy.get('#length').type(filmData.length);
            cy.get('#rating').type(filmData.rating);
            cy.get('#release_year').type(filmData.release_year);
            cy.get('#actors').type(filmData.actors);
            cy.get('button[type="submit"]').contains('Add Film').click();
            cy.url({ timeout: 10000 }).should('include', '/Staff/Edit/Film?v=');
        });

        it('can edit an existing film', () => {
            // First, add a film
            cy.visit('http://localhost:6969/Staff/Edit/Film');
            cy.get('#title').type(filmData.title);
            cy.get('#description').type(filmData.description);
            cy.get('#category').type(filmData.category);
            cy.get('#price').type(filmData.price);
            cy.get('#length').type(filmData.length);
            cy.get('#rating').type(filmData.rating);
            cy.get('#release_year').type(filmData.release_year);
            cy.get('#actors').type(filmData.actors);
            cy.get('button[type="submit"]').contains('Add Film').click();
            cy.url({ timeout: 10000 }).should('include', '/Staff/Edit/Film?v=');
            cy.url().then(url => {
                const filmId = url.split('=')[1];
                // Now edit the film
                cy.visit(`http://localhost:6969/Staff/Edit/Film?v=${filmId}`);
                cy.wait(200); // Wait for input to update
                cy.get('#title').clear().type('Updated Title');
                cy.get('button[type="submit"]').contains('Save Changes').click();
                cy.get('#title').should('have.value', 'Updated Title');
            });
        });

        it('can delete a film', () => {
            // First, add a film
            cy.visit('http://localhost:6969/Staff/Edit/Film');
            cy.get('#title').type(filmData.title);
            cy.get('#description').type(filmData.description);
            cy.get('#category').type(filmData.category);
            cy.get('#price').type(filmData.price);
            cy.get('#length').type(filmData.length);
            cy.get('#rating').type(filmData.rating);
            cy.get('#release_year').type(filmData.release_year);
            cy.get('#actors').type(filmData.actors);
            cy.get('button[type="submit"]').contains('Add Film').click();
            cy.url({ timeout: 10000 }).should('include', '/Staff/Edit/Film?v=');
            cy.url().then(url => {
                const filmId = url.split('=')[1];
                cy.visit(`http://localhost:6969/Staff/Edit/Film?v=${filmId}`);
                cy.wait(200); // Wait for input to update
                cy.get('#delete-film').click();
                cy.on('window:confirm', () => true);
                cy.url({ timeout: 10000 }).should('include', '/Catalogue');
            });
        });
    });

    context('as customer', () => {
        beforeEach(() => {
            cy.clearLocalStorage();
            login('customer');
        });

        it('cannot add, edit, or delete a film', () => {
            cy.visit('http://localhost:6969/Staff/Edit/Film');
            cy.get('#authorizationModal').should('be.visible');
            cy.get('#authorizationModal_redirectBtn').should('exist');
        });
    });
});
