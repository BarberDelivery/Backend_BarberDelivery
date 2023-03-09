const app = require("../../app");
const request = require("supertest");
const { sequelize } = require("../../models");
const { encodeToken } = require("../../helpers/jwt");
const { Customer, Barber, Item, Transaction, Service, ServicesTransaction, Schedule } = require("../../models/index");
const { hash } = require("../../helpers/bcrypt");
let access_token;

const cloudinary = require("../../helpers/cloudinary");
// const { uploads } = require("../helpers/cloudinary");
jest.mock("../../helpers/cloudinary");
// trans

// { message: "asbdkasjdkasd" }  500
// expect().toEqual({ message: "asbdkasjdkasd" })
cloudinary.uploads.mockResolvedValueOnce({
  id: 1,
  url: "Test",
});

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

describe("POST /customer/upload-image", () => {
  beforeAll(() => {
    jest.setTimeout(30000);
    // cloudinary.uploader.upload.mockImplementation(() => {
    //   return {
    //     upload: () => {
    //       return new Promise((resolve) => {
    //         resolve({
    //           url: "fake-image.png",
    //         });
    //       });
    //     },
    //   };
    // });
  });
  // /customer/upload-image
  it("should response transaction and response 201", async () => {
    // const response = await request(app).post("/customer/upload-image").set("access_token", access_token);
    // console.log(__dirname, "<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    try {
      // console.log(cloudinary.uploads.getMockImplementation(), "<<<<<<<<CLIUUJD");
      const response = await request(app).post("/customer/upload-image").set("access_token", access_token).attach("image", "Readme/test-image.jpg");
      console.log(response.body, "BBBBBBBBBBBBBBBBBBB");
      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Upload image is successful");
    } catch (err) {
      console.log(err, "EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEe");
    }
  });
});
