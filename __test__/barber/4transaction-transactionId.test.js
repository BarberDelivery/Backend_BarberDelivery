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

  const customerTransactionData = {
    BarberId: 1,
    priceBarber: 60000,
    date: "2023-03-14T24:00:00.000Z",
    servicesId: [1],
    longLatCustomer: "-6.162004679714239,106.8681513935716",
    longLatBarber: "-6.274352505262114,106.78225871774467",
  };

  const response = await request(app).post("/customer/order/transaction").set("access_token", access_token).send(customerTransactionData);

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

describe("GET /barber/transaction/:transactionId", () => {
  it("should response and status 200", async () => {
    const response = await request(app).get("/barber/transaction/1").set("access_token", access_token);

    console.log(response.body, "<<<<<<<<<Barber<<<<<<<<<");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: expect.any(Number),
      CustomerId: expect.any(Number),
      BarberId: expect.any(Number),
      status: expect.any(String),
      cutRating: expect.any(Number),
      totalPrice: expect.any(String),
      duration: expect.any(Number),
      date: expect.any(String),
      longLatCustomer: expect.any(String),
      tripPrice: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      ServicesTransactions: expect.objectContaining([
        {
          id: expect.any(Number),
          ServiceId: expect.any(Number),
          TransactionId: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          Service: expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            price: expect.any(Number),
            duration: expect.any(Number),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        },
      ]),
      Customer: expect.objectContaining({
        id: expect.any(Number),
        username: expect.any(String),
        email: expect.any(String),
        isStudent: expect.any(Boolean),
        lastCut: expect.any(String),
        imgDataCustomer: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
      Barber: expect.objectContaining({
        id: expect.any(Number),
        username: expect.any(String),
        email: expect.any(String),
        activityStatus: expect.any(String),
        yearOfExperience: expect.any(Number),
        rating: expect.any(Number),
        price: expect.any(String),
        description: expect.any(String),
        longLatBarber: expect.any(String),
        profileImage: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    });
  });
  it("should response and status 404", async () => {
    const response = await request(app).get("/barber/transaction/99").set("access_token", access_token);

    console.log(response.body.message, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Data not found");
  });

  it("should response and status 401", async () => {
    const response = await request(app).get("/barber/transaction/1");

    console.log(response.body.message, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid Token");
  });
});
