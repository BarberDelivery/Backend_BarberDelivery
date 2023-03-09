const app = require("../../app");
const request = require("supertest");
const { sequelize } = require("../../models");
const { hash } = require("../../helpers/bcrypt");

beforeAll(async () => {
  let customersData = require(`../../db/customers.json`).map((el) => {
    el.createdAt = new Date();
    el.updatedAt = new Date();
    el.password = hash(el.password);
    return el;
  });
  await sequelize.queryInterface.bulkInsert(`Customers`, customersData, {});
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("ServicesTransactions", null, { truncate: true, restartIdentity: true, cascade: true });
  await sequelize.queryInterface.bulkDelete("Schedules", null, { truncate: true, restartIdentity: true, cascade: true });
  await sequelize.queryInterface.bulkDelete("Services", null, { truncate: true, restartIdentity: true, cascade: true });
  await sequelize.queryInterface.bulkDelete("Transactions", null, { truncate: true, restartIdentity: true, cascade: true });
  await sequelize.queryInterface.bulkDelete("Customers", null, { truncate: true, restartIdentity: true, cascade: true });
  await sequelize.queryInterface.bulkDelete("Barbers", null, { truncate: true, restartIdentity: true, cascade: true });
});

describe("POST /customer/login", () => {
  it("should login and response 200", async () => {
    const customerLoginData = {
      email: "jin@gmail.com",
      password: "12345678",
    };

    const response = await request(app).post("/customer/login").send(customerLoginData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token", expect.any(String));
    expect(response.body).toHaveProperty("sendUsernameForClient", expect.any(String));
  });

  // Email Invalid
  it("should login and response 200", async () => {
    const customerLoginData = {
      username: "erwin",
      email: "er@gmail.com",
      password: "12345678",
    };

    const response = await request(app).post("/customer/login").send(customerLoginData);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Email/Password Invalid");
  });

  // Password Invalid
  it("should login and response 200", async () => {
    const customerLoginData = {
      username: "erwin",
      email: "erwin@gmail.com",
      password: "12345",
    };

    const response = await request(app).post("/customer/login").send(customerLoginData);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Email/Password Invalid");
  });

  // Email null
  it("should login and response 200", async () => {
    const barberLoginData = {
      username: "alfian",
      password: "12345678",
    };

    const response = await request(app).post("/customer/login").send(barberLoginData);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Email Required");
  });

  // Password null
  it("should login and response 200", async () => {
    const barberLoginData = {
      username: "alfian",
      email: "alfian@gmail.com",
    };

    const response = await request(app).post("/customer/login").send(barberLoginData);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Password Required");
  });
});
