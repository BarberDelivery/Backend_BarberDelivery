const { Customer, Barber, Item, Transaction, Service, ServicesTransaction, Schedule } = require("../models/index");
const distance = require("google-distance-matrix");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin
const locale = require("dayjs/locale/de");
const Catalogue = require("../modelsMongo/catalogModel");
const cloudinary = require("../helpers/cloudinary");
const axios = require("axios");

dayjs.locale("de"); // use locale globally
dayjs().locale("de").format(); // use locale in a specific instance

dayjs().format();

class customerMainController {
  static async getCustomerById(req, res, next) {
    try {
      console.log(req.customer.id, "<<<<<<<<<");
      const dataCustomer = await Customer.findOne({
        where: {
          id: req.customer.id,
        },
      });

      if (!dataCustomer) {
        throw { name: "data-not-found" };
      }
      console.log(dataCustomer, "OOOOO");
      res.status(200).json(dataCustomer);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getAllBarber(req, res, next) {
    try {
      const dataListBarber = await Barber.findAll({
        attributes: { exclude: ["password"] },
      });

      // console.log(dataListBarber);
      res.status(200).json(dataListBarber);
    } catch (err) {
      console.log(err);
      next();
    }
  }

  static async getBarberById(req, res, next) {
    try {
      const { barberId } = req.params;
      const dataBarber = await Barber.findOne({
        where: {
          id: barberId,
        },
        attributes: { exclude: ["password"] },
      });

      if (!dataBarber) {
        throw { name: "data-not-found" };
      }

      console.log(dataBarber);
      res.status(200).json(dataBarber);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getAllService(req, res, next) {
    try {
      const dataServices = await Service.findAll({
        attributes: ["id", "name", "price"],
      });
      res.status(200).json(dataServices);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async postTransaction(req, res, next) {
    try {
      const { BarberId, priceBarber, date, servicesId, longLatCustomer, longLatBarber } = req.body;

      // let loopFindService = [];

      const firstCreateTransaction = await Transaction.create({
        CustomerId: req.customer.id,
        BarberId: BarberId,
        status: "pending",
        cutRating: 0,
        totalPrice: null,
        duration: null,
        date: null,
        longLatCustomer: "",
      });

      let getDataService = [];
      let newServiceTransaction;
      if (servicesId.length) {
        console.log("MASUK");
        let loopingIdService = [];

        loopingIdService = servicesId.map((el) => {
          return { ServiceId: +el, TransactionId: firstCreateTransaction.id };
        });

        newServiceTransaction = await ServicesTransaction.bulkCreate(loopingIdService);
        if (servicesId.length) {
          getDataService = await ServicesTransaction.findAll({
            where: {
              TransactionId: newServiceTransaction[0].TransactionId,
            },
            include: {
              model: Service,
            },
          });
        }
      }

      // // Calculate Distance
      console.log(longLatCustomer, "Customer LongLat");
      console.log(longLatBarber, "Barber LongLat");

      distance.key("AIzaSyC6kL2tCQbuZXwDhNlDUDPiIp5c2hRXS1k");

      function getDistances(origins, destinations) {
        return new Promise(function (resolve, reject) {
          distance.matrix(origins, destinations, function (err, distances) {
            if (err) {
              reject(err);
            } else {
              resolve(distances);
            }
          });
        });
      }

      // Example usage with async/await:
      async function main() {
        try {
          const distances = await getDistances([`${longLatCustomer}`], [`${longLatBarber}`]);
          return distances.rows[0].elements;
          // console.log(distances);
        } catch (err) {
          console.error(err);
        }
      }

      const resultDistance = await main();
      console.log(resultDistance, "((((((((");
      // const totalPriceDistance = resultDistance[0].distance.text.split(" ")[0] * 1000;

      const totalPriceDistance = resultDistance[0].distance.text.split(" ")[0] * 1000;

      // Calculation For Total
      let priceService = [];
      if (getDataService.length) {
        console.log("masuk");
        priceService = getDataService.map((el) => {
          return el.Service.price;
        });
      }
      let sumArrayPrice = totalPriceDistance;
      if (priceService.length) {
        sumArrayPrice = priceService.reduce(function (a, b) {
          return a + b;
        }, 0);
      }

      const findCustomer = await Customer.findOne({
        where: {
          id: req.customer.id,
        },
      });

      let totalPrice;

      if (findCustomer.isStudent == true) {
        totalPrice = +sumArrayPrice + +priceBarber + +totalPriceDistance - 10000;
      } else {
        totalPrice = +sumArrayPrice + +priceBarber + +totalPriceDistance;
      }

      // Calculation For Duration
      const totalTripDuration = resultDistance[0].duration.text.split(" ")[0] * 2;
      const durationService = getDataService.map((el) => {
        return el.Service.duration;
      });

      let sumArrayDuration = durationService.reduce(function (a, b) {
        return a + b;
      }, 0);

      let totalDuration = +sumArrayDuration + totalTripDuration;

      // console.log(date);
      dayjs.extend(utc);
      dayjs.extend(timezone);
      const dateStart = new Date(date);
      const dateEnd = new Date(date);
      dateStart.setMinutes(dateStart.getMinutes());
      dateEnd.setMinutes(dateEnd.getMinutes() + totalDuration);

      // const d1 = dayjs.tz(`${dateStart}`, "Asia/Jakarta");
      // console.log(d1);

      const loopSchedule = await Schedule.findAll({
        where: {
          BarberId: BarberId,
        },
      });

      const mapLoop = loopSchedule.map((el) => {
        console.log(el.timeStart, "===", el.timeEnd);
        let convertTimeStart = new Date(el.timeStart);
        let convertTimeEnd = new Date(el.timeEnd);
        let convertDateStart = new Date(dateStart);
        if (convertDateStart >= convertTimeStart && convertDateStart <= convertTimeEnd) {
          throw { name: "date-booked" };
        }
      });

      const dateNow = new Date();
      dateNow.setMinutes(dateNow.getMinutes() + 420);
      console.log(dateStart, "++", dateNow);
      if (dateStart < dateNow) {
        throw { name: "date-invalid" };
      }

      const createSchedule = await Schedule.create({
        BarberId: BarberId,
        timeStart: dateStart,
        timeEnd: dateEnd,
        status: "unfinished",
        TransactionId: firstCreateTransaction.id,
      });

      const createTransaction = await Transaction.update(
        {
          CustomerId: req.customer.id,
          BarberId: BarberId,
          status: "pending",
          cutRating: 0,
          totalPrice: totalPrice,
          duration: totalDuration,
          date: dateStart,
          longLatCustomer: longLatCustomer,
          tripPrice: +totalPriceDistance,
        },
        {
          where: {
            id: firstCreateTransaction.id,
          },
          returning: true,
        }
      );

      // console.log(createSchedule);

      res.status(201).json(createTransaction[1][0]);
    } catch (err) {
      console.log(err);
      if (err.name === "date-invalid") {
        res.status(400).json({ message: "Date Invalid" });
      } else if (err.name === "date-booked") {
        res.status(400).json({ message: "This date has been booked" });
      } else {
        next(err);
      }
    }
  }

  static async getAllTransaction(req, res, next) {
    try {
      const getAllTransaction = await Transaction.findAll({
        where: {
          CustomerId: req.customer.id,
        },
        include: [
          { model: Customer, attributes: { exclude: ["password"] } },
          { model: Barber, attributes: { exclude: ["password"] } },
        ],
      });

      res.status(200).json(getAllTransaction);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getTransactionById(req, res, next) {
    try {
      const { transactionId } = req.params;
      const getTransactionById = await Transaction.findOne({
        where: {
          id: transactionId,
        },
        include: [
          { model: Customer, attributes: { exclude: ["password"] } },
          { model: Barber, attributes: { exclude: ["password"] } },
        ],
      });
      if (!getTransactionById) {
        throw { name: "data-not-found" };
      }
      console.log(getTransactionById);
      res.status(200).json(getTransactionById);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async successPayment(req, res, next) {
    try {
      const { transactionId } = req.body;

      const findTrancsaction = await Transaction.findOne({
        where: {
          id: transactionId,
        },
        include: [
          { model: Customer, attributes: { exclude: ["password"] } },
          { model: Barber, attributes: { exclude: ["password"] } },
        ],
      });
      // console.log(findTrancsaction);

      if (!findTrancsaction) {
        throw { name: "data-not-found" };
      }

      await Transaction.update(
        {
          status: "pending",
        },
        {
          where: {
            id: transactionId,
          },
        }
      );

      await Customer.update(
        { lastCut: findTrancsaction.date },
        {
          where: {
            id: findTrancsaction.CustomerId,
          },
        }
      );

      await Barber.update(
        {
          activityStatus: "standBy",
        },
        {
          where: {
            id: findTrancsaction.BarberId,
          },
        }
      );

      await Schedule.update(
        {
          status: "finished",
        },
        {
          where: {
            TransactionId: findTrancsaction.id,
          },
        }
      );

      res.status(201).json({ message: "Payment Successfully" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async rateBarber(req, res, next) {
    try {
      const { rate, BarberId } = req.body;

      if (!rate) {
        throw { name: "rate-must-filled" };
      }

      const findBarber = await Barber.findOne({
        where: {
          id: BarberId,
        },
      });

      if (!findBarber) {
        throw { name: "data-not-found" };
      }

      const rateBarber = findBarber.rating;
      // console.log(rateBarber);
      let totalRating;

      if (rateBarber == 0) {
        totalRating = +rate;
      } else {
        totalRating = (+rate + +rateBarber) / 2;
      }
      console.log(findBarber.rating);

      await Barber.update(
        {
          rating: totalRating,
        },
        {
          where: {
            id: BarberId,
          },
        }
      );
      console.log(totalRating);

      res.status(201).json({ message: "Rate Barber Successfully" });
    } catch (err) {
      if (err.name == "rate-must-filled") {
        res.status(400).json({ message: "Please, you must rate the Barbers" });
      }
      console.log(err);
      next(err);
    }
  }

  static async getAllCatalogue(req, res, next) {
    try {
      const dataCatalogue = await Catalogue.getAllCatalogue();
      res.status(200).json(dataCatalogue);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async uploadImage(req, res, next) {
    try {
      console.log("masuk upload image");
      // const uploader = async (path) => await cloudinary.uploads(path, "Images");
      // console.log(uploader, "uploader");
      const { path } = req.file;
      console.log(path, "path <<<<<<<<<<<<<,,");
      const newPath = await cloudinary.uploads(path, "Images");
      console.log(newPath, "newpath <<<<<<<<<<<<<<<,,");
      await Customer.update(
        {
          imgDataCustomer: newPath.url,
        },
        {
          where: {
            id: req.customer.id,
          },
        }
      );

      res.status(201).json({
        message: "Upload image is successful",
        data: newPath,
      });
    } catch (err) {
      console.log(err, "EEE<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      next(err);
    }
  }

  static async getAllSchedule(req, res, next) {
    try {
      const { BarberId } = req.body;
      const allSchedule = await Schedule.findAll({
        where: {
          BarberId: BarberId,
        },
      });
      console.log(allSchedule);
      res.status(200).json(allSchedule);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async paymentByCustomerId(req, res, next) {
    const { transactionId } = req.params;

    const getTransactionById = await Transaction.findOne({
      where: {
        id: transactionId,
      },
      include: [
        {
          model: ServicesTransaction,
        },
        { model: Customer, attributes: { exclude: ["password"] } },
        { model: Barber, attributes: { exclude: ["password"] } },
        { model: ServicesTransaction, include: [{ model: Service }] },
      ],
    });

    if (!getTransactionById) {
      throw { name: "data-not-found" };
    }

    let insertItem = [];

    insertItem = getTransactionById.ServicesTransactions.map((el) => {
      return { name: el.Service.name, price: el.Service.price, quantity: 1 };
    });

    try {
      const { data } = await axios({
        method: "POST",
        url: "https://api.xendit.co/v2/invoices",
        headers: {
          Authorization: "Basic eG5kX2RldmVsb3BtZW50X2lCbmptS0tvQXAyNmE1RkI5S2VrVmZ2TVh5U0E5MDhnNE9VdFBOSVZYeld0dW5IendXU3JGTTM5RldOQ0Y6",
          "Content-Type": "application/json",
          Cookie: "incap_ses_7267_2182539=g/IuKB7bunLB79SvQJLZZD97A2QAAAAAbYodfSs3YwY22cd4EYpSuQ==; nlbi_2182539=4njYCcyzmBpQlmiMNAqKSgAAAABu1mNFR3H5eOyynsWHRFRm",
        },
        data: {
          external_id: transactionId,
          amount: getTransactionById.totalPrice,
          description: "Invoice Demo #123",
          invoice_duration: 86400,
          customer: {
            given_names: getTransactionById.Customer.username,
            surname: "s",
            email: getTransactionById.Customer.email,
            mobile_number: "+6281224642373",
          },
          customer_notification_preference: {
            invoice_created: ["whatsapp", "sms", "email"],
            invoice_reminder: ["whatsapp", "sms", "email"],
            invoice_paid: ["whatsapp", "sms", "email"],
            invoice_expired: ["whatsapp", "sms", "email"],
          },
          success_redirect_url: "https://www.google.com",
          failure_redirect_url: "https://www.google.com",
          currency: "IDR",
          // reference_id :
          items: insertItem,
          fees: [
            {
              type: "ADMIN",
              value: 5000,
            },
          ],
        },
      });

      res.status(200).json(data);
    } catch (err) {
      console.log(err.response.data);
      next(err);
    }
  }

  static async successPaymentCb(req, res, next) {
    try {
      const token = req.headers["x-callback-token"];
      const transactionId = req.body.external_id;
      const status = req.body.status;
      // console.log(token, transactionId, status, "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
      if (status !== "PAID") {
        throw { name: "invalid-token" };
      }

      if (token != process.env.CALLBACK_TOKEN_XENDIT) {
        throw { name: "invalid-token" };
      }

      const findTrancsaction = await Transaction.findOne({
        where: {
          id: transactionId,
        },
        include: [
          { model: Customer, attributes: { exclude: ["password"] } },
          { model: Barber, attributes: { exclude: ["password"] } },
        ],
      });
      // console.log(findTrancsaction);

      if (!findTrancsaction) {
        throw { name: "data-not-found" };
      }

      await Transaction.update(
        {
          status: "paid",
        },
        {
          where: {
            id: transactionId,
          },
        }
      );

      await Customer.update(
        { lastCut: findTrancsaction.date },
        {
          where: {
            id: findTrancsaction.CustomerId,
          },
        }
      );

      await Barber.update(
        {
          activityStatus: "onTheWay",
        },
        {
          where: {
            id: findTrancsaction.BarberId,
          },
        }
      );

      res.status(201).json({ message: "Payment Successfully" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = customerMainController;
