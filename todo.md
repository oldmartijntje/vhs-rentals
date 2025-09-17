
- [x] express js
- [x] nodemon
- [x] winston

## Requirements

- [x] an express app with either `ejs` or `pug` or `handlebars`
- [x] DRY
- [ ] integratie testen: https://brightspace.avans.nl/d2l/le/lessons/251408/topics/1785872
- [ ] CI/CD autodeploy
- [x] A `view` layer
- [x] A `Controller` layer
- [x] A `Service` layer
- [x] A `DAO` layer (database access object?)
- [x] 3 epics
- [x] user stories for each epic
- [x] logging with the winston package
- [x] using nodemon
- [ ] running on docker
- [ ] proper readme

- [randvoorwaarden](https://brightspace.avans.nl/d2l/le/lessons/251408/topics/1770191)
    - I hate this: `Het systeem maakt alleen gebruik van callbackfuncties. We gebruiken nog geen async/await of Promises.`. The other things I am fine with, but this sucks.
- [architectuur](https://brightspace.avans.nl/d2l/le/lessons/251408/topics/1773535)
- [non functionals](https://brightspace.avans.nl/d2l/le/lessons/251408/topics/1731970)
- [functionals](https://brightspace.avans.nl/d2l/le/lessons/251408/topics/1758763)

## My Epics

- customer -> renting and returning
- staff -> movie management
- both -> searching library
- customer -> renting history
- staff -> rental history
- staff -> inventory management
- both -> login
- both -> sessions

## My user stories

**renting and returning**

* [ ] 1. as a customer I want to be able to rent a movie so that I am able to watch it
* [ ] 2. as a customer I want to be able to return a rented movie so that I don't get indefinitely billed

**movie management**

* [ ] 1. as an employee I want to be able to look at the movies we have in the store so that I can give specific information to customers
* [x] 2. as an employee I want to be able to add a movie so that we can update our collection
* [x] 3. as an employee I want to be able to edit a movie so that I can correct mistakes
* [x] 4. as an employee I want to be able to remove a movie so that we can update our collection

**searching library**

* [x] 1. as an customer I want to be able to browse the entire movie collection so that I can find a movie that I like
* [x] 2. as an customer I want to be able to filter the movies so that I do not have to look at the romance category.
	* [x] being able to filter on name, date, price, rating, category.
* [x] 3. as an employee I want to be able to browse and filter the entire movie collection so that I can see movies that are out, and am able to give correct suggestions to customers.
* [x] 4. as an user I want to be able to view any movie and it's details so that i can proceed from there correctly
    * An customer would want to decide to rent it or not
    * An staff member would want to edit it, manage it, and view it's copies

**Renting history**

* [ ] 1. as an customer I want to be able to look at my renting history so that I can see which items I still need to return, and so that I am able to check for payment mistakes
* [ ] 2. ~~as an customer I want to be able to export the transaction history to a pdf so that I am able to print and save it in my archive.~~

**rental history**

* [ ] 1. as an employee I want to be able to look at a specific copy of a movie so that I can see the specific copies separately
* [ ] 2. as an employee I want to be able to look at the renting history of a specific movie copy so that we can look for fraud
* [ ] 3. ~~as an employee I want to be able to look at all rental records of a specific customer so that we can look for fraud.~~

**inventory management**

* [ ] 1. as an employee I want to be able to look at the inventry for a specific film so that i can see whether we still have it in storage
* [ ] 2. as an employee I want to be able to look at who is renting a copy from our inventory, so that i can make sure it is returned in time.
* [ ] 3. as an employee I want to be able to add a new copy of a film to the inventory of 1 of our stores, so that we can actually keep the website up to date.
* [ ] 4. as an employee I want to be able to be able to move a copy from 1 store to another so that i people can return copies to any store of their choice, no matter where they rented it from.
* [ ] 5. as an employee I want to be able to remove a copy from our inventory so that we can remove stolen items from our website.

**Login**

* [ ] 1. as an user I want to be able to login so that I can see personal information
    * [x] Login
    * [ ] Account page
* [ ] 2. as an employee I want to be able to login so that I can do my job correctly
    * [x] Login
    * [ ] Dashboard

**Sessions**

* [x] 1. as an user I want to be able to stay logged in so that I don't need so send my login over the internet at every request
	* [x] session tokens
        - a session token should only be usable in combination with an userID or username to avoid random "guessing" of session tokens
* [x] 2. as an user I want to bew able to return to the website the next day without having to login again, so that using the website is an easier process for me.
	* [x] refresh tokens for refreshing session tokens
        - a refresh token should only be usable in combination with an username or userID to avoid random "guessing" of refresh tokens

## Concrete

Here I will list the pages that I need to work on that are already referenced:

- [x] http://localhost:3000/Film?v=1000 for viewing a specific film
- [x] http://localhost:3000/Catalogue for viewing the full catalog
- [ ] http://localhost:3000/Account the customer dashboard
- [ ] http://localhost:3000/Staff/Dashboard the staff dashboard
- [ ] http://localhost:3000/Rent?v=1000 the page to rent a film
- [ ] http://localhost:3000/Customer/History?v=1000 for viewing your renting history of this item
- [ ] http://localhost:3000/Staff/FilmHistory?v=1000 so that staff can see renting history
- [x] http://localhost:3000/Staff/Edit/Film?v=1000 so that staff can CRUD a film
- [ ] http://localhost:3000/Staff/Edit/Inventory?v=1000 so that staff can CRUD the inventory of a film

The ones that are not referenced yet, but I know I have to make them

- [ ] http://localhost:3000/Stores?v=1 for the viewing of a specific location
- [ ] http://localhost:3000/Rented for viewing things you are currently renting

Other things to do:

- [ ] http://localhost:3000/, fix the "visit us" modal
- [x] authorisation in auth.js with enums
- [ ] get info on staff, whether they are store owners
- [ ] limit form RATING field to max 5 characters