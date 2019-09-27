Web application that scraps data from http://books.toscrape.com/ and stores it in a PostgreSQL database

The application is based on Laravel 6.0 and uses React for the frontend

## How to run the application

Clone the repository

`git clone https://github.com/goranmitev/laravel-react-crud.git`

Navigate to the project dir

`cd laravel-react-crud`

Copy the .env file (modify if needed)

`cp .env.example .env`

Run docker compose build

`docker-compose build`

Start docker containers

`docker-compose up -d`

Install composer packages

`composer install`

Install npm packages

`npm install`

Compile npm packages

`npm run dev`

Run migrations and initial user seeder

`docker-compose exec app php artisan migrate:fresh --seed`

### Run the command for scrapping the books data

`docker-compose exec app php artisan process:books`

Open the app

`http://localhost:81`

Login with:
email: user@user.com
password: password
