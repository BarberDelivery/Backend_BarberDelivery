const app = require("../../app");
const request = require("supertest");
const { sequelize } = require("../../models");
const { encodeToken } = require("../../helpers/jwt");
const { Customer, Barber, Item, Transaction, Service, ServicesTransaction, Schedule } = require("../../models/index");
const { hash } = require("../../helpers/bcrypt");
let access_token;

beforeAll(async () => {
  let customersData = require(`../../db/customers.json`).map((el) => {
    el.createdAt = new Date();
    el.updatedAt = new Date();
    el.password = hash(el.password);
    return el;
  });
  await sequelize.queryInterface.bulkInsert(`Customers`, customersData, {});

  let barbersData = require(`../../db/barbers.json`).map((el) => {
    el.createdAt = new Date();
    el.updatedAt = new Date();
    el.password = hash(el.password);
    return el;
  });
  await sequelize.queryInterface.bulkInsert(`Barbers`, barbersData, {});

  access_token = encodeToken({
    id: 1,
  });

  let servicesData = require(`../../db/services.json`).map((el) => {
    el.createdAt = new Date();
    el.updatedAt = new Date();
    return el;
  });
  await sequelize.queryInterface.bulkInsert(`Services`, servicesData, {});

  // const customerTransactionData = {
  //   BarberId: 1,
  //   priceBarber: 60000,
  //   date: "2023-03-T16:20:00.000Z",
  //   servicesId: [1],
  //   longLatCustomer: "-6.162004679714239,106.8681513935716",
  //   longLatBarber: "-6.274352505262114,106.78225871774467",
  // };

  // const response = await request(app).post("/customer/order/transaction").set("access_token", access_token).send(customerTransactionData);

  let dataSchedule = [
    {
      BarberId: 1,
      timeStart: "2023-03-09 15:00:00.000 +0700",
      timeEnd: "2023-03-09 17:00:00.000 +0700",
      status: "unfinished",
      TransactionId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  await sequelize.queryInterface.bulkInsert(`Schedules`, dataSchedule, {});
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("ServicesTransactions", null, { truncate: true, restartIdentity: true, cascade: true });
  await sequelize.queryInterface.bulkDelete("Schedules", null, { truncate: true, restartIdentity: true, cascade: true });
  await sequelize.queryInterface.bulkDelete("Services", null, { truncate: true, restartIdentity: true, cascade: true });
  await sequelize.queryInterface.bulkDelete("Transactions", null, { truncate: true, restartIdentity: true, cascade: true });
  await sequelize.queryInterface.bulkDelete("Customers", null, { truncate: true, restartIdentity: true, cascade: true });
  await sequelize.queryInterface.bulkDelete("Barbers", null, { truncate: true, restartIdentity: true, cascade: true });
});

describe("POST /customer/order/transaction", () => {
  // /customer/order/transaction
  it("should response transaction and response 201", async () => {
    const customerTransactionData = {
      BarberId: 1,
      priceBarber: 60000,
      date: "2023-03-12T16:20:00.000Z",
      servicesId: [1],
      longLatCustomer: "-6.162004679714239,106.8681513935716",
      longLatBarber: "-6.274352505262114,106.78225871774467",
    };

    console.log(customerTransactionData, "--------------------------");
    const response = await request(app).post("/customer/order/transaction").set("access_token", access_token).send(customerTransactionData);
    console.log(response.body, "+++++++++++++++++++++++++++");

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("CustomerId", expect.any(Number));
    expect(response.body).toHaveProperty("BarberId", expect.any(Number));
    expect(response.body).toHaveProperty("status");
    expect(response.body).toHaveProperty("cutRating");
    expect(response.body).toHaveProperty("totalPrice");
    expect(response.body).toHaveProperty("duration");
    expect(response.body).toHaveProperty("date");
    expect(response.body).toHaveProperty("longLatCustomer", expect.any(String));
    expect(response.body).toHaveProperty("tripPrice", expect.any(Number));
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");
  });

  it("should response and status 401", async () => {
    const response = await request(app).post("/customer/order/transaction");

    // console.log(response.body.message, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid Token");
  });
});
