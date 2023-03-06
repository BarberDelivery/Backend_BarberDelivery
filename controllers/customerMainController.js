const { Customer, Barber, Item, Transaction, Service, ServicesTransaction, Schedule } = require("../models/index");
const distance = require("google-distance-matrix");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin
const locale = require("dayjs/locale/de");
const Catalogue = require("../modelsMongo/catalogModel");

dayjs.locale("de"); // use locale globally
dayjs().locale("de").format(); // use locale in a specific instance

dayjs().format();

class customerMainController {
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

  static async postTransaction(req, res, next) {
    try {
      const { BarberId, priceBarber, date, servicesId, longLatCustomer, longLatBarber } = req.body;

      // let loopFindService = [];

      const firstCreateTransaction = await Transaction.create({
        CustomerId: req.customer.id,
        BarberId: BarberId,
        status: "pending",
        cutRating: null,
        totalPrice: null,
        duration: null,
        date: null,
        longLatCustomer: "",
      });

      let loopingIdService = [];

      loopingIdService = servicesId.map((el) => {
        return { ServiceId: +el, TransactionId: firstCreateTransaction.id };
      });

      const newServiceTransaction = await ServicesTransaction.bulkCreate(loopingIdService);
      const getDataService = await ServicesTransaction.findAll({
        where: {
          TransactionId: newServiceTransaction[0].TransactionId,
        },
        include: {
          model: Service,
        },
      });

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
          // console.error(err);
        }
      }

      const resultDistance = await main();
      console.log(resultDistance, "((((((((");
      const totalPriceDistance = resultDistance[0].distance.text.split(" ")[0] * 1000;

      // Calculation For Total Price
      const priceService = getDataService.map((el) => {
        return el.Service.price;
      });

      let sumArrayPrice = priceService.reduce(function (a, b) {
        return a + b;
      }, 0);

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
          status: "",
          cutRating: null,
          totalPrice: totalPrice,
          duration: totalDuration,
          date: dateStart,
          longLatCustomer: longLatCustomer,
          tripPrice: +totalPriceDistance,
        },
        {
          where: {
            id: getDataService[0].TransactionId,
          },
          returning: true,
        }
      );

      // console.log(createSchedule);

      res.status(201).json(createTransaction[1][0]);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getAllTransaction(req, res, next) {
    try {
      const getAllTransaction = await Transaction.findAll({
        where: {
          CustomerId: req.customer.id,
        },
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
}

module.exports = customerMainController;
