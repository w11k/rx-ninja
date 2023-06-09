'use strict'

module.exports = {
    require: ['ts-node/register', 'source-map-support/register'],
    ui: 'bdd',
    reporter: 'spec',
    "check-leaks": true,
    recursive: true,
    timeout: 1000
}
