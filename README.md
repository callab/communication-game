# Unnamed Extremely Entertaining Game
A work in progress!

## Project Organization
This repo contains both the backend service and the game client. Both are
written using JavaScript (though the client is technically TypeScript).

### Getting Set Up
`yarn` is used to manage JavaScript package dependencies. Run `yarn install` to
install all the necessary packages.

If you have not already installed Node JS and Yarn, you will need to do that
first. Once you have installed Node JS, you can install Yarn with npm:
```
$ npm install yarn -g
```

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
Nginx.

### Deployment
[Fabric](http://docs.fabfile.org/en/2.4/index.html), a Python library, is used
to script deployment. The deployment script is named [fabfile.py](fabfile.py).
In order to run it, you will have to install Fabric:

```
$ pip install fabric
```

Once you have Fabric installed, you can deploy to one (or more!) hosts using
the "deploy" task:

```
$ fab -H deploy@host1, deploy@host2 deploy
```

The application is deployed under `/srv/app` on the host droplets and run under
a "deploy" user.

## Digital Ocean Droplet Configuration
A droplet has already been created to host the app. But if that droplet is
deleted for some reason or a new one needs to be created, this is how the
droplet was configured.

### Droplet Configuration
Once the droplet has been created, you can SSH into it as root using the IP
address. You should have had an opportuntiy to provide a public key when
creating the droplet.

Add a deploy user:
```
$ adduser deploy
```

Add the deploy user to the sudo group:
```
$ usermod -aG sudo deploy
```

Switch to the deploy user:
```
$ su deploy
```

In the deploy user's home directory, create a `.ssh` folder, set the
appropriate permissions (700), and then add to `authorized_keys` the public key
you plan to use to SSH in to the machine as deploy.

You can optionally set up a firewall using ufw:
```
$ sudo ufw allow OpenSSH
$ sudo ufw enable
```

### Nginx Configuration
Install Nginx using apt-get:
```
$ sudo apt-get install nginx
```

If you are running ufw (Uncomplicated Firewall), allow Nginx:
```
$ sudo ufw allow 'Nginx HTTP'
```

Once installed, Nginx runs automatically and is configured as a service that
will always be started by systemd.

Use something like the Nginx configuration specified in this article:
https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04

### Application Configuration
Install nvm:
https://github.com/nvm-sh/nvm

Make sure you are in the project directory, then install node. The version
installed is determined by the [.nvmrc](.nvmrc) file.
```
$ nvm install
```

Install yarn globally:
```
$ npm install yarn -g
```

Install sqlite:
```
$ sudo apt-get install sqlite
```
