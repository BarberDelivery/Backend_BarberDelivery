"use strict";
const { hash } = require("../helpers/bcrypt");
const fs = require("fs");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let customersData = JSON.parse(fs.readFileSync("./db/customers.json", "utf-8"));
    customersData = customersData.map((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
      el.password = hash(el.password);
      return el;
    });

    let barbersData = JSON.parse(fs.readFileSync("./db/barbers.json", "utf-8"));
    barbersData = barbersData.map((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
      el.password = hash(el.password);
      return el;
    });

    let servicesData = JSON.parse(fs.readFileSync("./db/services.json", "utf-8"));
    servicesData = servicesData.map((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el;
    });

    let transactionsData = JSON.parse(fs.readFileSync("./db/transactions.json", "utf-8"));
    transactionsData = transactionsData.map((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el;
    });

    await queryInterface.bulkInsert("Customers", customersData, null);
    await queryInterface.bulkInsert("Barbers", barbersData, null);
    await queryInterface.bulkInsert("Services", servicesData, null);
    await queryInterface.bulkInsert("Transactions", transactionsData, null);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Customers", null, {});
    await queryInterface.bulkDelete("Barbers", null, {});
    await queryInterface.bulkDelete("Services", null, {});
    await queryInterface.bulkDelete("Transactions", null, {});
  },
};
