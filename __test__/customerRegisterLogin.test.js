const app = require("../app");
const request = require("supertest");
const { sequelize } = require("../models");

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Customers", null, { truncate: true, restartIndentity: true, cascade: true });
});

describe("API customer", () => {
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

  describe("POST /customer/login", () => {
    it("should login and response 200", async () => {
      const customerLoginData = {
        username: "erwin",
        email: "erwin@gmail.com",
        password: "12345678",
      };

      const response = await request(app).post("/customer/login").send(customerLoginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("access_token", expect.any(String));
      expect(response.body).toHaveProperty("sendUsernameForClient", expect.any(String));
    });

    // Username Invalid
    it("should login and response 200", async () => {
      const customerLoginData = {
        username: "erwin2",
        email: "erwin@gmail.com",
        password: "12345678",
      };

      const response = await request(app).post("/customer/login").send(customerLoginData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Email/Password Invalid");
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
  });
});
