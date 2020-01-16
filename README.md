# Permanent ID Generator API and UI

This is an API and UI used to generate Permanent ID's for metadata and other products in UUID format.

## Architecture

This is a PEVN project which uses Postgres as the DB, Express.js as the server, Vue for the UI and node.js as the platform.  

The intitial project skeleton was generated using `express-generator`.

## Project Dependencies

* moment: date and time formatter
* eslint
* uuid: generates UUID's
* pg-promise:  Built on top of node-postgres, this library adds the following:
  * Automatic connections
  * Automatic transactions
  * Powerful query-formatting engine + query generation
  * Declarative approach to handling query results
  * Global events reporting for central handling
  * Extensive support for external SQL files
  * Support for all promise libraries
  * (docs: <http://vitaly-t.github.io/pg-promise/module-pg-promise.html>)
* bluebird: JavaScript promise library (required for pg-promise)
* express-validator: Validates API requests, built on validator.js
* winston: general logger for application
* express-winston: logger for express built using winston - logs internal express messages

## Development Dependencies

* eslint
* standard:  JavaScript standard style <https://standardjs.com/>

## App Configuration

Configuration variables for the app are stored in the `config` directory in `config.json`.  Four run environments are provided:

* local
* development
* staging
* production

"Local" is the "Base" environment. Any variable you provide in the other environments overwrites the value provided in local. The run environment for the project is set at the top of `app.js`. 

## Database

The database is scripted in the `sql` folder.  It is managed using flyway.

## Logging

Two logs are created in the `logs` directory.  The combined log has every event from log level `info` and above.  The other log only has `error` level events logged to it.

## Getting Started

1. Create a new database called `pid`.
2. Run flyway on the files in the `sql` directory.
3. Confirm you can connect to the database using the `app_pid` user.
4. In the project root directory, run `npm install`.
5. Type `npm start` to start the api application running on port 3000.
