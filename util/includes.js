/**
 * a module containing common imports
 */

const Sequelize = require('sequelize');
const db = require('../models'); //contain the User model, which is accessible via db.Contact
const bcrypt = require('bcrypt');
const saltRounds = 10;

const Cookies = require('cookies')
const functions = require("./funcs")
const keys = ['beetroot juice']

module.exports = {Sequelize, db, Cookies, functions, keys, bcrypt, saltRounds}
