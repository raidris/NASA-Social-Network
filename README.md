# NASA Social Network

NASA Social Network is a social media-style application built using the Node.js MVC architecture. It features user registration, login, session handling, and a basic feed, all backed by a SQLite database using Sequelize ORM.

## Features

- User registration and authentication
- Session-based login system
- Feed controller for displaying content
- EJS templating engine for views
- Sequelize ORM with SQLite
- Modular code structure with MVC pattern

## Tech Stack

- **Backend:** Node.js, Express.js
- **Templating:** EJS
- **Database:** SQLite3
- **ORM:** Sequelize
- **Authentication:** express-session, bcrypt
- **Others:** body-parser, cookie-parser

## Project Structure

```
SpaceBook/
├── app.js                 # Main app setup
├── bin/www                # Server launcher
├── controllers/           # Route logic (feed, login, register, etc.)
├── config/config.json     # Sequelize DB config
├── migrations/            # Sequelize migrations
├── views/                 # EJS templates (not shown in file list)
├── models/                # Sequelize models (assumed from ORM)
├── database.sqlite3       # App data
├── session.sqlite         # Session store
├── package.json           # Project metadata & dependencies
```

## Setup & Installation

### Prerequisites

- Node.js (v14 or later recommended)
- npm (comes with Node.js)

### Configurations
Before running the program, ensure the following configuration is in place:

- Obtain an API key from NASA's APOD API
- replace const ```bashNASA_API = "INSERT API KEY HERE"```; located the file public/javascripts/main.js at line 7 with your API key.

### Installation Steps

1. Clone or unzip the project
2. Install dependencies:

   ```bash
   npm install
   ```

3. Run Sequelize migrations (if applicable):

   ```bash
   npx sequelize-cli db:migrate
   ```

4. Start the application:

   ```bash
   npm start
   ```

5. Open your browser at `http://localhost:3000`

