
- [x] express js
- [x] nodemon
- [x] winston

## Requirements

- [x] an express app with either `ejs` or `pug` or `handlebars`
- [ ] DRY
- [ ] A `view` layer
- [ ] A `Controller` layer
- [ ] A `Service` layer
- [ ] A `DAO` layer (database access object?)
- [ ] 3 epics
- [ ] user stories for each epic
- [ ] logging with the winston package
- [ ] using nodemon

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
- both -> login
- both -> sessions

## My user stories

**renting and returning**

* [ ] 1. as a customer I want to be able to rent a movie so that I am able to watch it
* [ ] 2. as a customer I want to be able to return a rented movie so that I don't get indefinitely billed

**movie management**

* [ ] 1. as an employee I want to be able to look at the movies we have in the store so that I can give specific information to customers
* [ ] 2. as an employee I want to be able to add a movie so that we can update our collection
* [ ] 3. as an employee I want to be able to edit a movie so that I can correct mistakes
* [ ] 4. as an employee I want to be able to remove a movie so that we can update our collection

**searching library**

* [ ] 1. as an customer I want to be able to browse the entire movie collection so that I can find a movie that I like
* [ ] 2. as an customer I want to be able to filter the movies so that I do not have to look at the romance category.
	* [ ] being able to filter on author, name, description, language, store, store inventory.
* [ ] 3. as an employee I want to be able to browse and filter the entire movie collection so that I can see movies that are out, and am able to give correct suggestions to customers.

**Renting history**

* [ ] 1. as an customer I want to be able to look at my renting history so that I can see which items I still need to return, and so that I am able to check for payment mistakes
* [ ] 2. as an customer I want to be able to export the transaction history to a pdf so that I am able to print and save it in my archive.

**rental history**

* [ ] 1. as an employee I want to be able to look at a specific copy of a movie so that I can see the specific copies separately
* [ ] 2. as an employee I want to be able to look at the renting history of a specific movie copy so that we can look for fraud
* [ ] 3. as an employee I want to be able to look at all rental records of a specific customer so that we can look for fraud.

**Login**

* [ ] 1. as an user I want to be able to login so that I can see personal information
* [ ] 2. as an employee I want to be able to login so that I can do my job correctly
* [ ] 3. As an store owner / manager I want to be able to require 2fa for all my employees so that I can know for sure that my employees will not be likely to get hacked.
	* [ ] TOTP

**Sessions**

* [ ] 1. as an user I want to be able to stay logged in so that I don't need so send my login over the internet at every request
	* [ ] session tokens
        - a session token should only be usable in combination with an userID or username to avoid random "guessing" of session tokens
* [ ] 2. as an user I want to bew able to return to the website the next day without having to login again, so that using the website is an easier process for me.
	* [ ] refresh tokens for refreshing session tokens
        - a refresh token should only be usable in combination with an username or userID to avoid random "guessing" of refresh tokens

## Concrete

Here I will list the pages that I need to work on that are already referenced:

- [ ] http://localhost:3000/Film?v=1000 for viewing a specific film
- [ ] http://localhost:3000/Catalogue for viewing the full catalog
- [ ] http://localhost:3000/Account the customer dashboard
- [ ] http://localhost:3000/Staff/Dashboard the staff dashboard

The ones that are not referenced yet, but I know I have to make them

- [ ] http://localhost:3000/Stores?v=1 for the viewing of a specific location