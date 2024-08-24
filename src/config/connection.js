require('dotenv').config({})

const { Sequelize } = require('sequelize');
  const sq = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging:false,
    timezone:'+07:00'
  });



  module.exports = { sq }