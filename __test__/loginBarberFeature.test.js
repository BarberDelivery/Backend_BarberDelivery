const app = require("../app");
const request = require("supertest");
const { sequelize } = require("../models");
const { hash } = require("../helpers/bcrypt");
const { encodeToken } = require("../helpers/jwt");

beforeAll(async () => {
  let barbersData = require(`../db/barbers.json`).map((el) => {
    el.createdAt = new Date();
    el.updatedAt = new Date();
    el.password = hash(el.password);
    return el;
  });
  await sequelize.queryInterface.bulkInsert(`Barbers`, barbersData, {});

  access_token = encodeToken({
    id: 2,
  });
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Barbers", null, { truncate: true, restartIndentity: true, cascade: true });
});

describe.skip("API customer", () => {
  describe("POST /barber/login", () => {
    it("should login and response 200", async () => {
      const barberLoginData = {
        username: "alfian",
        email: "alfian@gmail.com",
        password: "12345678",
      };

      const response = await request(app).post("/barber/login").send(barberLoginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("access_token", expect.any(String));
      expect(response.body).toHaveProperty("sendUsernameForBarber", expect.any(String));
    });

    // Username Invalid
    it("should login and response 200", async () => {
      const barberLoginData = {
        username: "alfian2",
        email: "alfian@gmail.com",
        password: "12345678",
      };

      const response = await request(app).post("/barber/login").send(barberLoginData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Email/Password Invalid");
    });

    // Email Invalid
    it("should login and response 200", async () => {
      const barberLoginData = {
        username: "alfian",
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
        username: "alfian",
        email: "alfian@gmail.com",
        password: "12345",
      };

      const response = await request(app).post("/barber/login").send(barberLoginData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Email/Password Invalid");
    });

    // Username null
    it("should login and response 200", async () => {
      const barberLoginData = {
        email: "alfian@gmail.com",
        password: "12345678",
      };

      const response = await request(app).post("/barber/login").send(barberLoginData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Username Required");
    });

    // Email null
    it("should login and response 200", async () => {
      const barberLoginData = {
        username: "alfian",
        password: "12345678",
      };

      const response = await request(app).post("/barber/login").send(barberLoginData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Email Required");
    });

    // Password null
    it("should login and response 200", async () => {
      const barberLoginData = {
        username: "alfian",
        email: "alfian@gmail.com",
      };

      const response = await request(app).post("/barber/login").send(barberLoginData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Password Required");
    });
  });
});
