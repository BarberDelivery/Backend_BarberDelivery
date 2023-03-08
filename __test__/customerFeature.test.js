const app = require("../app");
const request = require("supertest");
const { sequelize } = require("../models");
const fs = require("fs");
const { hash } = require("../helpers/bcrypt");
const { encodeToken } = require("../helpers/jwt");
const Cloudinary = require("cloudinary");
// const bodyParser = require("body-parser");
// app.use(bodyParser.raw({ type: "application/octet-stream" }));
const { uploads } = require("../helpers/cloudinary");
jest.mock("cloudinary");
let access_token;

beforeAll(async () => {
  let customersData = require(`../db/customers.json`).map((el) => {
    el.createdAt = new Date();
    el.updatedAt = new Date();
    el.password = hash(el.password);
    return el;
  });
  await sequelize.queryInterface.bulkInsert(`Customers`, customersData, {});

  let barbersData = require(`../db/barbers.json`).map((el) => {
    el.createdAt = new Date();
    el.updatedAt = new Date();
    el.password = hash(el.password);
    return el;
  });
  await sequelize.queryInterface.bulkInsert(`Barbers`, barbersData, {});

  access_token = encodeToken({
    id: 1,
  });

  let servicesData = require(`../db/services.json`).map((el) => {
    el.createdAt = new Date();
    el.updatedAt = new Date();
    return el;
  });
  await sequelize.queryInterface.bulkInsert(`Services`, servicesData, {});

  const customerTransactionData = {
    BarberId: 1,
    priceBarber: 60000,
    date: "2023-03-07T16:20:00.000Z",
    servicesId: [1],
    longLatCustomer: "-6.162004679714239,106.8681513935716",
    longLatBarber: "-6.274352505262114,106.78225871774467",
  };

  const response = await request(app).post("/customer/order/transaction").set("access_token", access_token).send(customerTransactionData);

  // let transactionsData = require(`../db/transactions.json`).map((el) => {
  //   el.createdAt = new Date();
  //   el.updatedAt = new Date();
  //   return el;
  // });
  // await sequelize.queryInterface.bulkInsert(`Transactions`, transactionsData, {});

  // let servicesTranctionData = require(`../db/servicesTransactions.json`).map((el) => {
  //   el.createdAt = new Date();
  //   el.updatedAt = new Date();
  //   return el;
  // });
  // await sequelize.queryInterface.bulkInsert(`ServicesTransactions`, servicesTranctionData, {});

  // beforeAll(() => {
  //   Cloudinary.mockImplementation(() => {
  //     return {
  //       upload: () => {
  //         return new Promise((resolve) => {
  //           resolve({
  //             url: "fake-image.png",
  //           });
  //         });
  //       },
  //     };
  //   });
  // });
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Schedules", null, { truncate: true, restartIdentity: true, cascade: true });
  await sequelize.queryInterface.bulkDelete("ServicesTransactions", null, { truncate: true, restartIdentity: true, cascade: true });
  await sequelize.queryInterface.bulkDelete("Transactions", null, { truncate: true, restartIdentity: true, cascade: true });
  await sequelize.queryInterface.bulkDelete("Services", null, { truncate: true, restartIdentity: true, cascade: true });
  await sequelize.queryInterface.bulkDelete("Customers", null, { truncate: true, restartIdentity: true, cascade: true });
  await sequelize.queryInterface.bulkDelete("Barbers", null, { truncate: true, restartIdentity: true, cascade: true });
});

