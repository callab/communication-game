# Unnamed Extremely Entertaining Game
A work in progress!

## Project Organization
This repo contains both the backend service and the game client. Both are
written using JavaScript (though the client is technically TypeScript).

### Getting Set Up
`yarn` is used to manage JavaScript package dependencies. Run `yarn install` to
install all the necessary packages.

### Client
The game client depends on [Phaser](http://phaser.io/), a web-based game
engine.

The game client is built and bundled using [Webpack](https://webpack.js.org/).
Run `yarn build` to kick off the webpack build and output the bundle. (The
bundle should be output under the `/public` folder.)

### Server
The backend service is an [express.js](https://expressjs.com/) application. In
order to launch the application, you will first have to create the database.
Running `yarn db` will load [the schema file](schema.sql) into a new database.
(You must have [SQLite](https://www.sqlite.org/index.html) installed; you can
easily install SQLite with [Homebrew](https://brew.sh/).)

Once you have created the database, run `yarn start` to launch the server
process.

The backend service uses [passport.js](http://www.passportjs.org/) as
authentication middleware.

See [config.js](config.js) and [init.js](init.js) for how the express app is
configured.

In development, the express app is responsible for serving the client .js
bundle from the `/public` folder. In production, the express app still needs to
render a template with the correct script tag, but static files are served by
nginx.
