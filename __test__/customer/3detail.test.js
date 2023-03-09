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
  // console.log(customersData);
  await sequelize.queryInterface.bulkInsert(`Customers`, customersData, {});

  access_token = encodeToken({
    id: 1,
  });
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("ServicesTransactions", null, { truncate: true, restartIdentity: true, cascade: true });
  await sequelize.queryInterface.bulkDelete("Schedules", null, { truncate: true, restartIdentity: true, cascade: true });
  await sequelize.queryInterface.bulkDelete("Services", null, { truncate: true, restartIdentity: true, cascade: true });
  await sequelize.queryInterface.bulkDelete("Transactions", null, { truncate: true, restartIdentity: true, cascade: true });
  await sequelize.queryInterface.bulkDelete("Customers", null, { truncate: true, restartIdentity: true, cascade: true });
  await sequelize.queryInterface.bulkDelete("Barbers", null, { truncate: true, restartIdentity: true, cascade: true });
});

describe("GET /customer/detail", () => {
  it("should response and status 200", async () => {
    access_token = encodeToken({
      id: 1,
    });
    const response = await request(app).get("/customer/detail").set("access_token", access_token);

    console.log(response.body, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: expect.any(Number),
      username: expect.any(String),
      email: expect.any(String),
      password: expect.any(String),
      isStudent: expect.any(Boolean),
      lastCut: expect.any(String),
      imgDataCustomer: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it("should response and status 401", async () => {
    const response = await request(app).get("/customer/detail");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid Token");
  });
});
