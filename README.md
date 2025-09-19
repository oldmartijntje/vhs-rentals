# vhs-rentals
This is a project for School based on the Sakila db

it uses `nodejs` + `express` as backend. It uses `mariadb` as database, it also uses the `sakila` database, but it does have some edits made to it. It works by default with docker.

## Setup

1. run `npm run setup`, this will guide you through setting up your `settings.json` and your `.env`. That being said, of course you can edit those yourself aswell.
2. import the `sakila_db_dump.sql` into your mariadb to get the same structure and data.

### setup my version with docker

Below you can see the docker-compose.

```
services:
  web:
    image: oldmartijntje/vhs-rentals:latest
    ports:
      - "6969:6969"
    restart: always
    env_file:
      - .env
```

And then place the following .env values (filled in of coarse):

```
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_DATABASE=
DB_PORT=
```

TIP: copy this .env from your repo after you have ran the `npm run setup`, this will have the same fields filled in

#### Autodeploy your forked repo

For me it automatically deploys new versions to my docker, it does this by using ssh to connect to my vps. But i am not sharing these credentials.

See below all my github secrets, by name:

![img](https://i.imgur.com/ZvugunQ.png)

## Accounts

There is no account creation, this means you will have to login with an already existing user. Luckily the sakila db has a lot to choose from, every account has the password `12345` (hashed) when you are using my database export. 

I suggest you use 1 of the accounts below:

| Account type | username                          | password |
| ------------ | --------------------------------- | -------- |
| staff        | Mike.Hillyer@sakilastaff.com      | 12345    |
| staff        | Jon.Stephens@sakilastaff.com      | 12345    |
| staff        | oldma@sakila.org                  | 12345    |
| staff        | staff@example.com                 | 12345    |
| customer     | oldma@sakila.org                  | 12345    |
| customer     | customer@example.com              | 12345    |
| customer     | AUSTIN.CINTRON@sakilacustomer.org | 12345    |
| customer     | MARY.SMITH@sakilacustomer.org     | 12345    |

The user `oldma@sakila.org` will be the easiest to use because it has both an staff account and user account attatched to the mail address.

## Running locally

you must use the command `npm run start` to run the server.

Every network request made to the api will be logged to logfiles and the console. You can find the logfiles in the folder `loggin/`. this folder contains a folder with the year number `2025/` for example. That folder will contain another folder with the month, `09/` for example. and that folder will contain all the logfiles for that month.

This of coarse only happens when you do not disable file loggin in the setup.