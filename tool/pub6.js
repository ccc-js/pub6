#!/usr/bin/env node
// ex: node pub6 --path=../doc
let pub6 = require('../src/')
const argv = require('yargs').argv
pub6.convertAll(argv.path)
