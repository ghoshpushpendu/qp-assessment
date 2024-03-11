const dotenv = require('dotenv');
const path = require('path');

const parentDirPath = path.join(__dirname, '../../');
const envPath = path.join(parentDirPath, '.env');
dotenv.config({path: envPath});

module.exports = {
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_SCHEMA,
    "host": process.env.DB_HOST,
    "dialect": "postgres"
  }
}
