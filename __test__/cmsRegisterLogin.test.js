const app = require("../app");
const request = require("supertest");
const { sequelize } = require("../models");

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Customers", null, { truncate: true, restartIndentity: true, cascade: true });
});

describe.skip("API customer", () => {
  describe("POST /admin/register", () => {
    it("should register and response 201", async () => {
      const adminRegisterData = {
        username: "erwin",
        email: "erwin@gmail.com",
        password: "12345678",
      };

      const response = await request(app).post("/admin/register").send(adminRegisterData);
      console.log(response.body, "<<<<<<<<<<<<<<<<<,,");
      expect(response.body).toEqual({
        _id: expect.any(String),
        username: expect.any(String),
        email: expect.any(String),
        encrypPass: expect.any(String),
      });
    });

    // Email notNull
    it("should response with status 401", async () => {
      const adminRegisterData = {
        email: "erwin@gmail.com",
        inputPassword: "12345678",
      };

      const response = await request(app).post("/admin/register").send(adminRegisterData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Username Required");
    });

    // Email notNull
    it("should response with status 401", async () => {
      const adminRegisterData = {
        username: "erwin",
        inputPassword: "12345678",
      };

      const response = await request(app).post("/admin/register").send(adminRegisterData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Email Required");
    });

    // Password notNull
    it("should response with status 401", async () => {
      const adminRegisterData = {
        username: "erwin",
        email: "erwin@gmail.com",
      };

      const response = await request(app).post("/admin/register").send(adminRegisterData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Password Required");
    });
  });

  describe("POST /admin/login", () => {
    it("should login and response 200", async () => {
      const customerLoginData = {
        username: "erwin",
        email: "erwin@gmail.com",
        password: "12345678",
      };

      const response = await request(app).post("/admin/login").send(customerLoginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("access_token", expect.any(String));
      expect(response.body).toHaveProperty("sendUsernameForClient", expect.any(String));
    });

    // Username null
    it("should login and response 401", async () => {
      const barberLoginData = {
        email: "erwin@gmail.com",
        password: "12345678",
      };

      const response = await request(app).post("/admin/login").send(barberLoginData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Username Required");
    });

    // Email null
    it("should login and response 401", async () => {
      const barberLoginData = {
        username: "erwin",
        password: "12345678",
      };

      const response = await request(app).post("/admin/login").send(barberLoginData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Email/Password Invalid");
    });

    // Password null
    it("should response with status 401", async () => {
      const adminRegisterData = {
        username: "erwin",
        email: "erwin@gmail.com",
      };

      const response = await request(app).post("/admin/register").send(adminRegisterData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Password Required");
    });
  });
});
