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
  //   date: "2023-03-14T24:00:00.000Z",
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

describe("POST /barber/login", () => {
  it("should login and response 200", async () => {
    const barberLoginData = {
      email: "imanhairdnes@gmail.com",
      password: "12345678",
    };

    const response = await request(app).post("/barber/login").send(barberLoginData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token", expect.any(String));
    expect(response.body).toHaveProperty("sendUsernameForBarber", expect.any(String));
  });

  // Email Invalid
  it("should login and response 200", async () => {
    const barberLoginData = {
      username: "imanhairdnes",
      email: "er@gmail.com",
      password: "12345678",
    };

    const response = await request(app).post("/barber/login").send(barberLoginData);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Email/Password Invalid");
  });

  // Password Invalid
  it("should login and response 200", async () => {
    const barberLoginData = {
      username: "imanhairdnes",
      email: "imanhairdnes@gmail.com",
      password: "12345",
    };

    const response = await request(app).post("/barber/login").send(barberLoginData);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Email/Password Invalid");
  });

  // Email null
  it("should login and response 200", async () => {
    const barberLoginData = {
      username: "imanhairdnes",
      password: "12345678",
    };

    const response = await request(app).post("/barber/login").send(barberLoginData);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Email Required");
  });

  // Password null
  it("should login and response 200", async () => {
    jest.setTimeout(30000);
    const barberLoginData = {
      username: "imanhairdnes",
      email: "imanhairdnes@gmail.com",
    };

    const response = await request(app).post("/barber/login").send(barberLoginData);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Password Required");
  });
});
