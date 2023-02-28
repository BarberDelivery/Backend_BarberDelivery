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

    let itemsData = JSON.parse(fs.readFileSync("./db/items.json", "utf-8"));
    itemsData = itemsData.map((el) => {
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

    let chatsData = JSON.parse(fs.readFileSync("./db/chats.json", "utf-8"));
    chatsData = chatsData.map((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el;
    });

    await queryInterface.bulkInsert("Customers", customersData, null);
    await queryInterface.bulkInsert("Barbers", barbersData, null);
    await queryInterface.bulkInsert("Items", itemsData, null);
    await queryInterface.bulkInsert("Transactions", transactionsData, null);
    await queryInterface.bulkInsert("Chats", chatsData, null);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Customers", null, {});
    await queryInterface.bulkDelete("Barbers", null, {});
    await queryInterface.bulkDelete("Items", null, {});
    await queryInterface.bulkDelete("Transactions", null, {});
    await queryInterface.bulkDelete("Chats", null, {});
  },
};
