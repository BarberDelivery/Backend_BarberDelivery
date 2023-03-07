const app = require("../app");
const request = require("supertest");
const { sequelize } = require("../models");
const fs = require("fs");
const { hash } = require("../helpers/bcrypt");
const { encodeToken } = require("../helpers/jwt");
// const bodyParser = require("body-parser");
// app.use(bodyParser.raw({ type: "application/octet-stream" }));
let catalogueId;
let access_token;

beforeAll(async () => {
  let customersData = require(`../db/customers.json`).map((el) => {
    el.createdAt = new Date();
    el.updatedAt = new Date();
    el.password = hash(el.password);
    return el;
  });
  await sequelize.queryInterface.bulkInsert(`Customers`, customersData, {});

  // let barbersData = require(`../db/barbers.json`).map((el) => {
  //   el.createdAt = new Date();
  //   el.updatedAt = new Date();
  //   el.password = hash(el.password);
  //   return el;
  // });
  // await sequelize.queryInterface.bulkInsert(`Barbers`, barbersData, {});

  // let transactionsData = require(`../db/transactions.json`).map((el) => {
  //   el.createdAt = new Date();
  //   el.updatedAt = new Date();
  //   return el;
  // });
  // await sequelize.queryInterface.bulkInsert(`Transactions`, transactionsData, {});

  let servicesData = require(`../db/services.json`).map((el) => {
    el.createdAt = new Date();
    el.updatedAt = new Date();
    return el;
  });
  await sequelize.queryInterface.bulkInsert(`Services`, servicesData, {});

  // access_token = encodeToken({
  //   id: 1,
  // });
  let idPassing;
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Customers", null, { truncate: true, restartIdentity: true, cascade: true });
  await sequelize.queryInterface.bulkDelete("Barbers", null, { truncate: true, restartIdentity: true, cascade: true });
  await sequelize.queryInterface.bulkDelete("Transactions", null, { truncate: true, restartIdentity: true, cascade: true });
  await sequelize.queryInterface.bulkDelete("Services", null, { truncate: true, restartIdentity: true, cascade: true });
  await sequelize.queryInterface.bulkDelete("ServicesTransactions", null, { truncate: true, restartIdentity: true, cascade: true });
  await sequelize.queryInterface.bulkDelete("Schedules", null, { truncate: true, restartIdentity: true, cascade: true });
});

