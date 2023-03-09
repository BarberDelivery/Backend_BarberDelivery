const app = require("../../app");
const request = require("supertest");
const { sequelize } = require("../../models");

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("ServicesTransactions", null, { truncate: true, restartIdentity: true, cascade: true });
  await sequelize.queryInterface.bulkDelete("Schedules", null, { truncate: true, restartIdentity: true, cascade: true });
  await sequelize.queryInterface.bulkDelete("Services", null, { truncate: true, restartIdentity: true, cascade: true });
  await sequelize.queryInterface.bulkDelete("Transactions", null, { truncate: true, restartIdentity: true, cascade: true });
  await sequelize.queryInterface.bulkDelete("Customers", null, { truncate: true, restartIdentity: true, cascade: true });
  await sequelize.queryInterface.bulkDelete("Barbers", null, { truncate: true, restartIdentity: true, cascade: true });
});

describe("POST /customer/register", () => {
  it("should register and response 201", async () => {
    const customerRegisterData = {
      username: "erwin",
      email: "erwin@gmail.com",
      password: "12345678",
    };

    const response = await request(app).post("/customer/register").send(customerRegisterData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "Register Successfully");
    expect(response.body).toHaveProperty("customerRegisterData");
    expect(response.body.customerRegisterData).toHaveProperty("id", expect.any(Number));
    expect(response.body.customerRegisterData).toHaveProperty("username", customerRegisterData.username);
    expect(response.body.customerRegisterData).toHaveProperty("email", customerRegisterData.email);
    expect(response.body.customerRegisterData).toHaveProperty("password", expect.any(String));
    expect(response.body.customerRegisterData).toHaveProperty("createdAt");
    expect(response.body.customerRegisterData).toHaveProperty("updatedAt");
  });

  // Email notNull
  it("should response with status 400", async () => {
    const customerRegisterData = {
      username: "erwin",
      password: "12345678",
    };

    const response = await request(app).post("/customer/register").send(customerRegisterData);

    expect(response.status).toBe(400);
    expect(response.body.message[0]).toBe("Email can't be null");
  });

  // Email notEmpty
  it("should response with status 400", async () => {
    const customerRegisterData = {
      username: "erwin",
      email: "",
      password: "12345678",
    };

    const response = await request(app).post("/customer/register").send(customerRegisterData);

    expect(response.status).toBe(400);
    expect(response.body.message[0]).toBe("Email can't be empty");
  });

  // Username unique
  it("should response with status 400", async () => {
    const customerRegisterData = {
      username: "erwin",
      email: "erwin@gmail.com",
      password: "12345678",
    };

    const response = await request(app).post("/customer/register").send(customerRegisterData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("username must be unique");
  });

  // Email unique
  it("should response with status 400", async () => {
    const customerRegisterData = {
      username: "erwin2",
      email: "erwin@gmail.com",
      password: "12345678",
    };

    const response = await request(app).post("/customer/register").send(customerRegisterData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email must be unique");
  });

  // Email isEmail
  it("should response with status 400", async () => {
    const customerRegisterData = {
      username: "erwin",
      email: "erwingmail.com",
      password: "12345678",
    };

    const response = await request(app).post("/customer/register").send(customerRegisterData);

    expect(response.status).toBe(400);
    expect(response.body.message[0]).toBe("Your email not correct format");
  });

  // Password notNull
  it("should response with status 400", async () => {
    const customerRegisterData = {
      username: "erwin",
      email: "erwin@gmail.com",
    };

    const response = await request(app).post("/customer/register").send(customerRegisterData);

    expect(response.status).toBe(400);
    expect(response.body.message[0]).toBe("Password can't be null");
  });

  // Password notEmpty
  it("should response with status 400", async () => {
    const customerRegisterData = {
      username: "erwin",
      email: "erwin@gmail.com",
      password: "",
    };

    const response = await request(app).post("/customer/register").send(customerRegisterData);

    expect(response.status).toBe(400);
    expect(response.body.message[0]).toBe("Password can't be empty");
  });
});