describe("API Customer", () => {
  describe("GET /customer/detail", () => {
    it("should response and status 200", async () => {
      const response = await request(app).get("/customer/detail").set("access_token", access_token);

      // console.log(response.body[0], "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
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

      // console.log(response.body.message, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid Token");
    });
  });

  describe("GET /customer/order/barber", () => {
    it("should response and status 200", async () => {
      const response = await request(app).get("/customer/order/barber").set("access_token", access_token);

      // console.log(response.body[0], "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      expect(response.status).toBe(200);
      expect(response.body[0]).toEqual({
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
      });
    });

    it("should response and status 401", async () => {
      const response = await request(app).get("/customer/order/barber");

      // console.log(response.body.message, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid Token");
    });
  });

  describe("GET /customer/order/barber/:barberId", () => {
    it("should response and status 200", async () => {
      const response = await request(app).get("/customer/order/barber/2").set("access_token", access_token);

      // console.log(response.body[0], "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      expect(response.status).toBe(200);

      expect(response.body).toEqual({
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
      });
    });

    it("should response and status 404", async () => {
      const response = await request(app).get("/customer/order/barber/99").set("access_token", access_token);

      // console.log(response.body.message, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Data not found");
    });

    it("should response and status 401", async () => {
      const response = await request(app).get("/customer/order/barber/2");

      // console.log(response.body.message, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid Token");
    });
  });

  describe("GET /customer/order/services", () => {
    it("should response and status 200", async () => {
      const response = await request(app).get("/customer/order/services").set("access_token", access_token);

      // console.log(response.body[0], "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      expect(response.status).toBe(200);
      expect(response.body[0]).toEqual({
        id: expect.any(Number),
        name: expect.any(String),
        price: expect.any(Number),
      });
    });

    it("should response and status 401", async () => {
      const response = await request(app).get("/customer/order/services");

      // console.log(response.body.message, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid Token");
    });
  });

  describe("POST /customer/order/transaction", () => {
    // /customer/order/transaction
    it("should response transaction and response 201", async () => {
      const customerTransactionData = {
        BarberId: 2,
        priceBarber: 60000,
        date: "2023-03-07T16:20:00.000Z",
        servicesId: [1, 2],
        longLatCustomer: "-6.162004679714239,106.8681513935716",
        longLatBarber: "-6.274352505262114,106.78225871774467",
      };

      const response = await request(app).post("/customer/order/transaction").set("access_token", access_token).send(customerTransactionData);
      console.log(response.body);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id", expect.any(Number));
      expect(response.body).toHaveProperty("CustomerId", expect.any(Number));
      expect(response.body).toHaveProperty("BarberId", expect.any(Number));
      expect(response.body).toHaveProperty("status");
      expect(response.body).toHaveProperty("cutRating");
      expect(response.body).toHaveProperty("totalPrice", expect.any(String));
      expect(response.body).toHaveProperty("duration", expect.any(Number));
      expect(response.body).toHaveProperty("date", expect.any(String));
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

  describe("GET /customer/order/transaction", () => {
    it("should response and status 200", async () => {
      const response = await request(app).get("/customer/order/transaction").set("access_token", access_token);

      // console.log(response.body[0], "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");

      expect(response.status).toBe(200);
      expect(response.body[0]).toEqual({
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

    it("should response and status 401", async () => {
      const response = await request(app).get("/customer/order/transaction");

      // console.log(response.body.message, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid Token");
    });
  });

  describe("GET /customer/order/transaction/:transactionId", () => {
    // customer/order/transaction/:transactionId
    // Successfully got 1 Main Entity according to given id params
    it("should response and status 200", async () => {
      const response = await request(app).get("/customer/order/transaction/1").set("access_token", access_token);

      // console.log(response.body, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
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

    // customer/order/transaction/:transactionId
    // Data not found when got 1 Main Entity according to given id params
    it("should response and status 404", async () => {
      const response = await request(app).get("/customer/order/transaction/99").set("access_token", access_token);

      // console.log(response.body.message, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Data not found");
    });

    it("should response and status 401", async () => {
      const response = await request(app).get("/customer/order/transaction/99");

      console.log(response.body.message, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid Token");
    });
  });

  describe("PATCH /customer/order/payment", () => {
    it("should response and status 201", async () => {
      const dataPayment = {
        transactionId: 1,
      };

      const response = await request(app).patch("/customer/order/payment").set("access_token", access_token).send(dataPayment);

      // console.log(response, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Payment Successfully");
    });

    it("should response and status 404", async () => {
      const dataPayment = {
        transactionId: 99,
      };

      const response = await request(app).patch("/customer/order/payment").set("access_token", access_token).send(dataPayment);

      // console.log(response.body.message, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Data not found");
    });

    it("should response and status 401", async () => {
      const dataPayment = {
        transactionId: 2,
      };

      const response = await request(app).patch("/customer/order/payment").send(dataPayment);

      // console.log(response.body.message, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid Token");
    });
  });

  describe("PATCH /customer/rate", () => {
    it("should response and status 201", async () => {
      const dataRate = {
        rate: 3.8,
        BarberId: 1,
      };

      const response = await request(app).patch("/customer/rate").set("access_token", access_token).send(dataRate);

      console.log(response, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Rate Barber Successfully");
    });

    it("should response and status 404", async () => {
      const dataRate = {
        rate: 3.8,
        BarberId: 99,
      };

      const response = await request(app).patch("/customer/rate").set("access_token", access_token).send(dataRate);

      console.log(response.body.message, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Data not found");
    });

    it("should response and status 400", async () => {
      const dataRate = {
        BarberId: 2,
      };

      const response = await request(app).patch("/customer/rate").set("access_token", access_token).send(dataRate);

      console.log(response.body.message, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Please, you must rate the Barbers");
    });

    it("should response and status 401", async () => {
      const dataRate = {
        rate: 3.8,
        BarberId: 4,
      };

      const response = await request(app).patch("/customer/rate").send(dataRate);

      console.log(response.body.message, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid Token");
    });
  });

  describe("GET /customer/order/schedule", () => {
    it("should response and status 200", async () => {
      const data = {
        BarberId: 2,
      };
      const response = await request(app).get("/customer/order/schedule").set("access_token", access_token).send(data);
      // console.log(response, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      expect(response.status).toBe(200);
      expect(response.body[0]).toEqual({
        id: expect.any(Number),
        BarberId: expect.any(Number),
        timeStart: expect.any(String),
        timeEnd: expect.any(String),
        status: expect.any(String),
        TransactionId: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it("should response and status 401", async () => {
      const response = await request(app).get("/customer/order/schedule");

      console.log(response.body.message, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid Token");
    });
  });

  describe("GET /customer/catalogue", () => {
    it("should response and status 201", async () => {
      const response = await request(app).get("/customer/catalogue").set("access_token", access_token);

      // console.log(response, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      expect(response.status).toBe(200);
      expect(response.body[0]).toEqual({
        _id: expect.any(String),
        image: expect.any(String),
      });
    });

    it("should response and status 401", async () => {
      const response = await request(app).get("/customer/catalogue");

      console.log(response.body.message, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid Token");
    });
  });

  // describe("POST /customer/upload-image", () => {
  //   beforeAll(() => {
  //     Cloudinary.mockImplementation(() => {
  //       return {
  //         upload: () => {
  //           return new Promise((resolve) => {
  //             resolve({
  //               url: "fake-image.png",
  //             });
  //           });
  //         },
  //       };
  //     });
  //   });
  //   // /customer/upload-image
  //   it("should response transaction and response 201", async () => {
  //     // const response = await request(app).post("/customer/upload-image").set("access_token", access_token);
  //     // console.log(__dirname, "<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

  //     const response = await request(app).post("/customer/upload-image").set("access_token", access_token).attach("file", "Readme/test-image.jpg");
  //     expect(response.status).toBe(201);
  //     expect(response.body.message).toBe("Upload image is successful");
  //   });

  //   it("should response and status 401", async () => {
  //     const response = await request(app).post("/customer/upload-image").attach("file", "Readme/test-image.jpg");

  //     // console.log(response.body.message, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
  //     expect(response.status).toBe(401);
  //     expect(response.body.message).toBe("Invalid Token");
  //   });
  // });

  describe("POST customer/payment/:transactionId", () => {
    it("should response and status 200", async () => {
      const response = await request(app).post("/customer/payment/1").set("access_token", access_token);
      // console.log(response, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: expect.any(String),
        external_id: expect.any(String),
        user_id: expect.any(String),
        status: expect.any(String),
        items: expect.any(Array),
        merchant_name: expect.any(String),
        merchant_profile_picture_url: expect.any(String),
        amount: expect.any(Number),
        description: expect.any(String),
        expiry_date: expect.any(String),
        invoice_url: expect.any(String),
        available_banks: expect.any(Array),
        available_retail_outlets: expect.any(Array),
        available_ewallets: expect.any(Array),
        available_qr_codes: expect.any(Array),
        available_direct_debits: expect.any(Array),
        available_paylaters: expect.any(Array),
        should_exclude_credit_card: expect.any(Boolean),
        should_send_email: expect.any(Boolean),
        success_redirect_url: expect.any(String),
        failure_redirect_url: expect.any(String),
        created: expect.any(String),
        updated: expect.any(String),
        currency: expect.any(String),
        fees: expect.any(Array),
        customer: expect.any(Object),
        customer_notification_preference: expect.any(Object),
      });
    });

    it("should response and status 401", async () => {
      const response = await request(app).post("/customer/payment/1");

      console.log(response.body.message, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid Token");
    });
  });

  describe("POST /customer/success-payment", () => {
    it("should response and status 201", async () => {
      const tokenCallback = "NGvDBoztLU64gbSORRsbSFKks4yTdTmhDYJeQEFjwA2wQlwW";
      const dataSend = { external_id: 1, status: "PAID" };
      const response = await request(app).post("/customer/success-payment").send(dataSend).set("x-callback-token", tokenCallback);
      // console.log(response, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Payment Successfully");
    });

    it("should response and status 401", async () => {
      const response = await request(app).post("/customer/success-payment");

      console.log(response.body.message, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid Token");
    });
  });
});