describe("API Customer", () => {
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
      access_token = response.body.access_token;
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

  // describe("GET /admin/customer", () => {
  //   it("should response and status 200", async () => {
  //     access_token = encodeToken({
  //       id: 1,
  //     });
  //     const response = await request(app).get("/admin/customer").set("access_token", access_token);

  //     // console.log(response.body[0], "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
  //     expect(response.status).toBe(200);
  //     expect(response.body[0]).toEqual({
  //       id: expect.any(Number),
  //       email: expect.any(String),
  //       username: expect.any(String),
  //       password: expect.any(String),
  //       isStudent: expect.any(Boolean),
  //       lastCut: expect.any(String),
  //       imgDataCustomer: expect.any(String),
  //       createdAt: expect.any(String),
  //       updatedAt: expect.any(String),
  //     });
  //   });
  // });

  // describe("delete /admin/customer/:customerId", () => {
  //   it("should response and status 200", async () => {
  //     const response = await request(app).delete("/admin/customer/2").set("access_token", access_token);

  //     // console.log(response.body[0], "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
  //     expect(response.status).toBe(200);
  //     expect(response.body.message).toBe("Delete successfully");
  //   });

  //   it("should response and status 404", async () => {
  //     const response = await request(app).delete("/admin/customer/99").set("access_token", access_token);

  //     // console.log(response.body[0], "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
  //     expect(response.status).toBe(404);
  //     expect(response.body.message).toBe("Data not found");
  //   });
  // });

  // describe("patch /admin/customer/isStudent/:customerId", () => {
  //   it("should response and status 200", async () => {
  //     const response = await request(app).patch("/admin/customer/isStudent/1").set("access_token", access_token);

  //     // console.log(response.body[0], "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
  //     expect(response.status).toBe(200);
  //     expect(response.body.message).toBe("Update isStudent Successfuly");
  //   });

  //   it("should response and status 404", async () => {
  //     const response = await request(app).patch("/admin/customer/isStudent/9999").set("access_token", access_token);

  //     // console.log(response.body[0], "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
  //     expect(response.status).toBe(404);
  //     expect(response.body.message).toBe("Data not found");
  //   });
  // });

  // describe("POST /admin/barber", () => {
  //   it("should login and response 200", async () => {
  //     const postBarber = {
  //       username: "tayuya",
  //       email: "tayuya@gmail.com",
  //       password: "12345678",
  //       yearOfExperience: 4,
  //       description: "Lorem ipsum",
  //       longLatBarber: "-6.2601995872593745, 106.78085916408212",
  //       profileImage: "https://titlecitybarbers.com/assets/static/dany.7474da0.314044490d04151a74fee4f20b56d7ab.jpg",
  //     };

  //     const response = await request(app).post("/admin/barber").send(postBarber);

  //     expect(response.status).toBe(201);
  //     expect(response.body).toEqual({
  //       id: expect.any(Number),
  //       username: expect.any(String),
  //       email: expect.any(String),
  //       password: expect.any(String),
  //       activityStatus: expect.any(String),
  //       yearOfExperience: expect.any(Number),
  //       rating: expect.any(Number),
  //       price: null,
  //       description: expect.any(String),
  //       longLatBarber: expect.any(String),
  //       profileImage: expect.any(String),
  //       createdAt: expect.any(String),
  //       updatedAt: expect.any(String),
  //     });
  //   });

  //   // Username null
  //   it("should login and response 200", async () => {
  //     const dataBarber = {
  //       email: "tayuya@gmail.com",
  //       password: "12345678",
  //     };

  //     const response = await request(app).post("/admin/barber").send(dataBarber);

  //     expect(response.status).toBe(400);
  //     expect(response.body.message[0]).toBe("Username can't be null");
  //   });

  //   // Email null
  //   it("should login and response 200", async () => {
  //     const dataBarber = {
  //       username: "tayuya",
  //       password: "12345678",
  //     };

  //     const response = await request(app).post("/admin/barber").send(dataBarber);

  //     expect(response.status).toBe(400);
  //     expect(response.body.message[0]).toBe("Email can't be null");
  //   });

  //   // Password null
  //   it("should login and response 200", async () => {
  //     const dataBarber = {
  //       username: "tayuya",
  //       email: "tayuya@gmail.com",
  //     };

  //     const response = await request(app).post("/admin/barber").send(dataBarber);

  //     expect(response.status).toBe(400);
  //     expect(response.body.message[0]).toBe("Password can't be null");
  //   });
  // });

  // describe("GET /admin/barber", () => {
  //   it("should response and status 200", async () => {
  //     access_token = encodeToken({
  //       id: 1,
  //     });
  //     const response = await request(app).get("/admin/barber").set("access_token", access_token);

  //     // console.log(response.body[0], "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
  //     expect(response.status).toBe(200);
  //     expect(response.body[0]).toEqual({
  //       id: expect.any(Number),
  //       username: expect.any(String),
  //       email: expect.any(String),
  //       password: expect.any(String),
  //       activityStatus: expect.any(String),
  //       yearOfExperience: expect.any(Number),
  //       rating: expect.any(Number),
  //       price: null,
  //       description: expect.any(String),
  //       longLatBarber: expect.any(String),
  //       profileImage: expect.any(String),
  //       createdAt: expect.any(String),
  //       updatedAt: expect.any(String),
  //     });
  //   });
  // });

  // describe("GET /admin/barber/:barberId", () => {
  //   it("should response and status 200", async () => {
  //     const response = await request(app).get("/admin/barber/1").set("access_token", access_token);

  //     // console.log(response.body[0], "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
  //     expect(response.status).toBe(200);

  //     expect(response.body).toEqual({
  //       id: expect.any(Number),
  //       username: expect.any(String),
  //       email: expect.any(String),
  //       password: expect.any(String),
  //       activityStatus: expect.any(String),
  //       yearOfExperience: expect.any(Number),
  //       rating: expect.any(Number),
  //       price: null,
  //       description: expect.any(String),
  //       longLatBarber: expect.any(String),
  //       profileImage: expect.any(String),
  //       createdAt: expect.any(String),
  //       updatedAt: expect.any(String),
  //     });
  //   });

  //   it("should response and status 404", async () => {
  //     const response = await request(app).get("/admin/barber/99").set("access_token", access_token);

  //     // console.log(response.body.message, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
  //     expect(response.status).toBe(404);
  //     expect(response.body.message).toBe("Data not found");
  //   });
  // });

  // describe("PUT /admin/barber/1", () => {
  //   it("should login and response 200", async () => {
  //     const postBarber = {
  //       username: "tayuya l",
  //       email: "tayuya@gmail.com",
  //       password: "12345678",
  //       yearOfExperience: 4,
  //       description: "Lorem ipsum",
  //       longLatBarber: "-6.2601995872593745, 106.78085916408212",
  //       profileImage: "https://titlecitybarbers.com/assets/static/dany.7474da0.314044490d04151a74fee4f20b56d7ab.jpg",
  //     };

  //     const response = await request(app).put("/admin/barber/1").send(postBarber);
  //     console.log(response);

  //     expect(response.status).toBe(200);
  //     expect(response.body).toEqual({
  //       id: expect.any(Number),
  //       username: expect.any(String),
  //       email: expect.any(String),
  //       password: expect.any(String),
  //       activityStatus: expect.any(String),
  //       yearOfExperience: expect.any(Number),
  //       rating: expect.any(Number),
  //       price: null,
  //       description: expect.any(String),
  //       longLatBarber: expect.any(String),
  //       profileImage: expect.any(String),
  //       createdAt: expect.any(String),
  //       updatedAt: expect.any(String),
  //     });
  //   });
  // });

  // describe("POST /admin/catalogue", () => {
  //   it("should login and response 200", async () => {
  //     const postCatalogue = {
  //       image: "https://titlecitybarbers.com/assets/static/dany.7474da0.314044490d04151a74fee4f20b56d7ab.jpg",
  //     };

  //     const response = await request(app).post("/admin/catalogue").send(postCatalogue);
  //     catalogueId = response.body._id;
  //     expect(response.status).toBe(201);
  //     expect(response.body).toEqual({
  //       _id: expect.any(String),
  //       image: expect.any(String),
  //     });
  //   });
  // });

  // describe("GET /admin/catalogue", () => {
  //   it("should response and status 200", async () => {
  //     const response = await request(app).get("/admin/catalogue").set("access_token", access_token);

  //     // console.log(response.body[0], "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
  //     expect(response.status).toBe(200);

  //     expect(response.body[0]).toEqual({
  //       _id: expect.any(String),
  //       image: expect.any(String),
  //     });
  //   });
  // });

  // describe("delete /admin/catalogue/:catalogueId", () => {
  //   it("should response and status 200", async () => {
  //     const response = await request(app).delete(`/admin/catalogue/${catalogueId}`).set("access_token", access_token);

  //     // console.log(response.body[0], "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
  //     expect(response.status).toBe(200);
  //     expect(response.body.message).toBe("Delete Catalogue Successfuly");
  //   });

  //   it("should response and status 404", async () => {
  //     const response = await request(app).delete(`/admin/catalogue/${catalogueId}`).set("access_token", access_token);

  //     // console.log(response.body[0], "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
  //     expect(response.status).toBe(404);
  //     expect(response.body.message).toBe("Data not found");
  //   });
  // });
});
