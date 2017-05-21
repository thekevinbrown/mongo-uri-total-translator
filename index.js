#!/usr/bin/env node

const chalk = require('chalk');
const muri = require('muri');
const execSync = require('child_process').execSync;

if (process.argv.length < 3) {
    return console.error(
        chalk.red('Please call mutt with a mongo URI, and then any args you\'d like to pass to mongo, like this:\n\n') +
        'mutt "mongodb://localhost" --eval "printjson(db.getCollectionNames())"\n'
    );
}

const connectionDetails = muri(process.argv[2]);

let command = ['mongo'];

// Database Identifier
let databaseIdentifier = 'mongodb://';

if (connectionDetails.hosts) {
    databaseIdentifier += connectionDetails.hosts.map(hostDetails => {
        if (hostDetails.port) {
            return `${hostDetails.host}:${hostDetails.port}`;
        }

        return hostDetails.host;
    }).join(',');
}

// Do we have a database name?
if (connectionDetails.db) databaseIdentifier += `/${connectionDetails.db}`;

const databaseIdentifierQueryString = {};

// Do we have a replica set?
if (connectionDetails.options && connectionDetails.options.replicaSet) {
    databaseIdentifierQueryString.replicaSet = connectionDetails.options.replicaSet;
}

if (Object.keys(databaseIdentifierQueryString).length > 0) {
    const pairs = Object.keys(databaseIdentifierQueryString).map(key => {
        return `${key}=${databaseIdentifierQueryString[key]}`;
    })
    databaseIdentifier += `?${pairs.join('&')}`;
}
command.push(`"${databaseIdentifier}"`);

// Do we have an authentication database?
if (connectionDetails.options && connectionDetails.options.authSource) {
    command.push('--authenticationDatabase');
    command.push(`"${connectionDetails.options.authSource}"`);
}

// SSL
if (connectionDetails.options && connectionDetails.options.ssl) {
    command.push ('--ssl');
}

if (connectionDetails.auth) {
    if (connectionDetails.auth.user) {
        command.push('--username');
        command.push(`"${connectionDetails.auth.user}"`);
    }
    if (connectionDetails.auth.pass) {
        command.push('--password');
        command.push(`"${connectionDetails.auth.pass}"`);
    }
}

// Pass any additional command along to Mongo.
command = command.concat(process.argv.slice(3).map(command => `"${command}"`));

// Get ready to run.
command = command.join(' ');

console.log(`
Running command:
${chalk.cyan(command)}
`);

try {
    execSync(command, { stdio: 'inherit' });
} catch (error) {
    // We don't actually care that this happened except to pass
    // the return code along. stdout and stderr are already going
    // to have been displayed to the user.
    if (error.status) return process.exit(error.status);
    return process.exit(1);
}
